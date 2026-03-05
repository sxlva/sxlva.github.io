/* GSAP 通用动画函数库 */

const AnimationUtils = {
    // 元素淡入
    fadeIn(element, duration = 0.6, delay = 0) {
        gsap.fromTo(element,
            { opacity: 0 },
            { opacity: 1, duration, delay, ease: "power2.out" }
        );
    },

    // 元素滑入
    slideIn(element, direction = 'up', duration = 0.6, delay = 0) {
        const from = direction === 'up'
            ? { opacity: 0, y: 20 }
            : { opacity: 0, x: -20 };

        gsap.fromTo(element, from,
            { opacity: 1, y: 0, x: 0, duration, delay, ease: "power2.out" }
        );
    },

    // 元素缩放
    scale(element, targetScale = 1.1, duration = 0.3) {
        gsap.to(element, {
            scale: targetScale,
            duration,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    },

    // 脉冲动画
    pulse(element, duration = 2) {
        gsap.to(element, {
            opacity: 0.5,
            duration: duration / 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    },

    // 按钮点击动画
    buttonClick(element) {
        gsap.to(element, { scale: 0.95, duration: 0.1 });
        gsap.to(element, { scale: 1, duration: 0.1, delay: 0.1 });
    },

    // 成功动画
    successAnimation(element) {
        gsap.fromTo(element,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
        );
        gsap.to(element, {
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    },

    // 错误动画
    errorAnimation(element) {
        gsap.to(element, {
            x: -10,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut"
        });
    },

    // 加载动画
    loadingSpinner(element) {
        gsap.to(element, {
            rotation: 360,
            duration: 1,
            repeat: -1,
            ease: "none"
        });
    },

    // 交错进入
    staggerEnter(elements, duration = 0.6, stagger = 0.1, delay = 0) {
        gsap.fromTo(elements,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration,
                stagger,
                delay,
                ease: "power2.out"
            }
        );
    },

    // 数字计数
    countUp(element, endValue, duration = 1) {
        gsap.to({ value: 0 }, {
            value: endValue,
            duration,
            snap: { value: 1 },
            onUpdate() {
                element.textContent = Math.floor(this.targets()[0].value);
            },
            ease: "power2.out"
        });
    }
};
