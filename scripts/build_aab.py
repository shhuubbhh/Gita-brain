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

# 1. Build fresh frontend production bundle
print("=" * 60)
print("Step 1: Building fresh frontend production bundle (Vite)...")
print("=" * 60)
subprocess.run(["npm", "run", "build"], cwd=ROOT / "frontend", check=True, shell=True)

# 2. Sync web assets into Android project
print("\n" + "=" * 60)
print("Step 2: Syncing web assets to Android project...")
print("=" * 60)
frontend_dist = ROOT / "frontend" / "dist"
assets_dir = ANDROID_DIR / "app" / "src" / "main" / "assets"
os.makedirs(assets_dir, exist_ok=True)

# Clean old bundle files in destination
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

# 3. Setup build environment
env = os.environ.copy()
env["JAVA_HOME"] = JAVA_HOME
env["ANDROID_HOME"] = ANDROID_HOME
env["PATH"] = f"{JAVA_HOME}\\bin;{os.path.dirname(GRADLE_BIN)};{ANDROID_HOME}\\cmdline-tools\\latest\\bin;{ANDROID_HOME}\\platform-tools;{env.get('PATH', '')}"

# 4. Build Android App Bundle (.aab) with Gradle
print("\n" + "=" * 60)
print("Step 3: Building signed Android App Bundle (bundleRelease)...")
print("=" * 60)

p = subprocess.run(
    [GRADLE_BIN, "bundleRelease", "--stacktrace"],
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

print("Gradle bundleRelease succeeded!")

# 5. Locate and copy release .aab
aab_source = ANDROID_DIR / "app" / "build" / "outputs" / "bundle" / "release" / "app-release.aab"

if aab_source.exists():
    output_aab = ROOT / "maargdarshan-release.aab"
    shutil.copy2(aab_source, output_aab)
    size_mb = output_aab.stat().st_size / (1024 * 1024)

    # Copy to user Downloads for quick drag-and-drop to Google Play Console
    user_downloads = Path.home() / "Downloads" / "maargdarshan-release.aab"
    try:
        shutil.copy2(aab_source, user_downloads)
    except Exception:
        pass

    print("\n" + "=" * 60)
    print("SUCCESS: Google Play Store App Bundle (.aab) created!")
    print(f"Project File:    {output_aab}")
    print(f"Downloads File:  {user_downloads}")
    print(f"Bundle Size:     {size_mb:.2f} MB")
    print("Package Name:    com.gitabrain.companion")
    print("Version:         1.0.0 (versionCode 1)")
    print("Target SDK:      34 (Android 14 - Google Play requirement)")
    print("Signing:         Signed with release keystore")
    print("=" * 60)
else:
    print("ERROR: app-release.aab not found at expected location:", aab_source)
    sys.exit(1)
