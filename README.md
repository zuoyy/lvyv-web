# lvyv-web

LVYV 官网，基于 Nuxt 4 构建并静态生成，由 Nginx 托管。

## 环境要求

- Node.js `24.14.0`（最低 `24.11`，仅支持 24.x）
- npm `11.12.1`
- 本地后端默认运行在 `http://127.0.0.1:8088`

项目通过 `.node-version` 固定 Node 版本。使用 fnm 时：

```bash
fnm use
npm install --global npm@11.12.1
```

## 安装与开发

```bash
npm ci
npm run dev
```

Nuxt 开发服务器将 `/web-api/**` 代理到本地 `lvyv-server`，生产环境由 Nginx 转发。

## 验证与构建

```bash
npm run typecheck
npm run build
npm run generate
```

静态产物位于 `.output/public`。本地预览：

```bash
npm run preview
```

## 目录结构

```text
app/
  app.vue
  assets/
  components/
  composables/
  layouts/
  pages/
  plugins/
  utils/
public/
nuxt.config.ts
```

## 部署

`deploy-web.sh` 会使用 Node 24 执行静态生成，将 `.output/public` 打包上传，并通过 Nginx 版本目录和软链接原子切换发布。
