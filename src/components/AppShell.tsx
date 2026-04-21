import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Package,
  BarChart3,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useAuth } from "@/lib/auth";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/products", label: "Products", icon: Package },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/business", label: "Business Details", icon: Building2 },
] as const;

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  const { user, business, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <BrandMark />
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                // @ts-expect-error — placeholder routes will be added later
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-card text-sidebar-foreground shadow-card border border-sidebar-border"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-3">
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Create New
          </button>
        </div>

        <div className="px-3 pb-4 space-y-1 border-t border-sidebar-border pt-3">
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={HelpCircle} label="Support" />
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-surface flex items-center px-8 gap-6">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-foreground">
            {title.toUpperCase()}
          </h2>
          <div className="flex-1 max-w-2xl">
            <input
              placeholder="Search invoices..."
              className="w-full rounded-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-foreground leading-tight">
                {user?.email?.split("@")[0] ?? "User"}
              </div>
              <div className="text-[11px] tracking-wider text-muted-foreground uppercase">
                {business?.name ? `${business.name}` : `${user?.role ?? "user"} Account`}
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
}: {
  icon: typeof Settings;
  label: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
