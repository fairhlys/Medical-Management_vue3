# Vue + Vite 项目 CI/CD 学习与落地指南（GitHub Actions + GitHub Pages）

> 适用于本项目：`Medical-Management_vue3`

## 1. 先理解：CI/CD 到底是什么？

- **CI（Continuous Integration，持续集成）**：每次提交代码后，自动做一遍“机器检查”（安装依赖、Lint、测试、打包），尽早发现问题。
- **CD（Continuous Delivery / Deployment，持续交付/部署）**：CI 通过后，自动把可运行产物发布到目标环境（如 GitHub Pages、测试环境、生产环境）。

在这个项目里，我们定义为：

1. PR 或 push 到 `main` 时，先执行 CI：`install -> lint -> build`。
2. 只有 `main` 分支 push 才执行部署（CD）到 GitHub Pages。

---

## 2. 你这个项目的 CI/CD 文件在哪里？

- 工作流文件：`.github/workflows/ci-cd.yml`
- 构建命令：`pnpm build --base="/${{ github.event.repository.name }}/"`

`base` 的作用：GitHub Pages 通常以 `https://<user>.github.io/<repo>/` 形式部署，Vite 需要知道应用不是部署在根路径 `/`。

---

## 3. 从 0 到上线：完整操作步骤

### 步骤 A：准备仓库

1. 确保你已经把项目推到 GitHub。
2. 默认分支建议使用 `main`。
3. 本地先确认基础命令可用：

```bash
pnpm install
pnpm lint
pnpm build
```

### 步骤 B：启用 GitHub Pages

进入仓库：

- `Settings` → `Pages`
- `Build and deployment` 选择 **GitHub Actions**

### 步骤 C：提交工作流

确保存在文件：

- `.github/workflows/ci-cd.yml`

提交到 `main` 后，去 `Actions` 标签页查看执行。

### 步骤 D：观察一次完整流水线

一次 push 到 `main` 的流水线会经历：

1. **CI Job**
   - Checkout
   - Setup pnpm + Node
   - Install (`pnpm install --frozen-lockfile`)
   - Lint (`pnpm lint`)
   - Build (`pnpm build --base=...`)
   - Upload artifact (`dist`)
2. **Deploy Job**
   - 使用 `actions/deploy-pages` 自动部署到 Pages

部署成功后，环境里会给出页面 URL。

---

## 4. 推荐的团队协作方式（分支策略）

- 开发新功能：`feature/*` 分支
- 提交 PR 到 `main`
- PR 阶段只跑 CI，不部署
- 审核通过后 merge 到 `main`
- merge 触发自动部署

这样可以保证：未通过质量检查的代码，不会进入线上。

---

## 5. 常见问题与排查

### 5.1 页面空白 / 静态资源 404

通常是 `base` 配置不对。

- GitHub Pages 子路径部署：`--base="/<repo>/"`
- 自定义域名并部署到根路径时，才考虑 `--base="/"`

### 5.2 `pnpm install --frozen-lockfile` 失败

说明 `package.json` 和 `pnpm-lock.yaml` 不一致。

处理方式：

1. 本地执行 `pnpm install` 更新 lockfile
2. 提交 `pnpm-lock.yaml`
3. 重新触发 CI

### 5.3 Lint 失败导致无法部署

这是预期行为：CI 未通过则 CD 不执行。

做法：

- 先在本地修复并确保 `pnpm lint` 通过
- 再 push

---

## 6. 进阶：如何把这个流程升级成“企业版”

你可以在当前工作流上逐步加：

1. **自动化测试**：Vitest / Cypress
2. **多环境部署**：dev / staging / prod
3. **PR 预览环境**：每个 PR 一个临时预览 URL
4. **质量闸门**：覆盖率阈值、bundle 体积阈值
5. **通知系统**：企业微信、飞书、Slack

---

## 7. 最小可用心智模型（建议记住）

把 CI/CD 看成 4 句话：

1. **什么时候触发**（on）
2. **做哪些检查**（ci job）
3. **什么条件下发布**（if + needs）
4. **发布到哪里**（deploy job + target platform）

只要你能回答这 4 个问题，任何前端项目的 CI/CD 都能快速搭建。
