// --- DERIV WEBSOCKET MULTI-MARKET API MANAGER ---
class DerivAPIConnector {
    constructor(appId) {
        this.appId = appId;
        this.wsUrl = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
        this.ws = null;
        this.isConnected = false;
        this.subscribers = {};
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);

            this.ws.onopen = () => {
                this.isConnected = true;
                console.log("Deriv WebSocket Connected Successfully.");
                resolve(true);
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            };

            this.ws.onerror = (error) => {
                console.error("Deriv WebSocket Error:", error);
                this.isConnected = false;
                reject(error);
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                setTimeout(() => this.connect(), 3000);
            };
        });
    }

    subscribeTicks(symbol, callback) {
        this.subscribers[symbol] = callback;
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify({ forget_all: 'ticks' }));
            this.ws.send(JSON.stringify({ ticks: symbol }));
        }
    }

    handleMessage(data) {
        if (data.msg_type === 'tick' && data.tick) {
            const symbol = data.tick.symbol;
            if (this.subscribers[symbol]) {
                this.subscribers[symbol](data.tick);
            }
        }
    }
}
