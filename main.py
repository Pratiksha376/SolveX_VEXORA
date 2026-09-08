from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid

from resume_parser import extract_text
from llm import call_llm_json, call_llm

app = FastAPI(title="CareerForge API")

# Wide-open CORS for hackathon speed. Tighten later if you have time.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- In-memory "database" (no time for real DB in 7 hours) ----
SESSIONS: Dict[str, dict] = {}


# =========================================================
# 1. RESUME SCANNER + SKILL GAP ANALYSIS
# =========================================================

@app.post("/api/resume/analyze")
async def analyze_resume(
    target_role: str = Form(...),
    file: UploadFile = File(...),
):
    file_bytes = await file.read()
    resume_text = extract_text(file.filename, file_bytes)

    if not resume_text.strip():
        raise HTTPException(400, "Could not extract text from this file.")

    prompt = f"""
You are a career coach AI analyzing a resume for the target role: "{target_role}".

Resume text:
---
{resume_text[:6000]}
---

Return a JSON object with EXACTLY this shape:
{{
  "candidate_summary": "1-2 sentence summary of the candidate",
  "strong_skills": ["skill1", "skill2"],
  "needs_improvement_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "resume_feedback": ["specific actionable feedback point 1", "point 2"],
  "resume_score": 0-100,
  "priority_actions": ["most important thing to do first", "second"]
}}
"""
    result = call_llm_json(prompt)

    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = {
        "target_role": target_role,
        "resume_analysis": result,
        "resume_text": resume_text[:6000],
        "interview_history": [],
        "scores": {"resume": result.get("resume_score", 0)},
    }

    return {"session_id": session_id, "analysis": result}


# =========================================================
# 2. TECHNICAL INTERVIEW COACH (multi-turn chat)
# =========================================================

class ChatMessage(BaseModel):
    role: str  # "user" or "ai"
    content: str


class InterviewChatRequest(BaseModel):
    session_id: str
    message: Optional[str] = None  # None on the very first call to get the opening question
    history: List[ChatMessage] = []
    topic: Optional[str] = None  # e.g. "Machine Learning" — overrides resume-based focus


@app.post("/api/interview/chat")
async def interview_chat(req: InterviewChatRequest):
    session = SESSIONS.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Analyze a resume first.")

    role = session["target_role"]
    gaps = session["resume_analysis"].get("missing_skills", [])
    strengths = session["resume_analysis"].get("strong_skills", [])

    history_text = "\n".join(f"{m.role.upper()}: {m.content}" for m in req.history)

    # If the user asked for a specific topic (e.g. "ML"), the questions focus
    # entirely on that topic instead of the general resume-based interview.
    if req.topic:
        focus_instruction = (
            f'The candidate specifically requested an interview focused ONLY on: "{req.topic}". '
            f"Ask questions strictly within this topic, ranging from fundamentals to applied/scenario-based questions. "
            f"Ignore the candidate's other resume skills unless directly relevant to {req.topic}."
        )
    else:
        focus_instruction = (
            f"Candidate's strong skills: {strengths}. Skill gaps: {gaps}. "
            f"Ask questions relevant to this role and the candidate's background."
        )

    if req.message is None:
        prompt = f"""
You are an AI technical interviewer for the role "{role}".
{focus_instruction}
Ask ONE opening interview question. Keep it natural, not robotic.
Return JSON: {{"question": "..."}}
"""
        result = call_llm_json(prompt)
        session["interview_history"].append({"role": "ai", "content": result["question"]})
        return {"reply": result["question"], "done": False}

    prompt = f"""
You are an AI technical interviewer for the role "{role}".
{focus_instruction}
Conversation so far:
{history_text}
CANDIDATE JUST ANSWERED: {req.message}

Evaluate the answer briefly, then ask ONE relevant follow-up question (dig deeper or move to a new sub-topic within the same focus area).
Return JSON:
{{"feedback": "1 short sentence on the answer quality", "next_question": "..."}}
"""
    result = call_llm_json(prompt)
    session["interview_history"].append({"role": "user", "content": req.message})
    session["interview_history"].append({"role": "ai", "content": result["next_question"]})

    return {
        "feedback": result.get("feedback", ""),
        "reply": result["next_question"],
        "done": False,
    }


@app.post("/api/interview/score")
async def score_interview(session_id: str = Form(...)):
    """Call this when the interview is over to get a final technical score."""
    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found.")

    transcript = "\n".join(
        f"{m['role'].upper()}: {m['content']}" for m in session["interview_history"]
    )
    prompt = f"""
Here is a technical interview transcript for the role "{session['target_role']}":
{transcript}

Score the candidate's technical performance 0-100 and give 2-3 short improvement tips.
Return JSON: {{"technical_score": 0-100, "tips": ["tip1", "tip2"]}}
"""
    result = call_llm_json(prompt)
    session["scores"]["technical"] = result.get("technical_score", 0)
    return result


# =========================================================
# 2.5 ENGLISH & COMMUNICATION COACH
# =========================================================

class EnglishAnalyzeRequest(BaseModel):
    session_id: str
    transcript: str  # text from the browser's Web Speech API
    prompt_question: Optional[str] = "Tell me about yourself."


@app.post("/api/english/analyze")
async def analyze_english(req: EnglishAnalyzeRequest):
    session = SESSIONS.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found. Analyze a resume first.")

    prompt = f"""
A student was asked: "{req.prompt_question}"
They responded (transcribed from speech): "{req.transcript}"

Evaluate their spoken English communication. Look for grammar issues, filler words
(um, uh, like, you know), unclear or run-on sentences, vocabulary level, and overall clarity.

Return JSON:
{{
  "fluency_score": 0-100,
  "grammar_score": 0-100,
  "clarity_score": 0-100,
  "filler_words_found": ["um", "like"],
  "issues": ["specific issue 1", "specific issue 2"],
  "improved_version": "a rewritten, more polished version of their answer",
  "tip": "one specific actionable tip to improve"
}}
"""
    result = call_llm_json(prompt)

    overall_english = round(
        (result.get("fluency_score", 0) + result.get("grammar_score", 0) + result.get("clarity_score", 0)) / 3
    )
    session["scores"]["english"] = overall_english
    result["overall_english_score"] = overall_english

    return result


# =========================================================
# 3. DASHBOARD + ROADMAP
# =========================================================

class DashboardRequest(BaseModel):
    session_id: str
    aptitude_score: Optional[int] = None
    english_score: Optional[int] = None
    behavioral_score: Optional[int] = None


@app.post("/api/dashboard")
async def get_dashboard(req: DashboardRequest):
    session = SESSIONS.get(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found.")

    scores = session["scores"]
    if req.aptitude_score is not None:
        scores["aptitude"] = req.aptitude_score
    if req.english_score is not None:
        scores["english"] = req.english_score
    if req.behavioral_score is not None:
        scores["behavioral"] = req.behavioral_score

    overall = round(sum(scores.values()) / len(scores)) if scores else 0

    prompt = f"""
A student targeting the role "{session['target_role']}" has these readiness scores: {scores}.
Their resume analysis: {session['resume_analysis']}.

Generate a personalized 4-week improvement roadmap.
Return JSON:
{{
  "overall_readiness_score": {overall},
  "strengths": ["..."],
  "priority_gaps": ["..."],
  "roadmap": [
    {{"week": 1, "focus": "...", "actions": ["...", "..."]}},
    {{"week": 2, "focus": "...", "actions": ["...", "..."]}},
    {{"week": 3, "focus": "...", "actions": ["...", "..."]}},
    {{"week": 4, "focus": "...", "actions": ["...", "..."]}}
  ]
}}
"""
    result = call_llm_json(prompt)
    result["scores_breakdown"] = scores
    return result


@app.get("/api/health")
async def health():
    return {"status": "ok"}
