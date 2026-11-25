import os

with open('build_ui2.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the innerHTML block for social modal with clean unquoted helper calls
old_social_block = """      if (type === 'chat') {
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
      }"""

new_social_block = """      if (type === 'chat') {
        bodyEl.innerHTML = '<div class="rk-chat-feed" id="rk-chat-feed">' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">SpeedDemon:</span>Anyone up for downhill drift on Mountain Pass?</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">ApexHunter:</span>Just beat the 01:22 lap record on Dhaka GP!</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">TurboDrift:</span>The GR Supra with Stage 2 turbo feels incredible.</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">RedlineDev:</span>Server connection 100% active. Offline cache verified.</div>' +
          '</div>' +
          '<div class="rk-chat-input-row">' +
          '<input type="text" class="rk-chat-input" id="rk-chat-inp" placeholder="Send paddock message..." onkeydown="if(event.keyCode===13)sendChatMessage()">' +
          '<button class="rk-chat-send" onclick="sendChatMessage()">SEND</button>' +
          '</div>';
      } else if (type === 'friends') {
        bodyEl.innerHTML = '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Tamim_Apex</span><span class="rk-list-status online">● Online · Dhaka GP</span></div>' +
          '<button class="rk-action-pill primary" onclick="inviteFriend(1)">INVITE</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Rahat_DriftKing</span><span class="rk-list-status online">● Online · In Garage</span></div>' +
          '<button class="rk-action-pill primary" onclick="inviteFriend(2)">INVITE</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Speedy_Jubayer</span><span class="rk-list-status">● Offline 2h ago</span></div>' +
          '<button class="rk-action-pill" onclick="pokeFriend(3)">POKE</button>' +
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
          '<button class="rk-action-pill" style="width:100%;margin-top:6px;" onclick="refillBooster()">BOOSTER</button>' +
          '</div>' +
          '</div>';
      }"""

if old_social_block in text:
    text = text.replace(old_social_block, new_social_block)
    print("Replaced social modal block with clean syntax!")
else:
    print("Could not match old_social_block exactly!")

# Add helper functions inviteFriend, pokeFriend, refillBooster
helpers = """
    function inviteFriend(id) {
      var name = id === 1 ? 'Tamim_Apex' : 'Rahat_DriftKing';
      showToast('Invite sent to ' + name, '🏎️');
    }
    function pokeFriend(id) {
      showToast('Profile pinged', '🔔');
    }
    function refillBooster() {
      showToast('Free Gold Booster Refilled', '✨');
    }
"""

if 'function inviteFriend' not in text:
    text = text.replace("function openSocialModal(type) {", helpers + "\n    function openSocialModal(type) {")
    # Also attach to window
    text = text.replace(
        "window.claimDailyReward = function(a) { if (typeof claimDailyReward === 'function') claimDailyReward(a); };",
        "window.claimDailyReward = function(a) { if (typeof claimDailyReward === 'function') claimDailyReward(a); };\n  window.inviteFriend = function(id) { if (typeof inviteFriend === 'function') inviteFriend(id); };\n  window.pokeFriend = function(id) { if (typeof pokeFriend === 'function') pokeFriend(id); };\n  window.refillBooster = function() { if (typeof refillBooster === 'function') refillBooster(); };"
    )

with open('build_ui2.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated build_ui2.js with quote-safe handlers!")
