const fontFile = document.getElementById('fontFile');
const fontSelect = document.getElementById('fontSelect');
const fontSize = document.getElementById('fontSize');
const testText = document.getElementById('testText');
const charMapItems = document.querySelectorAll('.char-map-item');

// const loadedFontFileName = file.name;

// 获取全部固定字号的测试文本
const sizeTestText8 = document.querySelector('.size8px');
const sizeTestText12 = document.querySelector('.size12px');
const sizeTestText16 = document.querySelector('.size16px');
const sizeTestText24 = document.querySelector('.size24px');
const sizeTestText32 = document.querySelector('.size32px');
const sizeTestText48 = document.querySelector('.size48px');
const sizeTestText64 = document.querySelector('.size64px');
const sizeTestText72 = document.querySelector('.size72px');
const sizeTestText128 = document.querySelector('.size128px');

const fontFeatures = document.getElementById('fontFeatures');
const variableAxes = document.getElementById('variableAxes');
const fontColor = document.getElementById('fontColor');
const bgColor = document.getElementById('bgColor');
const loadFontInput = document.getElementById('load-font');
const fontInfoDiv = document.getElementById('font-info');

const body = document.querySelector('body');

const detailsElement = document.getElementsByTagName('details')[0];

let customFont = null;
let customFontBuffer = null;

function syncHeights() {
    var sizeElements = document.querySelectorAll('.size');

    for (var i = 0; i < sizeElements.length; i++) {
        var sizeElement = sizeElements[i];
        var sizeTestText = sizeElement.nextElementSibling;

        if (sizeTestText && sizeTestText.id === 'sizeTestText') {
            var height = sizeTestText.offsetHeight;
            sizeElement.style.height = height + 'px';
            // console.log('Synced height for a .size element: ' + height + 'px');
        }
        //  else {
        //     console.error('No adjacent #sizeTestText found for a .size element');
        // }
    }
}

// 页面加载完成后执行同步
document.addEventListener('DOMContentLoaded', syncHeights);

function adjustMargin() {
    const fontPreview = document.getElementById('fontPreview');
    const fontPreviewTop = fontPreview.getBoundingClientRect().top;

    if (fontPreviewTop <= 128) {
        testText.style.top = '-150px';
    } else {
        testText.style.top = '44px';
    }
}

function scrollToTop() {
    // 方法1：使用 window.scrollTo
    window.scrollTo(0, 0);
}

// 在页面加载完成后调用 scrollToTop 函数和 adjustMargin 函数
window.addEventListener('load', function () {
    scrollToTop();
    adjustMargin();
});

// 在页面加载完成后和滚动时调用 adjustMargin 函数
window.addEventListener('scroll', adjustMargin);

function changePage() {
    const contentBox = document.querySelector('#content');
    const welcomeBox = document.querySelector('#welcome');
    const headerBox = document.querySelector('header');
    contentBox.style.opacity = '1';
    welcomeBox.style.opacity = '0';
    headerBox.style.opacity = '1';
    headerBox.style.marginTop = '0';

    if (window.innerWidth > 420) {
        detailsElement.setAttribute('open', '');
    }

    body.style.overflowY = 'auto'

    setTimeout(() => {
        if (welcomeBox) {
            welcomeBox.remove();
        }
    }, 150);
}

const featureDescriptions = {
    'aalt': '替代注释',
    'liga': '连字',
    'dlig': '可选连字',
    'hlig': '历史连字',
    'clig': '上下文连字',
    'smcp': '小型大写字母',
    'c2sc': '从大写字母转换的小型大写字母',
    'case': '区分大小写形式',
    'cpsp': '大写字母间距',
    'frac': '分数',
    'numr': '分子',
    'dnom': '分母',
    'tnum': '表格数字',
    'pnum': '比例数字',
    'onum': '老式数字',
    'lnum': '对齐数字',
    'ordn': '序数',
    'zero': '斜杠零',
    'sups': '上标',
    'subs': '下标',
    'sinf': '科学下标',
    'salt': '风格变体',
    'ss01': '风格集 1',
    'ss02': '风格集 2',
    'ss03': '风格集 3',
    'ss04': '风格集 4',
    'ss05': '风格集 5',
    'ss06': '风格集 6',
    'ss07': '风格集 7',
    'ss08': '风格集 8',
    'ss09': '风格集 9',
    'ss10': '风格集 10',
    'swsh': '花饰',
    'cswh': '上下文花饰',
    'titl': '标题',
    'kern': '字距调整',
    'locl': '本地化形式',
    'mkmk': '标记到标记定位',
    'mark': '标记定位',
    'rlig': '必需连字',
    'calt': '上下文变体',
    'hist': '历史形式',
    'ornm': '装饰',
    'wght': '字重',
    'wdth': '宽度',
    'ital': '斜体',
    'slnt': '倾斜',
    'opsz': '光学尺寸',
    'vert': '竖排书写',
    'SRIF': '衬线',
    'srif': '衬线',
    'ccmp': '字形合成 / 分解'
};

fontFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        loadLocalFont(file);
        loadFontInfo(file);
        changePage();
    }
});

fontSelect.addEventListener('change', updateTextStyle);
fontSize.addEventListener('input', updateTextStyle);
fontColor.addEventListener('input', updateTextStyle);

async function loadLocalFont(file) {
    const fontName = file.name.split('.')[0];
    try {
        const arrayBuffer = await file.arrayBuffer();
        customFontBuffer = new Uint8Array(arrayBuffer);
        const fontBlob = new Blob([customFontBuffer], { type: 'font/opentype' });
        const fontUrl = URL.createObjectURL(fontBlob);

        const response = await fetch(fontUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fontData = await response.arrayBuffer();

        const fontFace = new FontFace(fontName, fontData);

        await fontFace.load();

        document.fonts.add(fontFace);

        customFont = fontName;

        const option = document.createElement('option');
        option.value = fontName;
        option.textContent = fontName;
        fontSelect.appendChild(option);
        fontSelect.value = fontName;

        await checkFontFeatures(fontName);
        updateTextStyle();
    } catch (error) {
        console.error('Error loading font:', error);
        loadedFontName.innerHTML = `
        <div class="errorinfo">
            <div class="errorbox">
                <main class="infomain">
                    <div class="infotitle">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path d="M11 20.625C16.3158 20.625 20.625 16.3158 20.625 11C20.625 5.68426 16.3158 1.375 11 1.375C5.68426 1.375 1.375 5.68426 1.375 11C1.375 16.3158 5.68426 20.625 11 20.625Z" fill-rule="evenodd"  fill="#E62C17" >
                            </path>
                            <path d="M10.9997 9.70355L13.33 7.37264C13.6879 7.0146 14.2683 7.01453 14.6263 7.37246C14.9844 7.73038 14.9845 8.31077 14.6265 8.6688L12.2961 10.9999L14.6271 13.3309C14.985 13.6888 14.985 14.2693 14.6271 14.6272C14.2691 14.9852 13.6887 14.9852 13.3307 14.6272L10.9999 12.2964L8.6697 14.6273C8.31177 14.9854 7.73138 14.9854 7.37335 14.6275C7.01532 14.2696 7.01524 13.6892 7.37317 13.3312L9.70358 11.0001L7.37296 8.66946C7.01497 8.31147 7.01498 7.73109 7.37296 7.37311C7.73093 7.01513 8.31132 7.01512 8.66931 7.37311L10.9997 9.70355Z" fill-rule="evenodd"  fill="#FFEDEB" >
                            </path>
                        </svg>
                        <h4>加载字体时出错</h4>
                    </div>
                    <p>请刷新页面并选择其他字体文件再试。</p>
                    <code onclick="copyContent(this)">${error.message}</code>
                </main>
                <button class="reload" onclick="javascript:location.reload();">刷新小工具</button>
            </div>
        </div>`;
        body.style.overflowY = "hidden"
    }
    //  finally {
    //     URL.revokeObjectURL(fontUrl);
    // }
}

function toggleDetails() {
    if (detailsElement.hasAttribute('open')) {
        detailsElement.removeAttribute('open');
    } else {
        detailsElement.setAttribute('open', '');
    }
}

function copyContent(element) {
    const textToCopy = element.textContent;
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

async function loadFontInfo(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const font = opentype.parse(arrayBuffer);

        let info = '';

        const nameTable = font.tables.name;
        info += `<div class="info-title"><h3>${nameTable.fontFamily.en || '未知'}</h3><span>字体详细信息</span></div>`;
        info += `<code>全称: ${nameTable.fullName.en || '未知'}<br>`;
        info += `子系列名称: ${nameTable.fontSubfamily.en || '未知'}<br>`;
        info += `版本: ${nameTable.version.en || '未知'}<br>`;
        info += `版权: ${nameTable.copyright.en || '未知'}<br>`;
        info += `设计师: ${nameTable.designer.en || '未知'}<br>`;
        info += `供应商: ${nameTable.manufacturer.en || '未知'}<br>`;

        const weightClass = font.tables.os2.usWeightClass;
        let weightName;

        if (font.tables.os2) {
            // const weightClass = font.tables.os2.usWeightClass;
            // let weightName;
            switch (weightClass) {
                case 100: weightName = 'Thin'; break;
                case 200: weightName = 'Extra Light'; break;
                case 300: weightName = 'Light'; break;
                case 400: weightName = 'Regular'; break;
                case 500: weightName = 'Medium'; break;
                case 600: weightName = 'Semi Bold'; break;
                case 630: weightName = 'Bold'; break;
                case 700: weightName = 'Bold'; break;
                case 800: weightName = 'Extra Bold'; break;
                case 900: weightName = 'Black'; break;
                default: weightName = 'Unknown';
            }
        }

        if (font.tables.fvar) {
            info += '可变字体轴:<br>';
            font.tables.fvar.axes.forEach(axis => {
                info += `  - ${axis.tag}: 由 ${axis.minValue}, 至 ${axis.maxValue}, 默认为 ${axis.defaultValue}<br>`;
            });
        } else {
            info += `字重: ${weightClass} `;
        }

        info += `</code>`;

        fontInfoDiv.innerHTML = info;
    } catch (error) {
        console.error('Error loading font:', error);
        fontInfoDiv.innerHTML = `<div class="whgtinfo"><span class="icon"></span><p>读取字体文件信息表时出错: ${error.message}</p></div>`;
    }
}

async function checkFontFeatures(fontName) {
    fontFeatures.innerHTML = '';
    variableAxes.innerHTML = '';

    try {
        const font = await opentype.load(URL.createObjectURL(new Blob([customFontBuffer])));

        const features = font.tables?.gsub?.features || [];

        const featuretitle = document.createElement('div');
        featuretitle.className = 'feature-title';
        featuretitle.innerHTML = '<h3>可用的 OpenType 特性</h3>';
        fontFeatures.appendChild(featuretitle);

        const featureSet = new Set();
        features.forEach(feature => {
            featureSet.add(feature.tag);
        });

        featureSet.forEach(feature => {
            const div = document.createElement('div');
            div.className = 'feature-control';
            div.innerHTML = `
                <input type="checkbox" id="${feature}" name="${feature}" title="${featureDescriptions[feature] || feature}">
                <label for="${feature}">${featureDescriptions[feature] || feature}<span class="featureName">${feature}</span></label>
            `;
            fontFeatures.appendChild(div);

            div.querySelector('input').addEventListener('change', updateTextStyle);
        });

        if (font.tables.fvar) {
            const axes = font.tables.fvar.axes;
            axes.forEach(axis => {
                const div = document.createElement('div');
                div.className = 'axis-control';

                div.innerHTML = `
                    <label for="${axis.tag}" title="${featureDescriptions[axis.tag] || axis.tag}">${featureDescriptions[axis.tag] || axis.name?.en || axis.tag} </label>
                    
                    <input type="range" id="${axis.tag}" name="${axis.tag}"
                           min="${axis.minValue}" max="${axis.maxValue}" 
                           value="${axis.defaultValue}" step="1"
                           title="${featureDescriptions[axis.tag] || axis.tag}">

                    <div class="axis">
                        <span class="axis-min">${Math.round(axis.minValue)}</span>
                        <span class="axis-value">${Math.round(axis.defaultValue)}</span>
                        <span class="axis-max">${Math.round(axis.maxValue)}</span>
                    </div>
                `;
                variableAxes.appendChild(div);

                const input = div.querySelector('input');
                const span = div.querySelector('.axis-value');
                input.addEventListener('input', (e) => {
                    span.textContent = Math.round(e.target.value);
                    updateTextStyle();
                });
            });
        } else {
            const div = document.createElement('div');
            div.className = 'axis-control';

            div.innerHTML = `
                    <div class="whgtinfo">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none"
                            version="1.1" width="157" height="40" viewBox="0 0 157 40">
                            <path class="a01"
                                d="M86.63427134399414,27.84L90.95847134399415,38.4076C91.35257134399414,39.3706,92.29147134399415,40,93.33397134399414,40C94.75107134399414,40,95.89987134399414,38.8538,95.89987134399414,37.44C95.89987134399414,37.1082,95.83527134399415,36.7796,95.70957134399414,36.4724L90.79417134399414,24.4601C90.76037134399414,24.3603,90.72057134399414,24.2633,90.67527134399414,24.1695L81.43687134399414,1.59239C81.04277134399413,0.629383,80.10387134399414,0,79.06127134399414,0L77.93867134399414,0C76.89247134399415,0,75.95097134399414,0.633777,75.55937134399414,1.60173L61.44760734399414,36.4803L61.44701434399414,36.4817C61.32380364399414,36.7863,61.26047134399414,37.1116,61.26047134399414,37.44C61.26047134399414,38.8538,62.40926134399414,40,63.82635134399414,40C64.87260134399413,40,65.81406134399414,39.3662,66.20569134399415,38.3983L66.20629134399414,38.3968L70.47754134399415,27.84L86.63427134399414,27.84ZM84.53917134399414,22.72L78.51027134399413,7.98639L72.54907134399414,22.72L84.53917134399414,22.72Z"
                                fill-rule="evenodd" fill-opacity="1" />
                            <path class="a02"
                                d="M123.37755004882813,38.2110997138977L123.37825004882812,38.212699713897706C123.82265004882812,39.2938997138977,124.87785004882812,39.99999971389771,126.04905004882812,39.99999971389771C127.64325004882812,39.99999971389771,128.93565004882814,38.71059971389771,128.93565004882814,37.119999713897705C128.93565004882814,36.745199713897705,128.86235004882812,36.3739997138977,128.71975004882813,36.027299713897705L128.7191500488281,36.025599713897705L124.56115004882813,25.909799713897705C124.52685004882812,25.811399713897703,124.48735004882812,25.715499713897707,124.44305004882813,25.622299713897704L116.61905004882813,6.587259713897705C116.17465004882813,5.506090713897705,115.11945004882813,4.799999713897705,113.94825004882813,4.799999713897705L112.99645004882812,4.799999713897705C111.82115004882813,4.799999713897705,110.76305004882812,5.511041713897705,110.32145004882813,6.597789713897705L98.35659704882812,36.037799713897705C98.21688194882813,36.38159971389771,98.14505004882812,36.7489997138977,98.14505004882812,37.119999713897705C98.14505004882812,38.71059971389771,99.43743004882812,39.99999971389771,101.03167004882812,39.99999971389771C102.20706004882813,39.99999971389771,103.26507004882812,39.2889997138977,103.70674004882812,38.202199713897706L107.14732004882812,29.736499713897704L119.89425004882813,29.736499713897704L123.37755004882813,38.2110997138977ZM117.52675004882812,23.976499713897706L113.48475004882812,14.142889713897706L109.48825004882812,23.976499713897706L117.52675004882812,23.976499713897706Z"
                                fill-rule="evenodd" fill-opacity="1" />
                            <path class="a03"
                                d="M53.74104155883789,38.04179992370605L53.74124155883789,38.04329992370606C53.88414155883789,39.161799923706056,54.83814155883789,39.999999923706056,55.96834155883789,39.999999923706056C57.20834155883789,39.999999923706056,58.213441558837886,38.99709992370605,58.213441558837886,37.759999923706054C58.213441558837886,37.66529992370606,58.207441558837886,37.57069992370606,58.19544155883789,37.47669992370605L58.19524155883789,37.47519992370606L54.433741558837895,8.036729923706055C54.29084155883789,6.918186923706054,53.33684155883789,6.079999923706055,52.20664155883789,6.079999923706055L51.25494155883789,6.079999923706055C50.46054155883789,6.079999923706055,49.72534155883789,6.498827923706054,49.32154155883789,7.181369923706055L31.90476855883789,36.62029992370606L31.904137558837892,36.62139992370605C31.70007755883789,36.96629992370605,31.59244155883789,37.35949992370605,31.59244155883789,37.759999923706054C31.59244155883789,38.99709992370605,32.59763155883789,39.999999923706056,33.83759155883789,39.999999923706056C34.63198155883789,39.999999923706056,35.36724155883789,39.58119992370605,35.771041558837894,38.89859992370606L35.77167155883789,38.89759992370605L41.17766155883789,29.759999923706054L52.68284155883789,29.759999923706054L53.74104155883789,38.04179992370605ZM52.11044155883789,25.279999923706054L50.63934155883789,13.767199923706055L43.82814155883789,25.279999923706054L52.11044155883789,25.279999923706054Z"
                                fill-rule="evenodd" fill-opacity="1" />
                            <path class="a04"
                                d="M150.82337126464844,38.00990011444092L150.82377126464843,38.01080011444092C151.31667126464845,39.21390011444092,152.48997126464843,40.00000011444092,153.79267126464845,40.00000011444092C155.56407126464845,40.00000011444092,156.99997126464842,38.56730011444092,156.99997126464842,36.80000011444092C156.99997126464842,36.38480011444092,156.91897126464843,35.97360011444091,156.76157126464844,35.589200114440914L156.76117126464845,35.58830011444092L153.57397126464843,27.809000114440916C153.54047126464843,27.714600114440916,153.50257126464845,27.62220011444092,153.46057126464842,27.53210011444092L147.45327126464844,12.869220114440918C146.96037126464844,11.666133114440917,145.78707126464843,10.880000114440918,144.48437126464844,10.880000114440918L143.75227126464844,10.880000114440918C142.44497126464844,10.880000114440918,141.26844126464843,11.671627114440918,140.77857126464843,12.880910114440919L131.57536226464845,35.59970011444092L131.57486126464843,35.60090011444092C131.42051306464845,35.98190011444092,131.34117126464844,36.38900011444092,131.34117126464844,36.80000011444092C131.34117126464844,38.56730011444092,132.77715126464844,40.00000011444092,134.54852126464843,40.00000011444092C135.85584126464843,40.00000011444092,137.03232126464843,39.20840011444092,137.52219126464843,37.99910011444092L137.52269126464844,37.99790011444092L139.92027126464845,32.07930011444092L148.39367126464845,32.07930011444092L150.82337126464844,38.00990011444092ZM145.77157126464843,25.67930011444092L144.13297126464843,21.679800114440916L142.51287126464842,25.67930011444092L145.77157126464843,25.67930011444092Z"
                                fill-rule="evenodd" fill-opacity="1" />
                            <path class="a05"
                                d="M26.7952,36.159999465942384L28.0643,36.159999465942384C29.1271,36.159999465942384,29.9887,37.01959946594238,29.9887,38.07999946594238C29.9887,39.14039946594238,29.1271,39.99999946594238,28.0643,39.99999946594238L21.9703,39.99999946594238C20.9075,39.99999946594238,20.0459,39.14039946594238,20.0459,38.07999946594238C20.0459,37.01959946594238,20.9075,36.159999465942384,21.9703,36.159999465942384L22.6425,36.159999465942384L20.578,31.075199465942383L8.89434,31.075199465942383L6.85298,36.159999465942384L8.01839,36.159999465942384C9.08121,36.159999465942384,9.9428,37.01959946594238,9.9428,38.07999946594238C9.9428,39.14039946594238,9.08121,39.99999946594238,8.01839,39.99999946594238L1.92441,39.99999946594238C0.861589,39.99999946594238,0,39.14039946594238,0,38.07999946594238C0,37.01959946594238,0.861589,36.159999465942384,1.92441,36.159999465942384L2.70689,36.159999465942384L12.5002,11.766089465942382C12.7926,11.037591465942382,13.5,10.559999465942383,14.2866,10.559999465942383L15.1041,10.559999465942383C15.888,10.559999465942383,16.5935,11.034305465942383,16.8878,11.759119465942383L23.6146,28.326699465942383C23.6486,28.39739946594238,23.6783,28.470399465942382,23.7035,28.54549946594238L26.7952,36.159999465942384ZM19.0188,27.235199465942383L14.7031,16.606159465942383L10.436,27.235199465942383L19.0188,27.235199465942383Z"
                                fill-rule="evenodd" fill-opacity="1" />
                        </svg>
                        <p>这个字体不包含任何可变轴</p>
                    </div>
                `;
            variableAxes.appendChild(div);
        }

        // 保存字体轴信息到全局变量，以便在其他地方使用
        window.fontAxes = font.tables.fvar ? font.tables.fvar.axes : null;

        updateTextStyle(); // 初始化时调用一次
    } catch (error) {
        console.error('Error loading font:', error);
        fontFeatures.innerHTML = `<div class="errorinfo"><main class="infomain"><span class="icon"></span><h4>加载字体特性时出错</h4><p>请刷新页面并选择其他字体文件再试。</p><code>${error.message}</code></main></div>`;
    }
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function getLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b];
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function changeColorVariable(newColor) {
    document.documentElement.style.setProperty('--text-color', newColor);
}

function change50Variable(newColor) {
    document.documentElement.style.setProperty('--text-color-50', newColor);
}

function change25Variable(newColor) {
    document.documentElement.style.setProperty('--text-color-25', newColor);
}

function change75Variable(newColor) {
    document.documentElement.style.setProperty('--text-color-75', newColor);
}

function changeSizeBGVariable(newColor) {
    document.documentElement.style.setProperty('--size-color-bg', newColor);
}

fontSize.addEventListener('keydown', (e) => {
    const allowedKeys = ['ArrowUp', 'ArrowDown'];
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
});

function updateTextStyle() {
    const selectedFont = fontSelect.value;
    const size = fontSize.value;
    const color = fontColor.value;

    let fontFeatureSettings = '';
    let fontVariationSettings = '';

    document.querySelectorAll('#fontFeatures input:checked').forEach(input => {
        fontFeatureSettings += `"${input.name}" 1, `;
    });

    document.querySelectorAll('#variableAxes input').forEach(input => {
        fontVariationSettings += `"${input.name}" ${input.value}, `;
    });

    fontFeatureSettings = fontFeatureSettings.slice(0, -2);
    fontVariationSettings = fontVariationSettings.slice(0, -2);

    const wghtInput = document.getElementById('wght');
    const opszInput = document.getElementById('opsz');
    if (wghtInput && opszInput && window.fontAxes) {
        const wghtAxis = window.fontAxes.find(axis => axis.tag === 'wght');
        const opszAxis = window.fontAxes.find(axis => axis.tag === 'opsz');

        if (wghtAxis && opszAxis) {
            const wghtValue = parseFloat(wghtInput.value);
            let opszValue = parseFloat(size);

            const wghtRange = wghtAxis.maxValue - wghtAxis.minValue;
            if (wghtValue > wghtAxis.minValue + wghtRange * 0.75) {
                opszValue *= 0.8;
            } else if (wghtValue < wghtAxis.minValue + wghtRange * 0.25) {
                opszValue *= 1.2;
            }

            // 确保 opszValue 在允许的范围内
            opszValue = Math.max(opszAxis.minValue, Math.min(opszAxis.maxValue, opszValue));

            opszInput.value = opszValue;
            opszInput.nextElementSibling.nextElementSibling.textContent = Math.round(opszValue);
            fontVariationSettings = fontVariationSettings.replace(/("opsz" )\d+(\.\d+)?/, `$1${opszValue}`);
        }
    }

    // const applyStyle = (element) => {

    //     element.style.fontFamily = selectedFont;
    //     element.style.color = color;
    //     element.style.fontFeatureSettings = fontFeatureSettings || 'normal';
    //     element.style.fontVariationSettings = fontVariationSettings || 'normal';
    // };

    testText.style.fontSize = `${size}px`;
    // applyStyle(testText);

    // charMapItems.forEach(item => {
    //     item.style.fontFamily = selectedFont;
    //     item.style.color = color;
    //     item.style.fontFeatureSettings = fontFeatureSettings || 'normal';
    //     item.style.fontVariationSettings = fontVariationSettings || 'normal';
    // });

    document.documentElement.style.setProperty('--selected-font', selectedFont);
    document.documentElement.style.setProperty('--selected-color', color);
    document.documentElement.style.setProperty('--font-feature-settings', fontFeatureSettings);
    document.documentElement.style.setProperty('--font-variation-settings', fontVariationSettings);

    // // 修改固定字号测试文本样式
    // [sizeTestText8, sizeTestText12, sizeTestText16, sizeTestText24, sizeTestText32,
    //     sizeTestText48, sizeTestText64, sizeTestText72, sizeTestText128].forEach(applyStyle);

    bgColor.addEventListener('change', function () {
        const selectedColor = this.value;
        body.style.backgroundColor = selectedColor;
        testText.style.backgroundColor = selectedColor;
        const rgbColor = hexToRgb(selectedColor);
        const luminance = getLuminance(rgbColor);

        changeSizeBGVariable(selectedColor);

        if (luminance < 0.5) {
            changeColorVariable('#ffffff');
            change75Variable('rgba(255, 255, 255, 0.75)');
            change50Variable('rgba(255, 255, 255, 0.5)');
            change25Variable('rgba(255, 255, 255, 0.25)');
        } else {
            changeColorVariable('#000000');
            change75Variable('rgba(0, 0, 0, 0.5)');
            change50Variable('rgba(0, 0, 0, 0.35)');
            change25Variable('rgba(0, 0, 0, 0.1)');
        }
    });
}

updateTextStyle();

function updateTestText(element) {
    var thisText = element.value;
    // console.log(thisText)
    sizeTestText8.textContent = thisText;
    sizeTestText12.textContent = thisText;
    sizeTestText16.textContent = thisText;
    sizeTestText24.textContent = thisText;
    sizeTestText32.textContent = thisText;
    sizeTestText48.textContent = thisText;
    sizeTestText64.textContent = thisText;
    sizeTestText72.textContent = thisText;
    sizeTestText128.textContent = thisText;
}

// document.addEventListener('DOMContentLoaded', function () {
//     var fontPreview = document.getElementById('fontPreview');    // 使用节流函数

//     if (fontPreview) {
//         fontPreview.addEventListener('wheel', function (e) {
//             e.preventDefault();
//             fontPreview.scrollLeft += e.deltaY > 0 ? 300 : -300;
//         });
//     }
// });
