/* 链路追踪图 */

class TraceChart {
    render() {
        return `
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-4 section-title"><span data-i18n="trace.title">⚡ 实时请求链路追踪</span></h2>
                <div class="glass-card p-6 rounded-xl sequence-card">
                    <!-- 时序图节点容器：使用共同父容器承载图标行和白色基准线 -->
                    <div class="relative mb-8 pt-4 sequence-track">
                        <!-- 节点层：确保圆形图标在自身容器内水平垂直居中 -->
                        <div class="relative flex justify-between items-center mb-4">
                            <div class="flex flex-col items-center w-1/5 node-container" id="node-frontend">
                                <div class="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-2xl mb-2 node-icon relative z-10">💻</div>
                                <span class="text-xs font-bold text-gray-700">Frontend</span>
                                <span class="text-xs text-gray-400">Browser</span>
                            </div>
                            <div class="flex flex-col items-center w-1/5 node-container" id="node-gateway">
                                <div class="w-16 h-16 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center text-2xl mb-2 node-icon relative z-10">🚪</div>
                                <span class="text-xs font-bold text-gray-700">Gateway</span>
                                <span class="text-xs text-gray-400">8091:Nginx</span>
                            </div>
                            <div class="flex flex-col items-center w-1/5 node-container" id="node-service">
                                <div class="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-500 flex items-center justify-center text-2xl mb-2 node-icon relative z-10">⚙️</div>
                                <span class="text-xs font-bold text-gray-700">Service</span>
                                <span class="text-xs text-gray-400">Spring Boot</span>
                            </div>
                            <div class="flex flex-col items-center w-1/5 node-container" id="node-redis">
                                <div class="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center text-2xl mb-2 node-icon relative z-10">⚡</div>
                                <span class="text-xs font-bold text-gray-700">Redis</span>
                                <span class="text-xs text-gray-400">Cache Layer</span>
                            </div>
                            <div class="flex flex-col items-center w-1/5 node-container" id="node-database">
                                <div class="w-16 h-16 rounded-full bg-yellow-100 border-2 border-yellow-500 flex items-center justify-center text-2xl mb-2 node-icon relative z-10">🗄️</div>
                                <span class="text-xs font-bold text-gray-700">Database</span>
                                <span class="text-xs text-gray-400">MySQL 8.0</span>
                            </div>
                        </div>

                        <!-- SVG 连接线层：单条白色横线穿过所有圆心，依托共同父容器居中对齐 -->
                        <svg class="absolute left-0 w-full pointer-events-none sequence-line">
                            <defs>
                                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0" />
                                    <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <!-- 白色横线 + 流动高亮，Y 轴取圆心附近，视觉上穿过所有圆圈几何中心 -->
                            <line id="base-line" x1="10%" y1="32" x2="90%" y2="32" stroke="#e5e7eb" stroke-width="2" />
                            <line id="flow-line" x1="10%" y1="32" x2="10%" y2="32" stroke="url(#flowGradient)" stroke-width="4" filter="url(#glow)" />
                            <circle id="flow-particle" cx="10%" cy="32" r="4" fill="#3b82f6" opacity="0" filter="url(#glow)" />
                        </svg>
                    </div>

                    <!-- 实时日志流 -->
                    <div class="border-t pt-4">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-sm font-bold text-gray-700"><span data-i18n="trace.logsTitle">📋 Request Trace Logs</span></h3>
                            <button data-action="trace-clear" class="text-xs text-gray-400 hover:text-gray-600 transition"><span data-i18n="trace.clearLogs">清空日志</span></button>
                        </div>
                        <div id="trace-logs" class="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg h-48 overflow-y-auto">
                            <div class="text-gray-500" data-i18n="trace.waiting">等待执行抽奖操作...</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async animateFlow() {
        const nodes = ['frontend', 'gateway', 'service', 'redis', 'database'];
        const line = document.getElementById('flow-line');
        const particle = document.getElementById('flow-particle');
        const positions = [10, 32.5, 55, 77.5, 90];

        if (!line || !particle) return;

        // 初始位置：从最左侧圆心开始
        gsap.set(line, { attr: { x2: '10%' } });
        gsap.set(particle, { attr: { cx: '10%' }, opacity: 0 });

        for (let i = 0; i < nodes.length; i++) {
            const node = document.getElementById(`node-${nodes[i]}`);
            if (!node) continue;

            const icon = node.querySelector('.node-icon');
            const nextPos = positions[i + 1];

            if (icon) {
                gsap.timeline()
                    .to(icon, { scale: 1.15, duration: 0.2, ease: "power2.out" })
                    .to(icon, {
                        boxShadow: `0 0 20px ${this.getNodeColor(nodes[i])}`,
                        duration: 0.2
                    }, "<")
                    .to(icon, { scale: 1, boxShadow: "none", duration: 0.3, ease: "power2.in" });
            }

            if (i < nodes.length - 1 && nextPos) {
                gsap.to(particle, { opacity: 1, duration: 0.1 });
                gsap.to(line, {
                    attr: { x2: `${nextPos}%` },
                    duration: 0.6,
                    ease: "power1.inOut"
                });
                gsap.to(particle, {
                    attr: { cx: `${nextPos}%` },
                    duration: 0.6,
                    ease: "power1.inOut",
                    onComplete: () => {
                        if (i === nodes.length - 2) {
                            gsap.to(particle, { opacity: 0, duration: 0.2 });
                        }
                    }
                });
            }

            const logMessages = [
                { label: '🌐 Frontend', msg: 'POST /api/v1/raffle/random_raffle', color: '#3b82f6' },
                { label: '🚪 Gateway', msg: 'Nginx reverse proxy → Service:8080', color: '#22c55e' },
                { label: '⚙️ Service', msg: 'StrategyArmory.randomRaffle(100006)', color: '#a855f7' },
                { label: '⚡ Redis', msg: 'GET strategy:100006:range_rate_map', color: '#ef4444' },
                { label: '🗄️ Database', msg: 'SELECT * FROM strategy_award WHERE strategy_id=100006', color: '#eab308' }
            ];

            if (logger) {
                logger.addLog(logMessages[i].label, logMessages[i].msg, logMessages[i].color);
            }

            await new Promise(resolve => setTimeout(resolve, 650));
        }
    }

    getNodeColor(nodeName) {
        const colors = {
            'frontend': 'rgba(59, 130, 246, 0.6)',
            'gateway': 'rgba(34, 197, 94, 0.6)',
            'service': 'rgba(168, 85, 247, 0.6)',
            'redis': 'rgba(239, 68, 68, 0.6)',
            'database': 'rgba(234, 179, 8, 0.6)'
        };
        return colors[nodeName] || 'rgba(59, 130, 246, 0.6)';
    }
}

const traceChart = new TraceChart();
