import { ArrowRight, FileText, Mic, MessageSquare, MapPin, Upload, ListChecks, Search, Sparkles, RefreshCcw } from "lucide-react";
import MarketingNavbar from "../components/MarketingNavbar";
import Button from "../components/Button";
import ProgressCarousel from "../components/ProgressCarousel";

const features = [
  { icon: FileText, title: "Resume Analysis", desc: "Get insights into your strengths and skill gaps.", tone: "bg-sage-soft text-sage-dark" },
  { icon: Mic, title: "AI Interview", desc: "Practice with personalized questions and feedback.", tone: "bg-peach text-[#a15a35]" },
  { icon: MessageSquare, title: "Communication", desc: "Improve your English and soft skills.", tone: "bg-[#EAF0EC] text-sage-dark" },
  { icon: MapPin, title: "Career Guidance", desc: "Get a tailored roadmap for your goals.", tone: "bg-[#FBF1DE] text-[#9a7a2c]" },
];

const steps = [
  { n: "01", title: "Upload your resume", desc: "Drop in a PDF or Word file — that's all we need to start.", icon: Upload },
  { n: "02", title: "Choose your target role", desc: "Tell us the job you're preparing for.", icon: ListChecks },
  { n: "03", title: "Discover your gaps", desc: "See exactly what's missing between you and the role.", icon: Search },
  { n: "04", title: "Practice with AI", desc: "Work through technical, behavioral, and speaking practice.", icon: Sparkles },
  { n: "05", title: "Improve and reassess", desc: "Track how each round moves your readiness forward.", icon: RefreshCcw },
];

export default function Landing() {
  return (
    <div className="bg-cream" id="home">
      <MarketingNavbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-20 pb-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-start">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-sage-soft text-sage-dark rounded-full px-4 py-1.5 text-sm mb-6">
              <span aria-hidden>🌿</span> Your Skills. Your Future.
            </span>
            <h1 className="font-display text-[44px] sm:text-5xl lg:text-[56px] leading-[1.08] text-ink mb-6">
              Know your gaps.
              <br />
              <span className="text-sage-dark">Practice smarter.</span>
              <br />
              Get interview-ready.
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-md mb-8">
              SkillSetGo helps you analyze your resume, identify skill gaps, conduct
              personalized mock interviews and give you a clear roadmap to your dream job.
            </p>
            <div className="flex items-center gap-6">
              <Button to="/app/dashboard" icon={ArrowRight}>Get Started</Button>
              <a href="#how-it-works" className="text-sage-dark font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Learn More <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="lg:pt-1">
            <ProgressCarousel />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 border-t border-border">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl lg:text-4xl text-ink mb-3">
            Everything you need for a successful career journey
          </h2>
          <p className="text-muted leading-relaxed">
            From resume analysis to mock interviews, get personalized guidance at every step.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc, tone }) => (
            <div key={title}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${tone}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-medium text-ink mb-1.5">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 border-t border-border">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl lg:text-4xl text-ink mb-3">How it works</h2>
          <p className="text-muted leading-relaxed">
            Five steps from an unassessed profile to a plan you can actually follow.
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-8">
          {steps.map(({ n, title, desc, icon: Icon }, i) => (
            <div key={n} className="relative">
              <div className="flex items-center gap-2 text-sage-dark mb-3">
                <Icon size={18} />
                <span className="font-display text-lg">{n}</span>
              </div>
              <h3 className="text-ink font-medium mb-1.5 text-[15px]">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[10px] left-full w-8 h-px bg-border -translate-x-2" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="rounded-2xl bg-sage-dark text-white px-10 py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl mb-2">Your career profile starts here.</h2>
            <p className="text-white/80 max-w-md">
              Upload your resume to discover your strengths and skill gaps — no fees, no waiting.
            </p>
          </div>
          <Button to="/app/dashboard" variant="secondary" icon={ArrowRight} className="!bg-white !text-sage-dark shrink-0">
            Get Started
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span>© {new Date().getFullYear()} SkillSetGo</span>
          <span>Know your gaps. Practice smarter. Get interview-ready.</span>
        </div>
      </footer>
    </div>
  );
}
