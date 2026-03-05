/* 抽奖系统 */
class RaffleSystem {
    constructor() {
        this.isDrawing = false;
    }

    async execute() {
        if (this.isDrawing) return;

        this.isDrawing = true;
        const resultEl = document.getElementById('raffle-result');
        const btn = document.querySelector('.raffle-btn');

        // 按钮动画
        if (btn) {
            gsap.to(btn, { scale: 0.95, duration: 0.1 });
            gsap.to(btn, { scale: 1, duration: 0.1, delay: 0.1 });
        }

        if (resultEl) {
            resultEl.innerHTML = `<span class="animate-spin mr-2" style="display: inline-block;">🌀</span> <span style="color: #00c2ff; font-size: 15px;">${i18nService.t('raffle.drawing')}</span>`;
            resultEl.style.background = 'rgba(0, 194, 255, 0.1)';
            resultEl.style.borderColor = 'rgba(0, 194, 255, 0.5)';
            resultEl.style.boxShadow = '0 0 15px rgba(0, 194, 255, 0.2)';
            gsap.fromTo(resultEl, { opacity: 0.5 }, { opacity: 1, duration: 0.3 });
        }

        // 启动链路追踪
        if (traceChart) {
            await traceChart.animateFlow();
        }

        const startTime = performance.now();

        try {
            // 1. 先进行策略装配（StrategyArmory），使用前端演示固定策略ID 100006
            await apiService.assembleStrategy(100006);

            // 2. 可选：查询奖品列表以确保策略与奖品数据就绪
            await apiService.getAwardList(100006);

            // 3. 再调用随机抽奖接口
            const data = await apiService.executeRaffle(100006);
            const latency = Math.round(performance.now() - startTime);

            // 更新性能追踪器
            if (performanceTracker) {
                performanceTracker.recordRequest(latency, data && data.code === '0000');
            }

            // 更新仪表盘
            if (performanceTracker && dashboard) {
                const avgLatency = performanceTracker.getAverageLatency();
                const healthScore = performanceTracker.getHealthScore();
                const successRate = performanceTracker.getSuccessRate();

                dashboard.updateMetrics(
                    latency,
                    avgLatency,
                    healthScore,
                    successRate,
                    performanceTracker.totalRequests,
                    performanceTracker.successCount,
                    performanceTracker.failCount
                );
            }

            if (data && data.code === '0000') {
                const awardData = data.data;
                const awardId =
                    awardData && typeof awardData === 'object'
                        ? (awardData.awardId ?? JSON.stringify(awardData))
                        : awardData;

                if (resultEl) {
                    resultEl.innerHTML = `<span style="color: #00ff88; font-size: 16px;">✅ ${i18nService.t('raffle.success')}</span> <strong style="color: #00f2fe; font-size: 18px; text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);">${awardId}</strong>`;
                    resultEl.style.background = 'rgba(0, 255, 136, 0.1)';
                    resultEl.style.borderColor = 'rgba(0, 255, 136, 0.6)';
                    resultEl.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
                    gsap.fromTo(resultEl, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
                }
                if (logger) {
                    logger.success('⬅️ Response', `awardId: ${awardId}, code: ${data.code}, latency: ${latency}ms`);
                }
            } else {
                if (resultEl) {
                    resultEl.innerHTML = `<span style="color: #ffea00; font-size: 16px;">⚠️ ${i18nService.t('raffle.error')}</span> <span style="color: rgba(255, 255, 255, 0.9);">${data && data.info || 'Unknown error'}</span>`;
                    resultEl.style.background = 'rgba(255, 234, 0, 0.1)';
                    resultEl.style.borderColor = 'rgba(255, 234, 0, 0.6)';
                    resultEl.style.boxShadow = '0 0 20px rgba(255, 234, 0, 0.3)';
                }
                if (logger) {
                    logger.warn('⚠️ Business Error', `code: ${data && data.code}, info: ${data && data.info}`);
                }
            }
        } catch (error) {
            const latency = Math.round(performance.now() - startTime);

            if (performanceTracker) {
                performanceTracker.recordRequest(latency, false);
            }

            if (resultEl) {
                resultEl.innerHTML = `<span style="color: #ff0066; font-size: 16px;">❌ ${i18nService.t('raffle.failed')}</span>`;
                resultEl.style.background = 'rgba(255, 0, 102, 0.1)';
                resultEl.style.borderColor = 'rgba(255, 0, 102, 0.6)';
                resultEl.style.boxShadow = '0 0 20px rgba(255, 0, 102, 0.3)';
            }

            if (logger) {
                logger.error('❌ Network Error', `${error.message}`);
            }

            console.error('Raffle execute error:', error);
        }

        this.isDrawing = false;
    }

    render() {
        return `
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-4 border-l-4 border-indigo-600 pl-4 section-title" style="color: rgba(255, 255, 255, 0.9);">
                    <span data-i18n="raffle.title">分布式抽奖系统演示</span>
                </h2>
                <div class="glass-card p-6 rounded-xl raffle-card">
                    <p class="text-sm mb-6 leading-relaxed" data-i18n="raffle.description" style="color: rgba(255, 255, 255, 0.7);"></p>
                    <button data-action="raffle-run" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition raffle-btn">
                        <span data-i18n="raffle.button">执行随机抽奖</span>
                    </button>
                    <div id="raffle-result" class="p-4 rounded-lg text-sm min-h-[50px] flex items-center justify-center border-2 raffle-result mt-4" style="background: rgba(0, 0, 0, 0.4); border-color: rgba(0, 242, 254, 0.4); color: rgba(255, 255, 255, 0.9); font-weight: 500;">
                        <span data-i18n="raffle.noData">暂无抽奖数据</span>
                    </div>
                </div>
            </section>
        `;
    }

    switchTab(tabName) {
        // 更新 Tab 按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('text-gray-600');
        });

        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.classList.remove('text-gray-600');
        }

        // 切换内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.remove('hidden');

            // GSAP 淡入动画
            gsap.fromTo(targetContent,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }

        // 如果切换到代码页，重新高亮
        if (tabName === 'code' && typeof Prism !== 'undefined') {
            setTimeout(() => Prism.highlightAll(), 100);
        }
    }
}

const raffleSystem = new RaffleSystem();
