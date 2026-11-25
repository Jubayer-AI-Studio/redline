import re
import os

mockup_path = 'mockup_realistic.html'
with open(mockup_path, 'r', encoding='utf-8') as f:
    text = f.read()

target = """function openSocialModal(type) {
      const titles = {
        chat: 'LOBBY CHAT',
        friends: 'DRIVERS & FRIENDS',
        messages: 'INBOX NOTIFICATIONS (9+)',
        clan: 'MOTORSPORT CLAN',
        rewards: 'DAILY REWARDS (2 CLAIMABLE)'
      };
      alert('[' + (titles[type] || type.toUpperCase()) + '] Live service connection active.');
    }
    function openRewardsModal() {
      openSocialModal('rewards');
    }

    function launchSelectedMode(overrideMode) {
      if (overrideMode) selectedMode = overrideMode;
      alert('Launching competition discipline: ' + selectedMode.toUpperCase() + ' with ' + CARS[currentCar].name);
    }

    function launchCarRace() {
      alert('Launching Grand Prix Sprint with active car: ' + CARS[currentCar].name);
    }"""

replacement = """function showToast(msg, icon) {
      const toast = document.getElementById('rk-game-toast');
      const msgEl = document.getElementById('rk-toast-msg');
      const icoEl = document.getElementById('rk-toast-ico');
      if (toast && msgEl) {
        msgEl.textContent = msg;
        if (icoEl && icon) icoEl.textContent = icon;
        toast.classList.add('show');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2600);
      }
    }

    function openSocialModal(type) {
      const overlay = document.getElementById('rk-modal-overlay');
      const titleEl = document.getElementById('rk-modal-title');
      const iconEl = document.getElementById('rk-modal-icon');
      const bodyEl = document.getElementById('rk-modal-body');
      if (!overlay || !bodyEl) return;

      const titles = {
        chat: { title: 'PADDOCK LOBBY CHAT', icon: '💬' },
        friends: { title: 'RIVAL DRIVERS & FRIENDS', icon: '👥' },
        messages: { title: 'TEAM INBOX & ALERTS', icon: '✉️' },
        clan: { title: 'MOTORSPORT CLAN · BANGLADESH', icon: '🏁' },
        rewards: { title: 'DAILY LOGIN REWARDS', icon: '🎁' },
        wallet: { title: 'BANK & CREDITS STORE', icon: '💳' }
      };

      const meta = titles[type] || { title: 'SERVICE PORTAL', icon: '🌐' };
      titleEl.textContent = meta.title;
      iconEl.textContent = meta.icon;

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
      const overlay = document.getElementById('rk-modal-overlay');
      if (overlay) overlay.classList.remove('open');
    }

    function openRewardsModal() {
      openSocialModal('rewards');
    }

    function sendChatMessage() {
      const inp = document.getElementById('rk-chat-inp');
      const feed = document.getElementById('rk-chat-feed');
      if (inp && inp.value.trim() && feed) {
        const div = document.createElement('div');
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
      const crEl = document.getElementById('topbar-credits');
      if (crEl) {
        let cur = parseInt(crEl.textContent.replace(/[^0-9]/g, ''), 10) || 148000;
        cur += amt;
        crEl.textContent = cur.toLocaleString();
      }
      showToast('+' + amt.toLocaleString() + ' Credits Added!', '💰');
    }

    function claimDailyReward(amt) {
      const btn = document.getElementById('rk-claim-btn');
      if (btn) {
        btn.textContent = 'REWARD CLAIMED ✓';
        btn.disabled = true;
        btn.style.opacity = '0.5';
      }
      claimBonusCredits(amt);
    }

    function launchSelectedMode(overrideMode) {
      const mode = overrideMode || selectedMode || 'race';
      showToast('Launching ' + mode.toUpperCase() + '...', '🏎️');
      setTimeout(function() {
        if (window.location.pathname.endsWith('mockup_realistic.html')) {
          window.location.href = 'index.html#/' + mode + '?quick=1';
        } else {
          window.location.hash = '#/' + mode + '?quick=1';
        }
      }, 350);
    }

    function launchCarRace() {
      showToast('Starting 3D Race...', '🏁');
      setTimeout(function() {
        if (window.location.pathname.endsWith('mockup_realistic.html')) {
          window.location.href = 'index.html#/race?quick=1';
        } else {
          window.location.hash = '#/race?quick=1';
        }
      }, 350);
    }"""

if target in text:
    text = text.replace(target, replacement)
    text = text.replace("alert('Selected ' + CARS[currentCar].name + ' as active vehicle.');", "showToast(CARS[currentCar].name + ' Equipped', '🏎️');")
    text = text.replace("alert('Modifications applied. Real profile credits updated.');", "showToast('Livery & Tuning Upgrades Applied', '✨');")
    text = text.replace("function navTo(screenId) {", "function navTo(screenId) {\n      const app = document.getElementById('app') || document.getElementById('rl-app');\n      if (app) app.classList.toggle('has-subscreen', screenId !== 'home');\n")

    with open(mockup_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully replaced alerts with live modals and toasts in mockup_realistic.html!")
else:
    print("Target block was not matched!")
