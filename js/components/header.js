/* 头部组件 */

class HeaderComponent {
    render() {
        return `
            <div class="mb-12">
                <h1 class="text-4xl font-bold mb-2 header-title" data-i18n="header.name" style="color: #00f2fe; text-shadow: 0 0 20px rgba(0, 242, 254, 0.5);">傅崇睿 (Sxlva)</h1>
                <p class="font-medium header-subtitle" data-i18n="header.subtitle" style="color: rgba(0, 242, 254, 0.8);">大连外国语大学 · 软件工程 · 2023 届</p>
                <div class="flex gap-4 mt-4 text-sm header-tags" style="color: rgba(255, 255, 255, 0.6);">
                    <span data-i18n="header.jlpt">🇯🇵 JLPT N2 备考中</span>
                    <span data-i18n="header.stack">☕ Java Full Stack</span>
                </div>
            </div>
        `;
    }
}

const headerComponent = new HeaderComponent();
