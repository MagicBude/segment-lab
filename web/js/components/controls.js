/** 创建逐列对齐的段名、bit 编号和二进制值。 */
export function renderBits(container, mask) {
    const names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'];
    container.replaceChildren(...Array.from({ length: 8 }, (_, column) => {
        const bit = 7 - column;
        const cell = document.createElement('div');
        cell.className = 'bit-cell';
        const name = document.createElement('span');
        name.textContent = names[bit];
        const index = document.createElement('small');
        index.textContent = `bit${bit}`;
        const value = document.createElement('strong');
        value.textContent = (mask >> bit) & 1;
        cell.classList.toggle('is-on', Boolean((mask >> bit) & 1));
        cell.append(name, index, value);
        return cell;
    }));
}

/** 绑定颜色设置并在页面之间保留选择；存储不可用时仍可正常修改颜色。 */
export function setupColor() {
    const input = document.getElementById('display-color');
    const apply = color => {
        if (!/^#[0-9a-f]{6}$/i.test(color)) return;
        input.value = color;
        document.documentElement.style.setProperty('--color-segment-on', color);
    };
    try {
        apply(localStorage.getItem('segment-lab-color') || input.value);
    } catch {
        apply(input.value);
    }
    input.addEventListener('input', event => {
        apply(event.target.value);
        try {
            localStorage.setItem('segment-lab-color', event.target.value);
        } catch {
            // 隐私模式或存储限制不影响本页颜色调整。
        }
    });
}
