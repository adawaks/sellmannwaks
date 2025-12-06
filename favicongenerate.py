import os
from PIL import Image

# Path of the folder where the script is located
base = os.path.dirname(os.path.abspath(__file__))

input_image = os.path.join(base, "images", "lotta_ring_sketch.PNG")
output_ico = os.path.join(base, "favicon.ico")

sizes = [(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)]

img = Image.open(input_image).convert("RGBA")
img.save(output_ico, sizes=sizes)

print("Saved to:", output_ico)
