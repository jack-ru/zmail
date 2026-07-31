<div align="center">

# 🚀 ZMAIL - 6小时临时邮箱服务

<img src="frontend/public/favicon.svg" alt="ZMAIL Logo" width="120" height="120" style="background-color: #4f46e5; padding: 20px; border-radius: 12px; margin: 20px 0;">

**💌 安全、简单、即用即走的临时邮箱服务**

---

</div>

## ✨ 功能特点

| 功能 | 说明 |
|:---|:---|
| ✨ 即时创建 | 无需注册，立即获得一个临时邮箱地址 |
| 🔒 隐私保护 | 保护您的真实邮箱，避免垃圾邮件和信息泄露 |
| ⚡ 高速接收 | 实时接收邮件，无需刷新页面 |
| 🌐 全球可用 | 基于 Cloudflare 构建，全球边缘网络加速 |
| 🔄 自动刷新 | 自动检查新邮件，确保不错过任何重要信息 |
| 📱 响应式设计 | 完美适配各种设备，从手机到桌面 |

---

## 🚀 部署

ZMAIL 采用一体化部署方式，前端和后端整合为一个 Cloudflare Worker。

### Fork 后通过 GitHub Action 自定义部署

**部署步骤：**

1. **Fork 项目** 到您的 GitHub 账户

2. **创建 D1 数据库**  
   在 Cloudflare Dashboard 中创建一个 D1 数据库，记录下 `database_name` 和 `database_id`

3. **配置 GitHub Secrets**  
   在您的仓库中，进入 `Settings` → `Secrets and variables` → `Actions`，添加以下密钥：

   | 密钥 | 说明 |
   |:---|:---|
   | `CF_API_TOKEN` | Cloudflare API Token（[创建链接](https://dash.cloudflare.com/profile/api-tokens)，使用 "Edit Cloudflare Workers" 模板） |
   | `CF_ACCOUNT_ID` | Cloudflare 账户 ID（在 Workers 页面右侧可找到） |
   | `D1_DATABASE_ID` | 上一步创建的 D1 数据库 ID |
   | `D1_DATABASE_NAME` | 上一步创建的 D1 数据库名称 |
   | `VITE_EMAIL_DOMAIN` | 您的域名列表，多个用逗号分隔（如 `example.com,test.com`） |

4. **自动部署**  
   推送到 `main` 分支后会自动部署，也可在 Actions 页面手动触发

5. **绑定域名**  
   为您的 Worker 绑定一个自定义域名

6. **配置邮件路由**（见下方）

### 📧 配置邮件路由

1. 在 Cloudflare 控制面板进入您的域名
2. 进入 `Email` → `Email Routing`，启用服务
3. 添加路由规则：
   - 匹配类型：`Catch-all address`
   - 操作：`Send to a Worker`
   - 选择您部署的 Worker
4. 如有多个域名，请重复上述步骤