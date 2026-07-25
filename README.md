# lvyv-web

LVYV 官网，基于 Nuxt 4 构建。普通页面静态托管，FAQ 内容页面由 Nuxt Node SSR 提供。

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

SSR 构建产物位于 `.output/server`，公共静态资源位于 `.output/public`。本地预览：

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

`deploy-web.sh` 负责普通静态页面；`deploy/deploy-ssr.sh` 负责构建并原子发布 FAQ Node SSR 服务。SSR 发布会在健康检查成功后保留新版本，失败时恢复旧版本。

HOST=127.0.0.1 \
PORT=3001 \
NUXT_CONTENT_API_BASE=http://127.0.0.1:8088/web-api \
NUXT_PUBLIC_API_BASE=/web-api \
node .output/server/index.mjs
