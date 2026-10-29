# 验证

- `python tools/check_site.py`：字形同步、极性与资源链接。
- `node --test tests/encoding.test.js`：小数点、多位组合、不支持字符和溢出。

当前自动检查通过；本机 Work 设置禁用了浏览器工具，尚未完成桌面及窄屏视觉验收。可运行 README 中的 HTTP 服务手动验收。

运行 node tests/page-smoke.mjs 可检查模拟 DOM 下的实验台初始化、显示生成与清空按钮；不代替真实浏览器交互验收。
