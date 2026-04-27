# My Creative Hub

这是一个基于 Jamstack 架构的个人数字花园（作品集、博客、视频聚合展示）。

## 📐 架构设计 (Jamstack + Headless)

本项目采用了前端完全静态化、核心业务后端分离的架构设计。这种设计兼顾了**访问速度**、**零服务器成本**与未来的**商业变现扩展性**。

- **主站展示（当前项目）**：
  - **部署方案**：部署于 GitHub Pages (或其他纯静态托管服务如 Vercel/Netlify)。
  - **内容来源**：纯本地 Markdown 文件，通过 Git 进行版本控制，支持本地无缝写作。
  - **技术栈**：React, Vite, TanStack Router, Tailwind CSS, shadcn/ui。
- **业务系统（未来计划）**：
  - **定位**：独立的“购买课程/付费订阅”页面系统。
  - **部署方案**：部署于你自己的云服务器（配合 Supabase 数据库）。
  - **交互方式**：主站通过外部链接 (`link` 属性) 将用户跳转至业务系统完成支付和消费，通过共享 CSS (Tailwind) 保持无缝的用户体验。

---

## 📝 内容发布工作流

你可以完全在本地的代码编辑器（如 VS Code / Trae）中完成所有内容的发布和管理。

所有的内容都以 Markdown (`.md`) 格式存放在 `src/content/` 目录下：
- `src/content/work/` - 产品与项目
- `src/content/writing/` - 博客文章
- `src/content/videos/` - 视频内容
- `src/content/courses/` - 课程展示

### 1. 发布一篇文章 (Writing)

在 `src/content/writing/` 目录下新建一个 `.md` 文件，例如 `my-new-post.md`：

```markdown
---
title: "我的新文章标题"
date: "2024-05-01"
tag: "思考"
excerpt: "这是一段关于文章内容的简短摘要..."
readTime: "5 min"
---

这里是文章的正文内容，支持**Markdown**语法...
```

### 2. 发布一个课程 (Courses)并链接到独立销售页

在 `src/content/courses/` 目录下新建 `.md` 文件，**注意 `link` 字段**：

```markdown
---
title: "独立开发全栈实战营"
excerpt: "从零到一教你如何用现代技术栈构建并发布自己的 SaaS 产品。"
price: "¥399"
link: "https://你的服务器域名.com/buy/indie-dev-bootcamp"
cta: "立即购买 ↗"
---

课程的详细介绍...
```
*当配置了 `link` 字段后，前端页面上的按钮将自动变为外部跳转链接，指向你的课程销售系统。*

---

## 🛠 本地开发与构建

**安装依赖**
```bash
npm install
```

**启动本地开发服务器**
```bash
npm run dev
```

**构建静态文件 (用于 GitHub Pages 部署)**
```bash
npm run build
```
*打包后的静态文件将生成在 `dist/` 目录中。*

---

## 🚀 部署到 GitHub Pages (参考步骤)

1. 在你的 GitHub 仓库中，进入 **Settings** -> **Pages**。
2. 将 **Source** 设置为 `GitHub Actions`。
3. 项目根目录创建 `.github/workflows/deploy.yml` 配置自动打包并发布 `dist` 目录。
4. 每次 `git push` 后，网站就会自动更新！
