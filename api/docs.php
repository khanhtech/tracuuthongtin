<?php
// ==============================================================================
// REST API: QUẢN LÝ KHO TÀI LIỆU & GIÁO TRÌNH (DOCUMENTS)
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT doc_id as id, title, category, format, target, size, author, downloads, `desc`, content, file_url as fileUrl FROM documents WHERE doc_id = ? OR id = ? LIMIT 1");
            $stmt->execute([$id, $id]);
            $item = $stmt->fetch();
            if ($item) {
                jsonResponse(true, "Tìm thấy tài liệu", $item);
            } else {
                jsonResponse(false, "Không tìm thấy tài liệu", null, 404);
            }
        } else {
            $stmt = $pdo->query("SELECT doc_id as id, title, category, format, target, size, author, downloads, `desc`, content, file_url as fileUrl FROM documents ORDER BY id ASC");
            $list = $stmt->fetchAll();
            jsonResponse(true, "Lấy danh sách tài liệu thành công", $list);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $title = trim($data['title'] ?? '');

        if (empty($title)) {
            jsonResponse(false, "Tên tài liệu không được để trống", null, 400);
        }

        $id = trim($data['id'] ?? '');
        if (empty($id)) {
            $stmtCount = $pdo->query("SELECT COUNT(*) FROM documents");
            $count = (int)$stmtCount->fetchColumn() + 1;
            $id = 'DOC' . str_pad($count, 2, '0', STR_PAD_LEFT);
        }

        $category = trim($data['category'] ?? 'Giáo Trình');
        $format = trim($data['format'] ?? 'PDF');
        $target = trim($data['target'] ?? 'Toàn Đoàn');
        $size = trim($data['size'] ?? '3.5 MB');
        $author = trim($data['author'] ?? 'Ban Giáo Lý Tân Mỹ');
        $desc = trim($data['desc'] ?? '');
        $content = trim($data['content'] ?? '');

        $stmt = $pdo->prepare("INSERT INTO documents (doc_id, title, category, format, target, size, author, downloads, `desc`, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())");
        $stmt->execute([$id, $title, $category, $format, $target, $size, $author, $desc, $content]);

        jsonResponse(true, "Đã thêm tài liệu thành công", ['id' => $id]);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ''));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã tài liệu cần sửa", null, 400);
        }

        // Check if updating download counter only
        if (isset($data['incrementDownload']) && $data['incrementDownload']) {
            $stmt = $pdo->prepare("UPDATE documents SET downloads = downloads + 1 WHERE doc_id = ?");
            $stmt->execute([$id]);
            jsonResponse(true, "Đã tăng lượt tải thành công");
            break;
        }

        $title = trim($data['title'] ?? '');
        $category = trim($data['category'] ?? 'Giáo Trình');
        $format = trim($data['format'] ?? 'PDF');
        $target = trim($data['target'] ?? 'Toàn Đoàn');
        $size = trim($data['size'] ?? '3.5 MB');
        $desc = trim($data['desc'] ?? '');
        $content = trim($data['content'] ?? '');

        $stmt = $pdo->prepare("UPDATE documents SET title = ?, category = ?, format = ?, target = ?, size = ?, `desc` = ?, content = ?, updated_at = NOW() WHERE doc_id = ?");
        $stmt->execute([$title, $category, $format, $target, $size, $desc, $content, $id]);

        jsonResponse(true, "Đã cập nhật tài liệu thành công");
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            jsonResponse(false, "Thiếu mã tài liệu cần xóa", null, 400);
        }

        $stmt = $pdo->prepare("DELETE FROM documents WHERE doc_id = ?");
        $stmt->execute([$id]);

        jsonResponse(true, "Đã xóa tài liệu thành công");
        break;

    default:
        jsonResponse(false, "Phương thức HTTP không được hỗ trợ", null, 405);
        break;
}
