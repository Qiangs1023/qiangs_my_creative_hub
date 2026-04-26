import { createFileRoute } from "@tanstack/react-router";
import { ContentList } from "@/components/admin/ContentList";

export const Route = createFileRoute("/admin/videos/")({
  component: () => (
    <ContentList table="videos" editBase="/admin/videos" title="视频" newLabel="新建视频" />
  ),
});
