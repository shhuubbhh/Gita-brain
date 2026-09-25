Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\victus\.gemini\antigravity-ide\brain\004bd564-44cd-41b1-acca-d2fd160fa4f6\.user_uploaded\media_1790362112456.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # Check if not pure white
        if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Feather Bounding Box: Left=$minX, Top=$minY, Right=$maxX, Bottom=$maxY"
Write-Output "Feather Size: Width=$($maxX - $minX), Height=$($maxY - $minY)"
$bmp.Dispose()
