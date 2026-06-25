from PIL import Image, ImageDraw, ImageFont
import os

# Create a blank white image
img = Image.new('RGB', (600, 400), color = 'white')
d = ImageDraw.Draw(img)

# Try to use a default font, or just default load
try:
    font = ImageFont.truetype("arial.ttf", 24)
except:
    font = ImageFont.load_default()

text = """
Student Name         Phone Number
Rahul Sharma         9876543210
Aditya Panchal       9518903329
Afsheen Fatima       9823612382
Some Random          6891234567
"""

d.text((20, 20), text, fill=(0, 0, 0), font=font)
img.save('test_ocr.png')
print("Image saved as test_ocr.png")
