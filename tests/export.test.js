import test from 'node:test';
import assert from 'node:assert/strict';
import { createExport } from '../web/js/core/export.js';
import { glyphs } from '../web/js/data/glyphs.js';
test('JSON 与 C 帧保持实际极性和位序', () => {
    const result = createExport('json', '2.', 2, 'anode', glyphs);
    const config = JSON.parse(result.content);
    assert.deepEqual(config.outputBytes, [0x24, 0xFF]);
    assert.equal(config.bitOrder[7], 'dp');
    assert.match(createExport('frame', '2.', 2, 'anode', glyphs).content, /0x24, 0xFF/);
});
test('字符表明确记录不支持项；数组拒绝无效输入', () => {
    assert.match(createExport('table', 'Q', 4, 'cathode', glyphs).content, /0x51, 0x00, 0/);
    assert.throws(() => createExport('json', 'Q', 4, 'cathode', glyphs));
});
