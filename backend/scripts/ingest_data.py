import os
import re
import json
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

ACT_NAMES = {
    "bns": "Bharatiya Nyaya Sanhita",
    "ipc": "Indian Penal Code",
    "it_act": "Information Technology Act",
    "consumer": "Consumer Protection Act"
}

def chunk_text(text, chunk_size=1000, overlap=100):
    """
    Splits text into chunks of ~1000 characters with 100 character overlap.
    Tries not to break in the middle of sentences.
    """
    chunks = []
    start = 0
    text_len = len(text)

    if text_len <= chunk_size:
        return [text.strip()]

    while start < text_len:
        end = start + chunk_size
        
        if end < text_len:
            # Try to find the end of a sentence (period followed by space or newline)
            # Look back up to 150 characters from the target end to find a sentence break
            sentence_end = text.rfind('. ', start + chunk_size - 150, end)
            if sentence_end == -1:
                sentence_end = text.rfind('.\n', start + chunk_size - 150, end)
            
            if sentence_end != -1:
                end = sentence_end + 1
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap
        if start >= text_len or end >= text_len:
            break
            
    return chunks

def parse_sections(content):
    """
    Splits content into sections. Returns list of (section_number, section_text).
    """
    # Check if it's a "Section" based file
    if "Section" in content:
        parts = re.split(r'^Section\s+', content, flags=re.MULTILINE)
        sections = []
        for part in parts[1:]:
            if not part.strip(): continue
            lines = part.strip().split('\n', 1)
            header = lines[0].strip()
            # Extract only the numeric part for section_number as per requirements
            section_match = re.match(r'^(\d+[A-Z]*)', header)
            section_num = section_match.group(1) if section_match else "unknown"
            sections.append((section_num, f"Section {part.strip()}"))
        return sections
    else:
        # Fallback for non-section files (like consumer.txt)
        blocks = re.split(r'\n\s*\n', content)
        return [("N/A", b.strip()) for b in blocks if b.strip() and len(b.split()) > 5]

def process_documents():
    """
    Main processing logic for Phase 1 (Strict Audit Mode).
    """
    data_folder = "data"
    output_file = "data/processed_chunks.json"
    
    # Load files
    raw_path = Path(data_folder) / "raw"
    files = list(raw_path.glob('*.txt'))
    
    all_chunks = []
    chunk_id_counter = 1
    
    for file_path in files:
        source_key = file_path.stem.lower()
        act_name = ACT_NAMES.get(source_key, file_path.stem.replace('_', ' ').title())
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            sections = parse_sections(content)
            
            for section_num, section_text in sections:
                # Apply 1000/100 chunking within each section
                sub_chunks = chunk_text(section_text, chunk_size=1000, overlap=100)
                
                for chunk in sub_chunks:
                    all_chunks.append({
                        "chunk_id": chunk_id_counter,
                        "act_name": act_name,
                        "section_number": section_num,
                        "text": chunk
                    })
                    chunk_id_counter += 1
                
        except Exception as e:
            logger.error(f"Error processing {file_path.name}: {e}")

    # Save output strictly as JSON array
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Phase 1 Complete: {len(all_chunks)} chunks created from {len(files)} files.")

if __name__ == "__main__":
    process_documents()


