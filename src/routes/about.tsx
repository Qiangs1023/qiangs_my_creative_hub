import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — 关于林知远" },
      {
        name: "description",
        content:
          "我是林知远 — 2019 年从大厂离职，一个人做产品、写文章、录视频。这里是我的故事，以及如何与我联系。",
      },
      { property: "og:title", content: "About — 关于林知远" },
      {
        property: "og:description",
        content: "一个人，一台电脑，一段还在继续的旅程。",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="relative min-h-screen pt-20">
      <Nav />
      <About />
      <Footer />
    </main>
  );
}
