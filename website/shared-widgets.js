/* ============================================
   MOD ALPHA — SHARED NAV + FLOATING AI CHAT WIDGET
   Included on all 6 journey pages
   ============================================ */

const MOD_ALPHA_LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="3.2" height="22" rx="1.2" fill="currentColor"/><rect x="24.8" y="5" width="3.2" height="22" rx="1.2" fill="currentColor"/><text x="16" y="24" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-style="italic" font-weight="700" fill="currentColor" text-anchor="middle">&#945;</text></svg>`;

function getUserName() {
    return localStorage.getItem('modAlphaUserName') || 'Investor';
}

function getUserInitial() {
    const name = getUserName().trim();
    return name ? name.charAt(0).toUpperCase() : 'I';
}

function getUserPlan() {
    return localStorage.getItem('modAlphaPlan') || 'Free';
}

/* ===== THEME ===== */
function getStoredTheme() {
    const stored = localStorage.getItem('modAlphaTheme');
    // 'medium' theme was removed — fall back anyone still on it to dark
    if (stored === 'medium') return 'dark';
    return stored || 'dark';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('modAlphaTheme', theme);
    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function navHTML() {
    const theme = getStoredTheme();
    return `
<nav class="topnav">
    <a href="page-1-home.html" class="brand">
        <span class="brand-icon">${MOD_ALPHA_LOGO_SVG}</span>
        <span>Mod Alpha</span>
    </a>
    <div class="topnav-links">
        <a href="page-2-fund-selection.html">Explore</a>
        <a href="page-3-performance-analytics.html">Tools</a>
        <a href="page-6-ai-insights-chat.html">AI Insights</a>
    </div>
    <div class="topnav-right">
        <div class="icon-btn">🔔</div>
        <div class="user-menu-wrap">
            <div class="icon-btn" id="userMenuBtn" title="${getUserName()}">${getUserInitial()}</div>
            <div class="user-dropdown" id="userDropdown">
                <div class="user-dropdown-header">
                    👋 Hi, ${getUserName()}
                    <span class="plan-pill">${getUserPlan()} Plan</span>
                </div>
                <div class="user-dropdown-label">Theme</div>
                <div class="theme-options">
                    <button class="theme-opt ${theme === 'light' ? 'active' : ''}" data-theme="light"><span class="ti">☀️</span>Light</button>
                    <button class="theme-opt ${theme === 'dark' ? 'active' : ''}" data-theme="dark"><span class="ti">🌙</span>Dark</button>
                </div>
                <a href="subscription.html" class="user-dropdown-item">💳 Subscription</a>
                <div class="user-dropdown-item" id="logoutItem" style="border-top: 1px solid var(--border); margin-top: 0.3rem; padding-top: 0.75rem;">🚪 Log Out</div>
            </div>
        </div>
    </div>
</nav>`;
}

function injectNav() {
    document.getElementById('navMount').innerHTML = navHTML();
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.topnav-links a').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });

    const menuBtn = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userDropdown');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    document.getElementById('logoutItem').addEventListener('click', logout);

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== menuBtn) {
            dropdown.classList.remove('open');
        }
    });
}

/* ===== AUTH GUARD ===== */
function requireAuth() {
    if (localStorage.getItem('modAlphaAuth') !== 'true') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('modAlphaAuth');
    localStorage.removeItem('modAlphaUserName');
    window.location.href = 'index.html';
}

/* ===== FLOATING AI CHAT WIDGET ===== */
const AI_SPARK_SVG = `<svg class="ai-spark-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c.43 0 .8.3.88.73l1.2 6.2 6.2 1.2a.9.9 0 010 1.74l-6.2 1.2-1.2 6.2a.9.9 0 01-1.76 0l-1.2-6.2-6.2-1.2a.9.9 0 010-1.74l6.2-1.2 1.2-6.2A.9.9 0 0112 2z" fill="currentColor"/><circle cx="19" cy="5" r="1.4" fill="currentColor"/></svg>`;

const CHAT_WIDGET_HTML = `
<div id="aiChatBubble" onclick="toggleChatPanel()">
    ${AI_SPARK_SVG}
    <div class="notif-dot"></div>
</div>

<div id="aiChatPanel">
    <div class="chat-panel-header">
        <div class="ai-avatar" style="width:36px;height:36px;min-width:36px;">${AI_SPARK_SVG}</div>
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

/* ===== ACTIVITY TOAST (bottom-left, simulated — not real user events) ===== */
const ACTIVITY_NAMES = ['Priya', 'Arjun', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Kavya', 'Aditya', 'Meera', 'Karan', 'Ishita', 'Rahul', 'Divya', 'Nikhil'];
const ACTIVITY_CITIES = ['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi'];

function getRandomActivityMessage() {
    const name = ACTIVITY_NAMES[Math.floor(Math.random() * ACTIVITY_NAMES.length)];
    const city = ACTIVITY_CITIES[Math.floor(Math.random() * ACTIVITY_CITIES.length)];
    return { icon: '👋', text: `<strong>${name}</strong> from ${city} just joined Mod Alpha` };
}

function injectActivityToast() {
    const mount = document.createElement('div');
    mount.innerHTML = `
<div id="activityToast">
    <span id="activityToastIcon">✨</span>
    <span id="activityToastText"></span>
</div>`;
    document.body.appendChild(mount);
    scheduleActivityToast(4000);
}

function showActivityToast() {
    const toast = document.getElementById('activityToast');
    if (!toast) return;
    const msg = getRandomActivityMessage();
    document.getElementById('activityToastIcon').textContent = msg.icon;
    document.getElementById('activityToastText').innerHTML = msg.text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
    scheduleActivityToast(16000 + Math.random() * 8000);
}

function scheduleActivityToast(delay) {
    setTimeout(showActivityToast, delay);
}

function initPage() {
    if (!requireAuth()) return;
    injectNav();
    injectChatWidget();
    injectActivityToast();
}

document.addEventListener('DOMContentLoaded', initPage);
