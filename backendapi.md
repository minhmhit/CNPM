# branch read_only cho việc chạy backend API
# code mới nhất được cập nhật từ branch minhmh
# Không merge branch này vào branch develop hay main
# Mục đích: chỉ để chạy backend API cho frontend tham chiếu và phát triển giao diện người dùng (UI), tránh việc conflict với code frontend khi thực hiện merge
# Không thực hiện bất kỳ thay đổi nào trên branch này
# Quy trình chạy Backend server:
1. tạo 1 terminal mới
2. checkout branch backendapi
3. chạy lệnh `npm install` để cài đặt các package cần thiết
4. cấu hình file .env (chủ yếu là tên database và port)
5. chạy lệnh `cd Backend`
6. chạy lệnh `npm run dev` để khởi động server