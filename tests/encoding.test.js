import test from 'node:test';
import assert from 'node:assert/strict';
import { encode, compose } from '../web/js/core/encoding.js';
import { glyphs } from '../web/js/data/glyphs.js';

test('八位极性转换与非法输入', () => {
    assert.equal(encode(0x5B, 'anode'), 0xA4);
    assert.equal(encode(0x80, 'anode'), 0x7F);
    assert.throws(() => encode(256));
});
test('小数点附位、前导点和补空位', () => {
    assert.deepEqual(compose('12.34', 4, glyphs), [6, 0xDB, 0x4F, 0x66]);
    assert.deepEqual(compose('.1', 3, glyphs), [128, 6, 0]);
});
test('不支持字符、连续点及溢出明确失败', () => {
    assert.throws(() => compose('Q', 4, glyphs));
    assert.throws(() => compose('1..', 4, glyphs));
    assert.throws(() => compose('12345', 4, glyphs));
    assert.throws(() => compose('1', 0, glyphs));
});
