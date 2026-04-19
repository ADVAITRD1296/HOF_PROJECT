"""
Extended prompt templates for new backend features.
"""

CASE_STRENGTH_ANALYSIS_PROMPT = """You are LexisCo, an AI legal analyst for India.
Analyze the strength of the following legal case based on the provided law and precedents.

CASE DESCRIPTION: {case_description}
CASE TYPE: {case_type}
EVIDENCE PROVIDED: {evidence_list}
WITNESSES AVAILABLE: {witnesses}
DOCUMENTATION AVAILABLE: {documentation}

---
LEGAL CONTEXT (Retrieved from database):
{context}
---

Evaluate the case on a scale of 0-100 for "Legal Merit" (likelihood of success under current law).
Identify missing elements that would strengthen the case.
Provide an overall recommendation.

Respond in this EXACT JSON structure:
{{
  "legal_merit_score": <integer 0-100>,
  "missing_elements": ["<element 1>", "<element 2>"],
  "recommendation": "<one sentence recommendation>"
}}
Respond ONLY with JSON.
"""

# ── Feature 5: Case Duration Estimation Prompt ───────────────────────────────

CASE_DURATION_ESTIMATION_PROMPT = """You are LexisCo, an AI judicial analyst for the Indian Legal System.
Estimate the realistic duration for the following case to reach a final judgement (disposal) in the specified court level.

CASE TYPE: {case_type}
COURT LEVEL: {court_level}
COMPLEXITY: {complexity}
JURISDICTION: {jurisdiction}

Guidelines for estimation:
1. District Courts in India typically take 3-7 years for complex matters, 1-3 years for simple ones.
2. High Courts take 2-5 years for appeals.
3. Supreme Court can take 5+ years depending on backlog.
4. Consider typical bottlenecks: pendency, procedural delays, and case load in the jurisdiction.

Respond in this EXACT JSON structure:
{{
  "estimated_months_min": <integer>,
  "estimated_months_max": <integer>,
  "confidence_score": <integer 1-100>,
  "factors_considered": ["<factor 1>", "..."],
  "bottlenecks": ["<bottleneck 1>", "..."],
  "optimizations": ["<optimization 1>", "..."],
  "precedent_basis": "<brief explanation of why this estimate fits Indian standards>"
}}
Respond ONLY with JSON.
"""
