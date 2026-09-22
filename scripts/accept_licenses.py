import os
import subprocess

java_home = r"C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
sdk_home = r"C:\Users\victus\Android\Sdk"
sdkmanager = os.path.join(sdk_home, "cmdline-tools", "latest", "bin", "sdkmanager.bat")

env = os.environ.copy()
env["JAVA_HOME"] = java_home
env["ANDROID_HOME"] = sdk_home
env["PATH"] = f"{java_home}\\bin;{env.get('PATH', '')}"

print("Running sdkmanager --licenses with communicate(y*100)...")
p = subprocess.Popen(
    [sdkmanager, "--licenses"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    env=env
)

stdout, stderr = p.communicate(input="y\n" * 100)
print("STDOUT:", stdout[-500:])
print("STDERR:", stderr)
print("Return code:", p.returncode)
