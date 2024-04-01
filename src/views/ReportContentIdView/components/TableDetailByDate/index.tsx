// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Components
import TableDetail from "components/DataGrid/components/TableDetail";

// Constants & Utils
import {
  propsTableDefault,
  summaryColumnDefault,
  arrColumnShowInfo,
  handleDataQualified,
} from "views/ReportContentIdView/constants";
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { ContentIdType } from "_types_/ContentIdType";

interface Props {
  params?: Partial<any>;
  endpoint?: string;
  columns: ColumnShowDatagrid<any>;
  handleDataApi?: (item: ContentIdType) => {};
}

const TableDetailByDate = (props: Props) => {
  const { columns } = props;

  return (
    <TableDetail
      {...propsTableDefault}
      heightProps={700}
      host={reportMarketing}
      handleDataApi={handleDataQualified}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnShowTable,
      }}
      columnShowDetail={columns}
      summaryDataColumns={summaryColumnDefault}
      {...props}
    />
  );
};

export default TableDetailByDate;
