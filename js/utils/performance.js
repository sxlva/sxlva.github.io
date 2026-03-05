/* 性能计时工具 */
class PerformanceTracker {
    constructor() {
        this.latencies = [];
        this.totalRequests = 0;
        this.successCount = 0;
        this.failCount = 0;
    }

    recordRequest(latency, isSuccess) {
        this.latencies.push(latency);
        this.totalRequests++;

        if (isSuccess) {
            this.successCount++;
        } else {
            this.failCount++;
        }

        // 保持最近 20 条记录
        if (this.latencies.length > 20) {
            this.latencies.shift();
        }

        // 同步更新性能看板
        if (typeof dashboard !== 'undefined' && dashboard && typeof dashboard.updateMetrics === 'function') {
            const avgLatency = this.getAverageLatency();
            const healthScore = this.getHealthScore();
            const successRate = this.getSuccessRate();

            dashboard.updateMetrics(
                latency,
                avgLatency,
                healthScore,
                successRate,
                this.totalRequests,
                this.successCount,
                this.failCount
            );
        }
    }

    getAverageLatency() {
        if (this.latencies.length === 0) return 0;
        return Math.round(
            this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
        );
    }

    getSuccessRate() {
        if (this.totalRequests === 0) return 0;
        return ((this.successCount / this.totalRequests) * 100).toFixed(1);
    }

    getHealthScore() {
        const avgLatency = this.getAverageLatency();
        if (avgLatency > 1000) return 40;
        if (avgLatency > 500) return 60;
        if (avgLatency > 200) return 80;
        if (avgLatency > 100) return 90;
        return 100;
    }

    reset() {
        this.latencies = [];
        this.totalRequests = 0;
        this.successCount = 0;
        this.failCount = 0;
    }
}

const performanceTracker = new PerformanceTracker();
