/**
 * LexisCo — Frontend Application Logic
 * Handles: Demo interaction, animations, voice input, navbar scroll
 */

/* ── Constants & Config ───────────────────────────────────── */
const API_BASE = 'http://localhost:8000/api/v1';

const MOCK_RESPONSES = {
  default: {
    summary: "Based on your situation, this involves a legal dispute that can be addressed through Indian civil and consumer law. Here's your personalized action plan:",
    steps: [
      { step_number: 1, title: "Document Your Evidence", description: "Collect all relevant documents, screenshots, receipts, messages, and any other proof related to your issue.", action_required: "📎 Organize documents chronologically with dates" },
      { step_number: 2, title: "Identify the Applicable Law", description: "Your situation falls under the Consumer Protection Act 2019 / IPC, which provides clear rights and remedies.", action_required: "📌 Review the cited sections below" },
      { step_number: 3, title: "Send a Legal Notice", description: "Before filing a formal complaint, send a legal demand notice giving the other party 15-30 days to resolve the issue.", action_required: "✉️ Send via registered post with acknowledgment" },
      { step_number: 4, title: "File a Formal Complaint", description: "If unresolved, escalate to the appropriate authority — consumer forum, police, or labour court depending on your case.", action_required: "🏛️ File complaint at your district consumer forum or nearest police station" },
    ],
    citations: [
      { act: "Consumer Protection Act, 2019", section: "Section 35", description: "Right to file district consumer dispute complaint", why_applicable: "Applicable when a consumer faces deficiency in service or unfair trade practice" },
      { act: "Indian Penal Code (IPC)", section: "Section 420", description: "Cheating and dishonestly inducing delivery of property", why_applicable: "Applies if there was deliberate deception or fraud involved" },
    ],
    suggested_actions: ["📄 Generate Legal Notice", "🚔 Draft FIR", "🏛️ Find Consumer Forum", "👨‍⚖️ Consult a Lawyer"],
  }
};

/* ── DOM References ───────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('nav-links');
const demoQuery    = document.getElementById('demo-query');
const charCount    = document.getElementById('char-count');
const askBtn       = document.getElementById('ask-btn');
const askBtnText   = document.getElementById('ask-btn-text');
const btnSpinner   = document.getElementById('btn-spinner');
const voiceBtn     = document.getElementById('voice-btn');
const outputPH     = document.getElementById('output-placeholder');
const outputResult = document.getElementById('output-result');
const langBtns     = document.querySelectorAll('.lang-btn');
const exampleChips = document.querySelectorAll('.example-chip');

let currentLang = 'en';
let isListening = false;
let recognition = null;

/* ══════════════════════════════════════════════════════════
   NAVBAR SCROLL BEHAVIOR
══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(8,9,13,0.97)';
  navLinks.style.padding = '20px';
  navLinks.style.gap = '8px';
  navLinks.style.zIndex = '200';
  navLinks.style.backdropFilter = 'blur(20px)';
  navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
});

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  // Feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.5s ${i * 0.08}s ease, transform 0.5s ${i * 0.08}s ease`;
  });

  // Tech cards
  const techCards = document.querySelectorAll('.tech-card');
  techCards.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  [...featureCards, ...techCards].forEach(el => observer.observe(el));

  // Timeline steps
  document.querySelectorAll('.timeline-step').forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(step);
  });

  // RAG diagram fade
  const ragDiag = document.getElementById('rag-diagram');
  if (ragDiag) {
    ragDiag.style.opacity = '0';
    ragDiag.style.transition = 'opacity 0.6s 0.2s ease';
    observer.observe(ragDiag);
    const ragObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        ragDiag.style.opacity = '1';
        ragObserver.disconnect();
      }
    }, { threshold: 0.2 });
    ragObserver.observe(ragDiag);
  }
}

/* ══════════════════════════════════════════════════════════
   LANGUAGE TOGGLE
══════════════════════════════════════════════════════════ */
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    langBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLang = btn.dataset.lang;
    if (currentLang === 'hi') {
      demoQuery.placeholder = 'अपनी कानूनी समस्या हिंदी में बताएं...';
    } else {
      demoQuery.placeholder = 'Describe your legal problem in simple language (Hindi or English)...';
    }
  });
});

/* ══════════════════════════════════════════════════════════
   EXAMPLE CHIPS
══════════════════════════════════════════════════════════ */
exampleChips.forEach(chip => {
  chip.addEventListener('click', () => {
    exampleChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    demoQuery.value = chip.dataset.query;
    updateCharCount();
    demoQuery.focus();
  });
});

/* ══════════════════════════════════════════════════════════
   CHAR COUNT
══════════════════════════════════════════════════════════ */
function updateCharCount() {
  const len = demoQuery.value.length;
  charCount.textContent = `${len} / 500`;
  charCount.classList.toggle('warn', len > 430);
  if (demoQuery.value.length > 500) {
    demoQuery.value = demoQuery.value.substring(0, 500);
  }
}
demoQuery.addEventListener('input', updateCharCount);

/* ══════════════════════════════════════════════════════════
   VOICE INPUT (Web Speech API)
══════════════════════════════════════════════════════════ */
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join('');
    demoQuery.value = transcript;
    updateCharCount();
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.title = 'Voice input';
  };

  recognition.onerror = () => {
    isListening = false;
    voiceBtn.classList.remove('listening');
  };

  voiceBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.start();
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceBtn.title = 'Listening... click to stop';
    }
  });
} else {
  voiceBtn.title = 'Voice input not supported in this browser';
  voiceBtn.style.opacity = '0.4';
}

/* ══════════════════════════════════════════════════════════
   ASK / DEMO INTERACTION
══════════════════════════════════════════════════════════ */
askBtn.addEventListener('click', handleAsk);
demoQuery.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAsk();
});

async function handleAsk() {
  const query = demoQuery.value.trim();
  if (!query) {
    demoQuery.focus();
    demoQuery.style.borderColor = 'rgba(244,63,94,0.6)';
    setTimeout(() => demoQuery.style.borderColor = '', 1200);
    return;
  }

  setLoading(true);

  try {
    // Try real API first, fall back to mock
    const data = await fetchGuidance(query);
    renderResult(query, data);
  } catch {
    // Use mock response for demo / when backend is down
    await sleep(1400);
    renderResult(query, MOCK_RESPONSES.default);
  } finally {
    setLoading(false);
  }
}

async function fetchGuidance(query) {
  const resp = await fetch(`${API_BASE}/guidance/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, language: currentLang }),
    signal: AbortSignal.timeout(10000),
  });
  if (!resp.ok) throw new Error('API error');
  return resp.json();
}

function setLoading(on) {
  askBtn.disabled = on;
  askBtnText.textContent = on ? 'Analyzing your situation...' : 'Get Legal Guidance →';
  btnSpinner.classList.toggle('active', on);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Render Result ────────────────────────────────────────── */
function renderResult(query, data) {
  outputPH.classList.add('hidden');
  outputResult.classList.remove('hidden');
  outputResult.innerHTML = '';

  // Summary
  const summaryEl = document.createElement('div');
  summaryEl.className = 'result-summary';
  summaryEl.innerHTML = `<strong>📋 Summary:</strong> ${escapeHtml(data.summary)}`;
  outputResult.appendChild(summaryEl);

  // Steps
  if (data.steps?.length) {
    const stepsLabel = document.createElement('div');
    stepsLabel.className = 'result-steps-title';
    stepsLabel.textContent = '🧭 Your Action Plan';
    outputResult.appendChild(stepsLabel);

    data.steps.forEach((step, i) => {
      const el = document.createElement('div');
      el.className = 'result-step';
      el.style.animationDelay = `${i * 0.1}s`;
      el.innerHTML = `
        <div class="result-step-num">${step.step_number}</div>
        <div class="result-step-body">
          <h4>${escapeHtml(step.title)}</h4>
          <p>${escapeHtml(step.description)}</p>
          ${step.action_required ? `<div class="result-step-action">${escapeHtml(step.action_required)}</div>` : ''}
        </div>
      `;
      outputResult.appendChild(el);
    });
  }

  // Citations
  if (data.citations?.length) {
    const citLabel = document.createElement('div');
    citLabel.className = 'result-citations-title';
    citLabel.textContent = '📚 Applicable Laws';
    outputResult.appendChild(citLabel);

    data.citations.forEach(c => {
      const el = document.createElement('div');
      el.className = 'result-citation';
      el.innerHTML = `
        <div class="citation-act">⚖️ ${escapeHtml(c.act)} — ${escapeHtml(c.section)}</div>
        <div class="citation-section">${escapeHtml(c.why_applicable)}</div>
      `;
      outputResult.appendChild(el);
    });
  }

  // Suggested actions
  if (data.suggested_actions?.length) {
    const actionsWrap = document.createElement('div');
    actionsWrap.className = 'result-actions';
    data.suggested_actions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = 'result-action-chip';
      btn.textContent = action;
      btn.addEventListener('click', () => handleSuggestedAction(action, query));
      actionsWrap.appendChild(btn);
    });
    outputResult.appendChild(actionsWrap);
  }

  // Disclaimer
  const disc = document.createElement('div');
  disc.className = 'result-disclaimer';
  disc.textContent = data.disclaimer || '⚠️ This is AI-generated legal guidance, not legal advice. Please consult a qualified lawyer for critical matters.';
  outputResult.appendChild(disc);

  // Scroll into view
  outputResult.parentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleSuggestedAction(action, query) {
  const msg = `You selected: "${action}"\nThis would trigger the ${action.toLowerCase()} flow for your query.\nBackend integration coming soon! 🚀`;
  showToast(msg.split('\n')[0]);
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════════════ */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: rgba(15,17,23,0.95); border: 1px solid rgba(124,58,237,0.4);
    color: #c4b5fd; padding: 12px 24px; border-radius: 99px;
    font-size: 0.88rem; font-weight: 600; font-family: 'Inter', sans-serif;
    backdrop-filter: blur(16px); z-index: 999;
    opacity: 0; transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    white-space: nowrap; max-width: 90vw;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ══════════════════════════════════════════════════════════
   HERO CARD STEP ANIMATION
══════════════════════════════════════════════════════════ */
function initHeroStepAnim() {
  const pills = document.querySelectorAll('.step-pill');
  if (!pills.length) return;
  let current = 0;
  setInterval(() => {
    pills.forEach(p => p.classList.remove('active'));
    pills[current].classList.add('active');
    current = (current + 1) % pills.length;
  }, 1800);
}

/* ══════════════════════════════════════════════════════════
   SUGGESTION CHIPS (HERO CARD)
══════════════════════════════════════════════════════════ */
document.querySelectorAll('.suggestion-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
    const map = {
      'chip-notice': 'I want to generate a legal notice for my situation.',
      'chip-complaint': 'I want to file a formal consumer complaint.',
      'chip-lawyer': 'How can I find a lawyer for my case?',
    };
    if (map[chip.id]) {
      setTimeout(() => {
        demoQuery.value = map[chip.id];
        updateCharCount();
      }, 600);
    }
  });
});

/* ══════════════════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════════════════ */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeroStepAnim();
  updateCharCount();
  console.log('%c⚖️ LexisCo Frontend Loaded', 'color: #7c3aed; font-size: 16px; font-weight: bold;');
  console.log('%cAI Legal Guide for India | Hackathon 2026', 'color: #94a3b8; font-size: 12px;');
});
