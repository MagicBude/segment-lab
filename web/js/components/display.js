const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * 按布局创建单个显示位，不解析文本或改变字形。
 * @param {number} mask 逻辑段码，1 表示点亮。
 * @param {object} layout 段路径、名称及可选标注位置。
 * @param {boolean} showLabels 是否展示位置标注，默认关闭。
 * @returns {SVGElement} 可插入页面的 SVG 元素。
 */
export function createDigit(mask, layout, showLabels = false) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', showLabels ? layout.labeledViewBox : layout.viewBox);
    svg.setAttribute('role', 'img');
    const lit = layout.names.filter((name, index) => mask & (1 << index));
    svg.setAttribute('aria-label', `亮段：${lit.join('、') || '无'}`);
    layout.paths.forEach((path, index) => {
        const element = document.createElementNS(SVG_NS, 'path');
        element.setAttribute('d', path);
        element.setAttribute('class', mask & (1 << index) ? 'segment is-lit' : 'segment');
        svg.append(element);
    });
    // 标注独立于亮灭状态，熄灭段的位置仍然可读。
    if (showLabels && layout.labelPositions) {
        layout.labelPositions.forEach(([x, y], index) => {
            const label = document.createElementNS(SVG_NS, 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', y);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('class', 'segment-label');
            label.textContent = layout.names[index];
            svg.append(label);
        });
    }
    return svg;
}
