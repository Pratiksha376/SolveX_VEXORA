import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import Logo from "./Logo";
import Button from "./Button";
import { useApp } from "../context/AppContext";

export default function MarketingNavbar() {
  const { isAuthenticated, user } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-9 text-[15px] text-ink">
          <a href="/#home" className="hover:text-sage-dark transition-colors">Home</a>
          <a href="/#features" className="hover:text-sage-dark transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-sage-dark transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button to={isAuthenticated ? "/app/dashboard" : "/login"}>
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Button>
          <Link
            to={isAuthenticated ? "/app/profile" : "/login"}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-ink hover:border-sage transition-colors shrink-0"
            aria-label={isAuthenticated ? "View profile" : "Log in"}
          >
            {isAuthenticated ? (
              <span className="text-sm font-medium text-sage-dark">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
            ) : (
              <UserRound size={18} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
