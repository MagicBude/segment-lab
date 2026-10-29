# 段式显示项目调研

调研日期：2026-10-29。依据项目维护者的 README 和公开文档，不复制其实现或字库。

## SegmentSim

来源：https://github.com/jdlien/led

原生 HTML/SVG/JS，分离字体、显示渲染和页面逻辑；支持多种段布局、字符编辑与编码复制。值得采用的是可操作的显示预览和字形数据独立管理。HDR、WebGPU 等效果不进入本期范围，优先确保段位可读及可访问性。

## LED Segment ASCII

来源：https://github.com/dmadison/LED-Segment-ASCII

提供七段、十四段及十六段 ASCII 字符表示，按段类型组织数据。借鉴数据与具体驱动独立的做法。本项目继续使用当前已确定字形，不导入其字库。

## SVG Web Component

来源：https://github.com/andygock/seven-segment-display

把 SVG 数码管封装为可复用 Web Component。借鉴渲染组件的独立边界；当前采用普通 ES 模块，避免为小型工具引入框架。

## 本项目决策

首页围绕工具操作组织，提供字符查询、单字段编辑、多位预览及编码导出；原理说明和资源入口置于独立区域。布局数据、字形数据、编码运算、SVG 渲染与 UI 控制分别维护。网站使用 HTML、CSS、原生 JavaScript ES modules，HTTP 本地预览与 GitHub Pages 托管，不依赖后端。
