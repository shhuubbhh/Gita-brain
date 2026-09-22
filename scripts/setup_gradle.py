import os
import urllib.request
import zipfile

target_dir = r"C:\Users\victus\gradle"
zip_path = os.path.join(target_dir, "gradle-8.5-bin.zip")
os.makedirs(target_dir, exist_ok=True)

gradle_url = "https://services.gradle.org/distributions/gradle-8.5-bin.zip"

if not os.path.exists(os.path.join(target_dir, "gradle-8.5", "bin", "gradle.bat")):
    print("Downloading Gradle 8.5...")
    urllib.request.urlretrieve(gradle_url, zip_path)
    print("Extracting Gradle 8.5...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(target_dir)
    if os.path.exists(zip_path):
        os.remove(zip_path)
    print("Gradle 8.5 installed successfully at", os.path.join(target_dir, "gradle-8.5"))
else:
    print("Gradle 8.5 already installed!")
