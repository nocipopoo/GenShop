# 环境变量配置指南

## 快速开始

1. 复制 `env.example` 文件为 `.env.local`：
   ```bash
   cp env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的实际配置值

3. 重启开发服务器（如果正在运行）

## 环境变量说明

### VITE_GEMINI_API_KEY

Gemini API 密钥，用于调用 Google Gemini API 生成图片。

**获取方式：**
1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录你的 Google 账号
3. 在 API Keys 页面创建新的 API Key
4. 复制 API Key 到 `.env.local` 文件中

**注意：** API Key 会暴露在客户端代码中，请确保你接受此风险。

### VITE_SUPABASE_URL

Supabase 项目 URL。

**获取方式：**
1. 登录 [Supabase](https://supabase.com)
2. 选择你的项目
3. 进入 Settings > API
4. 复制 "Project URL" 的值

**格式：** `https://xxxxx.supabase.co`

### VITE_SUPABASE_ANON_KEY

Supabase 匿名密钥（公开密钥），用于客户端访问 Supabase 服务。

**获取方式：**
1. 在 Supabase 项目设置中，进入 Settings > API
2. 复制 "anon public" 密钥的值

**注意：** 这是公开密钥，设计用于客户端使用。Row Level Security (RLS) 会保护你的数据。

## 本地开发

创建 `.env.local` 文件（此文件已被 `.gitignore` 忽略，不会提交到 Git）：

```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

## Vercel 部署

在 Vercel 项目设置中添加环境变量：

1. 进入 Vercel 项目设置
2. 选择 "Environment Variables"
3. 添加以下三个变量：
   - `VITE_GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 为每个环境（Production, Preview, Development）设置相应的值
5. 重新部署项目

## 验证配置

启动开发服务器后，检查浏览器控制台是否有错误。如果看到 "Missing Supabase environment variables" 或类似的错误，说明环境变量配置不正确。

## 安全提示

- ✅ `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git
- ✅ 不要将包含真实 API Key 的文件提交到代码仓库
- ✅ 在 Vercel 等平台使用环境变量设置，而不是硬编码
- ⚠️ 注意：`VITE_` 前缀的环境变量会暴露在客户端代码中

