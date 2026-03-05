/* 语言切换器组件 */

class LanguageSwitcher {
    render() {
        return `
            <div class="language-switcher">
                <div class="rounded-lg flex gap-1 p-1" data-action="language-switcher" style="background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(0, 242, 254, 0.3); box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);">
                    <button data-lang="cn" class="lang-btn px-3 py-1.5 rounded text-sm font-bold transition-all duration-300">
                        中文
                    </button>
                    <button data-lang="jp" class="lang-btn px-3 py-1.5 rounded text-sm font-bold transition-all duration-300">
                        日本語
                    </button>
                    <button data-lang="en" class="lang-btn px-3 py-1.5 rounded text-sm font-bold transition-all duration-300">
                        EN
                    </button>
                </div>
            </div>
        `;
    }
}

const languageSwitcher = new LanguageSwitcher();
