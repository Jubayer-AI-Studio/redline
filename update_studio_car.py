with open('build_ui2.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "function updateStudioCar(modelId) {"
replacement = """function updateStudioCar(modelId) {
      try {
        var gImg = document.getElementById('garage-hero-img');
        if (gImg) {
          var carObj = CARS[currentCar % CARS.length];
          if (carObj && carObj.img) gImg.src = carObj.img;
        }
      } catch (e) {}"""

if target in text:
    text = text.replace(target, replacement)
    print("Updated updateStudioCar in build_ui2.js!")

with open('build_ui2.js', 'w', encoding='utf-8') as f:
    f.write(text)
