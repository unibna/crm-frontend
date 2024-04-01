import { ReportSaleType } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import WrapPage from "layouts/WrapPage";
import { HEIGHT_DEVICE } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import map from "lodash/map";
import omit from "lodash/omit";
import { useCallback, useContext, useEffect, useState } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";
import SummaryColumnsV2 from "views/LeadCenterView/components/columns/SummaryColumnsV2";
import ReportSummaryTable from "views/LeadCenterView/components/tables/ReportSummaryTable";
import {
  SUMMARY_REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_V2,
  groupSummaryItems,
} from "views/LeadCenterView/constants/columns";
import { ReportPhoneLeadContext } from "views/LeadCenterView/containers/Report";
import { saleApi } from "_apis_/sale.api";
import { formatExportFunction } from "features/lead/exportData";
import { formatReportGroupItem } from "features/lead/formatData";

const ReportHandleLeadByProductTable = () => {
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();

  const context = useContext(ReportPhoneLeadContext);
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

  const getData = useCallback(async () => {
    if (user) {
      setData((prev) => ({ ...prev, loading: true }));

      const report = await saleApi.get<ReportSaleType>(
        {
          ...omit(context?.reportHandleLeadByProductParams, "channel", "product"),
          lead_product: context?.reportHandleLeadByProductParams.product,
          lead_channel: context?.reportHandleLeadByProductParams.channel,
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
  }, [user, context?.reportHandleLeadByProductParams, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  const isController = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
  );

  return (
    <WrapPage>
      <PhoneLeadHeader
        params={context?.reportHandleLeadByProductParams}
        setParams={(newParams) => {
          context?.setReportHandleLeadByProductParams((params: any) => {
            return { ...params, ...newParams, channel: params.channel };
          });
        }}
        isFilterFanpage
        isFilterHandler={isController}
        isFilterCreator={isController}
        isFilterProduct
        onRefresh={getData}
        isFilterCreatedDate
        isFilterAssignedDate
        isFilterProcessTime
        exportData={data.data}
        columns={context?.reportHandleLeadByProductColumns}
        hiddenColumnNames={context?.reportHandleLeadByProductHC}
        setHiddenColumnNames={context?.setReportHandleLeadByProductHC}
        formatExportFunc={(item) =>
          formatExportFunction(
            item,
            map(context?.reportHandleLeadByProductColumns, (item) => item.name)
          )
        }
        isFilterHandleStatus
        setFullRow={() => context?.setFullReportHandleLeadByProductTable((prev) => !prev)}
        isFullRow={context?.isFullReportHandleLeadByProductTable}
        tableTitle="Bảng báo cáo chia số Sale theo Sản phẩm"
        exportFileName="Báo cáo chia số Sale theo sản phẩm"
      />
      <ReportSummaryTable
        setParams={context?.setReportHandleLeadByProductParams}
        columns={context?.reportHandleLeadByProductColumns}
        data={data}
        params={context?.reportHandleLeadByProductParams}
        SummaryColumnsComponent={SummaryColumnsV2}
        columnOrders={context?.reportHandleLeadByProductCO}
        setColumnOrders={context?.setReportHandleLeadByProductCO}
        hiddenColumnNames={context?.reportHandleLeadByProductHC}
        columnWidths={context?.reportHandleLeadByProductCW}
        reportFor="report_lead_v2"
        isFullRow={context?.isFullReportHandleLeadByProductTable}
        setColumnWidths={context?.setReportHandleLeadByProductCW}
        summaryColumns={SUMMARY_REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_V2}
        totalRow={data.totalRow}
        grouping={[{ columnName: "lead_product" }]}
        groupSummaryItems={groupSummaryItems}
        formatGroupingItem={formatReportGroupItem}
        heightTable={
          context?.isFullReportHandleLeadByProductTable ? undefined : (HEIGHT_DEVICE * 60) / 110
        }
      />
    </WrapPage>
  );
};

export default ReportHandleLeadByProductTable;
