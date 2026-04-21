import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { BrandMark } from "@/components/BrandMark";
import { ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Ledger Pro" },
      { name: "description", content: "Create your Ledger Pro account to start invoicing." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register, token, business, businessLoaded } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && businessLoaded) {
      navigate({ to: business ? "/dashboard" : "/onboarding" });
    }
  }, [token, business, businessLoaded, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="flex flex-col px-8 sm:px-16 py-10 bg-surface">
        <BrandMark />
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Create your ledger
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start sending FBR-compliant invoices in minutes.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="input-field"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field"
                />
              </Field>
              <Field label="Confirm password">
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="input-field"
                />
              </Field>

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create account
              </button>

              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-foreground hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex bg-brand-hero text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>FBR Compliant Ledger</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight max-w-md">
            One ledger. Every invoice. Always compliant.
          </h2>
          <p className="mt-4 text-white/70 max-w-md">
            Spin up your business profile, plug in your FBR token, and start submitting
            QR-stamped invoices today.
          </p>
        </div>
        <div className="text-white/50 text-sm">© Ledger Pro · Enterprise Tier</div>
      </div>

      <style>{`.input-field {
        width: 100%;
        border-radius: 0.5rem;
        border: 1px solid var(--color-border);
        background: var(--color-card);
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
        outline: none;
        transition: border-color .15s, box-shadow .15s;
      }
      .input-field:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-primary) 15%, transparent);
      }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
