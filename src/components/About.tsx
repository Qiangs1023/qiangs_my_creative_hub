import { SectionHeader } from "./SectionHeader";

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "PostgreSQL",
  "Swift",
  "Go",
  "Figma",
  "Cursor",
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="05"
          eyebrow="About / Contact"
          title={
            <>
              一个人，<em className="italic text-primary">一台电脑</em>。
            </>
          }
        />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:col-span-7">
            <p>
              我 2019 年从一家大厂离职，搬到了一座小城，开始尝试自己做产品。
              前两年很糟糕，做了 11 个项目全部失败。第三年第一次有了订阅收入，
              那个月赚了 $87 — 我至今记得收到 Stripe 邮件时的感觉。
            </p>
            <p>
              现在，我同时做三件事：构建产品、写文章、录视频。
              我相信「慢就是快」，所以这个网站永远不会有弹窗，
              我也永远不会卖你不需要的东西。
            </p>
            <p>
              如果你也在路上，欢迎写信给我。我会读每一封。
            </p>

            <div className="hairline-t pt-6">
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Toolbox
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-hairline px-3 py-1 text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-hairline bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                邮件订阅 · 每两周一封
              </div>
              <h3 className="font-display text-2xl font-normal leading-tight text-foreground">
                加入 12,000+ 名读者，
                <br />
                收到我每两周一次的笔记。
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                独立工作的真实日常、产品笔记、和我读到的好东西。无广告，可一键退订。
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-6 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  订阅
                </button>
              </form>

              <div className="mt-6 hairline-t pt-5">
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  在别处找到我
                </div>
                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  {["Twitter / X", "GitHub", "B站", "YouTube", "小红书"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="text-foreground transition-colors hover:text-primary"
                    >
                      {s} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
