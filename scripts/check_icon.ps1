Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\victus\.gemini\antigravity-ide\brain\004bd564-44cd-41b1-acca-d2fd160fa4f6\.user_uploaded\media_1790362112456.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Dimensions: $($bmp.Width) x $($bmp.Height)"
$cornerPixel = $bmp.GetPixel(0, 0)
Write-Output "Corner pixel color: R=$($cornerPixel.R), G=$($cornerPixel.G), B=$($cornerPixel.B), A=$($cornerPixel.A)"
$bmp.Dispose()
