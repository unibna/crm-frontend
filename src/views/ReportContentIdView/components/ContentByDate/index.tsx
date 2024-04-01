// Libraries
import { useState, useEffect } from "react";
import { SummaryItem, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { styled } from "@mui/material/styles";
import map from "lodash/map";
import filter from "lodash/filter";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DataGrid from "components/DataGrid";
import { Span } from "components/Labels";
import InfoIcon from "@mui/icons-material/Info";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDate, fDateTime } from "utils/dateUtil";
import { columnShowContentIdTotalByContentIDDetailByDate } from "views/ReportContentIdView/constants/total";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";
import {
  arrColumnShowInfo,
  propsTableDefault,
  handleDataQualified,
} from "views/ReportContentIdView/constants";

// ----------------------------------

interface Props {
  summaryData: SummaryItem[];
  params: Partial<any>;
}

const ContentStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1.5),
  paddingLeft: theme.spacing(4),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.success.lighter,
  color: theme.palette.text.primary,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const ContentShowNote = ({
  notes = [],
  value = "",
}: {
  notes: { created_by_name: string; note: string; created: string }[];
  value: string;
}) => {
  const { dataPopup, setDataPopup } = usePopup();

  const handleOpenPopup = () => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender = () => (
      <Grid>
        {map(notes, (item) => (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Span color="warning">{item.created_by_name}</Span>
              <InfoStyle variant="caption">{fDateTime(item.created)}</InfoStyle>
            </Stack>
            <ContentStyle>
              <div dangerouslySetInnerHTML={{ __html: item.note }} />
            </ContentStyle>
          </Box>
        ))}
      </Grid>
    );
    let defaultData = {};
    defaultData = {
      name: "",
    };

    setDataPopup({
      ...dataPopup,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: "Ghi chú",
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter: false,
    });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body2">{fDate(value)}</Typography>
      {notes.length ? (
        <Box sx={{ cursor: "pointer" }} onClick={handleOpenPopup}>
          <InfoIcon color="info" fontSize="medium" />
        </Box>
      ) : null}
    </Stack>
  );
};

const ContentByDate = ({ params: paramProps, summaryData }: Props) => {
  const { newCancelToken } = useCancelToken();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [params, setParams] = useState({
    limit: 200,
    page: 1,
    ...paramProps,
    ordering: "-created_date",
  });
  const [dataTotal, setDataTotal] = useState(0);
  const [totalRow, setTotalRow] = useState<any>({});
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowContentIdTotalByContentIDDetailByDate.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowContentIdTotalByContentIDDetailByDate.columnsShowHeader)
  );

  useEffect(() => {
    getListDataDetail();
  }, [params]);

  const getListDataDetail = async () => {
    setLoading(true);

    const resultOne = await reportMarketing.get(
      {
        content_id: paramProps.ad_name,
        limit: 100,
        cancelToken: newCancelToken(),
      },
      "content-id-notes/"
    );

    const resultTwo = reportMarketing.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "aggregated/date/"
    );

    const result: any = await Promise.all([resultOne, resultTwo]);

    if (result.length) {
      const resultsNote = getObjectPropSafely(() => result[0].data);
      const resultsByDate = getObjectPropSafely(() => result[1].data);

      const newData = map(resultsByDate.results || [], (item: any) => {
        const noteByDate = filter(
          resultsNote.results,
          (option) => fDate(option.created) === fDate(item.created_date)
        );

        return {
          ...item,
          created_date_show: {
            content: <ContentShowNote notes={noteByDate} value={item.created_date} />,
          },
          ...handleDataQualified(item),
        };
      });

      setData(newData);
      setDataTotal(resultsByDate.count);
      setTotalRow(resultsByDate.total);
    }

    setLoading(false);
  };

  const handleChangeSorting = (value: any) => {
    const ordering = value[0].sort === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams((params: any) => {
      return { ...params, ordering };
    });
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  return (
    <DataGrid
      {...propsTableDefault}
      isShowListToolbar={false}
      isTableDetail
      heightProps={700}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      totalSummaryRow={totalRow}
      isLoadingTable={isLoading}
      summaryDataColumns={summaryData}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columnShowContentIdTotalByContentIDDetailByDate.columnShowTable,
      }}
      handleSorting={handleChangeSorting}
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

export default ContentByDate;
