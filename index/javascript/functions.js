const footer = document.querySelector('footer');
const children = document.body.children;

class BackToHome extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            @media (prefers-color-scheme: dark) {
                #backicon {
                    fill: #FFFFFF;
                }

                /* button::after {
                    border: solid 1px rgba(255, 255, 255, 0.5) !important;
                }

                button:hover::after {
                    border: solid 1px rgba(255, 255, 255, 0) !important;
                } */
            }

            @media (prefers-color-scheme: light) {
                #backicon {
                    fill: #000000;
                }

                /* button::after {
                    border: solid 1px rgba(0, 0, 0, 0.3) !important;
                }

                button:hover::after {
                    border: solid 1px rgba(0, 0, 0, 0) !important;
                } */
            }

            #backicon {
                transition: fill 0.2s ease-in-out;
                fill: var(--backicon-color, currentColor);
            }

            button {
                border: unset;
                padding: 0px;
                height: 32px;
                width: 52px;
                transition: background 0.25s ease-in-out;
                background: unset;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            button:hover {
                background: var(--backicon-bg, currentColor);
            }

            button:hover #backicon {
                fill: var(--backicon-color, currentColor);
            }
        </style>
        <button>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 20 20">
                <path id="backicon" d="M2.77129 9.25137L8.98728 3.08536C9.10386 2.96972 9.2908 2.97184 9.40482 3.09011L10.0253 3.73385C10.1393 3.85212 10.1372 4.04174 10.0205 4.15735L4.88217 9.25137L17.2433 9.25137C17.4064 9.25137 17.5386 9.38544 17.5386 9.55083L17.5386 10.4492C17.5386 10.6146 17.4064 10.7486 17.2433 10.7486L4.88217 10.7486L10.0205 15.8427C10.1372 15.9583 10.1393 16.1479 10.0253 16.2661L9.40482 16.9099C9.2908 17.0282 9.10386 17.0303 8.98728 16.9146L2.77129 10.7486C2.35673 10.3375 2.35673 9.66249 2.77129 9.25137Z"></path>
            </svg> -->

            <svg height="14" width="14" viewBox="0 0 1024 939" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path id="backicon" d="M1024,469.5C1024,481.167 1019.83,491.167 1011.5,499.5C1003.17,507.833 993.167,512 981.5,512L145.5,512L499.5,866C507.833,874.333 512,884.333 512,896C512,907.667 507.833,917.667 499.5,926C491.167,934.333 481.167,938.5 469.5,938.5C457.5,938.5 447.333,934.333 439,926L14.5,501.5C9.83333,496.833 6.25,492 3.75,487C1.25,482 0,476.167 0,469.5C0,462.833 1.16667,457 3.5,452C5.83333,447 9.33333,442.167 14,437.5L439,12.5C447.333,4.16669 457.5,0 469.5,0C481.5,0 491.583,4.08337 499.75,12.25C507.917,20.4167 512,30.5 512,42.5C512,54.5 507.833,64.6667 499.5,73L146,426.5L981.5,426.5C987.5,426.5 993.083,427.667 998.25,430C1003.42,432.333 1007.92,435.417 1011.75,439.25C1015.58,443.083 1018.58,447.583 1020.75,452.75C1022.92,457.917 1024,463.5 1024,469.5Z" fill="#000000" fill-opacity="1">
                </path>
            </svg>
        </button>
      `;
    }

    addEventListeners() {
        this.shadowRoot.host.addEventListener('click', () => {
            footer.style.opacity = '0';
            footer.style.bottom = '-30px';
            setTimeout(() => {
                // for (let i = 0; i < children.length; i++) {
                //     const element = children[i];

                //     if (element.tagName === 'SPAN' || element.tagName === 'DIV' || element.tagName === 'MAIN') {
                //         element.style.opacity = '0';
                const body = document.querySelector('body');
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    body.style.background = '#262626';
                } else {
                    body.style.background = '#F4F3F3';
                }
                body.style.opacity = '0';
                //     }
                // }
            }, 300);
            setTimeout(() => {
                window.location.replace(window.location.origin);
            }, 500);
        });
    }
}

customElements.define('back-to-home', BackToHome);


window.addEventListener('load', function () {
    for (let i = 0; i < children.length; i++) {
        const element = children[i];

        if (element.tagName === 'SPAN' || element.tagName === 'DIV' || element.tagName === 'MAIN') {
            element.style.marginTop = '0';

        }
    }

    if (footer) {
        if (footer.style.opacity === '0') {
            footer.style.opacity = '1';
            footer.style.bottom = '0px';
        } else {
            footer.style.opacity = '1';
            footer.style.bottom = '0px';
        }
    }
});

class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        // 移除了对 this.addEventListeners() 的调用
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            button {
                height: 48px;
                width: 164px;
                opacity: 1;
                border-radius: 8px;
                background-color: var(--card-background, currentColor);
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 0px 10px 2px 10px;
                transform: translateY(0px);
                box-sizing: border-box;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 1px 7px var(--shadow-color, currentColor);
                gap: 8px;
                color: var(--text-color-uni);
                font-size: 15px;
                margin-left: -2px;
                border: none;
                font-family: var(--font-family-default, currentColor);
                user-select: none;
            }

            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 3px 12px var(--shadow-color-hover, currentColor);
            }
        </style>
        <button><slot></slot></button>
      `;
    }
}

// 注册自定义元素
customElements.define('twinkle-button', Button);