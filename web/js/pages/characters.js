import { glyphs } from '../data/glyphs.js';
import { sevenSegment } from '../data/layouts.js';
import { encode, compose, hex } from '../core/encoding.js';
import { createDigit } from '../components/display.js';

import { renderBits, setupColor } from '../components/controls.js';
const byId = id => document.getElementById(id);
const state = { mask: 0x5B, polarity: 'cathode', category: 'all', query: '' };
/** 判断字符所属类别；大小写保持独立。 */
function category(char) {
    if (/^[0-9]$/.test(char)) return 'digit';
    if (/^[A-Z]$/.test(char)) return 'upper';
    if (/^[a-z]$/.test(char)) return 'lower';
    return 'symbol';
}

/** 从数据创建字符卡片，所有文本通过 textContent 写入。 */
function createCard(glyph) {
    const card = document.createElement('button');
    card.className = 'glyph-card';
    card.disabled = glyph.mask === null;
    const heading = document.createElement('span');
    heading.className = 'glyph-heading';
    const title = document.createElement('strong');
    title.textContent = glyph.char === ' ' ? '空格' : glyph.char;
    const ascii = document.createElement('small');
    ascii.textContent = hex(glyph.char.charCodeAt(0));
    heading.append(title, ascii);
    const preview = document.createElement('span');
    preview.className = 'glyph-preview';
    if (glyph.mask !== null) preview.append(createDigit(glyph.mask, sevenSegment));
    else preview.textContent = '不支持显示';
    const code = document.createElement('span');
    code.className = 'glyph-code';
    code.textContent = glyph.mask === null ? '—' : hex(encode(glyph.mask, state.polarity));
    const alias = document.createElement('span');
    alias.className = 'glyph-alias';
    alias.textContent = glyph.mask === null ? '当前字库未定义亮段' : `同形：${glyph.alias}`;
    card.append(heading, preview, code, alias);
    card.addEventListener('click', () => {
        window.location.href = `index.html?char=${encodeURIComponent(glyph.char)}`;
    });
    return card;
}

/** 按字符或十六进制逻辑段码搜索，精确区分字母大小写。 */
function renderLibrary() {
    const query = state.query.trim();
    const matches = glyphs.filter(glyph => (
        state.category === 'all' || category(glyph.char) === state.category
    ) && (!query || glyph.char === query || (glyph.char === ' ' && query === '空格') || (
        query.toLowerCase().startsWith('0x') && glyph.mask !== null && hex(glyph.mask).toLowerCase().includes(query.toLowerCase())
    )));
    byId('glyph-grid').replaceChildren(...matches.map(createCard));
    if (!matches.length) {
        const message = document.createElement('p');
        message.className = 'empty-state';
        message.textContent = '没有匹配的字符。可切换分类，或输入单个字符、0x 开头的逻辑段码。';
        byId('glyph-grid').append(message);
    }
    byId('result-count').textContent = `${matches.length} / ${glyphs.length} 项 · 卡片段码随驱动极性切换`;
}

byId('search').addEventListener('input', event => {
    state.query = event.target.value;
    renderLibrary();
});
byId('filters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    byId('filters').querySelectorAll('button').forEach(item => {
        item.setAttribute('aria-pressed', item === button);
    });
    renderLibrary();
});
byId('polarity').addEventListener('change', event => {
    state.polarity = event.target.value;
    renderLibrary();
});
setupColor();
renderLibrary();
