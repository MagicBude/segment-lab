import { encode, compose, hex } from './encoding.js';

/** 生成含映射语义的可移植导出；空段码保留为不支持，绝不自动替换为空白。 */
export function createExport(format, text, digits, polarity, glyphs) {
    if (!['table', 'frame', 'json'].includes(format)) throw new Error('未知导出格式');
    const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'];
    const description = `bit0..bit7 = ${order.join(', ')}; ${polarity}; output = segment electrical levels`;
    if (format === 'table') {
        const entries = glyphs.map(glyph => {
            const supported = glyph.mask !== null;
            return `    { ${hex(glyph.char.charCodeAt(0))}, ${supported ? hex(encode(glyph.mask, polarity)) : '0x00'}, ${supported ? 1 : 0} },`;
        });
        return {
            filename: 'segment_font.h',
            content: `/* Segment Lab: ${description}
 * supported=0: code is unused; check supported before writing.
 * Digit selection, transistor inversion and chip commands are not included.
 */
#ifndef SEGMENT_LAB_FONT_H
#define SEGMENT_LAB_FONT_H
#include <stdint.h>
typedef struct { uint8_t ascii; uint8_t code; uint8_t supported; } seg_glyph_t;
static const seg_glyph_t seg_font[] = {
${entries.join('\n')}
};
#endif
`
        };
    }
    const masks = compose(text, digits, glyphs);
    const levels = masks.map(mask => encode(mask, polarity));
    if (format === 'json') {
        return {
            filename: 'segment_config.json',
            content: JSON.stringify({ schemaVersion: 1, display: 'seven-segment-dp', bitOrder: order,
                polarity, encoding: 'segment-electrical-levels', digitOrder: 'left-to-right',
                text, digits, decimalPoint: 'attach-to-previous', padding: 'right-blank',
                logicalMasks: masks, outputBytes: levels,
                note: 'Digit selection, transistor inversion and chip commands are not included.' }, null, 4) + '\n'
        };
    }
    return {
        filename: 'segment_frame.h',
        content: `/* Segment Lab: ${description}
 * Left-to-right; decimal point attached; blank padding on right.
 * Input text: ${JSON.stringify(text).replaceAll('*/', '* /')}
 */
#include <stdint.h>
static const uint8_t seg_frame[${digits}] = { ${levels.map(hex).join(', ')} };
`
    };
}
