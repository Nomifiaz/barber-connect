import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { token, business, businessLoaded } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    if (businessLoaded) {
      navigate({ to: business ? "/dashboard" : "/onboarding" });
    }
  }, [token, business, businessLoaded, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
      Loading…
    </div>
  );
}
