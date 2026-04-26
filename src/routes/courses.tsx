import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Courses } from "@/components/Courses";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — 林知远的课程" },
      {
        name: "description",
        content:
          "从 0 到 1 独立开发者实战课、写作变现课、TypeScript 进阶训练营。已有 5,000+ 名学员加入。",
      },
      { property: "og:title", content: "Courses — 林知远的课程" },
      {
        property: "og:description",
        content: "我把走过的路教给你 —— 三门课程，可直接照抄的方法论。",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <main className="relative min-h-screen pt-20">
      <Nav />
      <Courses />
      <Footer />
    </main>
  );
}
