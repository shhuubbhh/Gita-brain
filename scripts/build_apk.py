import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ANDROID_DIR = ROOT / "android"
JAVA_HOME = r"C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
ANDROID_HOME = r"C:\Users\victus\Android\Sdk"
GRADLE_BIN = r"C:\Users\victus\gradle\gradle-8.5\bin\gradle.bat"

# First, ensure frontend is built and copied
frontend_dist = ROOT / "frontend" / "dist"
assets_dir = ANDROID_DIR / "app" / "src" / "main" / "assets"
os.makedirs(assets_dir, exist_ok=True)

print("Building fresh frontend bundle...")
subprocess.run(["npm", "run", "build"], cwd=ROOT / "frontend", check=True, shell=True)

print("Syncing web assets to Android project...")
# Clean old assets in destination to prevent stale bundles
for old in assets_dir.iterdir():
    if old.is_dir():
        shutil.rmtree(old)
    else:
        old.unlink()

for item in frontend_dist.iterdir():
    dest = assets_dir / item.name
    if item.is_dir():
        shutil.copytree(item, dest)
    else:
        shutil.copy2(item, dest)

print("Web assets synced successfully.")

# Setup build environment
env = os.environ.copy()
env["JAVA_HOME"] = JAVA_HOME
env["ANDROID_HOME"] = ANDROID_HOME
env["PATH"] = f"{JAVA_HOME}\\bin;{os.path.dirname(GRADLE_BIN)};{ANDROID_HOME}\\cmdline-tools\\latest\\bin;{ANDROID_HOME}\\platform-tools;{env.get('PATH', '')}"

print("Building Android APK with Gradle (assembleDebug)...")
p = subprocess.run(
    [GRADLE_BIN, "assembleDebug", "--no-daemon", "--stacktrace"],
    cwd=ANDROID_DIR,
    env=env,
    capture_output=True,
    text=True
)

if p.returncode != 0:
    print("Gradle build FAILED!")
    print("STDOUT:\n", p.stdout[-2500:])
    print("STDERR:\n", p.stderr[-1500:])
    sys.exit(1)

print("Gradle build succeeded!")
apk_source = ANDROID_DIR / "app" / "build" / "outputs" / "apk" / "debug" / "app-debug.apk"

if apk_source.exists():
    output_apk = ROOT / "gita-companion-debug.apk"
    shutil.copy2(apk_source, output_apk)
    size_mb = output_apk.stat().st_size / (1024 * 1024)

    # Also copy to Downloads folder if accessible
    user_downloads = Path.home() / "Downloads" / "gita-companion-debug.apk"
    try:
        shutil.copy2(apk_source, user_downloads)
    except Exception:
        pass

    print("=" * 60)
    print(f"SUCCESS: Android APK created successfully!")
    print(f"Project Folder: {output_apk}")
    print(f"Downloads Folder: {user_downloads}")
    print(f"File Size: {size_mb:.2f} MB")
    print("=" * 60)
else:
    print("ERROR: app-debug.apk not found at expected location:", apk_source)
    sys.exit(1)
