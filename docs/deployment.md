# GitHub Pages 部署

网站发布目录为 web/。已准备 .github/workflows/pages.yml，采用手动触发，避免推送未验收内容后自动发布。

## 发布步骤

1. 完成 docs/verification.md 中的浏览器验收。
2. 将通过验收的提交推送到 GitHub。
3. 仓库 Settings → Pages → Source 选择 GitHub Actions。
4. Actions 中手动运行 Deploy static site to Pages。
5. 核对流程输出 URL、三个页面和下载功能。

当前未推送或部署。远端为 MagicBude/segment-lab；预期项目站点路径为 /segment-lab/，实际地址以部署结果为准。页面全部使用相对路径。
