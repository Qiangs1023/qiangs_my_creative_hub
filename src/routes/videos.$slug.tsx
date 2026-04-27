import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Prose } from "@/components/Prose";
import { findEntry, neighbours, videosEntries } from "@/lib/content";
import { resolveCover } from "@/lib/covers";

export const Route = createFileRoute("/videos/$slug")({
  loader: ({ params }) => {
    const entry = findEntry(videosEntries, params.slug);
    if (!entry) throw notFound();
    return entry;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const m = loaderData.meta;
    return {
      meta: [
        { title: `${m.title} — Videos · 数字旷野` },
        { name: "description", content: m.excerpt ?? "" },
        { property: "og:title", content: `${m.title} — Videos · 数字旷野` },
        { property: "og:description", content: m.excerpt ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="relative min-h-screen pt-20">
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">未找到这支视频</h1>
        <Link to="/videos" className="mt-6 inline-block font-mono text-xs text-primary">
          ← 回到 Videos
        </Link>
      </section>
      <Footer />
    </main>
  ),
  component: VideoDetail,
});

function VideoDetail() {
  const entry = Route.useLoaderData();
  const { meta, html } = entry;
  const { prev, next } = neighbours(videosEntries, meta.slug);
  const cover = resolveCover(meta.cover);

  return (
    <main className="relative min-h-screen pt-20">
      <Nav />

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          to="/videos"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          ← Videos
        </Link>

        <header className="mt-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
            {meta.platform && <span className="text-primary">{meta.platform}</span>}
            {meta.date && (
              <>
                <span className="h-px w-6 bg-hairline" />
                <span>{meta.date}</span>
              </>
            )}
            {meta.duration && (
              <>
                <span className="h-px w-6 bg-hairline" />
                <span>{meta.duration}</span>
              </>
            )}
            {meta.views && (
              <>
                <span className="h-px w-6 bg-hairline" />
                <span>{meta.views}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-balance text-4xl font-light leading-[1.1] tracking-tight md:text-5xl">
            {meta.title}
          </h1>
          {meta.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{meta.excerpt}</p>
          )}
        </header>

        {cover && (
          <a
            href={meta.videoUrl ?? "#"}
            target={meta.videoUrl ? "_blank" : undefined}
            rel={meta.videoUrl ? "noopener noreferrer" : undefined}
            className="group relative mt-10 block overflow-hidden rounded-2xl border border-hairline"
          >
            <div className="relative aspect-video">
              <img
                src={cover}
                alt={meta.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-foreground/30 bg-background/40 backdrop-blur transition-all group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-8 w-8">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            {meta.videoUrl && (
              <div className="border-t border-hairline bg-surface/50 px-5 py-3 font-mono text-xs text-muted-foreground">
                在 {meta.platform} 上观看 →
              </div>
            )}
          </a>
        )}

        <div className="mt-12">
          <Prose html={html} />
        </div>

        <nav className="mt-20 grid grid-cols-1 gap-4 border-t border-hairline pt-10 md:grid-cols-2">
          {prev ? (
            <Link
              to="/videos/$slug"
              params={{ slug: prev.meta.slug }}
              className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                ← 上一支
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
              to="/videos/$slug"
              params={{ slug: next.meta.slug }}
              className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 text-right transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                下一支 →
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
