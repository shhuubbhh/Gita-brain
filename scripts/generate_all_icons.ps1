Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\victus\.gemini\antigravity-ide\brain\004bd564-44cd-41b1-acca-d2fd160fa4f6\.user_uploaded\media_1790362112456.jpg"
$baseDir = "c:\Users\victus\Downloads\gita-brain-v1.1.0-answer-quality\gita-v080"
$resDir = Join-Path $baseDir "android\app\src\main\res"
$frontendPublic = Join-Path $baseDir "frontend\public"

Write-Output "Loading source image from $srcPath..."
$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $srcBmp.Width
$height = $srcBmp.Height

# Step 1: Create transparent feather bitmap
Write-Output "Creating transparent feather bitmap..."
$featherBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $p = $srcBmp.GetPixel($x, $y)
        # Check white threshold with soft edge smoothing
        $minVal = [Math]::Min($p.R, [Math]::Min($p.G, $p.B))
        if ($minVal -ge 250) {
            # Completely white -> transparent
            $featherBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($minVal -ge 235) {
            # Soft anti-aliased edge
            $alpha = [int]((250 - $minVal) / 15.0 * 255.0)
            $featherBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            # Solid feather pixel
            $featherBmp.SetPixel($x, $y, $p)
        }
    }
}

# Function to draw high-quality scaled image
function Draw-Scaled-Image($source, $targetSize, $paddingRatio, $isRound, $bgWhite) {
    $outBmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($outBmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($bgWhite) {
        if ($isRound) {
            $g.Clear([System.Drawing.Color]::Transparent)
            $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
            $g.FillEllipse($brush, 0, 0, $targetSize, $targetSize)
            $brush.Dispose()
        } else {
            $g.Clear([System.Drawing.Color]::White)
        }
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }

    # Bounding box of feather: W=486, H=783, aspect ratio ~ 0.62
    # Safe dimension inside targetSize with padding
    $safeH = [int]($targetSize * $paddingRatio)
    $safeW = [int]($safeH * ($source.Width / $source.Height))

    $destX = [int](($targetSize - $safeW) / 2)
    $destY = [int](($targetSize - $safeH) / 2)

    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $safeW, $safeH)
    $g.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    return $outBmp
}

# 1. Generate Adaptive Icon Foreground (Transparent background, feather inside 66% safe zone of 108dp canvas)
Write-Output "Generating Adaptive Icon Foregrounds..."
$drawableDensities = @{
    "drawable" = 432
    "drawable-mdpi" = 108
    "drawable-hdpi" = 162
    "drawable-xhdpi" = 216
    "drawable-xxhdpi" = 324
    "drawable-xxxhdpi" = 432
}

foreach ($entry in $drawableDensities.GetEnumerator()) {
    $dir = Join-Path $resDir $entry.Key
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $adaptiveFore = Draw-Scaled-Image -source $featherBmp -targetSize $entry.Value -paddingRatio 0.65 -isRound $false -bgWhite $false
    $outPath = Join-Path $dir "ic_launcher_foreground.png"
    $adaptiveFore.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $adaptiveFore.Dispose()
    Write-Output "Saved: $outPath ($($entry.Value)x$($entry.Value))"
}

# 2. Generate Mipmap Icons (Standard & Round for legacy launchers)
Write-Output "Generating Mipmap Icons..."
$mipmapDensities = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($entry in $mipmapDensities.GetEnumerator()) {
    $dir = Join-Path $resDir $entry.Key
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    # Standard Square/Squircle launcher icon (White background, feather padded 82%)
    $standardIcon = Draw-Scaled-Image -source $featherBmp -targetSize $entry.Value -paddingRatio 0.82 -isRound $false -bgWhite $true
    $stdPath = Join-Path $dir "ic_launcher.png"
    $standardIcon.Save($stdPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $standardIcon.Dispose()

    # Round launcher icon (Circular white background, feather padded 78%)
    $roundIcon = Draw-Scaled-Image -source $featherBmp -targetSize $entry.Value -paddingRatio 0.78 -isRound $true -bgWhite $true
    $roundPath = Join-Path $dir "ic_launcher_round.png"
    $roundIcon.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $roundIcon.Dispose()

    # Also save ic_launcher_foreground.png in mipmap directories for any launcher referencing @mipmap/ic_launcher_foreground
    $adaptiveFore = Draw-Scaled-Image -source $featherBmp -targetSize ([int]($entry.Value * 108 / 48)) -paddingRatio 0.65 -isRound $false -bgWhite $false
    $forePath = Join-Path $dir "ic_launcher_foreground.png"
    $adaptiveFore.Save($forePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $adaptiveFore.Dispose()

    Write-Output "Saved mipmap in $dir ($($entry.Value)x$($entry.Value))"
}

# 3. Generate Web App / PWA & High-Res Icons
Write-Output "Generating Web App Icons..."
if (-not (Test-Path $frontendPublic)) { New-Item -ItemType Directory -Path $frontendPublic -Force | Out-Null }

# 512x512 app_icon.png (High-res for store & PWA)
$appIcon512 = Draw-Scaled-Image -source $featherBmp -targetSize 512 -paddingRatio 0.84 -isRound $false -bgWhite $true
$appIcon512.Save((Join-Path $frontendPublic "app_icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$appIcon512.Dispose()

# 192x192 pwa icon
$appIcon192 = Draw-Scaled-Image -source $featherBmp -targetSize 192 -paddingRatio 0.84 -isRound $false -bgWhite $true
$appIcon192.Save((Join-Path $frontendPublic "icon-192.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$appIcon192.Dispose()

# 180x180 apple touch icon
$appleIcon = Draw-Scaled-Image -source $featherBmp -targetSize 180 -paddingRatio 0.82 -isRound $false -bgWhite $true
$appleIcon.Save((Join-Path $frontendPublic "apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$appleIcon.Dispose()

# 64x64 favicon.png
$favIcon = Draw-Scaled-Image -source $featherBmp -targetSize 64 -paddingRatio 0.84 -isRound $false -bgWhite $true
$favIcon.Save((Join-Path $frontendPublic "favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$favIcon.Dispose()

# Save clean transparent peacock_feather.png as well
$cleanPeacock = Draw-Scaled-Image -source $featherBmp -targetSize 512 -paddingRatio 0.90 -isRound $false -bgWhite $false
$cleanPeacock.Save((Join-Path $frontendPublic "peacock_feather.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$cleanPeacock.Dispose()

# Clean up
$featherBmp.Dispose()
$srcBmp.Dispose()

Write-Output "All app icons successfully generated!"
