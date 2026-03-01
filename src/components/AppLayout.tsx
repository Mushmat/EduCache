import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Brain, RefreshCw } from "lucide-react";

const navItems = [
  { path: "/home", label: "Dashboard", icon: BookOpen },
  { path: "/brain", label: "Brain", icon: Brain },
  { path: "/sync", label: "Sync", icon: RefreshCw },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/home" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              EduCache
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
