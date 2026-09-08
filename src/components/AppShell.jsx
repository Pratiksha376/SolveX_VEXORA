import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import { useApp } from "../context/AppContext";

export default function AppShell({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  const { user } = useApp();
  const initial = user?.name?.[0]?.toUpperCase() || "R";

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-border">
          <div className="h-[76px] px-5 lg:px-10 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden text-ink shrink-0"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
              <div className="min-w-0">
                {title && <h1 className="font-display text-xl text-ink truncate">{title}</h1>}
                {subtitle && <p className="text-sm text-muted truncate">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button className="text-ink/70 hover:text-ink transition-colors" aria-label="Notifications">
                <Bell size={19} />
              </button>
              <Link
                to="/app/profile"
                className="w-9 h-9 rounded-full bg-sage-soft text-sage-dark flex items-center justify-center text-sm font-medium hover:bg-sage-soft/70 transition-colors"
                aria-label="View profile"
              >
                {initial}
              </Link>
            </div>
          </div>
        </header>

        <main className="px-5 lg:px-10 py-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
