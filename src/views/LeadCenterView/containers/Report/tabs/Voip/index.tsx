import Paper from "@mui/material/Paper";
import { ReportVoipType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import filter from "lodash/filter";
import includes from "lodash/includes";
import map from "lodash/map";
import reverse from "lodash/reverse";
import { useCallback, useContext, useEffect, useState } from "react";
import { fDateTime } from "utils/dateUtil";
import TableVoipHeader from "views/LeadCenterView/components/TableVoipHeader";
import ReportSummaryTable from "views/LeadCenterView/components/tables/ReportSummaryTable";
import { REPORT_VOIP_OPTIONS } from "views/LeadCenterView/constants";
import {
  REPORT_VOIP_COLUMNS_V2,
  REPORT_VOIP_COLUMN_WIDTHS_V2,
  SUMMARY_REPORT_VOIP_COLUMNS,
} from "views/LeadCenterView/constants/columns";
import { ReportPhoneLeadContext } from "views/LeadCenterView/containers/Report";
import { CallAttribute } from "views/LeadCenterView/containers/Status/tabs/AttributeTab/VoipAttribute";
import SummaryColumns from "./SummaryColumns";
import { formatExportReportVoip } from "features/voip/formatData";
import { skycallApi } from "_apis_/skycall.api";

const ReportTab = () => {
  const context = useContext(ReportPhoneLeadContext);
  const userSlice = useAppSelector(getDraftSafeSelector("users"));

  const { newCancelToken } = useCancelToken([context?.reportVoipParams]);
  const [callAttribute, setCallAttribute] = useState<CallAttribute[]>([]);

  const [data, setData] = useState<{
    data: ReportVoipType[];
    count: number;
    loading: boolean;
    total: any;
  }>({ data: [], count: 0, loading: false, total: {} });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await skycallApi.get<ReportVoipType>({
      params: { ...context?.reportVoipParams, cancelToken: newCancelToken() },
      endpoint: "history/report/",
    });
    if (res.data) {
      const { data = [], count = 0, total } = res.data;
      setData({ data, count, loading: false, total });
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [context?.reportVoipParams, newCancelToken]);

  const handleChangeDimension = useCallback(
    () => {
      const { dimension } = context?.reportVoipParams;
      if (dimension) {
        const reportBy = filter(REPORT_VOIP_OPTIONS, (option) =>
          includes(dimension, option.value?.toString())
        );

        const newColumns = reverse(
          map(reportBy, (item) => ({
            title: item.label,
            name: item.name?.toString(),
            columnName: item.name?.toString(),
            width: item.width,
          }))
        );

        if (reportBy) {
          context?.setReportVoipColumns([...newColumns, ...REPORT_VOIP_COLUMNS_V2]);
          context?.setReportVoipCW([...newColumns, ...REPORT_VOIP_COLUMN_WIDTHS_V2]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context?.reportVoipParams.dimension]
  );

  const getCallAttribute = useCallback(async () => {
    const result = await skycallApi.get<CallAttribute>({
      params: { limit: 200, page: 1 },
      endpoint: "call-attribute/",
    });
    if (result.data) {
      const { data = [], total = 0 } = result.data;
      setCallAttribute(data);
    }
  }, []);

  const callAttributeOptions = map(callAttribute, (item) => ({
    value: item.id,
    label: item.value,
  })) as SelectOptionType[];

  const telephonistOptions = map(userSlice.leaderAndTelesaleUsers, (item) => ({
    value: item.name,
    label: item.name,
  })) as SelectOptionType[];

  useEffect(() => {
    Promise.all([getCallAttribute()]);
  }, [getCallAttribute]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    handleChangeDimension();
  }, [handleChangeDimension]);

  return (
    <Paper variant="outlined" style={{ marginBottom: 24 }}>
      <TableVoipHeader
        params={context?.reportVoipParams}
        setParams={(newParams) => {
          context?.setReportVoipParams((params: any) => {
            return { ...params, ...newParams, page: 1 };
          });
        }}
        isFilterVoipReport
        columns={context?.reportVoipColumns}
        isFullRow={context?.isFullReportVoipTable}
        setIsFullRow={() => context?.setFullReportVoipTable((prev) => !prev)}
        hiddenColumnNames={context?.reportVoipHC}
        setHiddenColumns={context?.setReportVoipHC}
        exportFileName={`Bao_cao_phan_load_cuoc_goi_${fDateTime(new Date())}`}
        onRefresh={getData}
        isFilterCallAttribute
        isFilterCallDate
        isFilterTelephonist
        isFilterVoipProccess
        isFilterVoipStatus
        callAttributeOptions={callAttributeOptions}
        telephonistOptions={telephonistOptions}
        exportData={[
          ...data.data,
          {
            ...data.total,
            date: "",
            telephonist: "Tổng kết",
            business_call_type__value: "Tổng kết",
          },
        ]}
        formatExportFunc={formatExportReportVoip}
      />
      <ReportSummaryTable
        setParams={context?.setReportVoipParams}
        columns={context?.reportVoipColumns}
        data={data}
        params={context?.reportVoipParams}
        SummaryColumnsComponent={(itemProps) => (
          <SummaryColumns value={itemProps.value} column={itemProps.column} row={itemProps.row} />
        )}
        columnOrders={context?.reportVoipCO}
        setColumnOrders={context?.setReportVoipCO}
        hiddenColumnNames={context?.reportVoipHC}
        columnWidths={context?.reportVoipCW}
        // reportFor="report_lead_v1"
        isFullRow={context?.isFullReportVoipTable}
        setColumnWidths={context?.setReportVoipCW}
        summaryColumns={SUMMARY_REPORT_VOIP_COLUMNS}
        totalRow={data.total}
        cellStyle={{ height: 50 }}
      />
    </Paper>
  );
};

export default ReportTab;
