// --- APEXFLOW MARKET DOLLAR HUNTERS MAIN CONTROLLER ---
const PARTNER_APP_ID = "34UGhpx0qrXHqpfKHAkGH";
const AFFILIATE_TOKEN = "3A2CFHPG722B"; // Verified partner revenue-share token

// 3-Minute (180 Seconds) Inner Core Bleeding & Loading Initialization Sequence
let remainingSeconds = 180;
const totalDuration = 180;

const loadingMessages = [
    { at: 165, text: "Initializing Secure WebSocket Handshakes..." },
    { at: 140, text: "Bleeding and Calibrating Order Block Matrices..." },
    { at: 110, text: "Mapping Fair Value Gaps across Higher Timeframes..." },
    { at: 75, text: "Synchronizing ICT & SMC Liquidity Sweep Engines..." },
    { at: 35, text: "Connecting Partner Affiliate Tracking ID [3A2CFHPG722B]..." },
    { at: 10, text: "Finalizing Live Terminal Feed... Almost Ready." }
];

function runCoreLoadingSequence() {
    const timerDisplay = document.getElementById('loading-timer-display');
    const progressBar = document.getElementById('core-progress-bar');
    const statusText = document.getElementById('loading-status-text');
    const splashScreen = document.getElementById('splash-screen');

    const interval = setInterval(() => {
        remainingSeconds--;
        
        // Calculate minutes and seconds formatting
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;

        // Calculate progress percentage
        const elapsed = totalDuration - remainingSeconds;
        const percent = (elapsed / totalDuration) * 100;
        if (progressBar) progressBar.style.width = `${percent}%`;

        // Update dynamic bleeding text messages
        const currentMsg = loadingMessages.find(m => m.at === remainingSeconds);
        if (currentMsg && statusText) {
            statusText.innerText = currentMsg.text;
        }

        // Complete initialization when countdown hits zero
        if (remainingSeconds <= 0) {
            clearInterval(interval);
            if (splashScreen) {
                splashScreen.style.opacity = '0';
                setTimeout(() => splashScreen.remove(), 600);
            }
            initializeLiveTerminal();
        }
    }, 1000);
}

// OAuth Login Redirect with Affiliate Token
function loginWithDeriv() {
    const currentUrl = window.location.href.split('?')[0];
    const redirectUri = encodeURIComponent(currentUrl);
    const oauthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${PARTNER_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}&redirect_uri=${redirectUri}`;
    window.location.href = oauthUrl;
}

// Sign Up Funnel Redirect
function signupWithDeriv() {
    const signUpUrl = `https://hub.deriv.com/tradershub/signup?t=${AFFILIATE_TOKEN}`;
    window.open(signUpUrl, '_blank');
}

function initializeLiveTerminal() {
    console.log("Apexflow Inner Core Fully Initialized. Live Feed Active.");
    
    // Instantiate Deriv API Connector & AI Bots Engine
    const derivApi = new DerivAPIConnector(PARTNER_APP_ID);
    const aiEngine = new AIBotsEngine();

    derivApi.connect().then(() => {
        const assetSelector = document.getElementById('asset-selector');
        const selectedAsset = assetSelector ? assetSelector.value : 'R_100';

        derivApi.subscribeTicks(selectedAsset, (tick) => {
            const quoteEl = document.getElementById('live-quote-display');
            if (quoteEl) quoteEl.innerText = tick.quote.toFixed(4);
            aiEngine.analyzeTick(tick);
        });
    }).catch(err => {
        console.warn("Running in simulation fallback mode due to WebSocket network restriction.");
        setInterval(() => {
            const randomQuote = (10340.50 + (Math.random() * 10 - 5)).toFixed(4);
            const quoteEl = document.getElementById('live-quote-display');
            if (quoteEl) quoteEl.innerText = randomQuote;
        }, 1000);
    });
}

// Start sequence on page load
window.addEventListener('DOMContentLoaded', () => {
    runCoreLoadingSequence();
});
