/* 健康检查服务 */
class HealthService {
    async checkHealth() {
        const statusEl = document.getElementById('api-status');
        if (!statusEl) return;

        const startTime = performance.now();

        try {
            // 使用与前端演示一致的策略ID 100006
            const response = await apiService.getAwardList(100006);
            const latency = Math.round(performance.now() - startTime);

            if (response && response.code === "0000") {
                statusEl.innerHTML = `<span class="w-3 h-3 bg-green-500 rounded-full mr-3 status-dot"></span> <span class="text-green-600 font-bold">${i18nService.t('cloud.online')}</span>`;
                if (performanceTracker) performanceTracker.recordRequest(latency, true);
            } else {
                statusEl.innerHTML = `<span class="w-3 h-3 bg-yellow-500 rounded-full mr-3 status-dot"></span> <span class="text-yellow-600 font-bold">${i18nService.t('cloud.abnormal')}</span>`;
                if (performanceTracker) performanceTracker.recordRequest(latency, false);
            }
        } catch (error) {
            const latency = Math.round(performance.now() - startTime);
            statusEl.innerHTML = `<span class="w-3 h-3 bg-red-500 rounded-full mr-3 status-dot"></span> <span class="text-red-600 font-bold">${i18nService.t('cloud.offline')}</span>`;
            if (performanceTracker) performanceTracker.recordRequest(latency, false);
            console.error('Health check failed:', error);
        }
    }
}

const healthService = new HealthService();
