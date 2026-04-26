import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import v1 from "@/assets/video-1.jpg";
import v2 from "@/assets/video-2.jpg";

export const coverMap: Record<string, string> = {
  "project-1": p1,
  "project-2": p2,
  "project-3": p3,
  "video-1": v1,
  "video-2": v2,
};

export function resolveCover(key?: string): string | undefined {
  if (!key) return undefined;
  return coverMap[key];
}
