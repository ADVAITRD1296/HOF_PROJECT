# LexisCo — Setup Guide

## Prerequisites

- Python 3.10 or higher
- pip
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-team/lexisco.git
cd lexisco
```

---

## 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Mac/Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Open .env and fill in your API keys
```

### Get Your API Keys

| Key | Where to Get |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — free tier available |
| `SUPABASE_URL` + `SUPABASE_KEY` | [supabase.com](https://supabase.com) — free project |

### Start the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

## 3. RAG Pipeline Setup

### Step 1 — Add Legal Documents

Place your legal document files (PDF/DOCX/TXT) in:
```
data/raw/
```

### Step 2 — Run Ingestion

```bash
# From the project root
python rag_engine/ingestion/ingest.py
```

This will:
- Load all documents
- Chunk them into 500-token segments
- Generate embeddings using `all-MiniLM-L6-v2`
- Store in a FAISS index at `faiss_index/`

---

## 4. Frontend Setup

Simply open `frontend/index.html` in your browser.

Or serve with Python:
```bash
cd frontend
python -m http.server 3000
# Open http://localhost:3000
```

---

## 5. Docker (Optional — Full Stack)

```bash
# Build and start everything
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
# API docs → http://localhost:8000/docs
```

---

## Project Structure Quick Reference

```
HOF/
├── frontend/           ← Open index.html in browser
├── backend/            ← FastAPI server (port 8000)
├── rag_engine/         ← RAG pipeline scripts
├── data/raw/           ← Put your legal PDFs here
├── notebooks/          ← Research + experiments
└── docker-compose.yml  ← Full stack with one command
```

---

## Troubleshooting

**"GROQ_API_KEY not set"** → Make sure your `.env` file exists and has the key.

**FAISS index not found** → Run `python rag_engine/ingestion/ingest.py` first.

**CORS errors on frontend** → Make sure `ALLOWED_ORIGINS` in `.env` includes your frontend URL.
