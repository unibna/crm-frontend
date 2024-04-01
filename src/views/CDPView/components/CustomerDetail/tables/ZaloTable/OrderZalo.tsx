// Libraries
import { useState, useEffect, useCallback } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import axios, { CancelTokenSource } from "axios";
import drop from "lodash/drop";
import map from "lodash/map";
import { useTheme } from "@mui/material/styles";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Hooks
import usePopup from "hooks/usePopup";

// Components
import DDataGrid from "components/DDataGrid";
import ContentTemplateAutomatic from "views/ZaloView/components/AutomaticNotification/ContentTemplate";
import { Span } from "components/Labels";

// @Types
import { ColumnShow, FacebookType } from "_types_/FacebookType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { dataFilterTypeAutomatic, TypeNotification } from "views/ZaloView/constants";

// --------------------------------------------------ss

const columnShowAutomaticNotification: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "phone" },
    { width: 150, columnName: "is_success" },
    { width: 170, columnName: "type" },
    { width: 150, columnName: "is_received" },
    { width: 150, columnName: "reason_error" },
    { width: 150, columnName: "order_number" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
  ],
  columnsShowHeader: [
    { title: "Số điện thoại", name: "phone", isShow: true },
    { title: "Đơn hàng", name: "order_number", isShow: true },
    { title: "Trạng thái", name: "is_success", isShow: true },
    { title: "Loại", name: "type", isShow: true },
    { title: "Đã nhận", name: "is_received", isShow: true },
    { title: "Lí do lỗi", name: "reason_error", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
};

let cancelRequest: CancelTokenSource;

const OrderZalo = ({
  phone,
  dateParams,
}: {
  phone: string;
  dateParams?: {
    date_from?: string;
    date_to?: string;
    toValue?: string | number;
  };
}) => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [params, setParams] = useState({
    limit: 200,
    page: 1,
    ordering: "-created",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowAutomaticNotification.columnWidths
  );
  const [columnOrders, setColumnOrders] = useState<string[]>([]);

  const { setDataPopup, dataPopup } = usePopup<{
    name: string;
    accessToken: string;
    phone: string;
    password: string;
    shopId: string;
  }>();

  const getListData = useCallback(
    async (params: any) => {
      setLoading(true);

      if (cancelRequest) {
        cancelRequest.cancel();
      }

      cancelRequest = axios.CancelToken.source();

      const result = await zaloApi.get(
        {
          ...params,
          cancelToken: cancelRequest.token,
        },
        "auto-notification-zns/"
      );
      if (result && result.data) {
        const { results = [], count = 0 } = result.data;

        const newData = map(results, (item: any) => {
          return {
            ...item,
            type: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={(item.type === TypeNotification.ORN && "warning") || "info"}
                >
                  {dataFilterTypeAutomatic.find((type) => type.value === item.type)?.label}
                </Span>
              ),
            },
            is_success: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={(item.is_success && "success") || "error"}
                >
                  {item.is_success ? "Thành công" : "Thất bại"}
                </Span>
              ),
            },
            order_number: {
              endpoint: item.order_number,
            },
            operation: {
              isShowView: true,
            },
          };
        });

        setData(newData);
        setDataTotal(count);
      }
      setLoading(false);
    },
    [theme.palette.mode]
  );

  const handleChangePage = (page: number) => {
    setParams((params: any) => {
      return { ...params, page };
    });
  };

  const handleChangeRowsPerPage = (rowInPage: number) => {
    setParams((params: any) => {
      return { ...params, page: 1, limit: rowInPage };
    });
  };

  const handleChangeSorting = (value: any) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams((params: any) => {
      return { ...params, ordering };
    });
  };

  const openPopup = (optional?: any) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Thêm";
    let newContentRender: any;
    let defaultData = {};
    let isDisabledSubmit = true;

    defaultData = {
      template: {},
      templateId: getObjectPropSafely(() => optional.receive_data.template_id),
      templateData: getObjectPropSafely(() => optional.receive_data.content),
    };
    newContentRender = (methods: any) => {
      return <ContentTemplateAutomatic {...methods} />;
    };
    funcContentSchema = (yup: any) => {
      return {
        template: yup.object(),
        templateData: yup.object(),
        templateId: yup.string(),
      };
    };

    setDataPopup({
      ...dataPopup,
      maxWidthForm: "md",
      buttonText: buttonTextPopup,
      isDisabledSubmit,
      isOpenPopup: true,
      title: "Template tài khoản ZNS",
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter: false,
    });
  };

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const newColumnOrder = map(
      columnShowAutomaticNotification.columnsShowHeader,
      (item: any) => item.name
    );
    setColumnOrders(newColumnOrder);
  }, []);

  useEffect(() => {
    if (phone) {
      getListData({
        search: getObjectPropSafely(() => phone[0]) === "8" ? "0" + drop(phone, 2).join("") : phone,
        ...params,
      });
    }
  }, [params, phone, getListData]);

  return (
    <DDataGrid
      titleHeaderTable="Gửi theo đơn hàng"
      isShowListToolbar={false}
      heightProps={300}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columnShowAutomaticNotification.columnsShowHeader}
      columnOrders={columnOrders}
      columnWidths={columnWidths}
      isLoadingTable={isLoading}
      contentOptional={{
        arrColumnOptional: ["type", "is_success"],
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleView: (row: FacebookType) => openPopup(row),
      }}
      isCallApiColumnHandleLink
      arrColumnHandleLink={["order_number"]}
      arrColumnEditLabel={["is_received"]}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={setColumnOrders}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default OrderZalo;
