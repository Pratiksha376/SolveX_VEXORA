import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Mic,
  Code2,
  Users,
  Map,
  HelpCircle,
  Settings,
  UserRound,
  X,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useApp } from "../context/AppContext";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/resume", label: "Resume Analysis", icon: FileText },
  { to: "/app/english", label: "English Coach", icon: Mic },
  { to: "/app/technical", label: "Technical Interview", icon: Code2 },
  { to: "/app/behavioral", label: "Behavioral Interview", icon: Users },
  { to: "/app/topic-interview", label: "Topic Mock Interview", icon: HelpCircle },
  { to: "/app/roadmap", label: "Career Roadmap", icon: Map },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useApp();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 z-50 lg:z-0 h-screen w-[248px] shrink-0 bg-white border-r border-border flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-[76px] flex items-center justify-between px-6 border-b border-border">
          <Logo />
          <button onClick={onClose} className="lg:hidden text-muted" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                  isActive
                    ? "bg-sage-soft text-sage-dark font-medium"
                    : "text-ink/80 hover:bg-[#F5F3EB]"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-1">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                isActive ? "bg-sage-soft text-sage-dark font-medium" : "text-ink/80 hover:bg-[#F5F3EB]"
              }`
            }
          >
            <Settings size={18} /> Settings
          </NavLink>
          <NavLink
            to="/app/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                isActive ? "bg-sage-soft text-sage-dark font-medium" : "text-ink/80 hover:bg-[#F5F3EB]"
              }`
            }
          >
            <UserRound size={18} /> {user?.name ? user.name.split(" ")[0] : "Profile"}
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] text-ink/60 hover:bg-[#F5F3EB] hover:text-terracotta transition-colors"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
