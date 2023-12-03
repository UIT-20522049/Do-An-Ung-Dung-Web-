Các Chức Năng Chính: 

- Đăng nhập, xác thực bằng Clerk
- Trao đổi tin nhắn thời gian thực bằng cách sử dụng Socket.io
- Gửi tệp, file đính kèm dưới dạng tin nhắn sử dụng UploadThing
- Xóa & Chỉnh sửa tin nhắn ngay lập tức cho tất cả người dùng
- Tạo Kênh Gọi Văn bản, Âm thanh và Video
- Trò chuyện 1:1 giữa các thành viên
- Gọi video 1:1 giữa các thành viên
- Share Screen, Streaming
- Quản lý thành viên (Kick, Thay đổi vai trò Khách / Quản trị viên)
- Tạo liên kết mời vào kênh
- Chế độ Sáng / Tối
- Sử dụng cơ sở dữ liệu MySQL

### Cần cài đặt

**Node version 18.x.x**

### Cài đặt gói

```shell
npm i
```

### Setup Prisma

Add MySQL Database (sử dụng PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Chạy App

```shell
npm run dev
```

