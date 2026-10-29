# 验证

- `python tools/check_site.py`：字形同步、极性与资源链接。
- `node --test tests/encoding.test.js`：小数点、多位组合、不支持字符和溢出。

当前自动检查通过；本机 Work 设置禁用了浏览器工具，尚未完成桌面及窄屏视觉验收。可运行 README 中的 HTTP 服务手动验收。
