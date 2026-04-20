🌐 Live Demo: https://lexisco.vercel.app/

This project is a full-stack web application built with a modern frontend and a FastAPI backend. It provides a seamless user experience with efficient API handling, authentication, and real-time interactions.

>>>>>>


# ⚖️ LexisCo — AI Legal Guide

> **"An AI legal assistant that not only explains the law, but guides users step-by-step to take real legal action — making justice accessible to everyone."**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal.svg)](https://fastapi.tiangolo.com)
[![AI/ML Track](https://img.shields.io/badge/Track-AI%20%2F%20ML-purple.svg)]()

---

## 🚀 About LexisCo

LexisCo is an **AI-powered Legal Guidance Assistant for India** that doesn't just answer legal questions — it walks users step-by-step to **solve their legal problems**, just like a smart mentor.

Unlike normal chatbots, our system focuses on **"what to do next"**, not just **"what the law says"**.

---

## 💡 How It Works

A user explains their problem in simple language (Hindi/English), and the system:

1. **Understands** the situation using NLP
2. **Finds** the exact relevant law (IPC/BNS/Consumer Act/RTI, etc.) using RAG
3. **Breaks it down** into simple, actionable steps
4. **Guides** the user till actual action (complaint/FIR/next step)

---

## 🔥 Key Features

| Feature | Description |
|---|---|
| 🧭 Step-by-Step Guidance | Mentor-style, structured legal steps — not walls of text |
| 📄 Complaint/FIR Generator | Auto-generate FIR drafts, consumer complaints, legal notices |
| 📚 Verified Law + Citations | Exact section references (IPC/BNS) with explanations |
| 🌐 Hindi + English Support | Bilingual interface for wider accessibility |
| 🎤 Voice Input | Speak your problem — helpful for non-technical users |
| ⚠️ Anti-Hallucination | RAG-grounded answers only, with clear disclaimers |
| 🤖 Smart Suggestions | Interactive follow-up actions after every answer |

---

## 🏗️ Project Structure

```
LexisCo/
├── frontend/           # HTML/CSS/JS frontend
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── requirements.txt
│   └── .env.example
├── rag_engine/         # RAG pipeline (embeddings, vector DB)
│   ├── ingestion/
│   ├── retrieval/
│   └── data/
├── data/               # Legal documents and datasets
│   ├── raw/
│   └── processed/
├── notebooks/          # Research and experimentation
├── docs/               # Documentation
└── docker-compose.yml
```

---

## 🤖 Tech Stack

### Frontend
- HTML5 / CSS3 / Vanilla JS
- Responsive, bilingual UI

### Backend
- **FastAPI** (Python)
- **LangChain** for RAG orchestration
- **Groq API** (LLaMA 3) as LLM
- **FAISS / Pinecone** as Vector DB
- **Sentence Transformers** for embeddings

### AI/ML Pipeline
- RAG (Retrieval-Augmented Generation)
- Legal document chunking & embedding
- Prompt engineering for structured outputs
- Guardrails to prevent hallucinations

---

## ⚡ Quick Start

### Prerequisites
- Python 3.10+
- Node.js (optional, for dev server)
- Groq API key

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys
uvicorn app.main:app --reload
```

### Frontend
Open `frontend/index.html` in your browser, or serve with:
```bash
cd frontend
python -m http.server 3000
```

---

## 📋 Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
VECTOR_DB=faiss  # or pinecone
```

---

## 🚀 Extended Backend Features (New)

### 1. Shareable Case Card
- **Endpoint**: `POST /api/case-card/generate`
- **Purpose**: Generates a structured JSON "case card" from a legal summary, including applicable laws and action steps. Provides a unique `shareable_link`.
- **Retrieval**: `GET /api/case-card/{card_id}` (Publicly accessible).

### 2. Deadline Calculator
- **Endpoint**: `POST /api/deadline/calculate`
- **Purpose**: Calculates Indian law limitation periods for common case types (Consumer, FIR, Civil, RTI, NI Act, Labour).
- **Output**: Returns `filing_deadline`, `days_remaining`, and a `warning_status` (Safe, Urgent, Critical, Expired).

### 3. Case Strength Analyzer
- **Endpoint**: `POST /api/case-strength/analyze`
- **Purpose**: Uses LLM + RAG to evaluate the strength of a case based on legal merit, evidence, documentation, and witnesses.
- **Output**: Detailed scoring and improvement recommendations.

### 4. Journey Tracker
- **Endpoints**: `POST /api/journey/create`, `POST /api/journey/{id}/update`, `GET /api/journey/{id}`
- **Purpose**: Manages a user's legal lifecycle with predefined milestones for Consumer Complaints, FIRs, and RTIs.

---

## 🎯 Hackathon — AI/ML Track

**Why LexisCo stands out:**
- ✅ Not just Q&A → **Action-oriented AI**
- ✅ High real-world impact (India-scale problem)
- ✅ Combines Legal Domain + ML + UX thinking
- ✅ Mentor-style guidance (unique twist)
- ✅ RAG pipeline with anti-hallucination guardrails

---

## ⚠️ Disclaimer

LexisCo provides AI-generated legal *guidance*, not legal *advice*. Always consult a qualified lawyer for important legal matters.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
