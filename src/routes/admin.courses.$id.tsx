import { createFileRoute } from "@tanstack/react-router";
import { ContentEditor, type FieldDef } from "@/components/admin/ContentEditor";

const fields: FieldDef[] = [
  { name: "title", label: "标题", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text" },
  { name: "excerpt", label: "摘要", type: "textarea" },
  { name: "cover_url", label: "封面图", type: "image" },
  { name: "price_cents", label: "价格（分；如 1288 元请填 128800）", type: "number" },
  { name: "currency", label: "货币（CNY / USD）", type: "text" },
  { name: "level", label: "级别", type: "text" },
  { name: "duration", label: "时长", type: "text" },
  { name: "lessons", label: "课时数", type: "number" },
  { name: "tags", label: "标签", type: "tags" },
  { name: "content", label: "课程介绍（Markdown）", type: "markdown" },
];

export const Route = createFileRoute("/admin/courses/$id")({
  component: CourseEdit,
});

function CourseEdit() {
  const { id } = Route.useParams();
  return (
    <ContentEditor
      table="courses"
      id={id}
      fields={fields}
      listPath="/admin/courses"
      title="课程"
    />
  );
}
