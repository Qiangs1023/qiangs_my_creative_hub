export function Footer() {
  return (
    <footer className="hairline-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-mono text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          <span>© 2025 林知远 · 独立设计与开发</span>
        </div>
        <div>built in public · with care from 上海</div>
      </div>
    </footer>
  );
}
