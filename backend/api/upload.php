<?php
// ==============================================================================
// REST API: TẢI LÊN VÀ LƯU TRỮ ẢNH THẺ (UPLOAD PHOTO)
// ==============================================================================

require_once __DIR__ . '/../config/database.php';

$uploadDir = __DIR__ . '/../uploads/avatars/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Phương thức HTTP không được hỗ trợ!", null, 405);
}

// 1. Trường hợp gửi Multipart Form Data
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['photo'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (!in_array($ext, $allowed)) {
        jsonResponse(false, "Định dạng ảnh không hợp lệ! Vui lòng chọn file JPG, PNG hoặc WEBP.", null, 400);
    }

    $fileName = 'glv_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $publicUrl = 'backend/uploads/avatars/' . $fileName;
        jsonResponse(true, "Tải ảnh lên thành công!", ["url" => $publicUrl]);
    } else {
        jsonResponse(false, "Không thể lưu file ảnh!", null, 500);
    }
}

// 2. Trường hợp gửi Base64 JSON
$data = getJsonInput();
if (!empty($data['base64'])) {
    $base64 = $data['base64'];
    if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
        $base64 = substr($base64, strpos($base64, ',') + 1);
        $ext = strtolower($type[1]); // jpg, png, gif
        if ($ext === 'jpeg') $ext = 'jpg';
        
        $base64 = str_replace(' ', '+', $base64);
        $decoded = base64_decode($base64);

        if ($decoded !== false) {
            $fileName = 'glv_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
            $targetPath = $uploadDir . $fileName;
            file_put_contents($targetPath, $decoded);
            $publicUrl = 'backend/uploads/avatars/' . $fileName;
            jsonResponse(true, "Lưu ảnh thẻ thành công!", ["url" => $publicUrl]);
        }
    }
}

jsonResponse(false, "Không nhận được dữ liệu ảnh để tải lên!", null, 400);
?>
