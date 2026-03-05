/* API 请求服务 */
class ApiService {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.endpoints = config.endpoints;
        this.timeout = config.timeout || 10000;
    }

    async assembleStrategy(strategyId = 100006) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.strategyArmory}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ strategyId })
            });
            return await response.json();
        } catch (error) {
            console.error('Strategy armory request failed:', error);
            throw error;
        }
    }

    async getAwardList(strategyId = 100006) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.queryList}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ strategyId })
            });
            return await response.json();
        } catch (error) {
            console.error('Award list request failed:', error);
            throw error;
        }
    }

    async executeRaffle(strategyId) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.randomRaffle}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ strategyId })
            });
            return await response.json();
        } catch (error) {
            console.error('Raffle execute request failed:', error);
            throw error;
        }
    }
}

const apiService = new ApiService(API_CONFIG);
