## Cấu trúc thư mục Dashboard Sale

### comoponents
- ChartReportByDate
    + Biểu đồ đường báo cáo hoạt động của phòng theo ngày
- ChartReportTotalByDate
    + Biểu đồ đường báo cáo kết quả kinh doanh theo thời gian
- TableCompareTotalRevenue
    + Báo cáo so sánh kết quả doanh thu theo khoảng thời gian
- TableRanking
    + Bảng xếp hạng doanh thu của nhân viên TLS (doanh thu tổng, doanh thu CRM, doanh thu Cross Sale)
- TableTotalReport  
    + Báo cáo hoạt động của sale online theo nhiều dimension
### containers
    + Container dashboard sale
### constants.ts
    + Biến, hàm dùng chung trong Dashboard Sale
### context.ts
    + Context quản lý state của TableCompareTotalRevenue và TableTotalReport
### index.tsx
    + View chính của dashboard sale