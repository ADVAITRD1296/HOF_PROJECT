import io
import zipfile
import csv
import httpx
from loguru import logger
from app.core.config import settings

class StreamIngestService:
    def __init__(self):
        self.api = KaggleApi()
        self.api.authenticate()

    async def stream_and_index_dataset(self, dataset_slug: str, type: str = "statute"):
        """
        Streams a Kaggle dataset into memory, processes rows, and prepares for indexing.
        NO FILES ARE SAVED TO DISK.
        """
        logger.info(f"Starting memory-stream of dataset: {dataset_slug}")
        
        try:
            # 1. Get the download URL & Auth
            if not self._ensure_authenticated():
                return {"status": "error", "message": "Kaggle authentication failed. Check credentials."}

            owner, dataset_name = dataset_slug.split('/')
            url = f"https://www.kaggle.com/api/v1/datasets/download/{owner}/{dataset_name}"
            
            # Correct Kaggle Auth using Basic Auth for the API
            username = self.api.config_values['username']
            key = self.api.config_values['key']
            
            async with httpx.AsyncClient(timeout=120.0) as client:
                # Kaggle expects basic auth with username:key
                response = await client.get(url, auth=(username, key), follow_redirects=True)
                
                if response.status_code == 403:
                    logger.error("Kaggle 403 Forbidden. Please ensure you have accepted the dataset terms on Kaggle's website.")
                    return {"status": "error", "message": "403: Terms not accepted or invalid credentials."}
                
                response.raise_for_status()
                
                # 2. Open Zip in memory
                zip_data = io.BytesIO(response.content)
                logger.info(f"Downloaded {len(response.content)} bytes from Kaggle. Processing...")
                with zipfile.ZipFile(zip_data) as z:
                    for filename in z.namelist():
                        if filename.endswith('.csv'):
                            logger.info(f"Processing in-memory file: {filename}")
                            with z.open(filename) as f:
                                # Read as text stream
                                text_stream = io.TextIOWrapper(f, encoding='utf-8')
                                reader = csv.DictReader(text_stream)
                                
                                # 3. Process Rows
                                count = 0
                                chunks_to_index = []
                                for row in reader:
                                    count += 1
                                    
                                    # Create metadata and chunk text
                                    if type == "statute":
                                        act_name = row.get('act_name', 'Unknown Act')
                                        section = row.get('section', 'N/A')
                                        text = row.get('section_text', row.get('description', ''))
                                        chunk_text = f"ACT: {act_name} SECTION: {section}\n{text}"
                                    else:
                                        act_name = "Historical Case"
                                        section = row.get('citation', 'N/A')
                                        title = row.get('case_title', row.get('title', 'Case'))
                                        text = row.get('judgement_text', row.get('text', ''))
                                        chunk_text = f"CASE: {title} ({section})\n{text}"

                                    chunks_to_index.append({
                                        "act_name": act_name,
                                        "section": section,
                                        "title": title if type == "case" else act_name,
                                        "chunk_text": chunk_text[:2000], # Cap for embedding efficiency
                                        "doc_type": type
                                    })
                                    
                                    if len(chunks_to_index) >= 20: # Batch indexing
                                        await self._index_batch(chunks_to_index)
                                        chunks_to_index = []

                                    if count % 100 == 0:
                                        logger.info(f"Streamed and indexed {count} rows...")
                                    
                                    if count > 500: # Cap for memory safety
                                        break
                                
                                # Index remaining
                                if chunks_to_index:
                                    await self._index_batch(chunks_to_index)
                                        
                logger.info(f"Successfully finished streaming and indexing {dataset_slug}")
                return {"status": "success", "processed_rows": count}
                
        except Exception as e:
            logger.error(f"Error streaming from Kaggle: {e}")
            return {"status": "error", "message": str(e)}

    async def _index_batch(self, chunks: list):
        """Generates embeddings and pushes to Supabase."""
        from app.services.rag_service import RAGService
        rag = RAGService()
        supabase = rag._load_supabase()
        model = rag._load_embedding_model()
        
        if not supabase or not model:
            logger.error("Missing Supabase or Embedding Model for indexing")
            return

        texts = [c['chunk_text'] for c in chunks]
        embeddings = model.encode(texts).tolist()
        
        data_to_insert = []
        for i, chunk in enumerate(chunks):
            data_to_insert.append({
                "act_name": chunk['act_name'],
                "section": chunk['section'],
                "title": chunk['title'],
                "chunk_text": chunk['chunk_text'],
                "doc_type": chunk['doc_type'],
                "embedding": embeddings[i]
            })
            
        try:
            supabase.table("legal_documents").insert(data_to_insert).execute()
        except Exception as e:
            logger.error(f"Supabase Insert Error: {e}")

    @staticmethod
    def get_recommended_slugs():
        return {
            "statute": "lakshmi12nne/indian-laws",
            "cases": "subhadityadas/indian-legal-dataset",
            "ipc": "vignesh612/indian-penal-code-dataset"
        }
