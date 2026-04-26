import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsers,
});

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  view_count?: number;
  enrollment_count?: number;
  role?: string;
};

function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!profiles) {
      setLoading(false);
      return;
    }

    // enrich with counts
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        const [views, enrolls, role] = await Promise.all([
          supabase
            .from("content_views")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id),
          supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", p.id)
            .eq("role", "admin")
            .maybeSingle(),
        ]);
        return {
          ...p,
          view_count: views.count ?? 0,
          enrollment_count: enrolls.count ?? 0,
          role: role.data ? "admin" : "user",
        };
      }),
    );

    setUsers(enriched);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light tracking-tight">用户</h1>
        <p className="mt-1 text-sm text-muted-foreground">共 {users.length} 名注册用户</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">加载中…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">用户</th>
                <th className="px-4 py-3 text-left">角色</th>
                <th className="px-4 py-3 text-right">浏览数</th>
                <th className="px-4 py-3 text-right">课程数</th>
                <th className="px-4 py-3 text-right">注册时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.display_name || "—"}</div>
                    <div className="font-mono text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        u.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{u.view_count}</td>
                  <td className="px-4 py-3 text-right font-mono">{u.enrollment_count}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
