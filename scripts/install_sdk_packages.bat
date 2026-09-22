@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
set "PATH=%JAVA_HOME%\bin;C:\Users\victus\Android\Sdk\cmdline-tools\latest\bin;%PATH%"
set "ANDROID_HOME=C:\Users\victus\Android\Sdk"

echo Accepting Android SDK licenses...
(echo y & echo y & echo y & echo y & echo y & echo y & echo y & echo y) | call C:\Users\victus\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat --licenses

echo Installing platform-tools, build-tools, platforms...
(echo y) | call C:\Users\victus\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo Android SDK components installed successfully!
