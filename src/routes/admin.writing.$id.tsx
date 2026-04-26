import { createFileRoute } from "@tanstack/react-router";
import { ContentEditor, type FieldDef } from "@/components/admin/ContentEditor";

const fields: FieldDef[] = [
  { name: "title", label: "标题", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text" },
  { name: "excerpt", label: "摘要", type: "textarea" },
  { name: "cover_url", label: "封面图（可选）", type: "image" },
  { name: "read_time", label: "阅读时长（如 6 min）", type: "text" },
  { name: "tags", label: "标签", type: "tags" },
  { name: "content", label: "正文（Markdown）", type: "markdown" },
];

export const Route = createFileRoute("/admin/writing/$id")({
  component: WritingEdit,
});

function WritingEdit() {
  const { id } = Route.useParams();
  return (
    <ContentEditor
      table="writing"
      id={id}
      fields={fields}
      listPath="/admin/writing"
      title="文章"
    />
  );
}
