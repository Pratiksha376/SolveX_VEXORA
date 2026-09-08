import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, X, ArrowRight, RefreshCcw } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import SkillTag from "../components/SkillTag";
import { useApp } from "../context/AppContext";
import { analyzeResume } from "../lib/api";

const ROLES = [
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "AI/ML Engineer",
  "Cloud Engineer",
];

export default function ResumeAnalysis() {
  const { analysis, setAnalysis, setSessionId, targetRole, setTargetRole } = useApp();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(targetRole || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const okType = /\.(pdf|docx)$/i.test(f.name);
    if (!okType) {
      setError("Please upload a .pdf or .docx file.");
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file || !role) {
      setError("Add a resume and select a target role first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await analyzeResume({ file, targetRole: role });
      setAnalysis(result);
      setSessionId(result.session_id);
      setTargetRole(role);
    } catch (err) {
      setError("Something went wrong analyzing your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setFile(null);
  };

  const data = analysis?.analysis;

  return (
    <AppShell title="Resume Analysis" subtitle="Upload once, understand where you stand.">
      {!data ? (
        <Card className="max-w-xl mx-auto">
          <h2 className="font-display text-2xl text-ink mb-1">Analyze your resume</h2>
          <p className="text-muted text-sm mb-6">We accept PDF and Word documents only.</p>

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className="border-2 border-dashed border-border rounded-xl py-12 flex flex-col items-center text-center cursor-pointer hover:border-sage transition-colors"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {file ? (
              <>
                <CheckCircle2 className="text-sage-dark mb-3" size={30} />
                <p className="font-medium text-ink">{file.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-sm text-muted mt-1 inline-flex items-center gap-1 hover:text-ink"
                >
                  <X size={14} /> Remove
                </button>
              </>
            ) : (
              <>
                <Upload className="text-sage-dark mb-3" size={28} />
                <p className="font-medium text-ink mb-1">Upload Resume</p>
                <p className="text-sm text-muted">Drag & drop, or click to browse — PDF or DOCX</p>
              </>
            )}
          </div>

          <label className="block mt-6 mb-2 text-sm font-medium text-ink">Target Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-ink bg-white focus:border-sage outline-none"
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {error && <p className="text-sm text-terracotta mt-4">{error}</p>}

          <div className="mt-7">
            {loading ? (
              <Spinner label="Analyzing your resume — this can take a few seconds..." />
            ) : (
              <Button onClick={handleSubmit} className="w-full" icon={ArrowRight}>
                Analyze Resume
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted">Resume Score</p>
              <p className="font-display text-4xl text-ink">{data.resume_score}<span className="text-lg text-muted">/100</span></p>
            </div>
            <Button variant="secondary" icon={RefreshCcw} iconPosition="left" onClick={reset}>
              Analyze a different resume
            </Button>
          </div>

          <Card>
            <h3 className="font-display text-lg text-ink mb-2">Candidate Summary</h3>
            <p className="text-ink/80 leading-relaxed">{data.candidate_summary}</p>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h4 className="font-medium text-ink mb-3">Strong Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.strong_skills.map((s) => <SkillTag key={s} tone="strong">{s}</SkillTag>)}
              </div>
            </Card>
            <Card>
              <h4 className="font-medium text-ink mb-3">Needs Improvement</h4>
              <div className="flex flex-wrap gap-2">
                {data.needs_improvement_skills.map((s) => <SkillTag key={s} tone="weak">{s}</SkillTag>)}
              </div>
            </Card>
            <Card>
              <h4 className="font-medium text-ink mb-3">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.missing_skills.map((s) => <SkillTag key={s} tone="missing">{s}</SkillTag>)}
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h4 className="font-medium text-ink mb-3">Resume Feedback</h4>
              <ul className="space-y-2">
                {data.resume_feedback.map((f, i) => (
                  <li key={i} className="text-sm text-ink/80 flex gap-2">
                    <FileText size={15} className="text-terracotta shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h4 className="font-medium text-ink mb-3">Priority Actions</h4>
              <ul className="space-y-2">
                {data.priority_actions.map((f, i) => (
                  <li key={i} className="text-sm text-ink/80 flex gap-2">
                    <CheckCircle2 size={15} className="text-sage-dark shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="bg-sage-soft/60 border-sage-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-ink/90">Ready to work on your gaps? Head to your dashboard or start practicing.</p>
            <Button to="/app/dashboard" icon={ArrowRight}>Go to Dashboard</Button>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
