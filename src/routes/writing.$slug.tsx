import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Prose } from "@/components/Prose";
import { findEntry, neighbours, writingEntries } from "@/lib/content";

function formatDate(date?: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${y}.${m}.${d}`;
}

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const entry = findEntry(writingEntries, params.slug);
    if (!entry) throw notFound();
    return entry;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const m = loaderData.meta;
    return {
      meta: [
        { title: `${m.title} — 林知远` },
        { name: "description", content: m.excerpt ?? "" },
        { property: "og:title", content: `${m.title} — 林知远` },
        { property: "og:description", content: m.excerpt ?? "" },
        { property: "article:published_time", content: m.date ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="relative min-h-screen pt-20">
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">未找到这篇文章</h1>
        <Link to="/writing" className="mt-6 inline-block font-mono text-xs text-primary">
          ← 回到 Writing
        </Link>
      </section>
      <Footer />
    </main>
  ),
  component: WritingDetail,
});

function WritingDetail() {
  const entry = Route.useLoaderData();
  const { meta, html } = entry;
  const { prev, next } = neighbours(writingEntries, meta.slug);

  return (
    <main className="relative min-h-screen pt-20">
      <Nav />

      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          to="/writing"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          ← Writing
        </Link>

        <header className="mt-10">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{formatDate(meta.date)}</span>
            <span className="h-px w-6 bg-hairline" />
            {meta.tag && <span className="text-primary">{meta.tag}</span>}
            {meta.readTime && (
              <>
                <span className="h-px w-6 bg-hairline" />
                <span>{meta.readTime}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-balance text-4xl font-light leading-[1.1] tracking-tight md:text-5xl">
            {meta.title}
          </h1>
          {meta.excerpt && (
            <p className="mt-6 border-l-2 border-primary/40 pl-4 text-base italic leading-relaxed text-muted-foreground">
              {meta.excerpt}
            </p>
          )}
        </header>

        <div className="mt-12">
          <Prose html={html} />
        </div>

        <nav className="mt-20 grid grid-cols-1 gap-4 border-t border-hairline pt-10 md:grid-cols-2">
          {prev ? (
            <Link
              to="/writing/$slug"
              params={{ slug: prev.meta.slug }}
              className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                ← 上一篇
              </span>
              <span className="font-display text-lg leading-snug text-foreground transition-colors group-hover:text-primary">
                {prev.meta.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to="/writing/$slug"
              params={{ slug: next.meta.slug }}
              className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 text-right transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                下一篇 →
              </span>
              <span className="font-display text-lg leading-snug text-foreground transition-colors group-hover:text-primary">
                {next.meta.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>

      <Footer />
    </main>
  );
}
