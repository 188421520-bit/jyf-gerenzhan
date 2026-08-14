# 靳煜飞 · 3D Environment Artist Portfolio

基于 React + Vite 的个人作品集首版，页面内容与图片来自个人简历。

`source-assets/resume-pages/` 保存从简历提取的原始作品页，不会进入网站发布包；`public/portfolio/` 是经过压缩、供网站实际加载的图片。

## 本地运行

请先安装 Node.js 20 或更高版本，然后在当前目录执行：

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 替换 Hero 视频

当前 Hero 使用两张场景作品图做动态交替。后续拿到视频后，可将视频放入 `public/media/`，并在 `src/App.jsx` 的 `.hero-media` 内替换为 `<video>` 元素。
