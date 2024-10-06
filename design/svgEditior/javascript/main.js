const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

function updatePreview() {
    preview.innerHTML = editor.value;
    updateLineNumbers();
}

function updateLineNumbers() {
    const lines = editor.value.split('\n');
    lineNumbers.innerHTML = lines.map((_, index) => index + 1).join('<br>');
}

function formatCode() {
    const formatted = editor.value
        .replace(/>\s*</g, '>\n<')
        .replace(/</g, '\n<')
        .replace(/>/g, '>\n')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => '  '.repeat(getIndent(line)) + line.trim())
        .join('\n');
    editor.value = formatted;
    updatePreview();
}

function getIndent(line) {
    const closingTags = (line.match(/<\/[^>]+>/g) || []).length;
    const openingTags = (line.match(/<[^/>]+>/g) || []).length;
    return Math.max(0, openingTags - closingTags);
}

// 初始化
editor.value = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100">\n  <!-- 请在此键入你的 SVG 代码 -->\n  <!-- MDN SVG 文档：https://developer.mozilla.org/zh-CN/docs/Web/SVG -->\n</svg>';
updatePreview();

function saveSVGToFile() {
    const svgContent = editor.value;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.addEventListener("keydown", function (e) {
    if ((e.key == 's' || e.key == 'S') && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        saveSVGToFile()
    }
}, false);