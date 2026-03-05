/* 鼠标追踪光晕 */

class MouseGlow {
    init() {
        const mouseGlowEl = document.getElementById('mouse-glow');
        if (!mouseGlowEl) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 平滑跟随动画
        const updateGlow = () => {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;

            mouseGlowEl.style.left = glowX + 'px';
            mouseGlowEl.style.top = glowY + 'px';

            requestAnimationFrame(updateGlow);
        };

        updateGlow();
    }
}

const mouseGlow = new MouseGlow();
