import { createFileRoute } from "@tanstack/react-router";
import { ContentEditor, type FieldDef } from "@/components/admin/ContentEditor";

const fields: FieldDef[] = [
  { name: "title", label: "标题", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text" },
  { name: "excerpt", label: "摘要", type: "textarea" },
  { name: "cover_url", label: "封面图", type: "image" },
  { name: "video_url", label: "视频地址（外链或上传）", type: "video" },
  { name: "duration", label: "时长（如 28:14）", type: "text" },
  { name: "tags", label: "标签 / 平台", type: "tags" },
  { name: "content", label: "简介（Markdown）", type: "markdown" },
];

export const Route = createFileRoute("/admin/videos/$id")({
  component: VideoEdit,
});

function VideoEdit() {
  const { id } = Route.useParams();
  return (
    <ContentEditor
      table="videos"
      id={id}
      fields={fields}
      listPath="/admin/videos"
      title="视频"
    />
  );
}
