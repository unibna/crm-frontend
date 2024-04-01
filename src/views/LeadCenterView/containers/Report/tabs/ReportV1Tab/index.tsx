import { Paper } from "@mui/material";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadReportType } from "_types_/PhoneLeadType";
import { MultiSelect } from "components/Selectors";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import useIsMountedRef from "hooks/useIsMountedRef";
import map from "lodash/map";
import tail from "lodash/tail";
import { useCallback, useContext, useEffect, useState } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";
import ReportSummaryTable from "views/LeadCenterView/components/tables/ReportSummaryTable";
import { REPORT_BY_OPTIONS, SUMMARY_REPORT_COLUMNS } from "views/LeadCenterView/constants/columns";
import { ReportPhoneLeadContext } from "views/LeadCenterView/containers/Report";
import SummaryColumns from "./SummaryColumns";
import { formatExportFunction } from "features/lead/exportData";

const ReportTab = () => {
  const { user } = useAuth();
  const isMounted = useIsMountedRef();

  const context = useContext(ReportPhoneLeadContext);
  const [data, setData] = useState<PhoneLeadReportType[]>([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRow, setTotalRow] = useState<undefined | Partial<PhoneLeadReportType>>(undefined);

  const getData = useCallback(async () => {
    if (user) {
      setLoading(true);
      const report = await phoneLeadApi.getReport({ params: context?.reportV1Params });
      if (report.data) {
        setData(
          map(report.data, (item) => ({ ...item, buy_rate: item?.buy / item?.post_qualified }))
        );
        setDataTotal(report.count);
        setTotalRow({
          ...report.total,
          buy_rate: (report.total?.buy || 0) / (report.total?.post_qualified || 1),
        });
      }
      setLoading(false);
    }
  }, [user, context?.reportV1Params]);

  const handleChangeDimension = (dimension: string) => {
    if (dimension) {
      const reportBy = REPORT_BY_OPTIONS.find((option) => option.value === dimension);
      if (reportBy) {
        context?.setReportV1Columns([
          { title: reportBy?.label, name: reportBy?.value?.toString() },
          ...tail(context?.reportV1Columns),
        ]);
        context?.setReportV1CW([
          { columnName: reportBy?.value?.toString(), width: context?.reportV1CW[0].width },
          ...tail(context?.reportV1CW),
        ]);
      }
    }
  };

  const onSetParams = (
    name: string,
    value: string | number | "all" | "none" | (string | number)[]
  ) => {
    handleChangeDimension(value.toString());
    context?.setReportV1Params((params: any) => {
      return { ...params, dimension: value };
    });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const isController = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
  );

  return (
    <Paper variant="outlined" style={{ marginBottom: 24 }}>
      <PhoneLeadHeader
        params={context?.reportV1Params}
        setParams={(newParams) => {
          newParams.dimension && handleChangeDimension(newParams.dimension);
          context?.setReportV1Params((params: any) => {
            return { ...params, ...newParams };
          });
        }}
        isFilterChannel
        isFilterFanpage
        isFilterHandler={isController}
        isFilterCreator={isController}
        isFilterProduct
        isFilterCreatedDate
        isFilterAssignedDate
        isFilterProcessTime
        exportData={data}
        columns={context?.reportV1Columns}
        hiddenColumnNames={context?.reportV1HC}
        formatExportFunc={(item) =>
          formatExportFunction(
            item,
            map(context?.reportV1Columns, (item) => item.name)
          )
        }
        setFullRow={() => context?.setFullReportV1Table((prev) => !prev)}
        isFullRow={context?.isFullReportV1Table}
        setHiddenColumnNames={context?.setReportV1HC}
        exportFileName="Báo cáo lead v1"
        onRefresh={getData}
        leftChildren={
          <MultiSelect
            title="Báo cáo theo"
            options={REPORT_BY_OPTIONS}
            onChange={(value: string) => {
              onSetParams("dimension", value);
            }}
            label="dimension"
            defaultValue={context?.reportV1Params?.dimension}
            simpleSelect
            outlined
            fullWidth
            selectorId="report-lead-by-dimension-selector"
            isAllOption={false}
          />
        }
      />
      <ReportSummaryTable
        setParams={context?.setReportV1Params}
        columns={context?.reportV1Columns}
        data={{ data, count: dataTotal, loading }}
        params={context?.reportV1Params}
        SummaryColumnsComponent={(itemProps) => (
          <SummaryColumns value={itemProps.value} column={itemProps.column} row={itemProps.row} />
        )}
        columnOrders={context?.reportV1CO}
        setColumnOrders={context?.setReportV1CO}
        hiddenColumnNames={context?.reportV1HC}
        columnWidths={context?.reportV1CW}
        reportFor="report_lead_v1"
        isFullRow={context?.isFullReportV1Table}
        setColumnWidths={context?.setReportV1CW}
        summaryColumns={SUMMARY_REPORT_COLUMNS}
        totalRow={totalRow}
      />
    </Paper>
  );
};

export default ReportTab;
