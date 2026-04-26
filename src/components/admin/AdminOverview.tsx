import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

type Counts = {
  work: number;
  writing: number;
  videos: number;
  courses: number;
  users: number;
  views7d: number;
  enrollments: number;
};

export function AdminOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<{ kind: string; slug: string; created_at: string }[]>([]);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [w, wr, v, c, p, vws, en, recentViews] = await Promise.all([
      supabase.from("work").select("*", { count: "exact", head: true }),
      supabase.from("writing").select("*", { count: "exact", head: true }),
      supabase.from("videos").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("content_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
      supabase
        .from("content_views")
        .select("kind, slug, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    setCounts({
      work: w.count ?? 0,
      writing: wr.count ?? 0,
      videos: v.count ?? 0,
      courses: c.count ?? 0,
      users: p.count ?? 0,
      views7d: vws.count ?? 0,
      enrollments: en.count ?? 0,
    });
    setRecent(recentViews.data ?? []);
  }

  const stats = [
    { label: "作品", value: counts?.work, to: "/admin/work" as const },
    { label: "文章", value: counts?.writing, to: "/admin/writing" as const },
    { label: "视频", value: counts?.videos, to: "/admin/videos" as const },
    { label: "课程", value: counts?.courses, to: "/admin/courses" as const },
    { label: "注册用户", value: counts?.users, to: "/admin/users" as const },
    { label: "近 7 天浏览", value: counts?.views7d },
    { label: "课程报名", value: counts?.enrollments },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-light tracking-tight">概览</h1>
        <p className="mt-1 text-sm text-muted-foreground">站点核心数据一览。</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => {
          const card = (
            <div className="rounded-xl border border-hairline bg-surface/30 p-4 transition-colors hover:bg-surface/60">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-3xl font-light">
                {s.value === undefined ? "—" : s.value}
              </div>
            </div>
          );
          return s.to ? (
            <Link key={s.label} to={s.to}>
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-foreground">最近浏览</h2>
        <div className="rounded-xl border border-hairline">
          {recent.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">暂无浏览记录。</div>
          ) : (
            <ul className="divide-y divide-hairline">
              {recent.map((r, i) => (
                <li key={i} className="flex items-center justify-between p-3 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{r.kind}</span>
                  <span className="flex-1 px-3 truncate">{r.slug}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
