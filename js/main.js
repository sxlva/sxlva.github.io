/* 应用初始化入口 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. 初始化多语言
    if (i18nService) {
        i18nService.switchLanguage(i18nService.currentLanguage);
    }

    // 2. 渲染所有组件
    const containers = {
        'language-switcher-container': languageSwitcher,
        'header-container': headerComponent,
        'cloud-status-container': cloudStatus,
        'dashboard-container': dashboard,
        'raffle-container': raffleSystem,
        'trace-container': traceChart
    };

    for (const [id, component] of Object.entries(containers)) {
        const el = document.getElementById(id);
        if (el && component && component.render) {
            el.innerHTML = component.render();
        }
    }

    // 组件渲染后再绑定日志容器，避免初始化时容器不存在
    if (logger) {
        logger.setContainer('trace-logs');
    }

    // 统一事件委托，替代内联 onclick
    document.addEventListener('click', async (event) => {
        const langBtn = event.target.closest('[data-lang]');
        if (langBtn && i18nService) {
            i18nService.switchLanguage(langBtn.getAttribute('data-lang'));
            return;
        }

        const tabBtn = event.target.closest('[data-tab]');
        if (tabBtn && raffleSystem) {
            raffleSystem.switchTab(tabBtn.getAttribute('data-tab'));
            return;
        }

        const actionBtn = event.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-action');
        if (action === 'raffle-run' && raffleSystem) {
            await raffleSystem.execute();
            return;
        }

        if (action === 'trace-clear' && logger) {
            logger.clear();
        }
    });

    // 3. 初始化效果
    if (mouseGlow) mouseGlow.init();
    if (dashboard) dashboard.initTechStackBadges();
    if (healthService) await healthService.checkHealth();

    // 高亮代码
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // 4. 入场动画
    const elements = document.querySelectorAll('.header-title, .glass-card, .section-title');
    gsap.set(elements, { opacity: 0, y: 20 });
    gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.2
    });

    // 初始化翻译
    if (i18nService) {
        i18nService.switchLanguage(i18nService.currentLanguage);
    }
});
