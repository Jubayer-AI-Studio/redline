from PIL import Image, ImageFilter
import numpy as np

# Load reference image
im = Image.open('assets/realistic/workshop_reference.jpg')
w, h = im.size
arr = np.array(im).astype(np.float32)

# 1. Clean Top Bar (y: 0 to 58)
for y in range(0, 58):
    factor = 1.0 - (y / 58.0) * 0.4
    arr[y, :, :] = np.array([7, 8, 10], dtype=np.float32) * factor

# 2. Clean Bottom Bar (y: 475 to h) completely with smooth showroom floor shadow
for y in range(475, h):
    fade = min(1.0, (y - 475) / 10.0)
    floor_color = np.array([7, 8, 11], dtype=np.float32)
    arr[y, :, :] = arr[y, :, :] * (1.0 - fade) + floor_color * fade

# 3. Clean Left Event Area (x: 0 to 325, y: 56 to 272)
# Create a smooth, dark, ambient garage shadow vignette that seamlessly blends into the workshop
for y in range(56, 272):
    for x in range(0, 325):
        # Sample atmospheric dark grey from real workshop wall at x=340
        base_wall = arr[y, 340, :].copy()
        # Darken towards the left edge like natural ambient occlusion / shadow
        depth_factor = 0.45 + 0.55 * (x / 325.0)
        blend_to_real = min(1.0, (x / 325.0) ** 2.5)
        blended = base_wall * depth_factor
        arr[y, x, :] = arr[y, x, :] * (1.0 - (1.0 - blend_to_real)) + blended * (1.0 - blend_to_real)

# Clean Chat icon on left (x: 0 to 55, y: 450 to 520)
for y in range(450, 520):
    for x in range(0, 55):
        arr[y, x, :] = arr[y, 65, :]

# 4. Clean Right Rail Text (x: 935 to 1024, y: 65 to 495)
for y in range(65, 495):
    for x in range(935, 1024):
        src_x = 918 + (x % 12)
        arr[y, x, :] = arr[y, src_x, :] * 0.88

clean_im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
clean_im = clean_im.filter(ImageFilter.SMOOTH)
clean_im.save('assets/realistic/pristine_showroom_studio.jpg', quality=96)
print('pristine_showroom_studio.jpg regenerated with ultra-smooth wall blending!')
