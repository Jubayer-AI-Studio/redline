import re
import os

ROOT = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else '.'
mockup_file = os.path.join(ROOT, 'mockup_realistic.html')

with open(mockup_file, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ENHANCE CSS: Subscreen backdrop, modals, and toasts
modal_css = """
    /* Sleek Atmospheric Carbon Subscreens (No Black Voids) */
    .screen {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-fast) ease;
      background: radial-gradient(circle at 50% 30%, rgba(15, 20, 32, 0.78) 0%, rgba(7, 9, 14, 0.94) 100%);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    #screen-home {
      background: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }

    /* Ambient Workshop Lighting Behind Subscreens */
    .studio-stage {
      transition: filter 0.3s ease, transform 0.3s ease;
    }
    .has-subscreen .studio-stage {
      filter: brightness(0.42) blur(12px);
      transform: scale(1.03);
    }

    /* Interactive AAA In-Game Game Modal */
    .rk-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: rkFadeIn 0.2s ease;
    }
    .rk-modal-overlay.open {
      display: flex;
    }
    .rk-modal-dialog {
      background: linear-gradient(145deg, #161922 0%, #0d0f15 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 2px solid var(--accent-red, #ff2a4b);
      border-radius: 12px;
      width: 100%;
      max-width: 520px;
      max-height: 85vh;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 42, 75, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: rkPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rk-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }
    .rk-modal-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .rk-modal-icon {
      font-size: 20px;
    }
    .rk-modal-title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #fff;
      text-transform: uppercase;
      margin: 0;
    }
    .rk-modal-close {
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      transition: background 0.15s ease;
    }
    .rk-modal-close:hover {
      background: var(--accent-red, #ff2a4b);
    }
    .rk-modal-body {
      padding: 16px 18px;
      overflow-y: auto;
      font-size: 13px;
      color: #ccc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Modal Content Specifics */
    .rk-chat-feed {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 260px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .rk-chat-msg {
      background: rgba(255, 255, 255, 0.04);
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 3px solid var(--accent-red, #ff2a4b);
      font-size: 12px;
    }
    .rk-chat-sender {
      font-weight: 800;
      color: #ff4767;
      margin-right: 6px;
    }
    .rk-chat-input-row {
      display: flex;
      gap: 8px;
      margin-top: 6px;
    }
    .rk-chat-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      padding: 8px 12px;
      color: #fff;
      font-size: 12px;
      outline: none;
    }
    .rk-chat-send {
      background: var(--accent-red, #ff2a4b);
      color: #fff;
      border: none;
      padding: 0 16px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
    }

    /* Friend / Clan / Rewards Rows */
    .rk-list-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.04);
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .rk-list-col {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rk-list-name {
      font-weight: 700;
      color: #fff;
      font-size: 13px;
    }
    .rk-list-status {
      font-size: 11px;
      color: #888;
    }
    .rk-list-status.online {
      color: #10b981;
    }
    .rk-action-pill {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .rk-action-pill:hover, .rk-action-pill.primary {
      background: var(--accent-red, #ff2a4b);
      border-color: var(--accent-red, #ff2a4b);
      color: #fff;
    }

    /* Reward Calendar Cards */
    .rk-reward-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .rk-reward-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 12px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
    }
    .rk-reward-card.active {
      background: linear-gradient(135deg, rgba(255, 42, 75, 0.25) 0%, rgba(20, 24, 36, 0.8) 100%);
      border-color: var(--accent-red, #ff2a4b);
      box-shadow: 0 0 15px rgba(255, 42, 75, 0.2);
    }
    .rk-reward-day {
      font-size: 10px;
      font-weight: 800;
      color: #888;
      text-transform: uppercase;
    }
    .rk-reward-val {
      font-size: 12px;
      font-weight: 800;
      color: #fff;
    }
    .rk-claim-cta {
      width: 100%;
      background: linear-gradient(90deg, #ff2a4b 0%, #ff5e3a 100%);
      color: #fff;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 1px;
      cursor: pointer;
      text-transform: uppercase;
      box-shadow: 0 4px 18px rgba(255, 42, 75, 0.4);
      margin-top: 8px;
    }

    /* In-Game Animated Toast */
    .rk-game-toast {
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%) translateY(-30px);
      background: rgba(14, 17, 24, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 4px solid var(--accent-red, #ff2a4b);
      border-radius: 8px;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 100000;
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rk-game-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .rk-toast-ico {
      font-size: 16px;
    }
    .rk-toast-msg {
      color: #fff;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.5px;
    }

    @keyframes rkFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes rkPopIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
"""

# Replace the simple .screen definition with our rich atmospheric definition
old_screen_css = """.screen {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-fast) ease;
    }

    .screen.active {
      opacity: 1;
      pointer-events: auto;
    }"""

if old_screen_css in html:
    html = html.replace(old_screen_css, modal_css + """
    .screen.active {
      opacity: 1;
      pointer-events: auto;
    }""")
else:
    # Append before </style>
    html = html.replace('</style>', modal_css + '\n</style>')

# 2. Add Modal & Toast HTML before the end of #app
modal_html = """
    <!-- Interactive In-Game Social & Rewards Modal -->
    <div class="rk-modal-overlay" id="rk-modal-overlay" onclick="closeGameModal(event)">
      <div class="rk-modal-dialog" onclick="event.stopPropagation()">
        <header class="rk-modal-header">
          <div class="rk-modal-title-row">
            <span class="rk-modal-icon" id="rk-modal-icon">🏆</span>
            <h3 class="rk-modal-title" id="rk-modal-title">DAILY REWARDS</h3>
          </div>
          <button class="rk-modal-close" onclick="closeGameModal()" title="Close">✕</button>
        </header>
        <div class="rk-modal-body" id="rk-modal-body">
          <!-- Dynamic Content -->
        </div>
      </div>
    </div>

    <!-- In-Game Animated Toast Notification -->
    <div class="rk-game-toast" id="rk-game-toast">
      <span class="rk-toast-ico" id="rk-toast-ico">🏎️</span>
      <span class="rk-toast-msg" id="rk-toast-msg">Vehicle Equipped</span>
    </div>
"""

# Inject before </div>\n  </div>\n\n  <script>
if '<div class="rk-modal-overlay"' not in html:
    html = re.sub(r'(<\/div>\s*<\/div>\s*<script>)', modal_html + r'\n\1', html, count=1)

# 3. Wire all buttons to direct action functions:
# Pink Race CTA button
html = html.replace('onclick="navTo(\'modes\')" id="cta-race"', 'onclick="launchCarRace()" id="cta-race"')
html = html.replace('onclick="navTo(\'modes\')" id="cmd-store"', 'onclick="openSocialModal(\'wallet\')" id="cmd-store"')

# Event Cards on Left Stack:
html = html.replace('<div class="rk-card-hero" onclick="navTo(\'modes\')"', '<div class="rk-card-hero" onclick="launchSelectedMode(\'race\')"')
html = html.replace('<div class="rk-card-mini" onclick="navTo(\'modes\')" title="BMW M4 Challenge"', '<div class="rk-card-mini" onclick="launchSelectedMode(\'arcade\')" title="BMW M4 Challenge"')
html = html.replace('<div class="rk-card-mini" onclick="navTo(\'modes\')" title="Drift King Championship"', '<div class="rk-card-mini" onclick="launchSelectedMode(\'drift\')" title="Drift King Championship"')

# Topbar headers:
html = html.replace('id="top-showroom-center"', 'id="top-showroom-center" onclick="navTo(\'garage\')" style="cursor:pointer;" title="Choose Vehicle"')
html = html.replace('class="rk-synergy-box"', 'class="rk-synergy-box" onclick="openRewardsModal()" style="cursor:pointer;" title="Synergy Bonus"')
html = html.replace('class="rk-currency-cluster"', 'class="rk-currency-cluster" onclick="openSocialModal(\'wallet\')" style="cursor:pointer;" title="Credits & Cash"')

with open(mockup_file, 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated mockup_realistic.html successfully!')
