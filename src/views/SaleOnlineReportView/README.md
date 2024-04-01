## Cấu trúc thư mục của Sale Online Report
### components
- ChartReportByDate
    + Component render Chart Báo cáo hoạt động của phòng theo ngày
- Metrics
    + Component render Các chỉ số (metric)
    + Có 28 chỉ số, mặc định sẽ show ra 8 chỉ số
- TableReportSellerByDate
    + Component render bảng báo cáo thống kê các chỉ số hoạt động theo mỗi nhân viên telesale
- TableReportTeamByDate
    + Component render bảng báo cáo thống kê các chỉ số hoạt động của toàn bộ nhân viên telesale
- Metric.tsx
    + Component render 1 chỉ số
### containers
- Container của SaleOnlineReport
### constants.tsx
- Hàm, biến sửa dụng trong SaleOnline Report
### context.ts
- Chứa reducer của SaleOnline Report
### index.tsx
- View chính của SaleOnline Report