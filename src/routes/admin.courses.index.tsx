import { createFileRoute } from "@tanstack/react-router";
import { ContentList } from "@/components/admin/ContentList";

export const Route = createFileRoute("/admin/courses/")({
  component: () => (
    <ContentList table="courses" editBase="/admin/courses" title="课程" newLabel="新建课程" />
  ),
});
