/* ============================================
   MOD ALPHA — SHARED NAV + FLOATING AI CHAT WIDGET
   Included on all 6 journey pages
   ============================================ */

const NAV_HTML = `
<nav class="topnav">
    <a href="page-1-home.html" class="brand">
        <span class="brand-icon">⚡</span>
        <span>Mod Alpha</span>
    </a>
    <div class="topnav-links">
        <a href="page-2-fund-selection.html">Explore</a>
        <a href="page-3-performance-analytics.html">Tools</a>
        <a href="page-6-ai-insights-chat.html" class="ai-link">✨ AI Insights</a>
        <a href="#learn">Learn</a>
        <a href="#watchlist">Watchlist</a>
    </div>
    <div class="topnav-right">
        <div class="search-box">🔍 Search funds...</div>
        <div class="icon-btn">🔔</div>
        <div class="icon-btn">👤</div>
    </div>
</nav>`;

function injectNav() {
    document.getElementById('navMount').innerHTML = NAV_HTML;
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.topnav-links a').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });
}

/* ===== FLOATING AI CHAT WIDGET ===== */
const CHAT_WIDGET_HTML = `
<div id="aiChatBubble" onclick="toggleChatPanel()">
    🤖
    <div class="notif-dot"></div>
</div>

<div id="aiChatPanel">
    <div class="chat-panel-header">
        <div class="ai-avatar" style="width:36px;height:36px;min-width:36px;font-size:1.1rem;">🤖</div>
        <div>
            <div class="cph-title">Mod Alpha AI</div>
            <div class="cph-sub"><span class="cph-dot"></span> Online &middot; Ready to help</div>
        </div>
        <div class="chat-panel-close" onclick="toggleChatPanel()">✕</div>
    </div>
    <div class="chat-panel-body" id="chatPanelBody">
        <div class="chat-bubble bot">
            👋 Hi! I'm your AI investment assistant. Ask me about fund performance, best SIP dates, or MOD Alpha recommendations.
            <div class="chat-suggestions">
                <div class="chat-suggestion-chip" onclick="sendWidgetMessage('How is my fund performing?')">📈 Fund performance</div>
                <div class="chat-suggestion-chip" onclick="sendWidgetMessage('Best date to invest this month?')">📅 Best date</div>
                <div class="chat-suggestion-chip" onclick="sendWidgetMessage('Explain MOD Alpha')">🤖 What is MOD Alpha?</div>
            </div>
        </div>
    </div>
    <div class="chat-panel-input">
        <input type="text" id="chatWidgetInput" placeholder="Ask Mod Alpha AI..." onkeypress="if(event.key==='Enter')sendWidgetMessage()">
        <button onclick="sendWidgetMessage()">➤</button>
    </div>
</div>`;

function injectChatWidget() {
    const mount = document.createElement('div');
    mount.innerHTML = CHAT_WIDGET_HTML;
    document.body.appendChild(mount);
}

function toggleChatPanel() {
    const panel = document.getElementById('aiChatPanel');
    const bubble = document.getElementById('aiChatBubble');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        bubble.classList.add('hidden');
        document.querySelector('.notif-dot')?.remove();
    } else {
        bubble.classList.remove('hidden');
    }
}

const WIDGET_RESPONSES = {
    'performance': "📊 Your selected fund (Nifty 50 Index) is up <strong>18.5% YTD</strong>, outperforming its benchmark by 2.3%. Volatility is moderate at 14.8%. Want a detailed breakdown?",
    'date': "📅 Based on historical volatility analysis, the <strong>8th–15th of each month</strong> shows 23% lower volatility than month-start. This is the AI-suggested window for your next SIP.",
    'alpha': "🤖 <strong>MOD Alpha</strong> analyzes historical price patterns to suggest optimal SIP investment dates each month — instead of a fixed date, you invest when conditions are statistically favorable. Backtested results show up to <strong>+15.7% additional returns</strong> vs fixed-date SIP.",
    'default': "💡 I can help with fund performance, best investment dates, SIP comparisons, and portfolio insights. Try asking about a specific fund or your SIP strategy!"
};

function sendWidgetMessage(predefined) {
    const input = document.getElementById('chatWidgetInput');
    const msg = predefined || input.value.trim();
    if (!msg) return;

    const body = document.getElementById('chatPanelBody');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = msg;
    body.appendChild(userBubble);
    input.value = '';
    body.scrollTop = body.scrollHeight;

    const typing = document.createElement('div');
    typing.className = 'chat-bubble bot';
    typing.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
        typing.remove();
        let key = 'default';
        const lower = msg.toLowerCase();
        if (lower.includes('perform')) key = 'performance';
        else if (lower.includes('date') || lower.includes('when')) key = 'date';
        else if (lower.includes('alpha') || lower.includes('mod')) key = 'alpha';

        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.innerHTML = WIDGET_RESPONSES[key];
        body.appendChild(botBubble);
        body.scrollTop = body.scrollHeight;
    }, 1200);
}

function initPage() {
    injectNav();
    injectChatWidget();
}

document.addEventListener('DOMContentLoaded', initPage);
