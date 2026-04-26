import { createFileRoute } from "@tanstack/react-router";
import { ContentList } from "@/components/admin/ContentList";

export const Route = createFileRoute("/admin/work/")({
  component: () => (
    <ContentList table="work" editBase="/admin/work" title="作品" newLabel="新建作品" />
  ),
});
