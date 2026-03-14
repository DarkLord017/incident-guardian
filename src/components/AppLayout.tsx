import { Link, useLocation } from "react-router-dom";
import { BookOpen, AlertTriangle, Activity, LayoutDashboard } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/runbooks", label: "Runbooks", icon: BookOpen },
  { path: "/incidents", label: "Incidents", icon: AlertTriangle },
  { path: "/metrics", label: "Metrics", icon: Activity },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="brutal-border border-t-0 border-x-0 bg-secondary px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold tracking-tight">
            ⚡ RUNBOOK<span className="bg-foreground text-primary-foreground px-2 py-0.5 ml-1">AI</span>
          </h1>
          <nav className="flex gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold brutal-border brutal-hover ${
                  location.pathname === path
                    ? "bg-foreground text-primary-foreground brutal-shadow-sm"
                    : "bg-card"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
