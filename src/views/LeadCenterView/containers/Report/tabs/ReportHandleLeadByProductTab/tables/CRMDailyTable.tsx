import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { phoneLeadApi } from "_apis_/lead.api";
import { CRMDailyResponse } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import { MExportFileButton } from "components/Buttons";
import { NoDataPanel } from "components/DDataGrid/components";
import WrapPage from "layouts/WrapPage";
import { HEIGHT_DEVICE } from "constants/index";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { reduce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fDate } from "utils/dateUtil";
import { fNumber } from "utils/formatNumber";
import { multiGroupBy } from "utils/getObjectPropsSafelyUtil";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";
import { ORDER_STATUS_VALUE } from "views/OrderView/constants";
import MDatePicker from "components/Pickers/MDatePicker";

const CRMDailyTable = () => {
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const [params, setParams] = useState({ created_from: new Date() });

  const [data, setData] = useState<{
    data: CRMDailyResponse[];
    loading: boolean;
    count: number;
  }>({
    data: [],
    count: 0,
    loading: false,
  });

  const getData = useCallback(async () => {
    if (user) {
      setData((prev) => ({ ...prev, loading: true }));
      const report = await phoneLeadApi.get<CRMDailyResponse>({
        endpoint: "crm-daily-detail/",
        params: {
          created_from: fDate(params.created_from, yyyy_MM_dd),
          cancelToken: newCancelToken(),
        },
      });
      if (report?.data) {
        setData((prev) => ({
          ...prev,
          data: report.data.results,
          loading: false,
          count: report.data.count,
        }));
        return;
      }
      if ((report?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [user, newCancelToken, params]);

  useEffect(() => {
    getData();
  }, [getData]);

  const exportForeCaseData = useMemo(() => {
    return reduce(
      data.data?.[0]?.forecast,
      (prev, cur) => {
        return [
          ...prev,
          {
            "Dự đoán ngày chia:": fDate(cur.predicted_date),
            "Sản phẩm": cur.product_name,
            "Tổng số điện thoại": cur.customer__phone,
          },
        ];
      },
      []
    );
  }, [data.data]);

  const exportCRMDailyData = useMemo(() => {
    return reduce(
      data.data?.[0]?.detail_today,
      (prev, cur) => {
        return [
          ...prev,
          {
            completed_time: cur.completed_time,
            created: cur.created,
            crm_date_mark: cur.crm_date_mark,
            delivery_shift: cur.delivery_shift,
            is_main_product: cur.is_main_product ? "Đúng" : "Không",
            name: cur.name,
            order_key: cur.order_key,
            period: cur.period,
            phone: cur.phone,
            product_name: cur.product_name,
            shipping__carrier_status: cur.shipping__carrier_status,
            shipping__finish_date: cur.shipping__finish_date,
            shipping_address__location__province__label:
              cur.shipping_address__location__province__label,
            status: cur.status
              ? ORDER_STATUS_VALUE[cur.status as keyof typeof ORDER_STATUS_VALUE].value
              : "",
          },
        ];
      },
      []
    );
  }, [data.data]);

  return (
    <WrapPage>
      <PhoneLeadHeader
        params={params}
        onRefresh={getData}
        tableTitle="Báo cáo data CRM dự kiến"
        exportData={exportForeCaseData}
        exportFileName={`Báo cáo data CRM dự kiến ${fDate(params?.created_from)}`}
        rightChildren={
          <Grid item>
            <MExportFileButton
              exportData={exportCRMDailyData}
              exportFileName={`Báo cáo data CRM chi tiết theo ngày_${fDate(params.created_from)}`}
              buttonProps={{ color: "secondary" }}
              label="Xuất File báo cáo chi tiết theo ngày"
            />
          </Grid>
        }
      >
        <MDatePicker
          value={params.created_from?.toString()}
          onChangeDate={(value) => {
            setParams((prev) => ({ ...prev, created_from: value }));
          }}
        />
      </PhoneLeadHeader>
      <ForeCastTable data={data.data?.[0]?.forecast} loading={data.loading} />
    </WrapPage>
  );
};

export default CRMDailyTable;

const ForeCastTable = ({
  data = [],
  loading,
}: {
  data: CRMDailyResponse["forecast"];
  loading?: boolean;
}) => {
  let productNames = multiGroupBy(data, ["product_name"]);
  const predictedDates = multiGroupBy(data, ["predicted_date"]);

  const columnTotal = reduce(
    Object.keys(predictedDates),
    (row, cur) => {
      return (row += reduce(
        predictedDates[cur],
        (prev, cur) => {
          return prev + parseInt(cur.customer__phone);
        },
        0
      ));
    },
    0
  );

  const totalRow = { Tổng: [{ customer__phone: columnTotal }], ...productNames };
  return (
    <TableContainer component={Paper}>
      {loading && <LinearProgress />}
      {Object.keys(productNames).length ? (
        <Table
          sx={{
            "thead, tbody": {
              display: "block",
              tr: {
                display: "flex",
              },
            },
            tbody: {
              overflow: "auto",
              maxHeight: (HEIGHT_DEVICE * 60) / 110,
            },
            "th, td": {
              width: "calc(100% / 6)",
            },
          }}
          aria-label="crm daily table"
        >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Tổng</TableCell>
              {Object.keys(productNames).map((header) => {
                return <TableCell key={header}>{header}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(predictedDates).map((row) => {
              const total = reduce(
                predictedDates[row],
                (prev, cur) => {
                  return prev + parseInt(cur.customer__phone);
                },
                0
              );
              return (
                <TableRow key={`${row}`} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell style={{ fontWeight: "bold" }} align="left">
                    {row}
                  </TableCell>
                  <TableCell style={{ fontWeight: "600" }} align="left">
                    {total}
                  </TableCell>
                  {Object.keys(productNames).map((header) => {
                    const value = predictedDates?.[row].find(
                      (item: any) => item.product_name === header
                    );

                    return value?.customer__phone ? (
                      <TableCell key={`${value.product_name}-${value.predicted_date}`}>
                        {fNumber(parseInt(value.customer__phone))}
                      </TableCell>
                    ) : (
                      <TableCell key={`${value?.product_name}-${value?.predicted_date}`}>
                        0
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell />
              {Object.keys(totalRow).map((header) => {
                const total = reduce(
                  totalRow[header],
                  (prev, cur) => {
                    return (prev += parseInt(cur.customer__phone));
                  },
                  0
                );
                return (
                  <TableCell key={header} sx={{ color: "primary.main" }}>
                    {fNumber(total)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                labelRowsPerPage="Số dòng/ trang"
                rowsPerPageOptions={[
                  Object.keys(predictedDates).length,
                  { label: "All", value: -1 },
                ]}
                colSpan={3}
                count={Object.keys(predictedDates).length}
                rowsPerPage={Object.keys(predictedDates).length}
                page={0}
                SelectProps={{
                  inputProps: {
                    "aria-label": "Số dòng/ trang",
                  },
                  native: true,
                }}
                onPageChange={() => {}}
              />
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <NoDataPanel showImage />
      )}
    </TableContainer>
  );
};
