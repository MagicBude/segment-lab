# Segment Lab 开发约定

网站内容使用中文技术参考文风，直接描述结构、编码和使用方法。字形以 data/segment-character-map.csv 为当前映射依据，未经明确需求不调整字形。

web/ 是独立静态发布目录，不引用仓库外文件；发布资源全部放在该目录。修改 data/ 后运行 tools/sync_data.py 生成网站 CSV 与 js/data/glyphs.js，禁止手动维护第二套字形表；check_site.py 检查一致性。

docs/ 放派生设计、教程和资料索引，references/ 放原始器件资料。归档前记录准确来源、型号、修订、日期、哈希及分发条件，不改写原始 PDF，不默认复制字体或第三方代码。

drivers/ 放通用模块及平台适配，examples/ 保留实际 SDK 工程结构。不预先假设 MCU、引脚、位数或外设。C 代码遵循项目后续确认的编码规范。

代码和文档变更按影响检查链接、数据、交互、构建及硬件行为。自动检查不等于浏览器或实机验收；如未验收，交付说明标记 pending user acceptance。未经明确要求不推送或发布。

网站采用 ES modules；HTML、CSS、JavaScript 分文件管理。模块边界、中文注释与验收约定见 docs/design/website-design.md。
