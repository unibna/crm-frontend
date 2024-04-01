// Libraries
import { useState, useEffect } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import axios, { CancelTokenSource } from "axios";
import map from "lodash/map";
import tail from "lodash/tail";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Hooks
import usePopup from "hooks/usePopup";

// Components
import DDataGrid from "components/DDataGrid";
import ContentTemplateZns from "views/ZaloView/components/ManualZnsNotification/ContentTemplate";

// @Types
import { ColumnShow, FacebookType } from "_types_/FacebookType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -------------------------------------------

const columnShowZns: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "name" },
    { width: 150, columnName: "is_received" },
    { width: 150, columnName: "is_success" },
    { width: 150, columnName: "is_error" },
    { width: 150, columnName: "created" },
    { width: 150, columnName: "created_by" },
    { width: 150, columnName: "sent_time" },
    { columnName: "operation", width: 150 },
  ],
  columnsShowHeader: [
    { title: "Chiến dịch", name: "name", isShow: true },
    { title: "Đã nhận", name: "is_received", isShow: true },
    { title: "Thành công", name: "is_success", isShow: true },
    { title: "Thất bại", name: "is_error", isShow: true },
    { title: "Người tạo", name: "created_by", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian gửi", name: "sent_time", isShow: true },
    { name: "operation", title: "Thao tác", isShow: true },
  ],
};

let cancelRequest: CancelTokenSource;

const ZnsZalo = ({
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
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [params, setParams] = useState({
    limit: 200,
    page: 1,
    ordering: "-created",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowZns.columnWidths
  );
  const [columnOrders, setColumnOrders] = useState<string[]>([]);

  const { setDataPopup, dataPopup } = usePopup<{
    name: string;
    accessToken: string;
    phone: string;
    password: string;
    shopId: string;
  }>();

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const newColumnOrder = map(columnShowZns.columnsShowHeader, (item: any) => item.name);
    setColumnOrders(newColumnOrder);
  }, []);

  useEffect(() => {
    if (phone) {
      getListData({
        search: phone[0] === "0" ? "84" + tail(phone).join("") : phone,
        ...params,
      });
    }
  }, [params, phone]);

  const getListData = async (params: any) => {
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
      "recipients/"
    );
    if (result && result.data) {
      const { results = [], count = 0 } = result.data;

      const newData = map(results, (item: any) => {
        return {
          ...item,
          operation: {
            isShowView: true,
          },
          name: getObjectPropSafely(() => item.send_request.name),
          created_by: getObjectPropSafely(() => item.send_request.created_by.name),
          sent_time: getObjectPropSafely(() => item.send_request.sent_time),
          is_error: !!getObjectPropSafely(() => item.reason_error),
        };
      });

      setData(newData);
      setDataTotal(count);
    }
    setLoading(false);
  };

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
      return <ContentTemplateZns {...methods} />;
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

  return (
    <DDataGrid
      titleHeaderTable="Gửi theo ZNS"
      isShowListToolbar={false}
      heightProps={300}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columnShowZns.columnsShowHeader}
      columnOrders={columnOrders}
      columnWidths={columnWidths}
      isLoadingTable={isLoading}
      contentOptional={{
        arrColumnOptional: ["type"],
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleView: (row: FacebookType) => openPopup(row),
      }}
      arrColumnEditLabel={["is_received", "is_success", "is_error"]}
      arrColumnThumbImg={["thumb_img"]}
      arrDateTime={["sent_time", "created"]}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={setColumnOrders}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default ZnsZalo;
