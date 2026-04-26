const items = [
  "INDIE HACKER",
  "✦",
  "WRITER",
  "✦",
  "EDUCATOR",
  "✦",
  "BUILDER",
  "✦",
  "ESSAYIST",
  "✦",
];

export function Marquee() {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div className="hairline-y overflow-hidden border-y border-hairline bg-background py-5">
      <div className="flex w-max animate-marquee gap-10 font-display text-3xl font-light tracking-tight text-foreground/80 md:text-4xl">
        {all.map((item, i) => (
          <span
            key={i}
            className={i % 2 === 1 ? "text-primary" : "italic text-foreground/60"}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
