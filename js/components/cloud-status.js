/* 云端状态组件 */

class CloudStatus {
    render() {
        return `
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-4 flex items-center section-title" style="color: rgba(255, 255, 255, 0.9);">
                    <span class="mr-2">🖥️</span> <span data-i18n="cloud.title">云端后端状态 (117.72.153.14:8091)</span>
                </h2>
                <div class="glass-card p-6 rounded-xl status-card">
                    <div id="api-status" class="flex items-center text-lg status-indicator">
                        <span class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse mr-3" style="box-shadow: 0 0 10px rgba(0, 242, 254, 0.8);"></span>
                        <span style="color: rgba(255, 255, 255, 0.7);" data-i18n="cloud.connecting">连接中...</span>
                    </div>
                    <p class="text-xs mt-3" style="color: rgba(255, 255, 255, 0.5);" data-i18n="cloud.description">基于现有的 [查询奖品列表] 接口进行实时链路探测</p>
                </div>
            </section>
        `;
    }
}

const cloudStatus = new CloudStatus();
