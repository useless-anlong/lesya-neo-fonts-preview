const huePicker = document.getElementById('hue-picker');
const saturationBrightnessPicker = document.getElementById('saturation-brightness-picker');
const alphaSlider = document.getElementById('alpha-slider');
const colorPreview = document.getElementById('color-preview');
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const rgbAlpha = document.getElementById('rgb-alpha');
const hslValue = document.getElementById('hsl-value');
const hslAlpha = document.getElementById('hsl-alpha');
const hsbValue = document.getElementById('hsb-value');
const hsbAlpha = document.getElementById('hsb-alpha');
const includePrefix = document.getElementById('include-prefix');
const excludeAlpha = document.getElementById('exclude-alpha');
const shades = document.getElementById('shades');

let hue = 0;
let saturation = 100;
let brightness = 100;
let alpha = 1;

function pageloadOn() {
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    body.style.opacity = '1';
    header.style.opacity = '1';
    header.style.marginTop = '0';
}

function updateColor(e, picker) {
    const rect = picker.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    if (picker === huePicker) {
        hue = x * 360;
        updatePickerIndicator(huePicker, x, 0.5);
    } else if (picker === saturationBrightnessPicker) {
        saturation = x * 100;
        brightness = (1 - y) * 100;
        updatePickerIndicator(saturationBrightnessPicker, x, y);
    } else if (picker === alphaSlider) {
        alpha = 1 - x;
        updateSliderIndicator(alphaSlider, x);
    }

    updateColorDisplay();
}

function updatePickerIndicator(picker, x, y) {
    const indicator = picker.querySelector('.picker-indicator');
    indicator.style.left = `${x * 100}%`;
    if (picker !== huePicker) {
        indicator.style.top = `${y * 100}%`;
    }
}

function updateSliderIndicator(slider, x) {
    const indicator = slider.querySelector('.slider-indicator');
    indicator.style.left = `${(x * 100)}%`;
    // indicator.style.left = `${x * 100}%`;
}

function updateColorDisplay() {
    const color = hsbToRgb(hue, saturation, brightness);
    let hex = rgbToHex(color.r, color.g, color.b);
    const rgb = `${color.r}, ${color.g}, ${color.b}`;
    const hsl = hsbToHsl(hue, saturation, brightness);

    colorPreview.style.backgroundColor = `rgba(${rgb}, ${alpha})`;
    document.documentElement.style.setProperty('--selected-color', `rgb(${rgb})`);

    if (includePrefix.checked) {
        hex = '#' + hex.replace('#', '');
    } else {
        hex = hex.replace('#', '');
    }

    hexValue.textContent = hex;
    rgbValue.textContent = rgb;
    rgbAlpha.textContent = alpha.toFixed(2);
    hslValue.textContent = `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;
    hslAlpha.textContent = alpha.toFixed(2);
    hsbValue.textContent = `${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(brightness)}%`;
    hsbAlpha.textContent = alpha.toFixed(2);

    if (!excludeAlpha.checked) {
        hexValue.textContent += Math.round(alpha * 255).toString(16).padStart(2, '0');
    }

    saturationBrightnessPicker.style.background = `
                linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%)),
                linear-gradient(to top, #000, transparent)
            `;
    saturationBrightnessPicker.style.backgroundBlendMode = 'multiply';

    updateShades();
}

function updateShades() {
    shades.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const shade = document.createElement('div');
        shade.className = 'shade';
        const shadeBrightness = 20 + i * 20;
        const shadeColor = hsbToRgb(hue, saturation, shadeBrightness);
        shade.style.backgroundColor = `rgb(${shadeColor.r}, ${shadeColor.g}, ${shadeColor.b})`;
        shade.addEventListener('click', () => {
            brightness = shadeBrightness;
            updateColorDisplay();
            updatePickerIndicator(saturationBrightnessPicker, saturation / 100, 1 - brightness / 100);
        });
        shades.appendChild(shade);
    }
}

function hsbToRgb(h, s, v) {
    h = h % 360;
    s = s / 100;
    v = v / 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = v;
    } else {
        const i = Math.floor(h / 60);
        const f = h / 60 - i;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));

        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            default: r = v; g = p; b = q;
        }
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function hsbToHsl(h, s, v) {
    s /= 100;
    v /= 100;
    const l = v - v * s / 2;
    const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return { h: h, s: sl * 100, l: l * 100 };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function startDragging(e) {
    const picker = e.currentTarget;
    updateColor(e, picker);

    function onMouseMove(e) {
        updateColor(e, picker);
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function copyToClipboard(text) {
    const dialog = document.createElement('div');
    const body = document.querySelector('body');
    dialog.className = 'dialog';

    navigator.clipboard.writeText(text).then(() => {
        dialog.id = 'done';
        dialog.innerHTML = `<p>已将色值 <code>${text}</code> 复制到剪贴板</p>`
        body.appendChild(dialog);
        setTimeout(() => {
            dialog.remove();
        }, 5500);
    }).catch(err => {
        dialog.id = 'error';
        dialog.innerHTML = `<p>复制时出现错误: <code>${err}</code></p>`
        body.appendChild(dialog);
        setTimeout(() => {
            dialog.remove();
        }, 5500);
    });
}

huePicker.addEventListener('mousedown', startDragging);
saturationBrightnessPicker.addEventListener('mousedown', startDragging);
alphaSlider.addEventListener('mousedown', startDragging);

includePrefix.addEventListener('change', updateColorDisplay);
excludeAlpha.addEventListener('change', updateColorDisplay);

// 添加复制功能
hexValue.parentElement.addEventListener('click', () => copyToClipboard(hexValue.textContent));
rgbValue.parentElement.addEventListener('click', () => {
    const rgbText = excludeAlpha.checked ? `rgb(${rgbValue.textContent})` : `rgba(${rgbValue.textContent}, ${rgbAlpha.textContent})`;
    copyToClipboard(rgbText);
});
hslValue.parentElement.addEventListener('click', () => {
    const hslText = excludeAlpha.checked ? `hsl(${hslValue.textContent})` : `hsla(${hslValue.textContent}, ${hslAlpha.textContent})`;
    copyToClipboard(hslText);
});
hsbValue.parentElement.addEventListener('click', () => {
    const hsbText = excludeAlpha.checked ? `hsb(${hsbValue.textContent})` : `hsba(${hsbValue.textContent}, ${hsbAlpha.textContent})`;
    copyToClipboard(hsbText);
});

updateColorDisplay();