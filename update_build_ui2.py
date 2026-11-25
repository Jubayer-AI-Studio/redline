import os

with open('build_ui2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update scopedCss to include dark theme and suppress white screens
dark_overrides = """
/* Eradicate any stark white backgrounds and white setup screens */
html, body, #race-root, #game-hub, .st-sys, .rx-screen, .rx-screen-setup, .summary-head, .summary-chart, .overall, .lap-card, .rating-list {
  background-color: #0b0d14 !important;
  color: #f3f4f6 !important;
}
#race-root .rx-screen-setup, #race-root .rx-screen-setup * {
  background-color: #12141c !important;
  color: #f3f4f6 !important;
}
#toast-root {
  pointer-events: none !important;
  opacity: 0 !important;
}
"""

if '/* Eradicate any stark white backgrounds' not in content:
    content = content.replace("/* UI v2 App Container: Fixed 100dvh viewport, zero scroll */", dark_overrides + "\n/* UI v2 App Container: Fixed 100dvh viewport, zero scroll */")

# 2. Make UI v2 the default for all visitors
content = content.replace(
    "var isV2 = (uiParam === '2') || (!uiParam && savedUi === '2') || (uiParam !== '1' && !savedUi);",
    "var isV2 = (uiParam !== '1');"
)

# 3. Update confirmSelectCar and openSocialModal and enterRaceSession
old_block = """    function confirmSelectCar() {
      rlHaptic('cta');
      var c = CARS[currentCar];
      try {
        if (typeof CB !== 'undefined') {
          if (CB.stock && typeof CB.stock.apply === 'function') {
            CB.stock.apply({ model: c.id });
          } else if (CB.state && typeof CB.state.set === 'function') {
            CB.state.set('shape', c.id);
          }
        }
      } catch (e) {}
      alert('Selected ' + c.name + ' as your active competition car.');
    }

    /* Mode Selection and Launcher */
    function selectMode(card, modeKey) {
      selectedMode = modeKey || 'race';
      rlHaptic('select');
      rlPlaySound('select');
      document.querySelectorAll('#rl-app .mode-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
    }

    function launchSelectedMode(overrideMode) {
      rlHaptic('cta');
      var mode = overrideMode || selectedMode || 'race';
      enterRaceSession(mode);
    }

    function openSocialModal(type) {
      rlHaptic('tap');
      var titles = {
        chat: 'LOBBY CHAT',
        friends: 'DRIVERS & FRIENDS',
        messages: 'INBOX NOTIFICATIONS (9+)',
        clan: 'MOTORSPORT CLAN',
        rewards: 'DAILY REWARDS (2 CLAIMABLE)'
      };
      alert('[' + (titles[type] || String(type).toUpperCase()) + '] Live service connection active.');
    }

    function openRewardsModal() {
      openSocialModal('rewards');
    }

    function launchCarRace() {
      rlHaptic('cta');
      enterRaceSession('race');
    }

    function enterRaceSession(routeId) {
      document.documentElement.classList.add('rl-in-session');
      try {
        var c = CARS[currentCar];
        if (c && typeof CB !== 'undefined' && CB.stock && typeof CB.stock.apply === 'function') {
          CB.stock.apply({ model: c.id });
        }
      } catch (e) {}

      if (typeof CB !== 'undefined' && CB.router && typeof CB.router.go === 'function') {
        if (routeId === 'timetrial') CB.router.go('hub', { sub: 'timetrial' });
        else if (routeId === 'multiplayer') CB.router.go('multiplayer');
        else CB.router.go(routeId);
      }
    }"""

new_block = """    function showToast(msg, icon) {
      var toast = document.getElementById('rk-game-toast');
      var msgEl = document.getElementById('rk-toast-msg');
      var icoEl = document.getElementById('rk-toast-ico');
      if (toast && msgEl) {
        msgEl.textContent = msg;
        if (icoEl && icon) icoEl.textContent = icon;
        toast.classList.add('show');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2600);
      }
    }

    function confirmSelectCar() {
      rlHaptic('cta');
      var c = CARS[currentCar];
      try {
        if (typeof CB !== 'undefined') {
          if (CB.stock && typeof CB.stock.apply === 'function') {
            CB.stock.apply({ model: c.id });
          } else if (CB.state && typeof CB.state.set === 'function') {
            CB.state.set('shape', c.id);
          }
        }
      } catch (e) {}
      showToast(c.name + ' Equipped', '🏎️');
    }

    /* Mode Selection and Launcher */
    function selectMode(card, modeKey) {
      selectedMode = modeKey || 'race';
      rlHaptic('select');
      rlPlaySound('select');
      document.querySelectorAll('#rl-app .mode-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
    }

    function launchSelectedMode(overrideMode) {
      rlHaptic('cta');
      var mode = overrideMode || selectedMode || 'race';
      showToast('Launching ' + mode.toUpperCase() + '...', '🏎️');
      setTimeout(function() {
        enterRaceSession(mode);
      }, 300);
    }

    function openSocialModal(type) {
      rlHaptic('tap');
      var overlay = document.getElementById('rk-modal-overlay');
      var titleEl = document.getElementById('rk-modal-title');
      var iconEl = document.getElementById('rk-modal-icon');
      var bodyEl = document.getElementById('rk-modal-body');
      if (!overlay || !bodyEl) return;

      var titles = {
        chat: { title: 'PADDOCK LOBBY CHAT', icon: '💬' },
        friends: { title: 'RIVAL DRIVERS & FRIENDS', icon: '👥' },
        messages: { title: 'TEAM INBOX & ALERTS', icon: '✉️' },
        clan: { title: 'MOTORSPORT CLAN · BANGLADESH', icon: '🏁' },
        rewards: { title: 'DAILY LOGIN REWARDS', icon: '🎁' },
        wallet: { title: 'BANK & CREDITS STORE', icon: '💳' }
      };

      var meta = titles[type] || { title: 'SERVICE PORTAL', icon: '🌐' };
      if (titleEl) titleEl.textContent = meta.title;
      if (iconEl) iconEl.textContent = meta.icon;

      if (type === 'chat') {
        bodyEl.innerHTML = '<div class="rk-chat-feed" id="rk-chat-feed">' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">SpeedDemon:</span>Anyone up for downhill drift on Mountain Pass?</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">ApexHunter:</span>Just beat the 01:22 lap record on Dhaka GP!</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">TurboDrift:</span>The GR Supra with Stage 2 turbo feels incredible.</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">RedlineDev:</span>Server connection 100% active. Offline cache verified.</div>' +
          '</div>' +
          '<div class="rk-chat-input-row">' +
          '<input type="text" class="rk-chat-input" id="rk-chat-inp" placeholder="Send paddock message..." onkeydown="if(event.key===\\'Enter\\')sendChatMessage()">' +
          '<button class="rk-chat-send" onclick="sendChatMessage()">SEND</button>' +
          '</div>';
      } else if (type === 'friends') {
        bodyEl.innerHTML = '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Tamim_Apex</span><span class="rk-list-status online">● Online · Dhaka GP</span></div>' +
          '<button class="rk-action-pill primary" onclick="showToast(\\'Invite sent to Tamim_Apex\\', \\'🏎️\\')">INVITE</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Rahat_DriftKing</span><span class="rk-list-status online">● Online · In Garage</span></div>' +
          '<button class="rk-action-pill primary" onclick="showToast(\\'Invite sent to Rahat_DriftKing\\', \\'🏎️\\')">INVITE</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Speedy_Jubayer</span><span class="rk-list-status">● Offline 2h ago</span></div>' +
          '<button class="rk-action-pill" onclick="showToast(\\'Profile pinged\\', \\'🔔\\')">POKE</button>' +
          '</div>';
      } else if (type === 'messages') {
        bodyEl.innerHTML = '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Season 3 Pro Sponsor Payout</span><span class="rk-list-status">+25,000 CR available</span></div>' +
          '<button class="rk-action-pill primary" onclick="claimBonusCredits(25000, this)">CLAIM</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Clean Drift Challenge Bonus</span><span class="rk-list-status">+15,000 CR available</span></div>' +
          '<button class="rk-action-pill primary" onclick="claimBonusCredits(15000, this)">CLAIM</button>' +
          '</div>';
      } else if (type === 'clan') {
        bodyEl.innerHTML = '<div style="background:rgba(255,42,75,0.08);padding:12px;border-radius:8px;border:1px solid rgba(255,42,75,0.2);display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
          '<div style="font-size:15px;font-weight:800;color:#fff;">RACING KINGDOM BD</div>' +
          '<div style="font-size:11px;color:#ff6b84;">Rank #3 · 48/50 Drivers · Lvl 14 Club</div>' +
          '</div>' +
          '<span style="font-size:24px;">👑</span>' +
          '</div>' +
          '<div class="rk-list-row" style="margin-top:8px;">' +
          '<div class="rk-list-col"><span class="rk-list-name">Daily Clan Check-in</span><span class="rk-list-status">Earn +5,000 CR for your team</span></div>' +
          '<button class="rk-action-pill primary" onclick="claimBonusCredits(5000, this)">CHECK IN</button>' +
          '</div>';
      } else if (type === 'rewards') {
        bodyEl.innerHTML = '<div style="font-size:12px;color:#aaa;">Log in consecutively each day to claim exclusive automotive rewards and rare chassis blueprints:</div>' +
          '<div class="rk-reward-grid">' +
          '<div class="rk-reward-card"><span class="rk-reward-day">DAY 1</span><span style="font-size:18px;">💰</span><span class="rk-reward-val">10K CR</span></div>' +
          '<div class="rk-reward-card"><span class="rk-reward-day">DAY 2</span><span style="font-size:18px;">⚡</span><span class="rk-reward-val">NITRO</span></div>' +
          '<div class="rk-reward-card"><span class="rk-reward-day">DAY 3</span><span style="font-size:18px;">💰</span><span class="rk-reward-val">25K CR</span></div>' +
          '<div class="rk-reward-card active"><span class="rk-reward-day" style="color:#ff4767;">DAY 4</span><span style="font-size:18px;">🏆</span><span class="rk-reward-val">50K CR</span></div>' +
          '</div>' +
          '<button class="rk-claim-cta" id="rk-claim-btn" onclick="claimDailyReward(50000)">CLAIM 50,000 CR</button>';
      } else if (type === 'wallet') {
        bodyEl.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
          '<div style="background:rgba(255,255,255,0.04);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);text-align:center;">' +
          '<div style="font-size:11px;color:#888;">RACING CREDITS</div>' +
          '<div style="font-size:18px;font-weight:900;color:#ffcc00;margin:4px 0;"><span id="modal-rk-cr">148,000</span> CR</div>' +
          '<button class="rk-action-pill primary" style="width:100%;margin-top:6px;" onclick="claimBonusCredits(10000, this)">+10K FREE</button>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.04);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);text-align:center;">' +
          '<div style="font-size:11px;color:#888;">PREMIUM CASH</div>' +
          '<div style="font-size:18px;font-weight:900;color:#22c55e;margin:4px 0;">$682</div>' +
          '<button class="rk-action-pill" style="width:100%;margin-top:6px;" onclick="showToast(\\'Free Gold Booster Refilled\\', \\'✨\\')">BOOSTER</button>' +
          '</div>' +
          '</div>';
      }
      overlay.classList.add('open');
    }

    function closeGameModal(e) {
      var overlay = document.getElementById('rk-modal-overlay');
      if (overlay) overlay.classList.remove('open');
    }

    function openRewardsModal() {
      openSocialModal('rewards');
    }

    function sendChatMessage() {
      var inp = document.getElementById('rk-chat-inp');
      var feed = document.getElementById('rk-chat-feed');
      if (inp && inp.value.trim() && feed) {
        var div = document.createElement('div');
        div.className = 'rk-chat-msg';
        div.innerHTML = '<span class="rk-chat-sender">PlayerOne:</span>' + inp.value.trim().replace(/</g, '&lt;');
        feed.appendChild(div);
        feed.scrollTop = feed.scrollHeight;
        inp.value = '';
        showToast('Message sent to paddock lobby', '💬');
      }
    }

    function claimBonusCredits(amt, btn) {
      if (btn) {
        btn.textContent = 'CLAIMED';
        btn.disabled = true;
        btn.classList.remove('primary');
      }
      var crEl = document.getElementById('topbar-credits');
      if (crEl) {
        var cur = parseInt(crEl.textContent.replace(/[^0-9]/g, ''), 10) || 148000;
        cur += amt;
        crEl.textContent = cur.toLocaleString();
      }
      showToast('+' + amt.toLocaleString() + ' Credits Added!', '💰');
    }

    function claimDailyReward(amt) {
      var btn = document.getElementById('rk-claim-btn');
      if (btn) {
        btn.textContent = 'REWARD CLAIMED ✓';
        btn.disabled = true;
        btn.style.opacity = '0.5';
      }
      claimBonusCredits(amt);
    }

    function launchCarRace() {
      rlHaptic('cta');
      showToast('Starting 3D Race...', '🏁');
      setTimeout(function() {
        enterRaceSession('race');
      }, 300);
    }

    function enterRaceSession(routeId) {
      var mode = routeId || selectedMode || 'race';
      document.documentElement.classList.add('rl-in-session');
      var app = document.getElementById('rl-app');
      if (app) app.style.display = 'none';

      try {
        var c = CARS[currentCar];
        if (c && typeof CB !== 'undefined' && CB.stock && typeof CB.stock.apply === 'function') {
          CB.stock.apply({ model: c.id });
        }
      } catch (e) {}

      // Instant 3D launch directly to route with ?quick=1 (no washed-out white screen!)
      window.location.hash = '#/' + mode + '?quick=1';
    }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Replaced button block in build_ui2.js!")
else:
    print("Old block not matched in build_ui2.js!")

# Also add window.showToast, window.closeGameModal, window.sendChatMessage, window.claimBonusCredits, window.claimDailyReward
window_exports = """  window.showToast = function(m, i) { if (typeof showToast === 'function') showToast(m, i); };
  window.closeGameModal = function(e) { if (typeof closeGameModal === 'function') closeGameModal(e); };
  window.sendChatMessage = function() { if (typeof sendChatMessage === 'function') sendChatMessage(); };
  window.claimBonusCredits = function(a, b) { if (typeof claimBonusCredits === 'function') claimBonusCredits(a, b); };
  window.claimDailyReward = function(a) { if (typeof claimDailyReward === 'function') claimDailyReward(a); };
"""

if 'window.showToast' not in content:
    content = content.replace("window.openRewardsModal = function() { if (_openRewardsModal) _openRewardsModal(); };", "window.openRewardsModal = function() { if (_openRewardsModal) _openRewardsModal(); };\n" + window_exports)

# Also update navTo to toggle .has-subscreen on #rl-app
content = content.replace(
    "function navTo(screenId) {",
    "function navTo(screenId) {\n      var app = document.getElementById('rl-app');\n      if (app) app.classList.toggle('has-subscreen', screenId !== 'home');\n"
)

# Also replace applyCustomization alert with showToast
content = content.replace(
    "alert('Modifications applied. Real profile credits updated.');",
    "showToast('Livery & Tuning Upgrades Applied', '✨');"
)

# Add hashchange listener to return to UI v2 if back button pressed
hashchange_listener = """
    // Hashchange listener to synchronize UI v2 visibility and direct subscreen routing
    window.addEventListener('hashchange', function() {
      var h = (window.location.hash || '').replace(/^#\\/?/, '');
      var baseRoute = h.split('?')[0];
      var raceModes = ['race', 'drift', 'arcade', 'derby', 'drag', 'f1', 'career', 'multiplayer', 'timetrial'];
      var isRace = raceModes.indexOf(baseRoute) !== -1;
      var app = document.getElementById('rl-app');

      if (isRace) {
        document.documentElement.classList.add('rl-in-session');
        if (app) app.style.display = 'none';
      } else {
        document.documentElement.classList.remove('rl-in-session');
        if (app) app.style.display = 'flex';
        if (baseRoute === 'garage') navTo('garage');
        else if (baseRoute === 'modes') navTo('modes');
        else if (baseRoute === 'customize') navTo('customize');
        else if (baseRoute === 'settings') navTo('settings');
        else if (baseRoute === 'hub' || baseRoute === '' || baseRoute === 'home') navTo('home');
      }
    });
"""

if "Hashchange listener to synchronize UI v2" not in content:
    content = content.replace("// Listen to router route changes to restore UI v2 on return from race", hashchange_listener + "\n    // Listen to router route changes to restore UI v2 on return from race")

with open('build_ui2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated build_ui2.js successfully!")
