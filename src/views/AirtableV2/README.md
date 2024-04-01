## Cấu trúc Skytable tương ứng với AirTable
- Skytable = 1 base trên AirTable
- 1 base gồm nhiều table
- 1 table sẽ gồm nhiều view (GridView, KanbanView,...)

## Cấu trúc cơ bản của 1 Table
- Gồm: tên, quyền, view
- Mỗi table sẽ có 1 GridView là view gốc

## Cấu trúc cơ bản của 1 View
- Gồm: tên, quyền, loại view
- Data trên các view đồng bộ, chỉ khác nhau ở config view như filter, sort, hidden fields, vv... còn về các hàng, các cột, dữ liệu trong 1 cell thì không đổi - tức là data ở các view là như nhau chỉ khác cách hiển thị

## Quyền trong Skytable
- Có 2 cấp: theo bảng và theo view
- Theo bảng:
    + Danh sách bảng: (chỉnh sửa trong Setting và vào mục Skytable)
        - Đọc và ghi: user có thể truy cập vào Skytable ở menu hoặc đường dẫn, có thể xem và chỉnh sửa và xoá tất cả các bảng và các view có trong Skytable
        - Chỉ đọc: user có thể truy cập vào Skytable ở menu hoặc đường dẫn nhưng xem và chỉnh sửa thì phụ thuộc cấu hình quyền của mỗi bảng
    + Tạo bảng: (chỉnh sửa trong Setting và vào mục Skytable)
        - Đọc và ghi: user cho phép tạo bảng (ở UI hiển thị các bảng có thêm button để tạo bảng mới)
    + Xoá bảng: (chỉnh sửa trong Setting và vào mục Skytable)
        - Đọc và ghi: ở những bảng mà user có thể xem, sẽ cho phép user xoá bảng
    + Chi tiết trong 1 bảng:
        - Quyền xem: user có thể xem bảng nhưng không thể chỉnh sửa, xoá
        - Quyền chỉnh sửa: user có thể xem, xoá, sửa bảng (full quyền đối với view)
- Theo view:
    + Chi tiết trong 1 view:
        - Quyền xem: user có thể truy cập vào bảng và chỉ xem được view được phân quyền
        - Quyền chỉnh sửa: user có thể truy cập vào bảng và có thể xem, xoá, sửa view được phân quyền

## Cấu trúc thư mục Skytable
### components
- Cells
    + Chứa các component render một cell trong Grid
    - EditDateCell.tsx
        + Component render cell chỉnh sửa ngày
    - EditDateTimeCell.tsx
        + Component render cell chỉnh sửa ngày và giờ
    - EditTextCell.tsx
        + Component render cell chỉnh sửa giá trị trong input

- Filter
    + Chứa component Filter (Lọc theo điều kiện) trong các View
    - components
        - FilterCondition.tsx
            + Component 1 điều kiện lọc
        - FilterConditionGroup.tsx
            + Component 1 nhóm điều kiện lọc
    - AbstractFilterItem.ts
        + Cấu trúc dữ liệu định nghĩa kiểu đối tượng Filter (Class cha)
    - FilterItem.ts
        + Lớp con FilterItem kế thừa lớp cha là AbstractFilterItem - type của 1 điều kiện đơn
    - FilterSet.ts
        + Lớp con FilterSet kế thừa lớp cha là AbstractFilterItem - type của 1 điều kiện phức
    - index.tsx
        + Component hoàn chỉnh của Filter bao gồm cả button để mở form thêm điều kiện lọc

- Form 
    - LinkRecordForm
        + Compnent render 1 form popup khi người dùng edit 1 cell có type là LINK_TO_RECORD, nó sẽ hiển thị tất cả record của bảng được liên kết trong 1 danh sách để user có thể chọn
    - index.tsx
        + Component render dữ liệu của 1 record dưới dạng form nhập liệu

- Sort
    + Chứa component Sort (Sắp xếp) trong các View
    - components
        - SortCondition.tsx
            + Component 1 điều kiện sắp xếp
    - index.tsx
        + Component hoàn chỉnh của Sort bao gồm cả button để mở form thêm điều kiện sort

- views
    + Chứa component các loại View của 1 Table
    - Grid
        + GridView: view dạng bảng
        - ButtonAddField.tsx
            + Component render button và form popup xử lý chức năng thêm một cột mới vào grid
        - ButtonAddRow.tsx
            + Component button thêm một hàng mới vào grid
        - ButtonScrollToBottom.tsx
            + Component button scroll tới cuối bảng
        - CommonComponents.tsx
            + Chứa style và các styled components để sử dụng chung trong GridView
        - DraggableHeader.tsx
            + Component render header của 1 column có thể kéo thả
        - DragHandle.tsx
            + Component render button kéo thả
        - EditFieldConfig.tsx
            + Component render button và form popup xử lý chức năng chỉnh sửa config của 1 cột
        - FooterSelect.tsx
            + Component render cell footer của 1 cột trong grid dưới dạng select, select chứa các option là các hàm toán học, khi người dùng chọn option nào thì áp dụng hàm toán học đó để tính toán cho tất cả dữ liệu của cột để ra 1 kết quả duy nhất và hiển thị ra
        - GridBody.tsx
            + Component render body của grid
        - GridCell.tsx
            + Component render 1 cell của grid
        - MenuHeader.tsx
            + Component render button và menu popup chứa các option là các thao tác đối với 1 cột
        - MenuRowAcions.tsx
            + Component render menu context khi dùng click chuột phải 1 hàng
        - NewFieldForm.tsx
            + Component render form setup thông tin khi người dùng 1 tạo 1 cột mới
        - Toolbar.tsx
            + Component render thanh toolbar của grid
        - index.tsx
            + Component GridView
    - Kanban
        + KanbanView: view dạng Kanban
        - KanbanColumn.tsx 
            + Component render một cột trong Kanban
        - KanbanColumnAdd.tsx
            + Component render cột thêm mới 1 một
        - KanbanMenuHeader.tsx
            + Component render button và menu popup chứa các option là các thao tác đối với 1 cột 
        - KanbanTaskCard.tsx
            + Component render 1 card chứa dữ liệu 1 record - đối tượng để kéo thả
        - SkeletonKanbanColumn.tsx
            + Component skeleton loading của 1 cột 
        - index.tsx
            + Component KanbanView

- AttachmentReviewer.tsx 
    + Component render form popup review file

- BaseBox.tsx
    + Component render button đại diện cho 1 table trong List Table

- ButtonAddView.tsx
    + Component render button và form popup xử lý chức năng thêm một view mới vào table

- ButtonHistoryLog.tsx
    + Component render button và form popup hiển thị lịch sử

- ColorPicker.tsx
    + Component render button và popup chọn màu

- ComplexSelect.tsx
    + Component render select chung cho các loại select của Skytable 

- EditBaseConfig.tsx
    + Component render button và form popup xử lý chức năng chỉnh sửa config của 1 bảng

- EditText.tsx
    + Component render custom TextField sử dụng để render các input trong các cell của GridView

- FormConfig.tsx
   + Component render form popup dùng chung để chỉnh sửa tên bảng, tên view, tên trường,vv...

- Header.tsx
    + Component render header của 1 table bao gồm button back, tên bảng, button add view, button show history

- IndeterminateCheckbox.tsx
    + Component render 1 checkbox Indeterminate,
    + Checkbox thông thường chỉ có hai trạng thái: checked (được chọn) và unchecked (không được chọn). Khi một checkbox được chọn, nó sẽ ở trạng thái checked và khi nó không được chọn, nó sẽ ở trạng thái unchecked.
    + Trong khi đó, IndeterminateCheckbox có thể có ba trạng thái: checked (được chọn), unchecked (không được chọn) và indeterminate (không xác định). Trạng thái indeterminate được sử dụng để biểu thị rằng một tập hợp các checkbox không đồng nhất về trạng thái của chúng.

- MenuConfigTable.tsx
    + Component render menu với các option là các thao tác đối với bảng (thêm, xoá, sửa,...)

- MenuOption.tsx
    + Component render menu để xem, thêm, xoá, sửa các lựa chọn (choices) cho các cột có dạng select

- MenuRecord.tsx
    + Component render menu với mỗi option là mỗi record của bảng đầu vào

- NewViewForm.tsx
    + Component render button và form popup xử lý chức năng thêm mới một view

- PermissionConfig.tsx
    + Component render form popup chỉnh sửa quyền

- Tag.tsx
    + Component render tag dạng như chip hoặc label (thường dùng để hiển thị các value của option trong component select)

- TextLink.tsx
    + Component render 1 Typography chung để hiển thị dữ liệu tuỳ biến

- UploadAttachment.tsx
    + Component render form popup upload các file đính kèm

### containers
- LisTable
    + Component render UI danh sách các bảng có trong Skytable
- Table
    + Component render UI 1 bảng trong Skytable
### utils
- gridUtil.ts
    + Các hàm xử lý trong GridView
- tableUtils.ts
    + Các hàm xử lý trong Table

### constants.tsx
    + Các hàm, biến hằng trong Skytable

### context.tsx
    +  Reducer, Context, Context Provider các state dùng chung của Skytable

### index.tsx
    + View chính của Skytable




   
    

