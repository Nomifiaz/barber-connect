import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { ApiError, PK_PROVINCES, api } from "@/lib/api";
import { BrandMark } from "@/components/BrandMark";
import { Building2, ChevronRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Register your business — Ledger Pro" },
      { name: "description", content: "Set up your business profile for FBR submissions." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { token, business, businessLoaded, setBusiness } = useAuth();

  const [name, setName] = useState("");
  const [ntn, setNtn] = useState("");
  const [posId, setPosId] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState<string>(PK_PROVINCES[0]);
  const [fbrToken, setFbrToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    if (businessLoaded && business) {
      navigate({ to: "/dashboard" });
    }
  }, [token, business, businessLoaded, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.createBusiness({
        name: name.trim(),
        ntn: ntn.trim(),
        address: address.trim(),
        province,
        fbrToken: fbrToken.trim(),
        posId: posId.trim() || undefined,
      });
      setBusiness(res.data);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <BrandMark />
          <div className="text-sm text-muted-foreground">
            Step <span className="text-foreground font-semibold">1</span> of 1
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-card rounded-2xl border border-border shadow-card p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Register your business</h1>
              <p className="text-sm text-muted-foreground mt-1">
                These details appear on every FBR submission and invoice you generate.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field label="Business Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="input-field"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="NTN / Tax ID">
                <input
                  required
                  value={ntn}
                  onChange={(e) => setNtn(e.target.value)}
                  placeholder="1234567-8"
                  className="input-field"
                />
              </Field>
              <Field label="POS ID">
                <input
                  value={posId}
                  onChange={(e) => setPosId(e.target.value)}
                  placeholder="Optional POS ID"
                  className="input-field"
                />
              </Field>
            </div>

            <Field label="Address">
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City"
                className="input-field"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Province">
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="input-field"
                >
                  {PK_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="FBR Token">
                <input
                  required
                  value={fbrToken}
                  onChange={(e) => setFbrToken(e.target.value)}
                  placeholder="Your API Secret"
                  className="input-field"
                />
              </Field>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      <style>{`.input-field {
        width: 100%;
        border-radius: 0.5rem;
        border: 1px solid var(--color-border);
        background: var(--color-card);
        padding: 0.7rem 0.9rem;
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
