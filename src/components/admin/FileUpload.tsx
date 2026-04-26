import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Bucket = "covers" | "media";

export function FileUpload({
  bucket,
  value,
  onChange,
  accept = "image/*",
  label = "上传文件",
}: {
  bucket: Bucket;
  value?: string | null;
  onChange: (publicUrl: string | null) => void;
  accept?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  async function handle(file: File) {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const filename = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
      setPreview(data.publicUrl);
      toast.success("上传成功");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs hover:bg-surface/80 disabled:opacity-50"
        >
          {busy ? "上传中…" : label}
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange(null);
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            清除
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handle(f);
          e.target.value = "";
        }}
      />
      {preview && accept.startsWith("image") && (
        <img
          src={preview}
          alt="预览"
          className="h-32 w-full rounded-md border border-hairline object-cover"
        />
      )}
      {preview && !accept.startsWith("image") && (
        <p className="truncate font-mono text-xs text-muted-foreground">{preview}</p>
      )}
    </div>
  );
}

export async function uploadPrivate(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("course-videos").upload(path, file);
  if (error) throw error;
  return path;
}
