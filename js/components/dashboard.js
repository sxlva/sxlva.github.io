/* 性能监管看板 */

class Dashboard {
    render() {
        return `
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-4 border-l-4 border-purple-600 pl-4 section-title"><span data-i18n="dashboard.title">📊 Performance Dashboard</span></h2>
                <div class="glass-card p-6 rounded-xl dashboard-card">
                    <!-- 性能指标网格 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <!-- Latency -->
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 metric-card" id="latency-card">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-blue-700 uppercase">Latency</span>
                                <span class="text-xl">⚡</span>
                            </div>
                            <div class="text-3xl font-bold text-blue-900 mb-1" id="latency-value">-- ms</div>
                            <div class="text-xs text-blue-600">Avg: <span id="latency-avg">--</span> ms</div>
                            <div class="mt-2 h-1 bg-blue-200 rounded-full overflow-hidden">
                                <div id="latency-bar" class="h-full bg-blue-600 transition-all duration-300" style="width: 0"></div>
                            </div>
                        </div>

                        <!-- Health Score -->
                        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 metric-card" id="health-card">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-green-700 uppercase">Health Score</span>
                                <span class="text-xl">💚</span>
                            </div>
                            <div class="text-3xl font-bold text-green-900 mb-1" id="health-score">--</div>
                            <div class="text-xs text-green-600" id="health-status">System Standby</div>
                            <div class="mt-3 flex justify-center">
                                <svg width="80" height="80" class="transform -rotate-90">
                                    <circle cx="40" cy="40" r="32" stroke="#d1fae5" stroke-width="6" fill="none" />
                                    <circle id="health-circle" cx="40" cy="40" r="32" stroke="#10b981" stroke-width="6" fill="none"
                                            stroke-dasharray="201" stroke-dashoffset="201" class="transition-all duration-1000" />
                                </svg>
                            </div>
                        </div>

                        <!-- Request Count -->
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 metric-card" id="request-card">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-purple-700 uppercase">Total Requests</span>
                                <span class="text-xl">📈</span>
                            </div>
                            <div class="text-3xl font-bold text-purple-900 mb-1" id="request-count">0</div>
                            <div class="text-xs text-purple-600">Success: <span id="success-count">0</span> | Failed: <span id="fail-count">0</span></div>
                            <div class="mt-2 flex gap-1">
                                <div class="flex-1 h-1 bg-purple-200 rounded-full overflow-hidden">
                                    <div id="success-bar" class="h-full bg-green-500 transition-all duration-300" style="width: 0"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tech Stack Badge -->
                    <div class="border-t pt-4">
                        <h3 class="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                            <span class="mr-2">🛠️</span> <span data-i18n="dashboard.techStack">Tech Stack Architecture</span>
                        </h3>
                        <div class="flex flex-wrap gap-3" id="tech-stack">
                            <!-- 徽章将通过 JavaScript 动态生成 -->
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    initTechStackBadges() {
        const container = document.getElementById('tech-stack');
        if (!container) return;

        TECH_STACK.forEach((tech, index) => {
            const badge = document.createElement('div');
            badge.className = `flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${tech.color} font-bold text-sm opacity-0 transform translate-y-4 tech-badge`;
            if (tech.style) {
                badge.setAttribute('style', tech.style);
            }
            badge.innerHTML = `<span class="text-xl">${tech.icon}</span><span>${tech.name}</span>`;
            container.appendChild(badge);

            // GSAP 渐入动画
            gsap.to(badge, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.8 + index * 0.1,
                ease: "back.out(1.7)"
            });
        });
    }

    updateMetrics(latency, avgLatency, healthScore, successRate, totalRequests, successCount, failCount) {
        // 更新延迟
        const latencyValue = document.getElementById('latency-value');
        const latencyAvg = document.getElementById('latency-avg');
        const latencyBar = document.getElementById('latency-bar');

        if (latencyValue) {
            gsap.to(latencyValue, {
                textContent: `${latency} ms`,
                duration: 0.5,
                snap: { textContent: 1 },
                ease: "power2.out"
            });
        }

        if (latencyAvg) latencyAvg.textContent = avgLatency;

        const latencyPercent = Math.min((latency / 1000) * 100, 100);
        if (latencyBar) {
            gsap.to(latencyBar, {
                width: `${latencyPercent}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }

        // 更新健康评分
        const healthScoreEl = document.getElementById('health-score');
        const healthStatusEl = document.getElementById('health-status');
        const healthCircle = document.getElementById('health-circle');

        if (healthScoreEl) {
            gsap.to(healthScoreEl, {
                textContent: healthScore,
                duration: 1,
                snap: { textContent: 1 },
                ease: "power2.out"
            });
        }

        const circumference = 2 * Math.PI * 32;
        const offset = circumference - (healthScore / 100) * circumference;

        if (healthCircle) {
            gsap.to(healthCircle, {
                attr: { 'stroke-dashoffset': offset },
                duration: 1,
                ease: "power2.out"
            });
        }

        // 更新请求计数
        if (document.getElementById('request-count')) {
            document.getElementById('request-count').textContent = totalRequests;
        }
        if (document.getElementById('success-count')) {
            document.getElementById('success-count').textContent = successCount;
        }
        if (document.getElementById('fail-count')) {
            document.getElementById('fail-count').textContent = failCount;
        }

        const successBar = document.getElementById('success-bar');
        if (successBar) {
            gsap.to(successBar, {
                width: `${successRate}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }
}

const dashboard = new Dashboard();
