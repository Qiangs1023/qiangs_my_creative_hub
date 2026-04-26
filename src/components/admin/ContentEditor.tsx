import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";

type FieldType = "text" | "textarea" | "markdown" | "url" | "number" | "tags" | "image" | "video";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
};

export function ContentEditor({
  table,
  id,
  fields,
  listPath,
  title,
}: {
  table: "work" | "writing" | "videos" | "courses";
  id: string;
  fields: FieldDef[];
  listPath: "/admin/work" | "/admin/writing" | "/admin/videos" | "/admin/courses";
  title: string;
}) {
  const isNew = id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<Record<string, any>>(() => initialFromFields(fields));

  useEffect(() => {
    if (isNew) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, table]);

  async function load() {
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    if (error) {
      toast.error(error.message);
    } else if (data) {
      setForm(data);
    }
    setLoading(false);
  }

  function update<T>(key: string, value: T) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    // Validate required
    for (const f of fields) {
      if (f.required && !form[f.name]) {
        toast.error(`请填写「${f.label}」`);
        return;
      }
    }
    setBusy(true);
    try {
      // Slug auto from title if empty
      const payload = { ...form };
      if (!payload.slug && payload.title) {
        payload.slug = String(payload.title)
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      // Coerce numbers
      for (const f of fields) {
        if (f.type === "number" && payload[f.name] !== undefined && payload[f.name] !== null) {
          payload[f.name] = Number(payload[f.name]);
        }
      }
      // strip non-column fields just in case
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (isNew) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await supabase.from(table).insert(payload as any).select("id").single();
        if (error) throw error;
        toast.success("已创建");
        navigate({ to: `${listPath}/$id`, params: { id: data.id } });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from(table).update(payload as any).eq("id", id);
        if (error) throw error;
        toast.success("已保存");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="text-sm text-muted-foreground">加载中…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tight">
            {isNew ? `新建${title}` : `编辑${title}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: listPath })}
            className="rounded-md border border-hairline px-3 py-1.5 text-sm hover:bg-surface"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={busy}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "保存中…" : "保存"}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-xl border border-hairline bg-surface/30 p-6">
        {fields.map((f) => (
          <Field key={f.name} field={f} value={form[f.name]} onChange={(v) => update(f.name, v)} />
        ))}

        <div className="flex items-center gap-2 border-t border-hairline pt-5">
          <input
            id="published"
            type="checkbox"
            checked={form.published ?? true}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="published" className="text-sm">
            已发布（取消勾选则保存为草稿）
          </label>
        </div>
      </div>
    </div>
  );
}

function initialFromFields(fields: FieldDef[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: Record<string, any> = { published: true };
  for (const f of fields) {
    if (f.type === "tags") obj[f.name] = [];
    else if (f.type === "number") obj[f.name] = 0;
    else obj[f.name] = "";
  }
  return obj;
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
}) {
  const base =
    "w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {field.label} {field.required && <span className="text-destructive">*</span>}
      </label>
      {field.type === "text" || field.type === "url" ? (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : field.type === "number" ? (
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : field.type === "textarea" ? (
        <textarea
          rows={3}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} resize-y`}
        />
      ) : field.type === "markdown" ? (
        <textarea
          rows={16}
          value={value ?? ""}
          placeholder={field.placeholder ?? "支持 Markdown 语法"}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} resize-y font-mono text-xs leading-relaxed`}
        />
      ) : field.type === "tags" ? (
        <input
          type="text"
          value={Array.isArray(value) ? value.join(", ") : ""}
          placeholder="用逗号分隔，如：TypeScript, Next.js"
          onChange={(e) =>
            onChange(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className={base}
        />
      ) : field.type === "image" ? (
        <FileUpload
          bucket="covers"
          value={value}
          onChange={(url) => onChange(url)}
          accept="image/*"
          label="上传封面图"
        />
      ) : field.type === "video" ? (
        <FileUpload
          bucket="media"
          value={value}
          onChange={(url) => onChange(url)}
          accept="video/*"
          label="上传视频"
        />
      ) : null}
    </div>
  );
}
