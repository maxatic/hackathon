interface SectionLabelProps {
  number: string;
  text: string;
}

export function SectionLabel({ number, text }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 text-xs tracking-widest text-[var(--muted)] uppercase">
      <span className="shrink-0">[{number}]</span>
      <div className="h-px w-8 shrink-0 bg-[var(--border)]" />
      <span className="shrink-0">{text}</span>
    </div>
  );
}
