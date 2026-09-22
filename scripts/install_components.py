import os
import subprocess

java_home = r"C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
sdk_home = r"C:\Users\victus\Android\Sdk"
sdkmanager = os.path.join(sdk_home, "cmdline-tools", "latest", "bin", "sdkmanager.bat")

env = os.environ.copy()
env["JAVA_HOME"] = java_home
env["ANDROID_HOME"] = sdk_home
env["PATH"] = f"{java_home}\\bin;{env.get('PATH', '')}"

print("Installing Android platform-tools, platforms;android-34, build-tools;34.0.0...")
p = subprocess.run(
    [sdkmanager, "platform-tools", "platforms;android-34", "build-tools;34.0.0"],
    env=env,
    capture_output=True,
    text=True
)

print(p.stdout[-800:])
if p.stderr:
    print("STDERR:", p.stderr[-500:])
print("Exited with code:", p.returncode)
