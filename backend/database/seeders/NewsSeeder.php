<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('news')->delete();
        DB::table('news')->insert([
            [
                'news_id' => 'NEWS01',
                'title' => 'Lễ Khai Giảng & Ra Mắt Xứ Đoàn TNTT Giáo Xứ Tân Mỹ Năm Học 2026 - 2027',
                'category' => 'Khẩn',
                'date' => '26/08/2026',
                'author' => 'Ban Quản Trị Xứ Đoàn TNTT',
                'summary' => 'Ban Giáo Lý kính gửi quý phụ huynh và các em thiếu nhi toàn đoàn thời gian tập trung khai giảng, chương trình Thánh lễ tạ ơn và dặn dò đồng phục chuẩn TNTT.',
                'content' => "Kính gửi: Quý Phụ Huynh, Anh Chị Huynh Trưởng và các em Thiếu Nhi toàn đoàn.\n\nNhằm chuẩn bị chu đáo cho niên khóa Giáo lý mới 2026 - 2027, Ban Quản Trị Đoàn Thiếu Nhi Thánh Thể Giáo xứ Tân Mỹ xin thông báo chương trình Lễ Khai Giảng như sau:\n\n1. Thời gian tập trung: 06h30 Chúa Nhật, ngày 06/09/2026 tại khuôn viên Giáo xứ.\n2. Thánh Lễ Tạ Ơn & Khai Giảng: 07h00 - 08h30 do Cha Tuyên Úy chủ tế.\n3. Quy định trang phục: Đồng phục Thiếu Nhi Thánh Thể chỉnh tề (áo trắng có huy hiệu, khăn quàng đúng ngành, quần sẫm màu).\n4. Sinh hoạt nhận lớp: Ngay sau Thánh lễ, các em sẽ di chuyển về các phòng học Giáo lý tương ứng theo sơ đồ hướng dẫn của Huynh Trưởng phụ trách.\n\nKính mong quý phụ huynh nhắc nhở và đưa đón các em đúng giờ để buổi lễ diễn ra trang nghiêm và sốt sắng.",
                'is_pinned' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_id' => 'NEWS02',
                'title' => 'Lịch Phân Công Huynh Trưởng - Giáo Lý Viên Đứng Lớp Năm Học 2026 - 2027',
                'category' => 'GLV',
                'date' => '24/08/2026',
                'author' => 'Cha Tuyên Úy & Ban Điều Hành',
                'summary' => 'Công bố quyết định phân công phụ trách giảng dạy cho 41 Anh Chị Huynh Trưởng & GLV tại 14 lớp thuộc 5 khối Giáo Lý.',
                'content' => "Quyết định phân công nhiệm vụ giảng dạy Giáo lý niên khóa 2026 - 2027:\n\n- Tổng số GLV đứng lớp: 41 Huynh Trưởng & GLV.\n- Khối Khai Tâm (Dự Bị, KT1, KT2): 8 GLV phụ trách.\n- Khối Rước Lễ (RL1, RL2, RL3): 9 GLV phụ trách.\n- Khối Thêm Sức (TS1, TS2, TS3): 9 GLV phụ trách.\n- Khối Bao Đồng (BD1, BD2, BD3): 9 GLV phụ trách.\n- Khối Vào Đời (VD1, VD2): 6 GLV phụ trách.\n\nKính mời quý Anh Chị GLV kiểm tra thông tin phân công chi tiết tại mục \"Lớp Giáo Lý\" và \"Giáo Lý Viên\" trên cổng thông tin này.",
                'is_pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_id' => 'NEWS03',
                'title' => 'Quy Định Về Giờ Lễ Thứ 5 và Lễ Chúa Nhật Của Thiếu Nhi',
                'category' => 'Lịch Lễ',
                'date' => '20/08/2026',
                'author' => 'Ban Phụng Vụ Xứ Đoàn',
                'summary' => 'Thông báo chi tiết thời gian sinh hoạt, tham dự Thánh lễ Thứ 5 và Chúa Nhật dành cho tất cả các ngành Chiên Con, Ấu Nhi, Thiếu Nhi, Nghĩa Sĩ.',
                'content' => "Lịch Phụng Vụ & Sinh Hoạt Cố Định Hằng Tuần:\n\n1. Thánh Lễ Chiều Thứ 5:\n   - Tập trung & điểm danh: 17h45 tại nhà thờ.\n   - Thánh Lễ: 18h00 - 18h45.\n\n2. Thánh Lễ & Học Giáo Lý Chúa Nhật:\n   - Tập trung chào cờ TNTT: 06h45.\n   - Thánh Lễ Thiếu Nhi: 07h00 - 08h00.\n   - Giờ học Giáo Lý: 08h15 - 09h30.\n\nĐiểm chuyên cần tham dự Lễ Thứ 5, Lễ Chúa Nhật và Giờ học Giáo lý sẽ được tính trực tiếp vào Sổ Điểm Điện Tử của từng em.",
                'is_pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_id' => 'NEWS04',
                'title' => 'Chương Trình Sa Mạc Huấn Luyện Huynh Trưởng "Vươn Lên Với Chúa Kitô"',
                'category' => 'Sự Kiện',
                'date' => '15/08/2026',
                'author' => 'Ban Huấn Luyện TNTT',
                'summary' => 'Kế hoạch tổ chức sa mạc bồi dưỡng linh đạo, kỹ năng quản trò và phương pháp sư phạm Giáo lý cho toàn thể Huynh Trưởng.',
                'content' => "Khóa Sa Mạc Huấn Luyện Huynh Trưởng - GLV Năm 2026:\n\n- Chủ đề: \"Vươn Lên Với Chúa Kitô\"\n- Thời gian: 2 ngày 1 đêm (thứ Bảy và Chúa Nhật cuối tháng 8/2026).\n- Nội dung: Linh đạo TNTT, phương pháp dạy Giáo lý trực quan, sơ cấp cứu, kỹ năng gút dây, mật thư và tinh thần đồng đội.\n- Yêu cầu: 100% GLV trong danh sách đứng lớp tham dự đầy đủ.",
                'is_pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_id' => 'NEWS05',
                'title' => 'Họp Mặt Phụ Huynh Đầu Năm Học & Trao Đổi Đồng Hành Cùng Con Em',
                'category' => 'Phụ Huynh',
                'date' => '10/08/2026',
                'author' => 'Ban Giáo Lý Xứ Đoàn',
                'summary' => 'Trân trọng kính mời quý phụ huynh tham dự buổi gặp gỡ đầu năm để thống nhất nội quy và phương thức nhận thông tin điểm số qua Sổ Điểm Điện Tử.',
                'content' => "Kính gửi Quý Phụ Huynh,\n\nNhằm tạo sự gắn kết chặt chẽ giữa Gia Đình và Xứ Đoàn trong việc giáo dục đức tin cho các em, Ban Giáo Lý trân trọng kính mời quý phụ huynh tham dự buổi họp mặt:\n\n- Thời gian: 09h30 Chúa Nhật, ngày 13/09/2026 (sau giờ học Giáo lý).\n- Địa điểm: Hội trường Giáo xứ Tân Mỹ.\n- Nội dung: Giới thiệu chương trình học các khối, quy chế chuyên cần, hướng dẫn tra cứu Sổ Điểm Điện Tử và Phiếu Báo Điểm cá nhân.\n\nSự hiện diện của quý phụ huynh là niềm khích lệ to lớn cho các em thiếu nhi và ban giáo lý.",
                'is_pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_id' => 'NEWS06',
                'title' => 'Kế Hoạch Khảo Sát & Đánh Giá Chất Lượng Học Kỳ 1 (HK1)',
                'category' => 'Lịch Lễ',
                'date' => '05/08/2026',
                'author' => 'Ban Khảo Thí & Học Vụ',
                'summary' => 'Hướng dẫn cơ cấu điểm kiểm tra miệng, 15 phút, 1 tiết và thi học kỳ theo chuẩn chương trình Giáo lý Tân Mỹ.',
                'content' => "Kế hoạch đánh giá kết quả học tập Giáo lý HK1:\n\n1. Điểm Chuyên cần: Tính theo tỷ lệ tham gia Lễ Thứ 5, Lễ Chúa Nhật và Giờ học Giáo lý (Hệ số 5).\n2. Điểm Kiểm tra môn Giáo lý:\n   - Điểm Miệng: Hệ số 1 (trong các giờ học).\n   - Kiểm tra 15 phút: Hệ số 1 (tuần 6 của học kỳ).\n   - Kiểm tra 1 Tiết: Hệ số 2 (tuần 10 của học kỳ).\n   - Thi Học Kỳ: Hệ số 3 (cuối học kỳ).\n\nKết quả sẽ được công bố trên Sổ Điểm Điện Tử và gửi Phiếu Báo Điểm về cho gia đình.",
                'is_pinned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
