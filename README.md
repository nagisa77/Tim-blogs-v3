# Tim / Night Shift — 3D Digital Studio

Tim 的 3D 个人网站，用一间可探索的数字工作室组织项目、文章、Blues 学习记录和联系方式。

## 技术栈

- React 19 + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

## 文章同步

文章标题与摘要来自私密仓库 `nagisa77/blogs`。每次生产构建前会通过已登录的 GitHub CLI 同步，并把安全的展示快照写入 `src/generated/articles.json`。

```bash
gh auth status
npm run sync:articles
npm run build
```

线上站点不会持有 GitHub token，也不会在浏览器中读取私密仓库。

## 发布到 v3 分支

`deploy:v3` 会先同步文章并构建，再把 `dist/` 推送到 `nagisa77/nagisa77.github.io` 的 `v3` 分支。

```bash
npm run deploy:v3
```

GitHub Pages 的发布源应设置为 `v3` 分支根目录。
