# PowerShell Sync Script: Dong bo ma nguon sang XAMPP htdocs
$Src = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($Src)) {
    $Src = (Get-Location).Path
}
$Dest = "C:\xampp\htdocs"

Write-Host "Dang dong bo tu: $Src" -ForegroundColor Cyan
Write-Host "Den thu muc:     $Dest" -ForegroundColor Cyan

# 1. Xoa thu muc frontend bi long neu co
if (Test-Path "$Dest\frontend\frontend") {
    Remove-Item -Path "$Dest\frontend\frontend" -Recurse -Force
}

# 2. Dam bao cac thu muc ton tai
if (!(Test-Path "$Dest\frontend")) { New-Item -ItemType Directory -Path "$Dest\frontend" -Force }
if (!(Test-Path "$Dest\api")) { New-Item -ItemType Directory -Path "$Dest\api" -Force }

# 3. Copy de toan bo noi dung frontend
Copy-Item -Path "$Src\frontend\*" -Destination "$Dest\frontend\" -Recurse -Force

# 4. Copy de toan bo noi dung api
Copy-Item -Path "$Src\api\*" -Destination "$Dest\api\" -Recurse -Force

# 5. Copy cac file o goc
Copy-Item -Path "$Src\database.sql" -Destination "$Dest\database.sql" -Force
Copy-Item -Path "$Src\index.html" -Destination "$Dest\index.html" -Force
Copy-Item -Path "$Src\favicon.ico" -Destination "$Dest\favicon.ico" -Force
Copy-Item -Path "$Src\favicon.png" -Destination "$Dest\favicon.png" -Force
Copy-Item -Path "$Src\bible.png" -Destination "$Dest\bible.png" -Force
Copy-Item -Path "$Src\web_preview.jpg" -Destination "$Dest\web_preview.jpg" -Force

# 6. Tao file index.php o goc XAMPP voi day du the OpenGraph cho Zalo / Facebook crawler
$indexPhpContent = @'
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Quản Trị & Tra Cứu - Đoàn TNTT Giáo xứ Tân Mỹ</title>
  <meta name="description" content="Hệ thống tra cứu thông tin Giáo Lý Viên, Lớp Giáo Lý và Đoàn Sinh TNTT Giáo xứ Tân Mỹ">
  <meta name="theme-color" content="#0f2042">

  <!-- Favicon Kinh Thánh & Thánh Giá (Holy Bible) -->
  <link rel="icon" type="image/png" sizes="64x64" href="frontend/assets/favicon.png?v=4.0">
  <link rel="icon" type="image/png" sizes="32x32" href="frontend/assets/favicon.png?v=4.0">
  <link rel="shortcut icon" href="favicon.ico?v=4.0">
  <link rel="apple-touch-icon" href="frontend/assets/favicon.png?v=4.0">

  <!-- OpenGraph / Social Share Preview (Zalo, Facebook, Messenger, Telegram) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://doantnttgiaoxutanmy.dominico.io.vn/">
  <meta property="og:title" content="Website Quản Trị & Tra Cứu - Đoàn TNTT Giáo xứ Tân Mỹ">
  <meta property="og:description" content="Hệ thống tra cứu thông tin Giáo Lý Viên, Lớp Giáo Lý và Đoàn Sinh TNTT Giáo xứ Tân Mỹ">
  <meta property="og:image" content="https://doantnttgiaoxutanmy.dominico.io.vn/frontend/assets/web_preview.jpg?v=3.0">
  <meta property="og:image:secure_url" content="https://doantnttgiaoxutanmy.dominico.io.vn/frontend/assets/web_preview.jpg?v=3.0">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Website Quản Trị & Tra Cứu - Đoàn TNTT Giáo xứ Tân Mỹ">
  <meta name="twitter:description" content="Hệ thống tra cứu thông tin Giáo Lý Viên, Lớp Giáo Lý và Đoàn Sinh TNTT Giáo xứ Tân Mỹ">
  <meta name="twitter:image" content="https://doantnttgiaoxutanmy.dominico.io.vn/frontend/assets/web_preview.jpg?v=3.0">

  <meta http-equiv="refresh" content="0; url=frontend/index.html">
  <script>
    window.location.replace("frontend/index.html");
  </script>
</head>
<body style="font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #070d1e; color: #fff;">
  <h2>Hệ Thống Tra Cứu Thông Tin & Quản Lý Giáo Lý</h2>
  <p>Đoàn Thiếu Nhi Thánh Thể Giáo xứ Tân Mỹ</p>
  <p>Đang tự động chuyển hướng...</p>
</body>
</html>
'@
Set-Content -Path "$Dest\index.php" -Value $indexPhpContent -Encoding UTF8

Write-Host "`n[OK] DA DONG BO THANH CONG SANG XAMPP!" -ForegroundColor Green
Write-Host "Trang web chinh: https://doantnttgiaoxutanmy.dominico.io.vn/" -ForegroundColor Yellow
Write-Host "Localhost:       http://localhost/`n" -ForegroundColor Yellow
