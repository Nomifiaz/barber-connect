import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { TrendingUp, FileText, Package, Users, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ledger Pro" },
      { name: "description", content: "Your invoicing dashboard at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { token, business, businessLoaded } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    if (businessLoaded && !business) {
      navigate({ to: "/onboarding" });
    }
  }, [token, business, businessLoaded, navigate]);

  if (!token || !businessLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <AppShell title={business?.name ? `${business.name} Ledger` : "Architectural Ledger"}>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              accent="border-l-primary"
              label="TOTAL INVOICED"
              value="Rs 0.00"
            />
            <StatCard
              accent="border-l-destructive"
              label="PENDING APPROVAL"
              value="Rs 0.00"
            />
            <StatCard
              accent="border-l-success"
              label="SUCCESSFULLY PAID"
              value="Rs 0.00"
            />
          </div>

          {/* Recent transactions */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground">Recent Transaction Registry</h3>
              <button className="text-sm text-muted-foreground hover:text-foreground">
                View Ledger Archive
              </button>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card p-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">No invoices yet</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first invoice to see it here.
              </p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-semibold hover:bg-primary/90">
                <FileText className="h-4 w-4" />
                Create invoice
              </button>
            </div>
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-5">
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-elevated">
            <h4 className="text-lg font-bold">Portfolio Insights</h4>
            <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">
              Your invoicing volume has increased by{" "}
              <span className="text-success font-semibold">12.4%</span> this fiscal quarter
              compared to the previous period.
            </p>
            <button className="mt-5 w-full bg-card text-foreground rounded-md py-2.5 font-semibold text-sm hover:bg-card/90">
              View Full Analysis
            </button>
          </div>

          <div>
            <div className="text-[11px] tracking-[0.2em] text-muted-foreground mb-3">
              RAPID EXECUTION
            </div>
            <div className="space-y-2">
              <QuickAction icon={FileText} label="Create Invoice" />
              <QuickAction icon={Package} label="Manage Products" />
              <QuickAction icon={Users} label="Business Settings" />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-[11px] tracking-[0.2em] text-muted-foreground mb-3">
              UPCOMING DEADLINES
            </div>
            <Deadline month="OCT" day="31" title="Tax Compliance Audit" sub="Due in 2 days" />
            <div className="my-3 border-t border-border" />
            <Deadline month="NOV" day="05" title="Quarterly Payouts" sub="Due in 7 days" />
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={`bg-card rounded-2xl border border-border shadow-card border-l-4 ${accent} p-5`}>
      <div className="text-[11px] tracking-[0.18em] text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="mt-3 text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: typeof Plus;
  label: string;
}) {
  return (
    <button className="w-full bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-primary/40 transition-colors text-sm font-semibold text-foreground">
      <span className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function Deadline({
  month,
  day,
  title,
  sub,
}: {
  month: string;
  day: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-center w-12">
        <div className="text-[10px] tracking-widest text-muted-foreground font-semibold">
          {month}
        </div>
        <div className="text-2xl font-bold text-foreground leading-none">{day}</div>
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
