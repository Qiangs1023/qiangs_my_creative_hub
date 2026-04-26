import { createFileRoute } from "@tanstack/react-router";
import { ContentList } from "@/components/admin/ContentList";

export const Route = createFileRoute("/admin/writing/")({
  component: () => (
    <ContentList table="writing" editBase="/admin/writing" title="文章" newLabel="新建文章" />
  ),
});
