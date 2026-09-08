import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Phone, ArrowRight, Sparkles } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import Card from "../components/Card";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/app/dashboard";

  const [mode, setMode] = useState("email"); // "email" | "phone"
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) {
      setError("Add your name and " + (mode === "email" ? "email" : "phone number") + " to continue.");
      return;
    }
    setError(null);
    setUser({
      name: name.trim(),
      email: mode === "email" ? identifier.trim() : "",
      phone: mode === "phone" ? identifier.trim() : "",
    });
    navigate(redirectTo);
  };

  const continueAsGuest = () => {
    setUser({ name: "Guest", email: "", phone: "" });
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="h-[76px] flex items-center px-6 lg:px-10">
        <Logo />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <Card className="w-full max-w-md">
          <div className="text-center mb-7">
            <h1 className="font-display text-2xl text-ink mb-1.5">Welcome to SkillSetGo</h1>
            <p className="text-sm text-muted">Sign in to save your progress across sessions.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#F1EEE5] rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("email"); setIdentifier(""); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${
                mode === "email" ? "bg-white text-ink shadow-sm" : "text-muted"
              }`}
            >
              <Mail size={15} /> Email
            </button>
            <button
              type="button"
              onClick={() => { setMode("phone"); setIdentifier(""); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${
                mode === "phone" ? "bg-white text-ink shadow-sm" : "text-muted"
              }`}
            >
              <Phone size={15} /> Phone
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-ink">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Riya Sharma"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-ink">
                {mode === "email" ? "Email address" : "Phone number"}
              </label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type={mode === "email" ? "email" : "tel"}
                placeholder={mode === "email" ? "riya@example.com" : "+91 98765 43210"}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-ink">
                Password <span className="text-muted font-normal">(optional for this demo)</span>
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
              />
            </div>

            {error && <p className="text-sm text-terracotta">{error}</p>}

            <Button type="submit" className="w-full" icon={ArrowRight}>
              Continue
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <Button onClick={continueAsGuest} variant="secondary" className="w-full" icon={Sparkles} iconPosition="left">
            Continue as Guest
          </Button>

          <p className="text-center text-xs text-muted mt-6">
            This is a demo login — no password is verified and nothing is stored outside this session.
          </p>
        </Card>
      </div>
    </div>
  );
}
