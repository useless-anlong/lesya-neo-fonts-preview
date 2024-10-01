var href = window.location.href;

function start(element) {
    var id = element.id;
    var classify = element.getAttribute('data-classify');
    var replaceLink = href + classify + '/' + id + '/'
    // console.log(`ID: ${id}, CLASSIFY: ${classify}, Href: ${href}, ReplaceLink: ${replaceLink}`)
    window.location.replace(replaceLink);
}

const titleContent = {
    'fontpre': '<h2>不仅可以预览字体，<br>还能浏览、测试字体特性、可变属性。</h2>',
    'palettepad': '<h2>取你想要的色，<br>并获取颜色的 HEX、RGB、HSL、HSB 色值。</h2>'
}

// 获取所有toolShortcut类的li元素
var liElements = document.querySelectorAll('.toolShortcut');
// 遍历每个li元素
liElements.forEach(function (li) {
    var isHovered = false;
    li.addEventListener('mouseenter', function () {
        isHovered = true;
        // 根据li的id修改目标元素的内容
        var targetElement = document.getElementById('targetBox');
        var liId = li.id;
        setTimeout(() => {
            var classify = li.getAttribute('data-classify');
            if (titleContent.hasOwnProperty(liId)) {
                targetElement.innerHTML = `<img src="./${classify}/${liId}/style/icon.png">` + titleContent[liId];
            }

            var titleElement = document.getElementById('title');
            targetElement.classList.add('hovered');
            titleElement.classList.add('hovered');
        }, "350")
    });

    li.addEventListener('mouseleave', function () {
        isHovered = false;
        var targetElement = document.getElementById('targetBox');
        setTimeout(() => {
            var titleElement = document.getElementById('title');
            targetElement.classList.remove('hovered');
            titleElement.classList.remove('hovered');
            // setTimeout(() => {
            //     targetElement.innerHTML = '';
            // }, "300")
        }, "350")
    });
});

function updateWelcomeText() {
    const now = new Date();
    const hour = now.getHours();
    const welcomeTextElement = document.getElementById('welcomeText');
    const welcomeEmojiElement = document.getElementById('welcomeEmoji');

    let welcomeMessage;
    let welcomeEmoji;

    if (hour >= 0 && hour < 5) {
        welcomeMessage = "凌晨好，<br>夜深了，请注意休息。";
        welcomeEmoji = "😪";
    } else if (hour >= 5 && hour < 9) {
        welcomeMessage = "早上好，<br>祝你享受美味的早餐！";
        welcomeEmoji = "🥰";
    } else if (hour >= 9 && hour < 12) {
        welcomeMessage = "上午好，<br>愿你工作顺利！";
        welcomeEmoji = "🤩";
    } else if (hour >= 12 && hour < 14) {
        welcomeMessage = "中午好，<br>午餐时间到了！";
        welcomeEmoji = "😜";
    } else if (hour >= 14 && hour < 18) {
        welcomeMessage = "下午好，<br>喝杯咖啡提提神吧！";
        welcomeEmoji = "😉";
    } else if (hour >= 18 && hour < 22) {
        welcomeMessage = "晚上好，<br>愿你度过愉快的夜晚！";
        welcomeEmoji = "🥳";
    } else {
        welcomeMessage = "午夜好，<br>该休息了哦。";
        welcomeEmoji = "🥱";
    }

    welcomeTextElement.innerHTML = welcomeMessage;
    welcomeEmojiElement.textContent = welcomeEmoji;
}

// 初始化欢迎文本
updateWelcomeText();

// 每分钟更新一次欢迎文本
setInterval(updateWelcomeText, 60000);

const mainElement = document.querySelector('main');
const titleElement = document.querySelector('.title');

const titleHeight = titleElement.scrollHeight - titleElement.clientHeight;
const mainHeight = mainElement.scrollHeight - mainElement.clientHeight;

titleElement.addEventListener('scroll', function () {
    const scrollPercentage = this.scrollTop / titleHeight;
    const mainScrollPosition = scrollPercentage * mainHeight;
    mainElement.scrollTop = mainScrollPosition;
});