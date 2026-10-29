import { createExport } from '../core/export.js';
import { glyphs } from '../data/glyphs.js?v=20261029-export1';
import { sevenSegment } from '../data/layouts.js?v=20261029-export1';
import { encode, compose, hex } from '../core/encoding.js?v=20261029-export1';
import { createDigit } from '../components/display.js?v=20261029-export1';

import { renderBits, setupColor } from '../components/controls.js?v=20261029-export1';
const byId = id => document.getElementById(id);
const state = { mask: 0x5B, polarity: 'cathode', category: 'all', query: '' };
let exportText = '';
/** 刷新单字显示和编码；极性只影响电平，不影响逻辑亮段。 */
function renderSingle() {
    byId('single-display').replaceChildren(createDigit(state.mask, sevenSegment, true));
    byId('logic-code').textContent = hex(state.mask);
    byId('level-code').textContent = hex(encode(state.mask, state.polarity));
    renderBits(byId('binary-code'), state.mask);
    byId('lit-segments').textContent = '亮段：' + (sevenSegment.names.filter(
        (name, index) => state.mask & (1 << index)
    ).join('、') || '无');
    byId('segment-switches').replaceChildren(...sevenSegment.names.map((name, index) => {
        const button = document.createElement('button');
        button.textContent = `${name} · ${index}`;
        button.setAttribute('aria-label', `切换 ${name} 段，bit${index}`);
        button.setAttribute('aria-pressed', Boolean(state.mask & (1 << index)));
        button.addEventListener('click', () => {
            state.mask ^= 1 << index;
            byId('selected').textContent = '自定义组合';
            renderSingle();
        });
        return button;
    }));
}

/** 多位输入失败时清除结果，防止旧段码被当作当前输入的输出。 */
function renderComposer() {
    renderExport();
    const display = byId('multi-display');
    const status = byId('compose-status');
    try {
        const masks = compose(byId('text-input').value, Number(byId('digits-input').value), glyphs);
        display.replaceChildren(...masks.map(mask => createDigit(mask, sevenSegment)));
        exportText = `{ ${masks.map(mask => hex(encode(mask, state.polarity))).join(', ')} }`;
        byId('array-code').textContent = exportText;
        byId('copy-code').disabled = false;
        status.textContent = `${masks.length} 位 · ${state.polarity === 'anode' ? '共阳' : '共阴'}段电平码`;
        status.className = 'helper';
    } catch (error) {
        display.replaceChildren();
        exportText = '';
        byId('array-code').textContent = '';
        byId('copy-code').disabled = true;
        status.textContent = error.message;
        status.className = 'error';
    }
}

byId('polarity').addEventListener('change', event => {
    state.polarity = event.target.value;
    renderSingle();
    renderComposer();
});
byId('reset').addEventListener('click', () => {
    state.mask = 0;
    byId('selected').textContent = '空白';
    renderSingle();
});
byId('text-input').addEventListener('input', renderComposer);
byId('digits-input').addEventListener('input', renderComposer);
byId('copy-code').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(exportText);
        byId('compose-status').textContent = 'C 数组已复制';
    } catch {
        byId('compose-status').textContent = '浏览器未允许复制，请选中数组文本手动复制';
    }
});
renderSingle();
renderComposer();

const selectedChar = new URLSearchParams(window.location.search).get('char');
const selectedGlyph = glyphs.find(item => item.char === selectedChar && item.mask !== null);
if (selectedGlyph) {
    state.mask = selectedGlyph.mask;
    byId('selected').textContent = `字符 ${selectedChar === ' ' ? '空格' : selectedChar}`;
    renderSingle();
}
setupColor();

/** 预览与下载使用同一生成器，输入失效时禁用下载。 */
function renderExport() {
    try {
        const result = createExport(byId('export-format').value, byId('text-input').value,
            Number(byId('digits-input').value), state.polarity, glyphs);
        byId('export-preview').textContent = result.content;
        byId('download-export').disabled = false;
        byId('export-status').textContent = result.filename;
        return result;
    } catch (error) {
        byId('export-preview').textContent = '';
        byId('download-export').disabled = true;
        byId('export-status').textContent = error.message;
        return null;
    }
}
byId('export-format').addEventListener('change', renderExport);
byId('download-export').addEventListener('click', () => {
    const result = renderExport();
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result.content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
