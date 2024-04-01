import { useCallback, useEffect, useState } from "react";
import { ReportSaleType } from "_types_/PhoneLeadType";
import useAuth from "hooks/useAuth";
import { yyyy_MM_dd } from "constants/time";
import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { HEIGHT_DEVICE } from "constants/index";
import omit from "lodash/omit";
import { useCancelToken } from "hooks/useCancelToken";
import WrapPage from "layouts/WrapPage";
import SummaryColumnsV2 from "views/LeadCenterView/components/columns/SummaryColumnsV2";
import { isReadAndWriteRole } from "utils/roleUtils";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";
import useIsMountedRef from "hooks/useIsMountedRef";
import { ErrorName } from "_types_/ResponseApiType";
import ReportSummaryTable from "views/LeadCenterView/components/tables/ReportSummaryTable";
import { saleApi } from "_apis_/sale.api";
import { formatExportFunction } from "features/lead/exportData";
import { useSelector } from "react-redux";
import { leadStore } from "store/redux/leads/slice";
import { toSimplest } from "utils/stringsUtil";

const columns: Column[] = [
  { title: "Thao tác", name: "assign_action" },
  { title: "Sản phẩm", name: "lead_product" },
  { title: "Thời gian tạo số", name: "lasted_created_date" },
  { title: "Tổng Lead", name: "total_lead" },
  { title: "Đã chia số", name: "assigned_lead" },
  { title: "Chờ chia số", name: "unassigned_lead" },
  { title: "Tỉ lệ chốt", name: "purchase_rate" },
];

const exportKeys = [
  "assign_action",
  "lead_product",
  "lasted_created_date",
  "total_lead",
  "assigned_lead",
  "unassigned_lead",
  "purchase_rate",
];

export const columnWidths: TableColumnWidthInfo[] = [
  { width: 365, columnName: "assign_action" },
  { width: 220, columnName: "lead_product" },
  { width: 100, columnName: "lasted_created_date" },
  { width: 100, columnName: "total_lead" },
  { width: 100, columnName: "assigned_lead" },
  { width: 100, columnName: "unassigned_lead" },
  { width: 100, columnName: "purchase_rate" },
];

export const summaryColumns = [
  { type: "sum", columnName: "total_lead" },
  { type: "sum", columnName: "assigned_lead" },
  { type: "sum", columnName: "unassigned_lead" },
  { type: "sum", columnName: "purchase_rate" },
];

const AssignLeadItemForSaleTable = () => {
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const isMounted = useIsMountedRef();
  const [data, setData] = useState<{
    data: ReportSaleType[];
    loading: boolean;
    count: number;
    totalRow?: ReportSaleType;
  }>({
    data: [],
    count: 0,
    loading: false,
    totalRow: undefined,
  });

  const channelAttributes = useSelector(leadStore).attributes.channel;

  const [params, setParams] = useState<any>({
    limit: 500,
    page: 1,
    created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
    created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    dimension: ["lead_product"],
    dateValue: 31,
  });
  const [isFullRow, setIsFullRow] = useState(false);
  const [hiddenColumnNames, setHiddenColumnNames] = useState([]);

  const getData = useCallback(async () => {
    if (user) {
      setData((prev) => ({ ...prev, loading: true }));

      const report = await saleApi.get<ReportSaleType>(
        {
          ...omit(params, "channel", "product"),
          lead_product: params.product,
          lead_channel: params.channel,
          cancelToken: newCancelToken(),
        },
        "manager/pivot/"
      );
      if (report?.data) {
        setData((prev) => ({
          ...prev,
          data: report.data.results,
          loading: false,
          count: report.data.count || 0,
          totalRow: report.data.total,
        }));
        return;
      }

      if ((report?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }

      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [user, params, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  const isController = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
  );

  const crmChannel = channelAttributes
    .filter((item) => toSimplest(item.name).includes("crm"))
    .map((item) => item.name);

  return (
    <WrapPage>
      <PhoneLeadHeader
        tableTitle="Bảng chia số tự động CRM"
        params={{ ...params, channel: crmChannel }}
        setParams={(newParams) => {
          setParams((params: any) => {
            return { ...params, ...newParams, channel: params.channel };
          });
        }}
        isFilterFanpage
        isFilterHandler={isController}
        isFilterCreator={isController}
        isFilterProduct
        onRefresh={() => setParams && setParams((prev: any) => ({ ...prev }))}
        exportData={data.data}
        columns={columns}
        isFilterCreatedDate
        isFilterAssignedDate
        isFilterProcessTime
        setFullRow={() => setIsFullRow((prev) => !prev)}
        isFullRow={isFullRow}
        hiddenColumnNames={hiddenColumnNames}
        setHiddenColumnNames={setHiddenColumnNames}
        exportFileName="Báo cáo chia số"
        formatExportFunc={(item) => formatExportFunction(item, exportKeys)}
      />
      <ReportSummaryTable
        setParams={setParams}
        columns={columns}
        defaultColumnWidths={columnWidths}
        data={data}
        params={{ ...params, channel: crmChannel }}
        reportFor="report_lead_v2"
        isFullRow={isFullRow}
        heightTable={isFullRow ? undefined : (HEIGHT_DEVICE * 60) / 110}
        SummaryColumnsComponent={SummaryColumnsV2}
        totalRow={data.totalRow}
        summaryColumns={summaryColumns}
        hiddenColumnNames={hiddenColumnNames}
      />
    </WrapPage>
  );
};

export default AssignLeadItemForSaleTable;
