# LexisCo — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER (Browser)                       │
│              Hindi / English / Voice Input               │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP POST
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI Backend                          │
│           /api/v1/guidance/ask                           │
│           /api/v1/documents/upload                       │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
┌─────────────────────┐   ┌─────────────────────────────┐
│   RAG Retriever     │   │       LLM (Groq/LLaMA 3)    │
│                     │   │                             │
│  1. Embed query     │   │  1. Build prompt with       │
│  2. FAISS search    │   │     retrieved context       │
│  3. Return top-k    │   │  2. Generate structured     │
│     legal chunks    │   │     step-by-step output     │
└──────────┬──────────┘   └─────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│   FAISS Vector DB   │
│                     │
│  Legal Documents:   │
│  - IPC / BNS        │
│  - Consumer Act     │
│  - RTI Act          │
│  - IT Act           │
│  - Motor Vehicles   │
└─────────────────────┘
```

## Data Flow

1. **Ingestion** (one-time offline)
   ```
   PDF/DOCX → extract text → chunk (500 tokens, 50 overlap)
            → embed (SentenceTransformer) → store FAISS
   ```

2. **Query** (real-time)
   ```
   User query → embed query → FAISS similarity search
             → top-5 chunks → build prompt → Groq LLM
             → structured JSON response → frontend
   ```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| FAISS over Pinecone | Free, runs locally, no API quota |
| Groq over OpenAI | Free tier, faster inference, LLaMA 3 quality |
| Structured JSON output | Enables step-by-step UI rendering |
| RAG-only answers | Anti-hallucination: no answers outside retrieved docs |
| FastAPI | Async, fast, auto-docs via OpenAPI |

## Anti-Hallucination Strategy

1. All LLM context is **only** from retrieved FAISS chunks
2. Prompt explicitly instructs: "Only use information from CONTEXT"
3. If context is insufficient → LLM responds with "I cannot find relevant law for this"
4. Every response includes a disclaimer
5. Citations are pulled from retrieved documents, not generated freely
