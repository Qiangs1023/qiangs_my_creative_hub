import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Prose } from "@/components/Prose";
import { findEntry, neighbours, coursesEntries } from "@/lib/content";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const entry = findEntry(coursesEntries, params.slug);
    if (!entry) throw notFound();
    return entry;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const m = loaderData.meta;
    return {
      meta: [
        { title: `${m.title} — Courses · 林知远` },
        { name: "description", content: m.excerpt ?? "" },
        { property: "og:title", content: `${m.title} — Courses · 林知远` },
        { property: "og:description", content: m.excerpt ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="relative min-h-screen pt-20">
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">未找到这门课程</h1>
        <Link to="/courses" className="mt-6 inline-block font-mono text-xs text-primary">
          ← 回到 Courses
        </Link>
      </section>
      <Footer />
    </main>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const entry = Route.useLoaderData();
  const { meta, html } = entry;
  const { prev, next } = neighbours(coursesEntries, meta.slug);

  return (
    <main className="relative min-h-screen pt-20">
      <Nav />

      <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          ← Courses
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Main content */}
          <div className="md:col-span-7">
            <header>
              <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                {meta.tag && <span className="text-primary">{meta.tag}</span>}
                {meta.badge && (
                  <>
                    <span className="h-px w-6 bg-hairline" />
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">
                      {meta.badge}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-display text-balance text-4xl font-light leading-[1.1] tracking-tight md:text-5xl">
                {meta.title}
              </h1>
              {meta.excerpt && (
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {meta.excerpt}
                </p>
              )}
            </header>

            <div className="mt-12">
              <Prose html={html} />
            </div>
          </div>

          {/* Sticky purchase card */}
          <aside className="md:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-primary/40 bg-gradient-to-b from-surface to-surface-elevated p-7 shadow-card">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Enroll
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-5xl text-foreground">{meta.price}</span>
                {meta.original && (
                  <span className="font-mono text-sm text-muted-foreground line-through">
                    {meta.original}
                  </span>
                )}
              </div>
              {meta.students && (
                <div className="mt-1 font-mono text-xs text-muted-foreground">{meta.students}</div>
              )}

              {meta.features && (
                <ul className="my-6 space-y-3">
                  {meta.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="mt-1.5 inline-block h-1 w-3 bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <a
                href="#"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {meta.cta ?? "立即报名"} →
              </a>
              <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
                30 天无理由退款
              </p>
            </div>
          </aside>
        </div>

        <nav className="mt-20 grid grid-cols-1 gap-4 border-t border-hairline pt-10 md:grid-cols-2">
          {prev ? (
            <Link
              to="/courses/$slug"
              params={{ slug: prev.meta.slug }}
              className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                ← 上一门
              </span>
              <span className="font-display text-lg text-foreground transition-colors group-hover:text-primary">
                {prev.meta.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to="/courses/$slug"
              params={{ slug: next.meta.slug }}
              className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 text-right transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                下一门 →
              </span>
              <span className="font-display text-lg text-foreground transition-colors group-hover:text-primary">
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
