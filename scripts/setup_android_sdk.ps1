$ErrorActionPreference = 'Stop'
$sdk = "C:\Users\victus\Android\Sdk"
$cmdlineDir = "$sdk\cmdline-tools"
New-Item -ItemType Directory -Force -Path $cmdlineDir | Out-Null
$zip = "$sdk\cmdline-tools.zip"

Write-Host "Downloading Android commandlinetools..."
curl.exe -L -o $zip "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"

Write-Host "Extracting..."
Expand-Archive -Path $zip -DestinationPath $cmdlineDir -Force

if (Test-Path "$cmdlineDir\cmdline-tools") {
    if (Test-Path "$cmdlineDir\latest") {
        Remove-Item "$cmdlineDir\latest" -Recurse -Force
    }
    Rename-Item -Path "$cmdlineDir\cmdline-tools" -NewName "latest" -Force
}

Remove-Item $zip -Force
Write-Host "Android cmdline-tools installed successfully at $cmdlineDir\latest!"
