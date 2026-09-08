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
            $stmt = $pdo->prepare("SELECT doc_id as id, title, category, format, target, size, author, downloads, `desc`, content, file_url as fileUrl, file_name as fileName, file_data as fileData FROM documents WHERE doc_id = ? OR id = ? LIMIT 1");
            $stmt->execute([$id, $id]);
            $item = $stmt->fetch();
            if ($item) {
                jsonResponse(true, "Tìm thấy tài liệu", $item);
            } else {
                jsonResponse(false, "Không tìm thấy tài liệu", null, 404);
            }
        } else {
            $stmt = $pdo->query("SELECT doc_id as id, title, category, format, target, size, author, downloads, `desc`, content, file_url as fileUrl, file_name as fileName, file_data as fileData FROM documents ORDER BY id ASC");
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

        jsonResponse(true, "Đã lưu tài liệu thành công", ['id' => $id]);
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
