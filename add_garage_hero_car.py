with open('mockup_realistic.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add CSS for garage-car-showcase
garage_car_css = """
    /* Dealership 3D Car Centerpiece */
    .garage-car-showcase {
      position: absolute;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 540px;
      max-width: 68vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 2;
    }
    .garage-hero-img {
      width: 100%;
      height: auto;
      max-height: 280px;
      object-fit: contain;
      filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.92));
      transition: transform 0.25s ease, opacity 0.2s ease;
    }
    .garage-floor-shadow {
      width: 85%;
      height: 32px;
      background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 72%);
      border-radius: 50%;
      margin-top: -16px;
    }
"""

if '.garage-car-showcase' not in text:
    text = text.replace('/* SCREEN 3: GARAGE', garage_car_css + '\n    /* SCREEN 3: GARAGE')

# 2. Add HTML inside #screen-garage right after camera-bar
garage_html = """
        <!-- Dealership 3D Hero Car Centerpiece -->
        <div class="garage-car-showcase">
          <img src="assets/realistic/real_porsche_911_gt3_studio.png" class="garage-hero-img" id="garage-hero-img" alt="Selected Dealership Vehicle">
          <div class="garage-floor-shadow"></div>
        </div>
"""

if '<div class="garage-car-showcase">' not in text:
    text = text.replace('<!-- Top-Left: Technical Specifications Card -->', garage_html + '\n        <!-- Top-Left: Technical Specifications Card -->')

# 3. Update selectCar in script to also update garage-hero-img
if "document.getElementById('garage-hero-img')" not in text:
    text = text.replace("document.getElementById('g-hp').textContent", "const gImg = document.getElementById('garage-hero-img'); if (gImg) gImg.src = c.img;\n      document.getElementById('g-hp').textContent")

with open('mockup_realistic.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added garage hero car to mockup_realistic.html!")
