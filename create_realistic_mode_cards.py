from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import os

os.makedirs('assets/cards', exist_ok=True)

# Helper to create dramatic AAA racing cards
def create_card(filename, title, discipline, subtitle, primary_hue, track_type):
    w, h = 480, 270
    img = Image.new('RGB', (w, h), color=(10, 12, 16))
    draw = ImageDraw.Draw(img)

    # Base gradient background
    for y in range(h):
        r = int(12 + (primary_hue[0] - 12) * (y / h) * 0.4)
        g = int(14 + (primary_hue[1] - 14) * (y / h) * 0.4)
        b = int(20 + (primary_hue[2] - 20) * (y / h) * 0.4)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Add dynamic speed lines and asphalt horizon
    horizon = int(h * 0.45)
    # Sky / upper stadium lighting
    for y in range(horizon):
        glow = int((1.0 - y / horizon) * 35)
        r = min(255, 15 + glow)
        g = min(255, 18 + glow + int(primary_hue[1]*0.15))
        b = min(255, 28 + glow*2 + int(primary_hue[2]*0.2))
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Stadium floodlights / neon overhead glare
    for lx in [80, 240, 400]:
        for rad in range(60, 0, -4):
            alpha = int((1.0 - rad/60.0) * 40)
            draw.ellipse([lx - rad, 10 - rad//2, lx + rad, 10 + rad//2], fill=(primary_hue[0], primary_hue[1], 255))

    # Asphalt track with perspective lines
    for y in range(horizon, h):
        prog = (y - horizon) / float(h - horizon)
        asphalt = int(14 + prog * 22)
        draw.line([(0, y), (w, y)], fill=(asphalt, asphalt + 2, asphalt + 5))

    # Perspective racing stripes / kerbs (red & white or neon)
    for i in range(12):
        t0 = i / 12.0
        t1 = (i + 0.8) / 12.0
        y0 = int(horizon + (t0 ** 2) * (h - horizon))
        y1 = int(horizon + (t1 ** 2) * (h - horizon))
        # Left kerb
        x_left0 = int(w * 0.45 - (t0 * w * 0.55))
        x_left1 = int(w * 0.45 - (t1 * w * 0.55))
        col = (255, 0, 85) if (i % 2 == 0) else (240, 240, 240)
        draw.polygon([(x_left0, y0), (x_left1, y1), (x_left1 + 14, y1), (x_left0 + 8, y0)], fill=col)
        # Right kerb
        x_right0 = int(w * 0.55 + (t0 * w * 0.55))
        x_right1 = int(w * 0.55 + (t1 * w * 0.55))
        draw.polygon([(x_right0, y0), (x_right1, y1), (x_right1 - 14, y1), (x_right0 - 8, y0)], fill=col)

    # Center dash lines (racing apex guide)
    for i in range(8):
        t0 = (i + 0.2) / 8.0
        t1 = (i + 0.7) / 8.0
        y0 = int(horizon + (t0 ** 2.2) * (h - horizon))
        y1 = int(horizon + (t1 ** 2.2) * (h - horizon))
        x0 = int(w * 0.5 - t0 * 15)
        x1 = int(w * 0.5 - t1 * 15)
        draw.polygon([(x0, y0), (x1, y1), (x1 + 4 + int(t1*8), y1), (x0 + 4 + int(t0*8), y0)], fill=(255, 255, 255))

    # Add realistic 3D sports car silhouette in action
    cx, cy = int(w * 0.52), int(h * 0.68)
    car_w, car_h = 240, 82

    # Under-car dark contact shadow & motion blur
    draw.ellipse([cx - car_w//2 - 20, cy + car_h//2 - 6, cx + car_w//2 + 20, cy + car_h//2 + 20], fill=(2, 3, 5))

    # Aerodynamic Supercar Body (Cockpit, hood, diffuser, wing)
    body_col = primary_hue
    # Rear wing
    draw.polygon([(cx - 105, cy - 26), (cx - 70, cy - 24), (cx - 70, cy - 18), (cx - 105, cy - 20)], fill=(20, 20, 24))
    draw.rectangle([cx - 88, cy - 20, cx - 82, cy - 2], fill=(30, 30, 35))
    # Main fuselage
    draw.polygon([
        (cx - 110, cy + 22), (cx - 100, cy - 8), (cx - 65, cy - 16), # Rear haunch
        (cx - 30, cy - 32), (cx + 25, cy - 30),                     # Roof line / windshield
        (cx + 65, cy - 12), (cx + 105, cy + 6),                     # Hood slope
        (cx + 115, cy + 22), (cx + 100, cy + 28), (cx - 100, cy + 28) # Splitter & skirts
    ], fill=body_col)

    # Tinted glass cockpit
    draw.polygon([
        (cx - 45, cy - 14), (cx - 24, cy - 28), (cx + 20, cy - 26), (cx + 52, cy - 12),
        (cx + 20, cy - 12), (cx - 25, cy - 12)
    ], fill=(12, 16, 24))

    # Specular gloss body reflection highlight
    draw.line([(cx - 70, cy - 15), (cx + 55, cy - 11)], fill=(255, 255, 255), width=2)
    draw.line([(cx + 60, cy - 8), (cx + 100, cy + 5)], fill=(255, 255, 255), width=2)

    # Glowing taillight (red streak) or headlight (cyan/white beam)
    draw.ellipse([cx + 98, cy + 8, cx + 112, cy + 18], fill=(220, 255, 255))
    draw.line([(cx + 110, cy + 13), (cx + 190, cy + 20)], fill=(180, 240, 255), width=4)
    draw.ellipse([cx - 108, cy + 4, cx - 96, cy + 14], fill=(255, 20, 60))
    # Red neon taillight trail
    draw.line([(cx - 100, cy + 9), (cx - 180, cy + 5)], fill=(255, 0, 85), width=4)

    # Alloy wheels (Low-profile performance rims)
    for wx in [cx - 70, cx + 70]:
        draw.ellipse([wx - 22, cy + 10, wx + 22, cy + 54], fill=(15, 16, 19))
        draw.ellipse([wx - 16, cy + 16, wx + 16, cy + 48], fill=(50, 55, 62))
        draw.ellipse([wx - 8, cy + 24, wx + 8, cy + 40], fill=(20, 22, 26))
        # Red performance brake caliper
        draw.rectangle([wx + 8, cy + 22, wx + 15, cy + 34], fill=(255, 0, 85))

    # Carbon fibre side skirt & front splitter
    draw.polygon([(cx - 112, cy + 27), (cx + 118, cy + 27), (cx + 112, cy + 32), (cx - 108, cy + 32)], fill=(15, 15, 18))

    # Tire smoke or speed dust
    if 'drift' in filename or 'arcade' in filename:
        for s in range(5):
            sx = cx - 90 - s * 22
            sy = cy + 24 - s * 3
            draw.ellipse([sx - 15 - s*4, sy - 10 - s*3, sx + 15 + s*4, sy + 10 + s*3], fill=(80, 85, 95))

    # Dramatic cinematic vignette & dark gradient over card bottom
    for y in range(int(h * 0.55), h):
        prog = (y - h * 0.55) / (h * 0.45)
        alpha = int(prog * 230)
        # dark bottom overlay for crisp typography readability
        overlay = Image.new('RGBA', (w, 1), (7, 8, 11, alpha))
        img.paste(overlay, (0, y), overlay)

    # Save as high-performance webp
    img.save(f'assets/cards/{filename}', 'WEBP', quality=92)
    print(f'Created realistic card: assets/cards/{filename}')

# 10 Competitive Game Modes
cards_data = [
    ('mode_race.webp', 'Circuit Sprint', 'CIRCUIT', '8-Car Closed-Course Championship', (225, 20, 40), 'circuit'),
    ('mode_drift.webp', 'Tandem Battles', 'DRIFT', 'Twin-Drift Clipping Zone Scoring', (255, 100, 0), 'drift'),
    ('mode_f1.webp', 'Formula Grand Prix', 'OPEN WHEEL', '22-Car Grid with DRS & Tire Wear', (0, 180, 255), 'f1'),
    ('mode_drag.webp', 'Quarter-Mile Drag', 'DRAG STRIP', '0-400m Christmas Tree Reaction Time', (255, 180, 0), 'drag'),
    ('mode_derby.webp', 'Demolition Arena', 'DESTRUCTION', 'Full-Contact Armored Battle Royale', (200, 50, 20), 'derby'),
    ('mode_arcade.webp', 'Stunt Megaloop', 'ARCADE', 'Gravity-Defying Corkscrews & Jumps', (160, 32, 240), 'arcade'),
    ('mode_career.webp', 'World Tour Career', 'CAREER', 'From Rookie Cup to Hypercar Master', (255, 215, 0), 'career'),
    ('mode_challenges.webp', 'Apex Master', 'CHALLENGES', 'Precision Slalom & Speed Traps', (0, 220, 130), 'challenges'),
    ('mode_timetrial.webp', 'Ghost Time Attack', 'TIME ATTACK', 'Global Leaderboard Sector Timing', (100, 140, 255), 'timetrial'),
    ('mode_online.webp', 'Live Multiplayer', 'MULTIPLAYER', 'P2P Real-Time Grid Lobbies', (255, 0, 128), 'online'),
    # Tracks
    ('track_dhaka_gp.webp', 'Dhaka GP Circuit', 'STREET', '4.8 KM · 16 High-Speed Corners', (220, 40, 60), 'track'),
    ('track_mountain_pass.webp', 'Touge Mountain Pass', 'DOWNHILL', '6.2 KM · Tight Hairpin Descents', (0, 160, 220), 'track'),
    ('track_neon_harbor.webp', 'Neon Harbor Strip', 'NIGHT', '3.9 KM · Coastal Waterfront Sprint', (140, 20, 240), 'track')
]

for c in cards_data:
    create_card(*c)

print('All 13 cards generated successfully with realistic AAA automotive aesthetics!')
