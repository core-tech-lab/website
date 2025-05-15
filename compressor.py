import os
from PIL import Image

# 🔧 Set your parent directory containing the 3 subdirectories with images
BASE_DIR = "./assets/images"

# Supported image formats
SUPPORTED_FORMATS = ('.jpg', '.jpeg', '.png')

def compress_image(image_path, quality=60, optimize=True):
    """Compress a single image."""
    try:
        img = Image.open(image_path)
        img.save(image_path, quality=quality, optimize=optimize)
        print(f"✅ Compressed: {image_path}")
    except Exception as e:
        print(f"❌ Failed to compress {image_path}: {e}")

def compress_images_in_directory(directory_path):
    """Walk through all subdirectories and compress images."""
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith(SUPPORTED_FORMATS):
                full_path = os.path.join(root, file)
                compress_image(full_path)

# Run the compression
compress_images_in_directory(BASE_DIR)
