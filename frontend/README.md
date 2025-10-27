# Learn.io - Improved Learning Platform

## Tổng quan

Learn.io là một nền tảng học tập trực tuyến hiện đại được thiết kế theo phong cách tối giản và thân thiện với người dùng. Nền tảng tích hợp công nghệ blockchain E-Certify để phát hành và xác minh chứng chỉ học tập một cách phi tập trung.

## Tính năng chính

### 🎨 Giao diện hiện đại
- **Layout 3 cột**: Sidebar trái, nội dung chính, sidebar phải
- **Thiết kế responsive**: Tối ưu cho mọi thiết bị
- **Màu sắc hài hòa**: Sử dụng bảng màu tím, xanh, xanh lá cây
- **Animations mượt mà**: Hiệu ứng hover và transition đẹp mắt

### 📚 Quản lý khóa học
- **Dashboard cá nhân**: Theo dõi tiến độ học tập
- **Goals Status**: Hiển thị tiến độ hoàn thành mục tiêu
- **Course Cards**: Thẻ khóa học với thông tin chi tiết
- **Tutor Management**: Quản lý gia sư và người hướng dẫn

### 🔗 Tích hợp Blockchain
- **E-Certify Modal**: Truy cập các tính năng blockchain
- **Admin Dashboard**: Phát hành chứng chỉ
- **Student Wallet**: Xem và quản lý chứng chỉ
- **Verifier Portal**: Xác minh tính xác thực của chứng chỉ

## Cấu trúc dự án

```
frontend/
├── components/
│   ├── AdminDashboard.tsx      # Dashboard quản trị
│   ├── StudentWallet.tsx       # Ví sinh viên
│   ├── VerifierPortal.tsx      # Cổng xác minh
│   ├── WalletProvider.tsx      # Provider cho Solana wallet
│   ├── ECertifyModal.tsx       # Modal tích hợp blockchain
│   ├── NotificationToast.tsx  # Thông báo
│   └── LoadingSpinner.tsx      # Loading states
├── pages/
│   └── index.tsx               # Trang chủ với layout mới
├── styles/
│   └── globals.css             # CSS tùy chỉnh
├── utils/
│   ├── ecertify.ts            # Utilities cho E-Certify
│   ├── bubblegum.ts          # Bubblegum NFT utilities
│   ├── helius.ts              # Helius API integration
│   └── verification.ts        # Verification logic
└── tailwind.config.js         # Cấu hình Tailwind
```

## Cách sử dụng

### 1. Khởi chạy ứng dụng
```bash
cd frontend
npm install
npm run dev
```

### 2. Truy cập các tính năng

#### Giao diện Learn.io
- **Sidebar trái**: Điều hướng chính, thông tin người dùng
- **Nội dung chính**: Dashboard, khóa học, gia sư
- **Sidebar phải**: Tìm kiếm, bộ lọc, khóa học mới

#### Tính năng Blockchain
- Click vào **"E-Certify Blockchain"** trong sidebar trái
- Chọn tab phù hợp:
  - **Admin Dashboard**: Đăng ký issuer, tạo batch, phát hành chứng chỉ
  - **Student Wallet**: Xem chứng chỉ, tạo QR code, chia sẻ
  - **Verify Credentials**: Quét QR code, nhập ID để xác minh

### 3. Tính năng chính

#### Admin Dashboard
- Đăng ký APEC University làm issuer
- Tạo credential batches
- Upload CSV để phát hành hàng loạt chứng chỉ

#### Student Wallet
- Xem danh sách chứng chỉ đã nhận
- Tạo QR code để chia sẻ
- Xem chi tiết metadata của chứng chỉ

#### Verifier Portal
- Quét QR code từ sinh viên
- Nhập Asset ID để xác minh
- Xem kết quả xác minh chi tiết

## Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS với custom theme
- **Blockchain**: Solana, Metaplex Bubblegum
- **Wallet**: Phantom, Solflare
- **API**: Helius DAS API

## Tùy chỉnh

### Màu sắc
Các màu chính được định nghĩa trong `tailwind.config.js`:
- `learn-purple`: Tím chủ đạo
- `learn-blue`: Xanh dương
- `learn-green`: Xanh lá cây

### Components
Các component có thể tái sử dụng:
- `LoadingSpinner`: Loading states
- `NotificationToast`: Thông báo
- `ECertifyModal`: Modal blockchain

## Phát triển tiếp

### Tính năng có thể thêm
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Advanced course filtering
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Analytics dashboard

### Cải thiện UX
- [ ] Keyboard shortcuts
- [ ] Drag & drop functionality
- [ ] Advanced search
- [ ] Course recommendations
- [ ] Social features

## Liên hệ

Để biết thêm thông tin về dự án E-Certify và Learn.io, vui lòng liên hệ với team phát triển.

