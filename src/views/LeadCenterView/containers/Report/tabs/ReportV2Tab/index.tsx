import { ReportSaleType } from "_types_/PhoneLeadType";
import { MultiSelect } from "components/Selectors";
import WrapPage from "layouts/WrapPage";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import filter from "lodash/filter";
import includes from "lodash/includes";
import map from "lodash/map";
import omit from "lodash/omit";
import reverse from "lodash/reverse";
import { useCallback, useContext, useEffect, useState } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";
import SummaryColumnsV2 from "views/LeadCenterView/components/columns/SummaryColumnsV2";
import ReportSummaryTable from "views/LeadCenterView/components/tables/ReportSummaryTable";
import {
  REPORT_BY_OPTIONS_V2,
  REPORT_COLUMNS_V2,
  REPORT_COLUMN_WIDTHS_V2,
  SUMMARY_REPORT_COLUMNS_V2,
} from "views/LeadCenterView/constants/columns";
import { ReportPhoneLeadContext } from "views/LeadCenterView/containers/Report";
import { saleApi } from "_apis_/sale.api";
import { formatExportFunction } from "features/lead/exportData";

const ReportTab = () => {
  const { user } = useAuth();

  const context = useContext(ReportPhoneLeadContext);
  const [data, setData] = useState<ReportSaleType[]>([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRow, setTotalRow] = useState<undefined | Partial<ReportSaleType>>(undefined);

  const getData = useCallback(async () => {
    if (user) {
      setLoading(true);
      const report = await saleApi.get<ReportSaleType>(
        {
          ...omit(context?.reportV2Params, "channel", "product"),
          lead_product: context?.reportV2Params.product,
          lead_channel: context?.reportV2Params.channel,
        },
        "manager/pivot/"
      );
      if (report.data) {
        setData(report.data.results);
        setDataTotal(report.data.count || 0);
        setTotalRow(report.data.total);
      }
      setLoading(false);
    }
  }, [user, context?.reportV2Params]);

  const handleChangeDimension = useCallback(
    (dimension?: string) => {
      if (dimension) {
        const reportBy = filter(REPORT_BY_OPTIONS_V2, (option) =>
          includes(dimension, option.value?.toString())
        );

        const newColumns = reverse(
          map(reportBy, (item) => ({
            title: item.label,
            name: item.value?.toString(),
            columnName: item.value?.toString(),
            width: 150,
          }))
        );

        if (reportBy) {
          context?.setReportV2Columns([...newColumns, ...REPORT_COLUMNS_V2]);
          context?.setReportV2CW([...newColumns, ...REPORT_COLUMN_WIDTHS_V2]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSetParams = (
    name: string,
    value: string | number | "all" | "none" | (string | number)[]
  ) => {
    handleChangeDimension(value.toString());
    context?.setReportV2Params((params: any) => {
      return { ...params, dimension: value };
    });
  };

  useEffect(() => {
    if (context?.reportV2Params.dimension) {
      handleChangeDimension(context?.reportV2Params.dimension);
    }
  }, [handleChangeDimension, context?.reportV2Params.dimension]);

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
        setHiddenColumnNames={context?.setReportV2HC}
        params={context?.reportV2Params}
        onRefresh={getData}
        setParams={(newParams) => {
          context?.setReportV2Params((params: any) => {
            return { ...params, ...newParams };
          });
        }}
        isFilterChannelByName
        isFilterProductByName
        isFilterFanpage
        isFilterHandler={isController}
        isFilterCreator={isController}
        isFilterAssignedDate
        isFilterProcessTime
        isFilterCreatedDate
        exportData={data}
        columns={context?.reportV2Columns}
        hiddenColumnNames={context?.reportV2HC}
        formatExportFunc={(item) =>
          formatExportFunction(
            item,
            map(context?.reportV2Columns, (item) => item.name)
          )
        }
        setFullRow={() => context?.setFullReportV2Table((prev) => !prev)}
        isFullRow={context?.isFullReportV2Table}
        exportFileName="Báo cáo lead v2"
        leftChildren={
          <MultiSelect
            title="Báo cáo theo"
            isAllOption={false}
            options={REPORT_BY_OPTIONS_V2}
            onChange={(value) => onSetParams("dimension", value)}
            label="dimension"
            defaultValue={context?.reportV2Params?.dimension}
            outlined
            fullWidth
            selectorId="report-lead-by-dimension-selector-v2"
          />
        }
      />
      <ReportSummaryTable
        setParams={context?.setReportV2Params}
        columns={context?.reportV2Columns}
        data={{ data, count: dataTotal, loading }}
        params={context?.reportV2Params}
        SummaryColumnsComponent={SummaryColumnsV2}
        columnOrders={context?.reportV2CO}
        setColumnOrders={context?.setReportV2CO}
        hiddenColumnNames={context?.reportV2HC}
        columnWidths={context?.reportV2CW}
        reportFor="report_lead_v2"
        isFullRow={context?.isFullReportV2Table}
        setColumnWidths={context?.setReportV2CW}
        summaryColumns={SUMMARY_REPORT_COLUMNS_V2}
        totalRow={totalRow}
      />
    </WrapPage>
  );
};

export default ReportTab;
