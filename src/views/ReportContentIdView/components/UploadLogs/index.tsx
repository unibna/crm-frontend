// Libraries
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DataGrid from "components/DataGrid";
import { FormValuesProps } from "components/Popups/FormPopup";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Types
import { ContentIdPhoneLeadType } from "_types_/ContentIdType";
import { ColumnTypeDefault } from "_types_/ColumnType";
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants & Utils
import { columnShowUploadLogs } from "views/ReportContentIdView/constants/phoneLead";
import { chooseParams } from "utils/formatParamsUtil";
import { arrRenderFilterDateDefault } from "constants/index";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";

// -----------------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  ruleName: string;
  optionCustomer: SelectOptionType[];
}

const UpdateLogs = (props: Props) => {
  const { ruleName, optionCustomer } = props;
  const { newCancelToken } = useCancelToken();
  const [data, setData] = useState<ContentIdPhoneLeadType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowUploadLogs.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<
    ColumnTypeDefault<ContentIdPhoneLeadType>[]
  >(getColumnsShow(columnShowUploadLogs.columnsShowHeader));
  const [params, setParams] = useState<
    Partial<{
      page: number;
      limit: number;
      ordering: string;
      date_from?: string;
      date_to?: string;
    }>
  >({
    page: 1,
    limit: 200,
    ordering: "",
  });
  const [dataTotal, setDataTotal] = useState(0);

  useEffect(() => {
    getListUplodaLogs(
      chooseParams(
        {
          rule_name: ruleName,
          limit: 100,
          ...params,
          created_from: params.date_from,
          created_to: params.date_to,
        },
        ["rule_name", "limit", "created_from", "", "created_to", "customer_id"]
      )
    );
  }, [params]);

  const getListUplodaLogs = async (paramsAgs: Partial<any>) => {
    setLoading(true);
    const result: any = await reportMarketing.get(
      { ...paramsAgs, cancelToken: newCancelToken() },
      "google/click-converions/upload/logs/"
    );

    if (result && result.data) {
      const { results = [], count } = result.data;

      setData(results);
      setDataTotal(count);
    }

    setLoading(false);
  };

  const handleFilter = (paramsAgs: any) => {
    setParams({
      ...params,
      ...paramsAgs,
    });
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        title: "Tài khoản khách hàng",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...optionCustomer,
        ],
        label: "customer_id",
        defaultValue: "all",
      },
      ...arrRenderFilterDateDefault,
    ];

    return (
      <HeaderFilter
        isShowPopupFilter={false}
        params={params}
        columns={{
          resultColumnsShow: columnShowUploadLogs.columnsShowHeader,
          columnsShow: columnShowUploadLogs.columnShowTable,
        }}
        dataRenderHeader={dataRenderHeader}
        handleFilter={handleFilter}
      />
    );
  };

  return (
    <DataGrid
      data={data}
      heightProps={600}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      isLoadingTable={isLoading}
      columns={columnShowUploadLogs.columnsShowHeader}
      columnWidths={columnWidths}
      contentOptional={{
        arrColumnOptional: ["warehouse", "quantity"],
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: [
          "rule_name",
          "created",
          "conversion_action_name",
          "customer_id",
          "uploaded_clicks",
          "successful",
          "error",
        ],
        infoCell: columnShowUploadLogs.columnShowTable,
      }}
      arrAttachUnitVnd={["sale_price", "purchase_price"]}
      arrColumnThumbImg={["thumb_img"]}
      arrColumnEditLabel={["is_confirm"]}
      renderHeader={renderHeader}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default UpdateLogs;
