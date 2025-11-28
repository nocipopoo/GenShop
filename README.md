<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GenShop - AI 电商图片生成工具

使用 Gemini API 生成专业的电商产品主图，集成 Supabase 用户系统和存储。

## 功能特性

- 🔐 用户认证（邮件登录、Google OAuth）
- 🖼️ AI 图片生成（基于 Gemini 3 Pro）
- ✏️ 图片编辑（基于 Gemini 2.5 Flash）
- 💾 自动保存到 Supabase Storage
- 📊 生成历史记录（存储在 Supabase Database）

## 前置要求

- Node.js
- Supabase 项目（用于认证和存储）
- Gemini API Key

## Supabase 配置

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 获取项目 URL 和 Anon Key（在项目设置 > API 中）

### 2. 配置 Storage

1. 在 Supabase 控制台，进入 Storage
2. 创建新的 bucket，命名为 `generations`
3. 设置为公开（Public）或配置适当的权限策略
4. 确保允许用户上传文件到自己的文件夹

### 3. 配置数据库

1. 在 Supabase 控制台，进入 SQL Editor
2. 运行 `supabase/migrations/001_create_generations_table.sql` 中的 SQL 脚本
3. 这将创建 `generations` 表并设置 Row Level Security (RLS) 策略

### 4. 配置 Google OAuth（可选）

1. 在 Supabase 控制台，进入 Authentication > Providers
2. 启用 Google 提供商
3. 配置 Google OAuth 凭据（Client ID 和 Client Secret）
4. 添加重定向 URL: `https://your-project-ref.supabase.co/auth/v1/callback`

## 本地运行

1. 安装依赖:
   ```bash
   npm install
   ```

2. 创建 `.env.local` 文件并设置环境变量:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. 运行应用:
   ```bash
   npm run dev
   ```

## 部署到 Vercel

1. 将项目推送到 GitHub

2. 在 [Vercel](https://vercel.com) 导入项目

3. 在 Vercel 项目设置中添加环境变量:
   - `VITE_GEMINI_API_KEY` - 你的 Gemini API Key
   - `VITE_SUPABASE_URL` - 你的 Supabase 项目 URL
   - `VITE_SUPABASE_ANON_KEY` - 你的 Supabase Anon Key

4. 部署完成后，Vercel 会自动构建并部署应用

5. 在 Supabase 控制台配置重定向 URL:
   - 添加你的 Vercel 部署 URL 到允许的重定向 URL 列表

## 数据库结构

### generations 表

- `id` (UUID) - 主键
- `user_id` (UUID) - 用户 ID，外键关联 auth.users
- `image_url` (TEXT) - 生成的图片 URL
- `video_url` (TEXT) - 生成的视频 URL（预留）
- `parameters` (JSONB) - 生成参数（包含文案、比例、标签等）
- `created_at` (TIMESTAMP) - 创建时间

表已启用 Row Level Security (RLS)，用户只能访问自己的生成记录。

## 注意事项

- 由于这是纯前端应用，API Key 会暴露在客户端代码中。请确保你接受此风险，或考虑使用后端代理来保护 API Key
- Supabase Storage bucket 需要正确配置权限，确保用户可以上传文件
- Google OAuth 需要在 Google Cloud Console 配置 OAuth 2.0 客户端
