export function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <div
      className="t-label flex items-center gap-3 text-[color:var(--scene-dim)]"
      aria-hidden="true"
    >
      <span className="tabular-nums">{n}</span>
      <span className="block h-px w-8 bg-current opacity-60" />
      <span>{label}</span>
    </div>
  );
}
