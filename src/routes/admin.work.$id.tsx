import { createFileRoute } from "@tanstack/react-router";
import { ContentEditor, type FieldDef } from "@/components/admin/ContentEditor";

const fields: FieldDef[] = [
  { name: "title", label: "标题", type: "text", required: true },
  { name: "slug", label: "Slug（URL，可留空自动生成）", type: "text" },
  { name: "excerpt", label: "摘要", type: "textarea" },
  { name: "cover_url", label: "封面图", type: "image" },
  { name: "url", label: "项目外链", type: "url" },
  { name: "status", label: "状态（如：进行中、已退出）", type: "text" },
  { name: "tags", label: "标签 / 技术栈", type: "tags" },
  { name: "content", label: "正文（Markdown）", type: "markdown" },
];

export const Route = createFileRoute("/admin/work/$id")({
  component: WorkEdit,
});

function WorkEdit() {
  const { id } = Route.useParams();
  return (
    <ContentEditor table="work" id={id} fields={fields} listPath="/admin/work" title="作品" />
  );
}
