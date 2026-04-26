import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "林知远 — 独立开发者 · 写作者 · 教育者" },
      {
        name: "description",
        content:
          "林知远的个人主页 — 独立开发者、自媒体博主、课程作者。在这里查看他的产品、文章、视频与课程。",
      },
      { property: "og:title", content: "林知远 — 独立开发者 · 写作者 · 教育者" },
      {
        property: "og:description",
        content:
          "造物，写作，然后分享。三年时间从一个人到 6 位数年收入的实践记录。",
      },
    ],
  }),
  component: Index,
});

const cards = [
  {
    to: "/work" as const,
    index: "01",
    eyebrow: "Work",
    title: "我做过的东西",
    desc: "上线产品、开源项目、被收购的 SaaS。每一个都从 0 到 1。",
  },
  {
    to: "/writing" as const,
    index: "02",
    eyebrow: "Writing",
    title: "我想清楚的事",
    desc: "每两周一篇，独立工作、产品设计与生活。48 篇可读。",
  },
  {
    to: "/videos" as const,
    index: "03",
    eyebrow: "Videos",
    title: "我在镜头前说",
    desc: "深度长视频与工作日常 vlog。月更两支。",
  },
  {
    to: "/courses" as const,
    index: "04",
    eyebrow: "Courses",
    title: "我把走过的路教给你",
    desc: "三门课程，5,000+ 名学员。可直接照抄的方法论。",
  },
  {
    to: "/about" as const,
    index: "05",
    eyebrow: "About",
    title: "一个人，一台电脑",
    desc: "我是谁，做什么，以及如何写信给我。",
  },
];

function Index() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <Hero />
      <Marquee />

      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="text-primary">∗</span>
            <span className="h-px w-8 bg-hairline" />
            <span className="uppercase tracking-[0.2em]">Explore</span>
          </div>
          <h2 className="font-display text-balance text-4xl font-light leading-[1.1] tracking-tight md:text-5xl">
            五个入口，<em className="italic text-primary">一个我</em>。
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            按你感兴趣的方向逐个深入。每个板块都是独立的页面。
          </p>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-2">
            {cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-surface md:p-10"
              >
                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">{c.index}</span>
                  <span className="h-px w-8 bg-hairline" />
                  <span className="uppercase tracking-[0.2em]">{c.eyebrow}</span>
                </div>
                <h3 className="font-display text-3xl font-normal leading-tight text-foreground transition-colors group-hover:text-primary md:text-4xl">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <div className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">
                  进入 <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
