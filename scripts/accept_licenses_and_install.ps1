$sdk = "C:\Users\victus\Android\Sdk"
$licensesDir = "$sdk\licenses"
New-Item -ItemType Directory -Force -Path $licensesDir | Out-Null

$sdkLicense = @"
8933bad161af4178b1185d1a37fbf41ea5269c55
d56f5187479451eabf01fb78ba6edcb786dd95e4
24333f8a63b1d7f2e5bf817262f31f2d6248a693
"@
Set-Content -Path "$licensesDir\android-sdk-license" -Value $sdkLicense -NoNewline

$sdkPreviewLicense = @"
84831b9409646a233e33e4540cb027200f227d19
"@
Set-Content -Path "$licensesDir\android-sdk-preview-license" -Value $sdkPreviewLicense -NoNewline

Write-Host "Licenses configured! Now installing platform-tools, platforms;android-34, build-tools;34.0.0..."
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$sdk\cmdline-tools\latest\bin;$env:Path"
$env:ANDROID_HOME = $sdk

& "$sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools" "platforms;android-34" "build-tools;34.0.0"
Write-Host "SDK installation complete!"
