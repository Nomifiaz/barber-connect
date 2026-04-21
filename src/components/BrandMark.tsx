export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="font-extrabold tracking-[0.2em] text-foreground text-sm">
        LEDGER PRO
      </div>
      <div className="text-[10px] tracking-[0.35em] text-muted-foreground mt-1">
        ENTERPRISE TIER
      </div>
    </div>
  );
}
