/* 多语言服务 */
class I18nService {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'cn';
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // 更新按钮样式
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === lang);
            btn.classList.toggle('bg-black text-white', btnLang === lang);
            btn.classList.toggle('text-gray-600 hover:bg-gray-100', btnLang !== lang);
        });

        // GSAP 淡入动画
        gsap.fromTo('[data-i18n]',
            { opacity: 0.5 },
            { opacity: 1, duration: 0.3, stagger: 0.02 }
        );

        // 语言按钮切换动画
        const activeBtn = document.querySelector('.lang-btn.active');
        if (activeBtn) {
            gsap.fromTo(activeBtn,
                { scale: 0.95, boxShadow: '0 0 0 rgba(0,0,0,0)' },
                { scale: 1, boxShadow: '0 8px 20px rgba(0,0,0,0.18)', duration: 0.25, ease: "power2.out" }
            );
        }
    }

    t(key) {
        return translations[this.currentLanguage]?.[key] || key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

const i18nService = new I18nService();
