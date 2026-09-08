# CareerForge Backend API Contract

Base URL (local dev): `http://localhost:8000`

All requests/responses are JSON except file upload (multipart/form-data).

---

## 1. Analyze Resume
`POST /api/resume/analyze`
**Body:** `multipart/form-data`
- `target_role` (string) — e.g. "Software Developer"
- `file` (file) — .pdf or .docx

**Response 200:**
```json
{
  "session_id": "uuid-string",
  "analysis": {
    "candidate_summary": "string",
    "strong_skills": ["Python", "React"],
    "needs_improvement_skills": ["SQL"],
    "missing_skills": ["Docker", "REST APIs"],
    "resume_feedback": ["string", "string"],
    "resume_score": 82,
    "priority_actions": ["string", "string"]
  }
}
```
> Save `session_id` — every other call needs it.

---

## 2. Interview Chat (multi-turn)
`POST /api/interview/chat`
**Body:**
```json
{
  "session_id": "uuid-string",
  "message": null,        // null on first call to get opening question
  "history": []           // [{ "role": "user"|"ai", "content": "..." }, ...]
}
```
**Response 200 (first call):**
```json
{ "reply": "Can you explain how REST APIs work?", "done": false }
```
**Response 200 (subsequent calls, message set):**
```json
{ "feedback": "Good explanation, a bit brief.", "reply": "How would you add auth to that?", "done": false }
```
> Frontend keeps appending to `history` locally and sends the whole thing each time.

---

## 3. Score Interview
`POST /api/interview/score`
**Body:** `multipart/form-data` — `session_id` (string)

**Response 200:**
```json
{ "technical_score": 76, "tips": ["string", "string"] }
```

---

## 4. Dashboard + Roadmap
`POST /api/dashboard`
**Body:**
```json
{
  "session_id": "uuid-string",
  "aptitude_score": 64,     // optional, from frontend-only aptitude quiz
  "english_score": 71,      // optional
  "behavioral_score": 84    // optional
}
```
**Response 200:**
```json
{
  "overall_readiness_score": 78,
  "strengths": ["string"],
  "priority_gaps": ["string"],
  "roadmap": [
    { "week": 1, "focus": "string", "actions": ["string", "string"] }
  ],
  "scores_breakdown": { "resume": 82, "technical": 76 }
}
```

---

## 5. Health check
`GET /api/health` → `{ "status": "ok" }`

---

## Notes for frontend team
- CORS is wide open, call directly from `fetch`/`axios` — no proxy needed.
- Aptitude quiz can be **entirely frontend** (static question bank + local scoring) — just send the final `aptitude_score` to `/api/dashboard` at the end.
- You can build the whole UI right now against these exact JSON shapes using mock/dummy responses — swap in real fetch calls once the backend is running on `localhost:8000`.
