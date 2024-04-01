import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { TableEditColumn } from "@devexpress/dx-react-grid-material-ui";
import { skycallApi } from "_apis_/skycall.api";
import { BaseResponseType, ErrorName } from "_types_/ResponseApiType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { SkycallType } from "_types_/SkycallType";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import findIndex from "lodash/findIndex";
import map from "lodash/map";
import { useCallback, useContext, useEffect, useState } from "react";
import { dispatch } from "store";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { fDateTime } from "utils/dateUtil";
import { isReadAndWriteRole } from "utils/roleUtils";
import CDPTable from "views/CDPView/components/CDPTable";
import { CALL_COLUMNS, CALL_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import TableVoipHeader, { HeaderVoipType } from "views/LeadCenterView/components/TableVoipHeader";
import { VoipContext } from "..";
import FormVoipModal from "./FormVoipModal";
import { Page } from "components/Page";
import format from "date-fns/format";
import { yyyy_MM_dd } from "constants/time";
import { formatExportVoip } from "features/voip/exportData";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";

const FIX_LEFT_COLUMNS = [
  "created",
  "hotline_number",
  "customer_number",
  "telephonist_name",
  "business_call_type",
];

interface Props extends HeaderVoipType {
  params: any;
  setParams: (value: any) => void;
  columns?: Column[];
  columnWidths?: TableColumnWidthInfo[];
}

const VoipContainer = ({
  params,
  setParams,
  columns = CALL_COLUMNS,
  columnWidths = CALL_COLUMNS_WIDTH,
  ...props
}: Props) => {
  const userSlice = useAppSelector(getDraftSafeSelector("users"));
  const voipContext = useContext(VoipContext);
  const { user } = useAuth();
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [data, setData] = useState<{ data: SkycallType[]; loading: boolean; count: number }>({
    data: [],
    count: 0,
    loading: false,
  });
  const { newCancelToken } = useCancelToken([params]);
  const [isFullRow, setIsFullRow] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const { date_from, date_to } = params;
    //lấy voip từ ngày tạo lead => ngày hoàn thành lead
    const rangeDateFilter = {
      date_from: date_from ? format(new Date(date_from), yyyy_MM_dd) : undefined,
      date_to: date_to ? format(new Date(date_to), yyyy_MM_dd) : undefined,
    };

    const result = await skycallApi.get<SkycallType>({
      params: { ...params, ...rangeDateFilter, cancelToken: newCancelToken() },
      endpoint: "sky-calls/",
    });
    if (result.data) {
      const { data = [], total = 0 } = result.data;
      setData((prev) => ({ ...prev, data, loading: false, count: total }));
      return;
    }

    if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [newCancelToken, params]);

  const handleUpdate = async (row: Partial<SkycallType>) => {
    const idx = findIndex(data.data, (item) => item.sky_call_id === row.sky_call_id);
    setData((prev) => ({ ...prev, loading: true }));

    const { business_call_type, sky_call_note } = row;

    const result = await skycallApi.update<BaseResponseType<SkycallType>>({
      params: { business_call_type, sky_call_note, modified_by_name: user?.name },
      endpoint: `sky-calls/${data.data[idx]?.sky_call_id}/`,
    });
    if (result.data) {
      setData((prev) => {
        const dataClone = [...prev.data];
        dataClone[idx] = { ...dataClone[idx], ...result.data.data };
        return { ...prev, data: dataClone, loading: false };
      });
      dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
      return true;
    }
    dispatch(toastError({ message: RESPONSE_MESSAGES.UPDATE_ERROR }));
    setData((prev) => ({ ...prev, loading: false }));
    return false;
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const callAttributeOptions = map(voipContext?.callAttribute, (item) => ({
    value: item.value,
    label: item.value,
  })) as SelectOptionType[];

  const telephonistOptions = map(userSlice.leaderAndTelesaleUsers, (item) => ({
    value: item.name,
    label: item.name,
  })) as SelectOptionType[];

  const isControlVoip = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]
  );

  return (
    <Page title="Cuộc gọi" style={{ marginBottom: 24 }}>
      <CDPTable
        editComponent={
          isControlVoip
            ? (contentProps) => {
                return (
                  <FormVoipModal
                    onClose={contentProps.onCancelChanges}
                    {...contentProps}
                    callAttributeOptions={callAttributeOptions}
                    open={contentProps.open}
                    onApplyChanges={handleUpdate}
                  />
                );
              }
            : undefined
        }
        columnEditExtensions={columnWidths}
        showEditCommand
        cellStyle={{ height: 60 }}
        params={params}
        isFullRow={isFullRow}
        columns={columns}
        defaultColumnWidths={columnWidths}
        defaultColumnOrders={map(columns, (column) => column.name)}
        data={data}
        setParams={setParams}
        hiddenColumnNames={hiddenColumns}
        hiddenPagination={false}
        fixLeftColumns={[TableEditColumn.COLUMN_TYPE, ...FIX_LEFT_COLUMNS]}
        headerPanel={
          <TableVoipHeader
            params={params}
            onSearch={(customer_number) => setParams((prev: any) => ({ ...prev, customer_number }))}
            onRefresh={() => setParams({ ...params })}
            columns={columns}
            exportData={data.data}
            exportFileName={`Danh_sach_cuoc_goi_${fDateTime(new Date())}`}
            formatExportFunc={formatExportVoip}
            hiddenColumnNames={hiddenColumns}
            setHiddenColumnNames={setHiddenColumns}
            isFullRow={isFullRow}
            setFullRow={setIsFullRow}
            filterChipCount={filterCount}
            setFilterCount={setFilterCount}
            setParams={setParams}
            isFilterVoipStatus={props.isFilterVoipStatus}
            isFilterVoipProccess={props.isFilterVoipProccess}
            isFilterCallAttribute={props.isFilterCallAttribute}
            isFilterTelephonist={props.isFilterTelephonist}
            isFilterCallDate={props.isFilterCallDate}
            isFilterModifiedByName={props.isFilterModifiedByName}
            callAttributeOptions={callAttributeOptions}
            telephonistOptions={telephonistOptions}
          />
        }
        containerStyle={{ marginBottom: 32 }}
      />
    </Page>
  );
};

export default VoipContainer;
