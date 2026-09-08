<?php
// ==============================================================================
// REST API: QUẢN LÝ KHO TÀI LIỆU & GIÁO TRÌNH (DOCUMENTS) - HỖ TRỢ UPLOAD FILE LỚN
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uploadDir = __DIR__ . '/../frontend/uploads/docs/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}

// Hàm format dung lượng file
function formatBytes($bytes, $precision = 1) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT doc_id as id, title, category, format, target, size, author, downloads, `desc`, content, file_url as fileUrl, file_name as fileName, file_data as fileData FROM documents WHERE doc_id = ? OR id = ? LIMIT 1");
            $stmt->execute([$id, $id]);
            $item = $stmt->fetch();
            if ($item) {
                jsonResponse(true, "Tìm thấy tài liệu", $item);
            } else {
                jsonResponse(false, "Không tìm thấy tài liệu", null, 404);
            }
        } else {
            $stmt = $pdo->query("SELECT doc_id as id, title, category, format, target, size, author, downloads, `desc`, content, file_url as fileUrl, file_name as fileName, file_data as fileData FROM documents ORDER BY id DESC");
            $list = $stmt->fetchAll();
            jsonResponse(true, "Lấy danh sách tài liệu thành công", $list);
        }
        break;

    case 'POST':
        // Hỗ trợ cả multipart/form-data (FormData) và JSON
        $isMultipart = !empty($_FILES) || (!empty($_POST) && !empty($_POST['title']));
        $data = $isMultipart ? $_POST : getJsonInput();

        $title = trim($data['title'] ?? '');
        if (empty($title)) {
            jsonResponse(false, "Tên tài liệu không được để trống", null, 400);
        }

        $id = trim($data['id'] ?? '');
        if (empty($id)) {
            $stmtCount = $pdo->query("SELECT doc_id FROM documents WHERE doc_id LIKE 'DOC%' ORDER BY id DESC LIMIT 1");
            $lastDoc = $stmtCount->fetchColumn();
            $nextNum = 1;
            if ($lastDoc && preg_match('/DOC(\d+)/i', $lastDoc, $m)) {
                $nextNum = (int)$m[1] + 1;
            } else {
                $stmtTotal = $pdo->query("SELECT COUNT(*) FROM documents");
                $nextNum = (int)$stmtTotal->fetchColumn() + 1;
            }
            $id = 'DOC' . str_pad($nextNum, 2, '0', STR_PAD_LEFT);
        }

        $category = trim($data['category'] ?? 'Giáo Trình');
        $format = trim($data['format'] ?? 'PDF');
        $target = trim($data['target'] ?? 'Toàn Đoàn');
        $size = trim($data['size'] ?? 'Đính kèm');
        $author = trim($data['author'] ?? 'Ban Giáo Lý Tân Mỹ');
        $downloads = isset($data['downloads']) ? (int)$data['downloads'] : 1;
        $desc = trim($data['desc'] ?? '');
        $content = trim($data['content'] ?? '');
        $fileUrl = trim($data['fileUrl'] ?? ($data['file_url'] ?? ''));
        $fileName = trim($data['fileName'] ?? ($data['file_name'] ?? ''));
        $fileData = $data['fileData'] ?? ($data['file_data'] ?? null);

        // 1. Xử lý upload file vật lý trực tiếp từ FormData
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $origName = basename($_FILES['file']['name']);
            $ext = pathinfo($origName, PATHINFO_EXTENSION);
            $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
            $savedFileName = "doc_{$id}_{$cleanBase}." . strtolower($ext);
            $destPath = $uploadDir . $savedFileName;

            if (move_uploaded_file($_FILES['file']['tmp_name'], $destPath)) {
                $fileUrl = "uploads/docs/" . $savedFileName;
                $fileName = $origName;
                $size = formatBytes($_FILES['file']['size']);
                $fileData = null; // Không cần lưu base64 khi đã có file vật lý
            }
        }
        // 2. Xử lý nếu gửi base64 data URL lớn -> lưu thành file vật lý để tối ưu CSDL
        else if ($fileData && strpos($fileData, 'data:') === 0) {
            if (preg_match('/^data:([a-zA-Z0-9\/+-]+);base64,(.+)$/s', $fileData, $matches)) {
                $binaryData = base64_decode($matches[2]);
                if ($binaryData !== false && strlen($binaryData) > 0) {
                    $ext = strtolower($format);
                    if ($fileName && pathinfo($fileName, PATHINFO_EXTENSION)) {
                        $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    }
                    $cleanBase = $fileName ? preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($fileName, PATHINFO_FILENAME)) : 'file';
                    $savedFileName = "doc_{$id}_{$cleanBase}." . $ext;
                    $destPath = $uploadDir . $savedFileName;

                    if (@file_put_contents($destPath, $binaryData)) {
                        $fileUrl = "uploads/docs/" . $savedFileName;
                        if (!$size || $size === 'Đính kèm') {
                            $size = formatBytes(strlen($binaryData));
                        }
                        $fileData = null;
                    }
                }
            }
        }

        $stmt = $pdo->prepare("
            INSERT INTO documents (doc_id, title, category, format, target, size, author, downloads, `desc`, content, file_url, file_name, file_data, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
                title = VALUES(title), 
                category = VALUES(category), 
                format = VALUES(format), 
                target = VALUES(target), 
                size = VALUES(size), 
                author = VALUES(author),
                downloads = VALUES(downloads),
                `desc` = VALUES(`desc`), 
                content = VALUES(content), 
                file_url = VALUES(file_url),
                file_name = VALUES(file_name),
                file_data = VALUES(file_data),
                updated_at = NOW()
        ");
        $stmt->execute([$id, $title, $category, $format, $target, $size, $author, $downloads, $desc, $content, $fileUrl, $fileName, $fileData]);

        jsonResponse(true, "Đã lưu tài liệu thành công", [
            'id' => $id,
            'fileUrl' => $fileUrl,
            'fileName' => $fileName,
            'size' => $size
        ]);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ''));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã tài liệu cần sửa", null, 400);
        }

        // Check if updating download counter only
        if (isset($data['incrementDownload']) && $data['incrementDownload']) {
            $stmt = $pdo->prepare("UPDATE documents SET downloads = downloads + 1 WHERE doc_id = ? OR id = ?");
            $stmt->execute([$id, $id]);
            jsonResponse(true, "Đã tăng lượt tải thành công");
            break;
        }

        $title = trim($data['title'] ?? '');
        $category = trim($data['category'] ?? 'Giáo Trình');
        $format = trim($data['format'] ?? 'PDF');
        $target = trim($data['target'] ?? 'Toàn Đoàn');
        $size = trim($data['size'] ?? 'Đính kèm');
        $author = trim($data['author'] ?? 'Ban Giáo Lý Tân Mỹ');
        $desc = trim($data['desc'] ?? '');
        $content = trim($data['content'] ?? '');
        $fileUrl = trim($data['fileUrl'] ?? ($data['file_url'] ?? ''));
        $fileName = trim($data['fileName'] ?? ($data['file_name'] ?? ''));
        $fileData = $data['fileData'] ?? ($data['file_data'] ?? null);

        $stmt = $pdo->prepare("
            UPDATE documents 
            SET title = ?, category = ?, format = ?, target = ?, size = ?, author = ?, `desc` = ?, content = ?, 
                file_url = ?,
                file_name = ?,
                file_data = ?,
                updated_at = NOW() 
            WHERE doc_id = ? OR id = ?
        ");
        $stmt->execute([$title, $category, $format, $target, $size, $author, $desc, $content, $fileUrl, $fileName, $fileData, $id, $id]);

        jsonResponse(true, "Đã cập nhật tài liệu thành công");
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            jsonResponse(false, "Thiếu mã tài liệu cần xóa", null, 400);
        }

        $stmt = $pdo->prepare("DELETE FROM documents WHERE doc_id = ? OR id = ?");
        $stmt->execute([$id, $id]);

        jsonResponse(true, "Đã xóa tài liệu thành công");
        break;

    default:
        jsonResponse(false, "Phương thức HTTP không được hỗ trợ", null, 405);
        break;
}
?>
