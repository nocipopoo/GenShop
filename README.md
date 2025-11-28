<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GenShop - AI 电商图片生成工具

使用 Gemini API 生成专业的电商产品主图。

## 本地运行

**前置要求:** Node.js

1. 安装依赖:
   ```bash
   npm install
   ```

2. 创建 `.env.local` 文件并设置环境变量:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. 运行应用:
   ```bash
   npm run dev
   ```

## 部署到 Vercel

1. 将项目推送到 GitHub

2. 在 [Vercel](https://vercel.com) 导入项目

3. 在 Vercel 项目设置中添加环境变量:
   - 变量名: `VITE_GEMINI_API_KEY`
   - 值: 你的 Gemini API Key

4. 部署完成后，Vercel 会自动构建并部署应用

**注意:** 由于这是纯前端应用，API Key 会暴露在客户端代码中。请确保你接受此风险，或考虑使用后端代理来保护 API Key。
