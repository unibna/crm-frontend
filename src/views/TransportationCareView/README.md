## Cấu trúc thư mục CSVĐ
### components 
- columns
    + Chứa các customize columns của TransportationVirtualTable (Bảng CSVĐ / Relative Path: src/views/TransportationCareView/components/tables/TransportationVirtualTable.tsx)
    + Chi tiết các column
        - TransportationCustomerColumn: Cột thông tin khách hàng
        - TransportationHandleByActionColumn: Cột chia người nhận xử lý
        - TransportationTaskColumn: Cột thông tin CSVĐ
        - TransportationHandleColumn: Cột thông tin xử lý CSVĐ
        - TransportationOrderInfoColumn: Cột thông tin đợn hàng
        - TransportationOrderModifiedInfoColumn: Cột thông tin xử lý đơn hàng
        - TransportationShippingInfoColumn: Cột thông tin vận đơn
        - TransportationShippingModifiedInfoColumn: Cột thông tin xử lý vận đơn
        - TransportationOrderReasonAndActionColumn: Cột các hướng xử lý và lí do xử lý đã chọn của CSVĐ

    - detailColumns
        + Chứa các customize columns của TransportationVirtualTableDetail (Bảng Lịch sử CSVĐ / Relative Path: src/views/TransportationCareView/components/tables/TransportationVirtualTableDetail.tsx)
        + Chi tiết các column
            - TDetailAction: Cột hướng xử lý task
            - TDetailAppointmentDate: Cột ngày gọi lại
            - TDetailHandleBy: Cột người được chia xử lý
            - TDetailHandleStatus: Cột trạng thái của CSVĐ
            - TDetailModifiedBy: Cột người chỉnh sửa
            - TDetailModifiedDate: Cột thời gian chỉnh sửa
            - TDetailReason: Cột lí do xử lý task
            - TDetailReasonCreatedDate: Cột ngày tạo task

- popups
    - HandlePopup.tsx
        + Popup xử lý 1 CVSĐ

- Report 
    + Báo cáo chia số và báo cáo chăm sóc vận đơn dùng chung component này và phân biệt bằng prop `isHiddenDimension` do 2 báo cáo dùng chung 1 api
    + Báo cáo chia số thì mặc định dimension là `handle_by__name - Người được chia`, báo cáo chia số thì có tất cả dimenson bao gồm cả `handle_by__name - Người được chia`

- tables
    - TransportationVirtualTable.tsx
        + Component bảng CSVĐ
    - TransportationVirtualTableDetail.tsx
        + Component bảng lịch sử CSVĐ

- tabs
    - AttributeTab.tsx 
        + Tab thuộc tính của CSVĐ
    - TransportationCareTab.tsx
        + Tab của 1 trạng thái CSVĐ phân biệt với nhau bằng prop `tabValue`

- TransportationHeader
    + Header của TransportationContainer

- TransportationRowDetail
    + Chi tiết của 1 hàng trong bảng CSVĐ
    + Bao gồm 3 tab: lịch sử đơn hàng, lịch sử vận đơn, lịch sử chăm sóc vận đơn

    - OrderHistoryTable.tsx
        + Lịch sử đơn hàng của đơn được chăm sóc
    - ShippingHistoryTable.tsx
        + Lịch sử vận đơn của đơn được chăm sóc
    - TransportationHistoryTable.tsx
        + Lịch sử chăm sóc vận đơn của đơn được chăm sóc

### containers
- TransportationContainer.tsx
    + Container Trạng thái của CSVĐ

### constants.tsx
- Chứa các hàm, các biến hằng số của CSVĐ

### context.ts
- Chứa hook quản lý các state dùng chung của TransporationCareView

### index.ts
- Chứa view chính của TransporationCareView






