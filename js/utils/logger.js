/* 日志流管理工具 */

class Logger {
    constructor(containerId = 'trace-logs') {
        this.containerId = containerId;
        this.container = null;
        this.maxLogs = 100;
    }

    ensureContainer() {
        if (!this.container || !document.body.contains(this.container)) {
            this.container = document.getElementById(this.containerId);
        }
        return this.container;
    }

    addLog(label, message, color = '#22c55e') {
        if (!this.ensureContainer()) return;

        // 如果还是初始的“等待执行抽奖操作...”占位文案，先清掉
        if (this.container.children.length === 1) {
            const first = this.container.children[0];
            if (first && first.textContent && first.textContent.indexOf(i18nService.t('trace.waiting')) !== -1) {
                this.container.innerHTML = '';
            }
        }

        const timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });

        const logEntry = document.createElement('div');
        logEntry.className = 'mb-2 opacity-0';
        logEntry.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> <span style="color: ${color}; font-weight: bold;">${label}</span> → ${message}`;

        this.container.appendChild(logEntry);

        // 限制日志条数
        while (this.container.children.length > this.maxLogs) {
            this.container.removeChild(this.container.firstChild);
        }

        // 淡入动画
        gsap.to(logEntry, { opacity: 1, duration: 0.3 });

        // 自动滚动到底部
        this.container.scrollTop = this.container.scrollHeight;
    }

    clear() {
        if (!this.ensureContainer()) return;

        gsap.to(this.container.children, {
            opacity: 0,
            duration: 0.2,
            stagger: 0.02,
            onComplete: () => {
                this.container.innerHTML = `<div class="text-gray-500">${i18nService.t('trace.cleared')}</div>`;
            }
        });
    }

    error(label, message) {
        this.addLog(label, message, '#ef4444');
    }

    success(label, message) {
        this.addLog(label, message, '#22c55e');
    }

    warn(label, message) {
        this.addLog(label, message, '#eab308');
    }

    info(label, message) {
        this.addLog(label, message, '#3b82f6');
    }

    setContainer(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
    }
}

const logger = new Logger();
