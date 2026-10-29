/** 将八位逻辑段码转换为指定极性的段电平码。1 始终代表逻辑点亮。 */
export function encode(mask, polarity = 'cathode') {
    if (!Number.isInteger(mask) || mask < 0 || mask > 255) {
        throw new RangeError('段码必须为 0～255 的整数');
    }
    return polarity === 'anode' ? mask ^ 255 : mask;
}

/** 将文本转换为固定数量的显示位；不支持字符、连续点及溢出时抛出错误。 */
export function compose(text, digits, glyphs) {
    if (!Number.isInteger(digits) || digits < 1 || digits > 12) {
        throw new RangeError('显示位数须为 1～12');
    }
    const result = [];
    let dotted = false;
    for (const char of text) {
        if (char === '.') {
            if (dotted) throw new Error('连续小数点不能附于同一显示位');
            if (!result.length) result.push(0);
            result[result.length - 1] |= 128;
            dotted = true;
        } else {
            const glyph = glyphs.find(item => item.char === char);
            if (!glyph || glyph.mask === null) throw new Error(`不支持字符：${char}`);
            result.push(glyph.mask);
            dotted = false;
        }
    }
    if (result.length > digits) throw new Error(`输入占 ${result.length} 位，超过 ${digits} 位`);
    return result.concat(Array(digits - result.length).fill(0));
}

/** 返回两位大写十六进制表示。 */
export function hex(value) {
    return `0x${value.toString(16).padStart(2, '0').toUpperCase()}`;
}
