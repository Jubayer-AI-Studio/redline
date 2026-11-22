# REDLINE UI/UX DESIGN SYSTEM SPECIFICATION (v2.0)
**Architectural Blueprint: Premium Mobile-First (Landscape) Racing Game UI**
*Reference implementation for Redline / As-Sunnah Skill Development Institute*

---

## 1. Executive Summary & Vision

Redline is evolving from a desktop-centric car builder and multi-screen hub into a unified, AAA mobile-first racing experience inspired by modern mobile flagships (CSR Racing 2, Asphalt 9/Legends, Forza Horizon, Need for Speed Heat) while retaining **100% feature parity**, zero rewritten physics, all 53 cars, career progressions, and save data.

### Core Pillars
1. **Landscape-First Fixed Shell (`100dvh`)**: Zero vertical browser/page scrolling across the entire application. All lists, grids, and selections use horizontal scroll-snap carousels or contained modal viewports.
2. **3D Turntable Showroom Foundation**: The 3D car asset sits as the physical centerpiece behind fluid glass/carbon panels in Home, Garage, and Customize.
3. **Ergonomic Touch Ergonomics**: Minimum touch targets >= 48px, edge-anchored navigation thumb zones, safe-area inset compliance for notches and home indicators.
4. **Bilingual Parity**: Seamless instantaneous toggling between English and Bangla (বাংলা) with layout-tested expansion resilience (no text clipping or truncation).
5. **GPU-Accelerated 60 FPS Micro-Interactions**: Strictly `transform` and `opacity` transitions with full `prefers-reduced-motion` compliance.

---

## 2. Design Tokens

### 2.1 Color Palette

```css
:root {
  /* Surface & Base - Carbon / Asphalt Dark Matrix */
  --rl-bg-void:          #08090b;       /* Pure void backdrop for 3D stage */
  --rl-bg-surface:       #111318;       /* Deep asphalt foundation */
  --rl-bg-elevated:      #181b22;       /* Elevated cards and sidebars */
  --rl-bg-card:          rgba(28, 32, 42, 0.72); /* Glass carbon panel */
  --rl-bg-glass:         rgba(18, 20, 26, 0.65); /* Frosted HUD elements */
  --rl-bg-glass-heavy:   rgba(12, 14, 18, 0.88); /* Heavy frosted backdrop */

  /* Primary Brand Accent - "Redline" Red */
  --rl-accent-red:       #e0412f;       /* Signature competition red */
  --rl-accent-red-bright:#ff4d38;       /* Hover / active highlights */
  --rl-accent-red-glow:  rgba(224, 65, 47, 0.45); /* Neon brake / rpm glow */
  --rl-accent-red-dark:  #942417;       /* Pressed state / shadows */

  /* Secondary Accent - Racing Gold / Amber */
  --rl-accent-gold:      #c9a56b;       /* Trophies, currencies, VIP tiers */
  --rl-accent-gold-glow: rgba(201, 165, 107, 0.40);
  --rl-accent-gold-dark: #826639;

  /* Electric Telemetry Accent - Cyan / Nitro */
  --rl-accent-cyan:      #00e5ff;       /* NOS, electric powertrains, delta bests */
  --rl-accent-cyan-glow: rgba(0, 229, 255, 0.35);

  /* Performance Stat Deltas */
  --rl-delta-positive:   #10b981;       /* Green improvement stat */
  --rl-delta-negative:   #ef4444;       /* Red penalty stat */

  /* Tier & Rarity Progression */
  --rl-tier-common:      #9ca3af;       /* Tier 1 / Stock */
  --rl-tier-rare:        #38bdf8;       /* Tier 2 / Street */
  --rl-tier-epic:        #a855f7;       /* Tier 3 / Pro Sport */
  --rl-tier-legendary:   #f59e0b;       /* Tier 4 / Supercar / Race Spec */

  /* Text & Typography */
  --rl-text-primary:     #f9fafb;       /* High contrast white */
  --rl-text-secondary:   #9ca3af;       /* Mid-tone subtitle / specs */
  --rl-text-muted:       #6b7280;       /* Footers, inactive labels */
  --rl-text-inverted:    #090a0d;       /* Text on solid red CTA */

  /* Borders & Dividers */
  --rl-border-subtle:    rgba(255, 255, 255, 0.08);
  --rl-border-medium:    rgba(255, 255, 255, 0.16);
  --rl-border-focus:     #e0412f;
}
```

### 2.2 Typography Scale

- **Display Headline Font**: `Rajdhani, Exo 2, Orbitron, system-ui, sans-serif` (Aggressive condensed italic display weights: 600, 700, 800)
- **Body & Numerical Font**: `Inter, Hind Siliguri, Segoe UI, system-ui, sans-serif` (Ultra-clean legibility for specs, HUD digits, and Bengali script)

| Level | Size | Weight / Style | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display XXL** | 44px / 2.75rem | 800 Italic Uppercase | 1.05 | +0.06em | Hero Mode Title, Big Speedometer |
| **Display XL** | 32px / 2.0rem | 700 Italic Uppercase | 1.10 | +0.04em | Screen Titles, Car Name Hero |
| **Display L** | 24px / 1.5rem | 700 Italic Uppercase | 1.15 | +0.04em | Card Headers, Gear Indicator |
| **Display M** | 18px / 1.125rem | 600 Italic Uppercase | 1.20 | +0.03em | Section Titles, CTA Labels |
| **Body Bold** | 15px / 0.9375rem | 600 Normal | 1.30 | 0.00em | Stat Bar Values, Price Badges |
| **Body Regular** | 13px / 0.8125rem | 400 Normal | 1.35 | 0.00em | Descriptions, Explanatory Text |
| **Caption / Micro** | 11px / 0.6875rem | 500 Uppercase | 1.20 | +0.05em | Category Tags, Tier Badges |
| **HUD Digits** | 22-48px | 800 Tabular Monospace | 1.00 | -0.02em | Speed, Lap Timer, Split Deltas |

### 2.3 Spacing & Rhythm (8px Matrix)

```css
:root {
  --rl-space-1:   4px;
  --rl-space-2:   8px;
  --rl-space-3:  12px;
  --rl-space-4:  16px;
  --rl-space-5:  20px;
  --rl-space-6:  24px;
  --rl-space-8:  32px;
  --rl-space-10: 40px;
  --rl-space-12: 48px;  /* Minimum touch target baseline */
  --rl-space-16: 64px;
}
```

### 2.4 Safe-Area Insets (Mandatory on Mobile Landscape)

```css
:root {
  --rl-safe-top:    env(safe-area-inset-top, 0px);
  --rl-safe-right:  env(safe-area-inset-right, 16px);
  --rl-safe-bottom: env(safe-area-inset-bottom, 8px);
  --rl-safe-left:   env(safe-area-inset-left, 16px);
}
```

### 2.5 Geometry, Chamfers & Skew Cuts

Racing aesthetics demand aggressive diagonal styling:
- **Skewed Ribbon / CTA**: `transform: skewX(-12deg);` with inner child `transform: skewX(12deg);`
- **Angled Card Chamfer**: `clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);`
- **Beveled Corner Badges**: `clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);`
- **Standard Card Radius**: `border-radius: 10px;` (for soft glass containers)
- **Action Pill Radius**: `border-radius: 9999px;`

### 2.6 Shadows & Neon Glows

```css
:root {
  --rl-shadow-card:     0 8px 32px rgba(0, 0, 0, 0.65);
  --rl-shadow-elevated: 0 12px 48px rgba(0, 0, 0, 0.85);
  --rl-glow-red:        0 0 24px rgba(224, 65, 47, 0.55);
  --rl-glow-gold:       0 0 20px rgba(201, 165, 107, 0.45);
  --rl-glow-cyan:       0 0 20px rgba(0, 229, 255, 0.40);
}
```

### 2.7 Motion Tokens & Performance Rules

- **Standard Duration**: `200ms` for interactions, `350ms` for panel transitions, `500ms` for camera easing.
- **Timing Function**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy out-expo curve for responsive game feel).
- **Rule**: ONLY animate `transform` and `opacity`. Never animate `width`, `height`, `left`, `margin`, or `filter` on mobile hot paths.
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, set durations to `0.01ms` and disable auto-turntable spinning.

---

## 3. Core Component Library

### 3.1 Left Navigation Rail (`.rl-nav-rail`)
- **Location**: Docked on the left side of the screen inside `--rl-safe-left`.
- **Purpose**: Fast thumb switching between primary destinations: Home, Modes, Garage, Career, Customization, Settings.
- **Specifications**:
  - Width: `68px`
  - Targets: `48px x 48px` circular/rounded icons
  - States: Default (40% opacity), Hover/Active (100% opacity, red active bar indicator `width: 4px`, red glow).

### 3.2 Top Currency & Profile Bar (`.rl-top-bar`)
- **Location**: Pinned along the top safe area.
- **Contents**:
  - **Left**: Institute brand mark ("REDLINE | AS-SUNNAH") and back button (when in sub-screens).
  - **Center-Right**: Driver level chip (e.g. `LVL 18` with subtle gold ring progress).
  - **Right**: Dual currency chips:
    - **Credits ($CR)**: Primary in-game soft currency (e.g. `$425,800 CR`).
    - **Gold / Tokens**: Premium race tokens (e.g. `1,250 ✪`).

### 3.3 Large Skewed Primary Action Button (`.rl-btn-primary`)
- **Appearance**: Skewed parallelogram with signature Redline red gradient, bold condensed italic type, high-contrast inverted text, subtle forward directional chevron.
- **Dimensions**: Min height `52px`, min width `180px`.
- **Haptics**: Triggers `navigator.vibrate(25)` where supported.

### 3.4 Swipeable Mode Selection Carousel (`.rl-carousel-modes`)
- **Structure**: Horizontal flex track with CSS scroll-snap (`scroll-snap-type: x mandatory`).
- **Cards**:
  - Aspect ratio: `16:9` or `4:3` game art cards.
  - States: Active card enlarged to `scale(1.04)`, active red border glow. Inactive cards at `scale(0.94)` with `opacity: 0.65`.
  - Content: Mode banner, Star progression (e.g. `18/24 ★`), Reward multiplier badge, "ENTER" CTA.
  - Peeking: 25% of adjacent cards peek at screen edges to provide intuitive swipe affordance.

### 3.5 3D Garage Turntable & Stat Panel (`.rl-garage-view`)
- **Background**: Dynamic WebGL turntable showing active vehicle on dark reflective floor with soft radial contact shadow and overhead lighting sweep.
- **Left Panel**: Floating glass card displaying key performance stat meters:
  - **Power**: Horsepower (HP) & kW bar.
  - **Top Speed**: km/h or mph bar.
  - **0-100 km/h**: Sprint acceleration time in seconds.
  - **Grip**: Lateral cornering G-force.
  - **Weight**: Curb weight in kg / lbs.
- **Bottom Car Strip**: Horizontal scrolling thumbnail strip of all 53 cars with tier tags and ownership status.
- **Right Quick Tabs**: Category jump buttons: `[Upgrade]`, `[Tune]`, `[Customize]`, `[Race]`.

### 3.6 Customization Hotspot Pins (`.rl-hotspot-pin`)
- **Interaction**: Floating 3D/2D leader pins pointing to specific car regions:
  - Hotspot 1: Front Wheels / Brakes
  - Hotspot 2: Body Panels / Paint Swatches
  - Hotspot 3: Powertrain / Turbo / Exhaust
  - Hotspot 4: Aero Wing / Splitter
- **Drawer / Bottom Sheet**: Selecting a hotspot slides up a contained horizontal parts drawer featuring:
  - Rarity color coding (Common, Rare, Epic, Legendary).
  - Stat deltas (`+45 HP`, `-12 kg`, `+0.08 G`).
  - Running total price calculation with one-tap "APPLY".

### 3.7 In-Race HUD Cluster (`.rl-race-hud`)
- **Speedometer Cluster (Center-Top / Center-Bottom)**:
  - Large digital speed digits (`214 km/h`).
  - Bold gear indicator (`4`).
  - Arced LED tachometer with multi-color shift points (Green -> Orange -> Redline -> Blue flash).
  - Mini-map overlay with circular track loop and competitor blips.
  - Lap count (`Lap 2/3`) and real-time sector split (+/- 0.34s).
- **Left Controls**: Ergonomic steering zone (large virtual steering wheel or left/right thumb arcs).
- **Right Controls**: Ergonomic stacked vertical pedals:
  - Top: Red-accented progressive Brake pedal.
  - Bottom: Green-accented progressive Throttle / Gas pedal.
- **Top Corners**:
  - Top-Left: Pause / Menu button and Camera perspective toggle.
  - Top-Right: Audio mute button and Quick Settings gear.

### 3.8 Dialogs & Contained Modals (`.rl-dialog`, `.rl-drawer`)
- **Structure**: Centered backdrop modal or sliding bottom-up sheet with heavy blur (`backdrop-filter: blur(16px)`).
- **Use Cases**:
  - Pre-race career briefing & rival breakdown.
  - Multiplayer room code entry & lobby browser.
  - Part purchase confirmation ("Buy & Install").
  - Factory stock reset warning.
- **Specifications**:
  - Header: Skewed title chip with dismiss icon button (>= 48px).
  - Body: Contained viewport with horizontal carousel or scroll-free grid.
  - Actions: Dual button group: Secondary "Cancel" pill + Primary "Confirm" red skewed CTA.

### 3.9 Toast Notifications & Telemetry Banners (`.rl-toast`)
- **Structure**: Floating pill anchored to top-center (beneath top bar safe-area) with slide-down/fade-in animation.
- **Use Cases**:
  - Controller connected / disconnected: `Controller connected · Xbox Wireless Controller`.
  - In-game achievements: `Achievement Unlocked · Apex Predator (+5,000 CR)`.
  - Save sync & cloud backup status.
- **Specifications**:
  - Height: `44px`, horizontal padding `16px`.
  - Border: 1px solid with accent glow (Green for success, Gold for trophy, Red for warning).
  - Auto-dismiss: 3.5 seconds with cubic-bezier out-expo ease.

### 3.10 3D Showroom Quality Architecture & Hardware Tiers
- **Environment Lighting**:
  - CC0 High Dynamic Range Image (HDRI) studio equirectangular map (Poly Haven "Studio Small" CC0 license, or warm warehouse reflection rig).
  - Ambient occlusion contact ground shadow beneath active tire contact patches.
- **Floor Reflections**:
  - High tier: Real-time planar roughness reflection map displaying dynamic car underside and neon underglow.
  - Low tier: Blurry pre-baked directional gradient fake reflection (`scaleY(-0.45)` with linear fade mask).
- **Post-Processing Bloom**:
  - Dual-pass Gaussian threshold bloom enabled **strictly on high-tier hardware**.
  - Luminance threshold: `0.85`, radius: `0.4` for subtle brake calipers and LED light bar bloom without blowing out carbon texture.
- **Paint Finishes (Instant Real-Time Preview)**:
  - **Gloss**: Roughness `0.08`, Metalness `0.10`, Clearcoat `1.0`.
  - **Matte**: Roughness `0.65`, Metalness `0.02`, Clearcoat `0.0`.
  - **Metallic**: Roughness `0.22`, Metalness `0.88`, Clearcoat `0.6`.
  - **Pearl**: Two-tone custom iridescence shader shifting from base red `#e0412f` to amber gold `#c9a56b` along grazing angles.
- **Device Quality Tiering**:
  - **Tier 1 (Flagship / Desktop)**: 60 FPS target, full WebGL PBR, HDRI radiosity, real-time reflection, subtle bloom, full anti-aliasing.
  - **Tier 2 (Mid-range Mobile)**: 60 FPS target, standard PBR, contact shadow, cheap fake floor reflection, bloom disabled.
  - **Tier 3 (Budget / Thermal Throttled)**: 60 FPS target, simplified shading, reduced canvas resolution (0.8x DPR), static studio still.
- **Geometric Ceiling & Weakest Car Models**:
  - **Detailed Models**: Sports, exotics and JDM icons (`mclaren-p1`, `ferrari-sf90-stradale`, `porsche-911-992`, `nissan-skyline-gtr-r34`) feature high-density lofted splines with defined vents, diffusers, and aerodynamic spoilers.
  - **Weakest Models**: Utility and commercial shapes (`mercedes-sprinter-vs30`, `ford-transit-hr`, `tesla-cybertruck`) are constrained by simple polygonal box profiles with minimal exterior curvature and flatter geometric depth.

---

## 4. Comprehensive Feature-to-Screen Mapping

Every single capability present in Redline's codebase (`hub.js`, `router.js`, `app.js`, `garage.js`, `panels-*.js`, `race.js`) is mapped directly to the new architecture. **No feature is lost or deprecated.**

| Legacy Location / Route | Existing Feature / Sub-view | New UI Screen | Presentation & Navigation Placement |
| :--- | :--- | :--- | :--- |
| `router.js` (`#/menu`) | Main menu hub, title screen | **Home Screen** | Full 3D showroom hero, big "PLAY" CTA, Quick Launch cards, top currencies, left nav rail |
| `hub.js` (`career`) | Career tier map, championships | **Career Screen** | Swipeable Championship ladder (Rookie, Clubman, Pro, Masters) with star badges |
| `hub.js` (`briefing`) | Pre-race briefing, rival car info | **Career Briefing** | Contained modal overlay over 3D track view, "Go Racing" primary CTA |
| `hub.js` (`rewards`, `trophies`) | End-of-season awards, trophy shelf | **Career Trophies** | 3D trophy showcase carousel inside Career sub-tab |
| `router.js` (`#/race`) | Quick Race & Custom Race | **Modes -> Race** | Mode carousel card -> Track selector drawer with lap & AI settings |
| `router.js` (`#/drift`) | Drift challenge mode | **Modes -> Drift** | Mode carousel card -> Drift mountain/dock tracks, live drift angle/combo scoring |
| `router.js` (`#/arcade`) | Arcade stunt mode | **Modes -> Arcade** | Mode carousel card -> Stunt arena, ramp jumps, barrel roll score HUD |
| `router.js` (`#/derby`) | Demolition Derby | **Modes -> Derby** | Mode carousel card -> Arena selector, vehicle armor bars, ramming physics |
| `router.js` (`#/drag`) | Drag racing mode | **Modes -> Drag** | Mode carousel card -> 1/4 & 1/2 mile strip, Christmas tree launch lights HUD |
| `router.js` (`#/f1`) | Formula 1 Grand Prix | **Modes -> F1** | Mode carousel card -> Open-wheel cars, tire wear telemetry, DRS zones |
| `hub.js` (`timetrial`) | Time trial vs ghost laps | **Modes -> Time Trial** | Mode carousel card -> Ghost car selector, split delta comparison |
| `endurance.js` | Long-distance endurance racing | **Modes -> Endurance** | Mode carousel card -> Day/night cycle, tire/fuel management |
| `router.js` (`#/multiplayer`) | Online lobbies & room codes | **Modes -> Online** | Mode carousel card -> Room browser drawer, join code input modal |
| `hub.js` (`challenges`) | Daily & weekly challenges | **Modes -> Challenges** | Featured time-limited challenge banners on Mode carousel |
| `router.js` (`#/garage`, `atelier`) | 53-car builder & specs | **Garage Screen** | Central turntable 3D car, 53-car horizontal thumbnail strip, left stat bars |
| `hub.js` (`showroom`) | Car dealership & purchases | **Garage -> Showroom** | 3D vehicle catalog to browse, inspect, and purchase new cars |
| `hub.js` (`workshop`) | Car repair & maintenance | **Garage -> Workshop** | Condition meter (`condition < 0.6`) with instant repair & refresh action |
| `garage.js` (`openPresets`) | Factory and iconic car presets | **Garage -> Presets** | "Presets" button on top bar -> Modal gallery card drawer |
| `garage.js` (`Auto-config`) | Factory stock reset | **Garage -> Stock** | "Factory Stock" pill button in Garage top actions |
| `garage.js` (`Share / Export`) | Build URL share, JSON export | **Garage -> Share** | Share icon button -> Instant copyable link / spec sheet export |
| `panels-powertrain.js` | Engine, turbo, tune, exhaust, fuel | **Customize -> Engine** | Hotspot pin on engine bay -> Powertrain parts selector with dyno power deltas |
| `panels-chassis.js` | Suspension, brakes, tires, ABS, ballast | **Customize -> Chassis** | Hotspot pin on front wheel -> Brakes/suspension slider drawer with grip deltas |
| `panels-style.js` | Paint, swatches, stripes, finish, aero | **Customize -> Paint & Aero** | Hotspot pins on car body & rear wing -> Color wheel & aero spoiler selector |
| `panels-simple.js` | Cabin, seats, trim, audio, rollcage | **Customize -> Interior** | Hotspot pin on windshield/cabin -> Cockpit trim & seat customization |
| `tune.js` | Gearbox ratio sliders, tire pressures | **Tune Screen** | "Tune" tab in Garage -> Interactive sliders for gear ratios and suspension |
| `pricing.js` | Parts valuation & running total | **Customize Footer** | Live running total cost chip with one-tap "Buy & Install" button |
| `hub.js` (`achievements`) | Achievement unlocks & rewards | **Profile -> Achievements** | Achievements drawer accessible via top driver profile chip |
| `hub.js` (`replays`) | Saved race replays & photo mode | **Profile -> Replays** | Replays tab in profile with camera playback controls |
| `hub.js` (`settings`) | Sound, Graphics, Units, Controls | **Settings Screen** | Settings modal via gear icon: Audio sliders, Graphics tier, km/h vs mph, Lang |
| `camwheel.js` | AI camera gesture steering | **Settings -> CamWheel** | Webcam hands tracking calibration and sensitivity settings |
| `phone-wheel.js` | Mobile QR orientation steering | **Settings -> PhoneWheel** | QR pairing screen to use phone gyroscope as steering wheel |
| `audio/music.js` | Soundtrack player & music tracks | **Settings -> Music** | Track selector, playback controls, and sound balance |
| `settings` (Language) | English / Bangla switch | **Global Quick Action** | Dedicated `[EN | বাংলা]` toggle on top/edge bar with instant text swap |

---

## 5. Mobile Landscape Safe-Area & Viewport Matrix

| Viewport Resolution | Device Category | Safe Area Inset Handling | UI Layout Strategy |
| :--- | :--- | :--- | :--- |
| **800 x 360** | Compact Android / Budget phones | Insets `12px` L/R, compact typography | Scaled icons (42px), compressed stat bars, 1-card focused carousel |
| **844 x 390** | Modern iPhone (iPhone 12/13/14) | Notch on Left/Right: `44px` inset | Left rail padded past dynamic island, controls clear of bottom bar |
| **932 x 430** | Large Flagship (iPhone Pro Max, Galaxy S Ultra) | Notch on Left/Right: `48px` inset | Expanded layout, larger typography, full 3-card peeking carousel |
| **360 x 800 (Portrait)** | Orientation Guard / Error state | Full screen backdrop overlay | Animated "Rotate to Landscape" prompt with interactive override preview |

---

## 6. Bilingual (English / Bangla) Translation Reference

All keys are structured for dynamic real-time swapping without layout reflow:

| Translation Key | English (EN) | Bengali (বাংলা) | UI Location | Max Length Buffer Check |
| :--- | :--- | :--- | :--- | :--- |
| `ui_play` | PLAY | শুরু করুন | Home bottom-right CTA | Fits within 180px skewed button |
| `ui_modes` | GAME MODES | গেম মোডসমূহ | Left Nav Rail / Carousel | Fits within 240px header |
| `ui_garage` | GARAGE | গ্যারেজ | Left Nav Rail / Top Bar | Verified compact length |
| `ui_customize` | CUSTOMIZE | কাস্টমাইজ | Garage Action Tab | Verified |
| `ui_upgrade` | UPGRADE | আপগ্রেড | Garage Action Tab | Verified |
| `ui_tune` | TUNING | টিউনিং | Garage Action Tab | Verified |
| `ui_career` | CAREER | ক্যারিয়ার | Left Nav Rail | Verified |
| `ui_settings` | SETTINGS | সেটিংস | Quick Action Gear | Verified |
| `ui_select_car` | SELECT CAR | গাড়ি নির্বাচন | Garage Main Action | Fits within 200px button |
| `ui_power` | POWER | শক্তি | Stat bar label | Verified |
| `ui_top_speed` | TOP SPEED | সর্বোচ্চ গতি | Stat bar label | Tested for 120px label column |
| `ui_weight` | WEIGHT | ওজন | Stat bar label | Verified |
| `ui_grip` | GRIP | গ্রিপ | Stat bar label | Verified |
| `ui_apply` | APPLY | প্রয়োগ করুন | Customization Action | Fits button width |
| `ui_total_price` | TOTAL PRICE | মোট মূল্য | Running Price Pill | Verified |
| `ui_back` | BACK | পেছনে | Header back button | Fits 48px target |
| `ui_rotate_prompt` | PLEASE ROTATE YOUR DEVICE | আপনার ডিভাইসটি ঘোরান | Portrait overlay | Centered container |

---

## 7. Quality Gates & Architectural Sign-Off

1. **Gate 1**: `DESIGN.md` tokens, component library, and 100% feature-to-screen matrix completed.
2. **Gate 2**: Clickable static mockups of the 5 core screens (Home, Modes, Garage, Customize, Race HUD) and portrait overlay built and validated via Playwright screenshots across all specified aspect ratios.
3. **Gate 3**: Human review and sign-off on static prototypes before proceeding to live wiring (?ui=2).
