<?php
// ==============================================================================
// REST API: QUẢN LÝ THÔNG BÁO & TIN TỨC (NEWS)
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT news_id as id, title, category, date, author, summary, content, is_pinned as isPinned FROM news WHERE news_id = ? OR id = ? LIMIT 1");
            $stmt->execute([$id, $id]);
            $item = $stmt->fetch();
            if ($item) {
                $item['isPinned'] = (bool)$item['isPinned'];
                jsonResponse(true, "Tìm thấy thông báo", $item);
            } else {
                jsonResponse(false, "Không tìm thấy thông báo", null, 404);
            }
        } else {
            $stmt = $pdo->query("SELECT news_id as id, title, category, date, author, summary, content, is_pinned as isPinned FROM news ORDER BY is_pinned DESC, id DESC");
            $list = $stmt->fetchAll();
            foreach ($list as &$item) {
                $item['isPinned'] = (bool)$item['isPinned'];
            }
            jsonResponse(true, "Lấy danh sách thông báo thành công", $list);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $title = trim($data['title'] ?? '');
        $content = trim($data['content'] ?? '');

        if (empty($title) || empty($content)) {
            jsonResponse(false, "Tiêu đề và nội dung không được để trống", null, 400);
        }

        $id = trim($data['id'] ?? '');
        if (empty($id)) {
            $stmtCount = $pdo->query("SELECT COUNT(*) FROM news");
            $count = (int)$stmtCount->fetchColumn() + 1;
            $id = 'NEWS' . str_pad($count, 2, '0', STR_PAD_LEFT);
        }

        $category = trim($data['category'] ?? 'Khẩn');
        $date = trim($data['date'] ?? date('d/m/Y'));
        $author = trim($data['author'] ?? 'Ban Quản Trị Xứ Đoàn TNTT');
        $summary = trim($data['summary'] ?? '');
        $isPinned = !empty($data['isPinned']) ? 1 : 0;

        if ($isPinned) {
            $pdo->exec("UPDATE news SET is_pinned = 0");
        }

        $stmt = $pdo->prepare("INSERT INTO news (news_id, title, category, date, author, summary, content, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$id, $title, $category, $date, $author, $summary, $content, $isPinned]);

        jsonResponse(true, "Đã thêm thông báo thành công", ['id' => $id]);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ''));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã thông báo cần sửa", null, 400);
        }

        $title = trim($data['title'] ?? '');
        $category = trim($data['category'] ?? 'Khẩn');
        $date = trim($data['date'] ?? date('d/m/Y'));
        $author = trim($data['author'] ?? 'Ban Quản Trị Xứ Đoàn');
        $summary = trim($data['summary'] ?? '');
        $content = trim($data['content'] ?? '');
        $isPinned = !empty($data['isPinned']) ? 1 : 0;

        if ($isPinned) {
            $pdo->exec("UPDATE news SET is_pinned = 0");
        }

        $stmt = $pdo->prepare("UPDATE news SET title = ?, category = ?, date = ?, author = ?, summary = ?, content = ?, is_pinned = ?, updated_at = NOW() WHERE news_id = ?");
        $stmt->execute([$title, $category, $date, $author, $summary, $content, $isPinned, $id]);

        jsonResponse(true, "Đã cập nhật thông báo thành công");
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            jsonResponse(false, "Thiếu mã thông báo cần xóa", null, 400);
        }

        $stmt = $pdo->prepare("DELETE FROM news WHERE news_id = ?");
        $stmt->execute([$id]);

        jsonResponse(true, "Đã xóa thông báo thành công");
        break;

    default:
        jsonResponse(false, "Phương thức HTTP không được hỗ trợ", null, 405);
        break;
}
