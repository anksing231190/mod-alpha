/* ============================================
   MOD ALPHA — SHARED NAV + FLOATING AI CHAT WIDGET
   Included on all 6 journey pages
   ============================================ */

const MOD_ALPHA_LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="modAlphaGoldGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f3d576"/><stop offset="50%" stop-color="#d4af37"/><stop offset="100%" stop-color="#a9790a"/></linearGradient></defs><rect x="4" y="5" width="3.2" height="22" rx="1.2" fill="url(#modAlphaGoldGrad)"/><rect x="24.8" y="5" width="3.2" height="22" rx="1.2" fill="url(#modAlphaGoldGrad)"/><text x="16" y="24" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-style="italic" font-weight="700" fill="url(#modAlphaGoldGrad)" text-anchor="middle">&#945;</text></svg>`;

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
        <a href="page-6-ai-insights-chat.html">AI Insights</a>
        <a href="subscription.html">Subscription</a>
        <a href="support.html">Support</a>
    </div>
    <div class="topnav-right">
        <div class="icon-btn mobile-menu-btn" id="mobileMenuBtn">☰</div>
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
                <div class="user-dropdown-item" id="logoutItem" style="border-top: 1px solid var(--border); margin-top: 0.3rem; padding-top: 0.75rem;">🚪 Log Out</div>
            </div>
        </div>
    </div>
    <div class="mobile-nav-dropdown" id="mobileNavDropdown">
        <a href="page-2-fund-selection.html">🔍 Explore</a>
        <a href="page-6-ai-insights-chat.html">✨ AI Insights</a>
        <a href="subscription.html">💳 Subscription</a>
        <a href="support.html">🆘 Support</a>
    </div>
</nav>`;
}

function injectNav() {
    document.getElementById('navMount').innerHTML = navHTML();
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.topnav-links a, .mobile-nav-dropdown a').forEach(a => {
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

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileNavDropdown');

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== menuBtn) {
            dropdown.classList.remove('open');
        }
        if (!mobileDropdown.contains(e.target) && e.target !== mobileMenuBtn) {
            mobileDropdown.classList.remove('open');
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

/* ===== SITE FOOTER ===== */
const SOCIAL_LINKS = [
    { name: 'WhatsApp', href: '#', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.07-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.25-.47.07-1.03.1-1.66-.1-.38-.12-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.08-1.44-1.08-2.75 0-1.3.68-1.95.93-2.22.24-.26.52-.33.7-.33h.5c.16 0 .37-.03.58.44.22.5.75 1.74.82 1.86.07.13.11.28.02.46-.09.18-.14.3-.27.46-.13.16-.28.35-.4.47-.13.13-.27.27-.12.53.16.26.7 1.15 1.5 1.87 1.04.93 1.91 1.21 2.17 1.35.26.13.41.11.56-.07.16-.18.65-.76.83-1.02.18-.26.35-.21.58-.13.24.08 1.5.71 1.76.84.26.13.43.2.5.3.07.1.07.6-.15 1.22z"/></svg>' },
    { name: 'Twitter / X', href: '#', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2.9l8.1-9.3L2 2h6.6l4.5 6 5.8-6zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z"/></svg>' },
    { name: 'Instagram', href: '#', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>' },
    { name: 'YouTube', href: '#', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 7.2a3 3 0 00-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 00.5 7.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 4.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-4.8zM9.8 15.5V8.5L15.8 12l-6 3.5z"/></svg>' },
    { name: 'LinkedIn', href: '#', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>' }
];

function footerHTML() {
    return `
<footer class="site-footer">
    <div class="footer-inner">
        <div class="footer-brand">
            <div class="footer-brand-row">
                <span class="brand-icon">${MOD_ALPHA_LOGO_SVG}</span>
                <span>Mod Alpha</span>
            </div>
            <p>AI-powered SIP timing for smarter mutual fund investing. We analyze fund data, you stay in control.</p>
            <div class="footer-social">
                ${SOCIAL_LINKS.map(s => `<a href="${s.href}" title="${s.name}" aria-label="${s.name}">${s.svg}</a>`).join('')}
            </div>
        </div>
        <div class="footer-col">
            <div class="footer-col-title">Platform</div>
            <a href="page-2-fund-selection.html">Explore</a>
            <a href="page-6-ai-insights-chat.html">AI Insights</a>
            <a href="subscription.html">Subscription</a>
        </div>
        <div class="footer-col">
            <div class="footer-col-title">Help</div>
            <a href="support.html">Support &amp; FAQs</a>
            <a href="mailto:support@modalpha.app">Email Us</a>
        </div>
    </div>
    <div class="footer-bottom">
        <span>&copy; 2026 Mod Alpha. All rights reserved.</span>
        <span>SEBI Registered &middot; Notification-only, we never place trades on your behalf.</span>
    </div>
</footer>`;
}

function injectFooter() {
    const mount = document.createElement('div');
    mount.innerHTML = footerHTML();
    document.body.appendChild(mount);
}

function initPage() {
    if (!requireAuth()) return;
    injectNav();
    injectChatWidget();
    injectActivityToast();
    injectFooter();
}

document.addEventListener('DOMContentLoaded', initPage);
