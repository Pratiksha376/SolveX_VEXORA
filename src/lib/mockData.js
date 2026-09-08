// Mock data mirrors the exact shapes the real backend returns (see the
// build brief). Swap the fetch calls in lib/api.js and every screen keeps
// working unchanged.

export const mockAnalysis = {
  session_id: "mock-session-0001",
  analysis: {
    candidate_summary:
      "A final-year CS student with solid fundamentals in Python and React, some backend exposure, and one internship. Ready for entry-level developer roles with a few targeted gaps to close.",
    strong_skills: ["Python", "React", "Git", "Problem Solving"],
    needs_improvement_skills: ["SQL", "System Design"],
    missing_skills: ["Docker", "REST APIs", "AWS"],
    resume_feedback: [
      "Project descriptions read like task lists rather than outcomes.",
      "No measurable results — add numbers wherever you can.",
    ],
    resume_score: 82,
    priority_actions: [
      "Add metrics to each project bullet (users, speed, scale).",
      "Call out backend work explicitly, even if it was small.",
    ],
  },
};

export const mockTechnicalScore = {
  technical_score: 76,
  tips: [
    "Go one layer deeper on trade-offs before moving to the next topic.",
    "Ground answers in a real project instead of textbook definitions.",
  ],
};

export const mockDashboard = {
  overall_readiness_score: 78,
  strengths: ["Python", "React", "Clear communication"],
  priority_gaps: ["SQL joins", "System design basics", "Docker"],
  roadmap: [
    { week: 1, focus: "SQL fundamentals", actions: ["Practice joins and subqueries daily", "Rebuild one project's queries from scratch"] },
    { week: 2, focus: "System design basics", actions: ["Study 3 common design patterns", "Whiteboard a URL shortener"] },
    { week: 3, focus: "Docker & deployment", actions: ["Containerize one existing project", "Write a docker-compose for it"] },
    { week: 4, focus: "Mock interview loop", actions: ["Full technical + behavioral mock", "Revise resume with new metrics"] },
  ],
  scores_breakdown: { resume: 82, technical: 76, english: 71, behavioral: 84 },
};

export const englishQuestions = [
  "Tell me about yourself.",
  "Describe a project you're proud of.",
  "How do you handle disagreements in a team?",
];

export const behavioralQuestions = [
  "Tell me about a time you had a conflict with a team member.",
  "Describe a situation where you missed a deadline. What happened?",
  "Tell me about a time you had to learn something quickly.",
];

export const aptitudeQuestions = [
  {
    id: "a1",
    prompt: "If 3 workers finish a task in 12 days, how many days will 6 workers take?",
    options: ["4 days", "6 days", "8 days", "24 days"],
    answer: 1,
  },
  {
    id: "a2",
    prompt: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    answer: 2,
  },
  {
    id: "a3",
    prompt: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    options: ["60 km/h", "70 km/h", "75 km/h", "80 km/h"],
    answer: 3,
  },
  {
    id: "a4",
    prompt: "Choose the word that does NOT belong: Python, Java, HTML, Ruby",
    options: ["Python", "Java", "HTML", "Ruby"],
    answer: 2,
  },
  {
    id: "a5",
    prompt: "If CODE is written as DPEF, how is DATA written?",
    options: ["EBUB", "EBUA", "FCVC", "EBVB"],
    answer: 0,
  },
];

// Generic question bank used by the topic-based mock interview when no
// backend is reachable. Keyed loosely — falls back to genericTopicQuestions
// for any topic not explicitly listed.
const topicQuestionBank = {
  react: [
    "What's the difference between state and props in React?",
    "How does the virtual DOM improve performance?",
    "When would you reach for useMemo or useCallback?",
    "How do you handle side effects in a functional component?",
  ],
  "system design": [
    "How would you design a URL shortener?",
    "How would you scale that to handle 10 million requests a day?",
    "Where would caching fit into this design?",
    "How would you handle a database becoming a bottleneck?",
  ],
  dbms: [
    "What's the difference between a primary key and a foreign key?",
    "Explain normalization and why it matters.",
    "How does an index speed up a query, and what's the trade-off?",
    "What's the difference between INNER JOIN and LEFT JOIN?",
  ],
  python: [
    "What's the difference between a list and a tuple in Python?",
    "How does Python's garbage collection work?",
    "Explain decorators with an example use case.",
    "What are Python generators and when would you use one?",
  ],
};

const genericTopicQuestions = [
  "Can you walk me through your experience with this topic?",
  "What's a challenging problem you've solved related to it?",
  "How would you explain this topic to someone new to it?",
  "Where do you think your understanding could go deeper?",
];

export function mockTopicInterviewReply(topic, message, history) {
  const key = (topic || "").trim().toLowerCase();
  const questions = topicQuestionBank[key] || genericTopicQuestions;
  const turn = (history || []).filter((h) => h.role === "ai").length;

  if (message === null || message === undefined) {
    return { reply: questions[0], done: false };
  }

  const next = questions[Math.min(turn, questions.length - 1)];
  const done = turn >= questions.length - 1;

  return {
    feedback: "Solid answer — try grounding it in a specific example from a project you've built.",
    reply: done ? `That wraps up your ${topic || "mock"} interview round. Nice work.` : next,
    done,
    technical_score: Math.floor(65 + Math.random() * 25),
    tips: [
      `Go one level deeper on the "why" behind ${topic || "this topic"}, not just the "what".`,
      "Use a concrete project example to anchor each answer.",
    ],
  };
}
