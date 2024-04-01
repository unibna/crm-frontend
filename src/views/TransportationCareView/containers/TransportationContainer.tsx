// Libraries
import { ChangeSet, Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// Utils & Constants
import { ROLE_TAB, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { formatSelectorForQueryParams, revertFromQueryForSelector } from "utils/formatParamsUtil";
import {
  TRANSPORTATION_COLUMNS_SHOW_SORT,
  formatExportTransportation,
} from "views/TransportationCareView/constant";

// Components
import WrapPage from "layouts/WrapPage";
import TransportationHeader from "../components/TransportationHeader";
import Popup from "../components/popups/HandlePopup";
import TransportationVirtualTable from "../components/tables/TransportationVirtualTable";

// Types
import { DGridType } from "_types_/DGridType";
import { HeaderType } from "_types_/HeaderType";
import {
  TRANSPORTATION_HANDLE_STATUS_TYPE,
  TransportationOrderResType,
} from "_types_/TransportationType";

// Services
import { orderApi } from "_apis_/order.api";

// Hooks
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import useIsMountedRef from "hooks/useIsMountedRef";
import { fDateTime } from "utils/dateUtil";
import { isReadAndWriteRole } from "utils/roleUtils";
import { Page } from "components/Page";
import { OrderShippingTransportationHistory } from "components/OrderShippingTransportationHistory";

interface Props extends Partial<DGridType>, Partial<HeaderType> {
  filterColumns?: boolean;
  hiddenHeader?: boolean;
  loadingDefault?: boolean;
  updateHandleByDisabled?: boolean;
  dimension?: {
    columnsReport: Column;
    columnReportWidth: TableColumnWidthInfo;
  };
  isTabAll?: boolean;
  isToggleDetail?: boolean;
  isEditRow?: boolean;
}

const TransportationContainer = (props: Props) => {
  const { user } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { newCancelToken } = useCancelToken();

  const [data, setData] = useState<TransportationOrderResType[]>([]);
  const [loading, setLoading] = useState(props.loadingDefault || false);
  const [dataTotal, setDataTotal] = useState(0);
  const [totalRow, setTotalRow] = useState<any>();
  const [selection, setSelection] = useState<number[]>([]);

  const dataExport = useMemo(() => {
    return data?.reduce(
      (prev: any, current: any, currentIndex: number) =>
        selection.includes(currentIndex) ? [...prev, current] : prev,
      []
    );
  }, [data, selection]);

  const dataTable = {
    data,
    loading,
    count: dataTotal,
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await orderApi.get<TransportationOrderResType>({
      params: {
        ...props.params,
        cancelToken: newCancelToken(),
      },
      endpoint: "transportation-care/",
    });
    if (result.data && isMountedRef.current) {
      setData(result.data.results || []);

      setDataTotal(result.data.count || 0);

      setTotalRow(result.data.total);
    }
    setLoading(false);
  }, [isMountedRef, props.params]);

  useEffect(() => {
    fetchData();
  }, [props.params, fetchData, newCancelToken]);

  const updateTransportationCareItem = async (changes: any, id: string) => {
    const result = await orderApi.update<any>({
      params: changes,
      endpoint: `transportation-care/${id}/`,
    });
    if (result.data) {
      return result.data;
    }
    return false;
  };

  const handleUpdateTransportationCareItem = async (rowIndex: number, changes: ChangeSet) => {
    if (rowIndex >= 0) {
      const {
        handle_by,
        note,
        appointment_date,
        status,
        late_action,
        late_reason,
        wait_return_action,
        wait_return_reason,
        returning_action,
        returning_reason,
      } = changes.changed?.[rowIndex];

      const body = {
        // Chỉ update assign_by khi có handle_by được update
        assign_by: handle_by?.id ? user?.id : undefined,
        handle_by: handle_by?.id,
        note,
        modified_by: user?.id,
        appointment_date,
        status:
          status !== TRANSPORTATION_HANDLE_STATUS_TYPE.NEW
            ? status
            : TRANSPORTATION_HANDLE_STATUS_TYPE.PENDING,
        late_action: late_action?.id,
        late_reason: late_reason?.id,
        wait_return_action: wait_return_action?.id,
        wait_return_reason: wait_return_reason?.id,
        returning_action: returning_action?.id,
        returning_reason: returning_reason?.id,
      };
      const result = await updateTransportationCareItem(body, data[rowIndex]?.id || "");
      if (result) {
        fetchData();
      }
    }
  };

  // Chọn người xử lý
  const handleSubmitChangeHandleByItem = async ({
    userId,
    rowId,
  }: {
    userId: string;
    rowId: string;
  }) => {
    const rowIndex = data.findIndex((row) => row.id === rowId);
    const body = {
      changed: {
        [rowIndex]: {
          handle_by: { id: userId },
          status:
            data[rowIndex].status !== TRANSPORTATION_HANDLE_STATUS_TYPE.NEW
              ? data[rowIndex].status
              : TRANSPORTATION_HANDLE_STATUS_TYPE.PENDING,
        },
      },
    };
    await handleUpdateTransportationCareItem(rowIndex, body);
  };

  const handleFilter = (name: string, value: any) => {
    props.setParams && props.setParams({ ...props.params, [name]: value, page: 1 });
  };

  const handleFilterDate =
    (keyFrom: string, keyTo: string, keyDateValue: string) =>
    (from: string | undefined, to: string | undefined, dateValue: number | string | undefined) =>
      props.setParams &&
      props.setParams((prevParams: any) => {
        return {
          ...prevParams,
          [keyFrom]: from,
          [keyTo]: to,
          [keyDateValue]: dateValue,
        };
      });

  const renderRowDetail = ({ row }: { row: any }) => {
    return (
      <OrderShippingTransportationHistory
        row={row}
        isFullTable={props.isFullRow}
        pickCategoriesHistory={["ORDER_HISTORY", "SHIPPING_HISTORY", "TRANSPORTATION_HISTORY"]}
        defaultTab={"TRANSPORTATION_HISTORY"}
      />
    );
  };

  const handleApplyChanges = async (values: any, id: string, onClose: () => void) => {
    const {
      handle_by,
      note,
      appointment_date,
      status,
      late_action,
      late_reason,
      wait_return_action,
      wait_return_reason,
      returning_action,
      returning_reason,
      returned_action,
      returned_reason,
    } = values;

    const body = {
      // Chỉ update assign_by khi có handle_by được update
      assign_by: handle_by ? user?.id : undefined,
      handle_by: handle_by,
      note,
      modified_by: user?.id,
      appointment_date,
      status:
        status !== TRANSPORTATION_HANDLE_STATUS_TYPE.NEW
          ? status
          : TRANSPORTATION_HANDLE_STATUS_TYPE.PENDING,
      late_action,
      late_reason,
      wait_return_action,
      wait_return_reason,
      returning_action,
      returning_reason,
      returned_action,
      returned_reason,
    };
    const result = await updateTransportationCareItem(body, id);
    if (result) {
      onClose();
      fetchData();
    }
  };

  const renderHandlePopup = (contentProps: any) => {
    return (
      <Popup
        {...contentProps}
        isNewTransportation={contentProps.row.status === "new"}
        updateHandleByDisabled={props.updateHandleByDisabled}
        onApplyChanges={(values: any) =>
          handleApplyChanges(values, contentProps.row.id, contentProps.onCancelChanges)
        }
      />
    );
  };

  const renderHeader = () => {
    if (!props.hiddenHeader)
      return (
        <TransportationHeader
          filterColumns
          isTabAll={props.isTabAll}
          isFullRow={props.isFullRow}
          params={props.params || {}}
          date_from={props.params?.date_from}
          date_to={props.params?.date_to}
          columns={props.columns}
          hiddenColumnNames={props.hiddenColumnNames}
          setHiddenColumnNames={props.setHiddenColumnNames}
          setParams={props.setParams}
          refreshData={fetchData}
          onSearch={(value) => handleFilter("search", value)}
          onToggleColumns={props.setHiddenColumnNames}
          setFullRow={props.setFullRow}
          filterConfirmDate={handleFilterDate(
            "order_completed_time_from",
            "order_completed_time_to",
            "confirmDateValue"
          )}
          filterDate={handleFilterDate("date_from", "date_to", "dateValue")}
          filterTrackingCreatedDate={handleFilterDate(
            "tracking_created_from",
            "tracking_created_to",
            "trackingDateValue"
          )}
          filterAssignedDate={handleFilterDate(
            "assigned_at_from",
            "assigned_at_to",
            "assignedDateValue"
          )}
          filterHandleStatus={
            props.isTabAll
              ? (value) => handleFilter("status", formatSelectorForQueryParams(value))
              : undefined
          }
          filterLateReason={(value) =>
            handleFilter("late_reason", formatSelectorForQueryParams(value))
          }
          filterLateAction={(value) =>
            handleFilter("late_action", formatSelectorForQueryParams(value))
          }
          filterWaittingForReturnReason={(value) =>
            handleFilter("wait_return_reason", formatSelectorForQueryParams(value))
          }
          filterWaittingForReturnAction={(value) =>
            handleFilter("wait_return_action", formatSelectorForQueryParams(value))
          }
          filterReturningReason={(value) =>
            handleFilter("returning_reason", formatSelectorForQueryParams(value))
          }
          filterReturningAction={(value) =>
            handleFilter("returning_action", formatSelectorForQueryParams(value))
          }
          filterReturnedReason={(value) =>
            handleFilter("returned_reason", formatSelectorForQueryParams(value))
          }
          filterReturnedAction={(value) =>
            handleFilter("returned_action", formatSelectorForQueryParams(value))
          }
          filterReasonCreated={(value) =>
            handleFilter("reasons_created", formatSelectorForQueryParams(value))
          }
          filterTrackingStatus={(value) =>
            handleFilter("shipping_carrier_status", formatSelectorForQueryParams(value))
          }
          filterReferringSite={(value) =>
            handleFilter("source", formatSelectorForQueryParams(value))
          }
          filterTrackingCompany={(value) =>
            handleFilter("delivery_company", formatSelectorForQueryParams(value))
          }
          filterHandleBy={
            isReadAndWriteRole(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION]?.[
                STATUS_ROLE_TRANSPORTATION.ADD_HANDLE_BY
              ]
            )
              ? (value) => handleFilter("handle_by", formatSelectorForQueryParams(value))
              : undefined
          }
          filterModifiedBy={(value) =>
            handleFilter("modified_by", formatSelectorForQueryParams(value))
          }
          filterAssignBy={(value) => handleFilter("assign_by", formatSelectorForQueryParams(value))}
          filterOrderCreatedBy={(value) =>
            handleFilter("order_created_by", formatSelectorForQueryParams(value))
          }
          filterDateDefault={props.params?.dateValue}
          handleStatusDefault={
            props.isTabAll ? revertFromQueryForSelector(props.params?.status) : undefined
          }
          trackingCreatedDefault={props.params?.trackingDateValue}
          completedTimeDefault={props.params?.confirmDateValue}
          assignedDateDefault={props.params?.assignedDateValue}
          handleByDefault={revertFromQueryForSelector(props.params?.handle_by)}
          modifiedByDefault={revertFromQueryForSelector(props.params?.modified_by)}
          assignByDefault={revertFromQueryForSelector(props.params?.assign_by)}
          orderCreatedByDefault={revertFromQueryForSelector(props.params?.order_created_by)}
          skylinkStatusDefault={revertFromQueryForSelector(props.params?.carrier_status)}
          lateActionDefault={revertFromQueryForSelector(props.params?.late_action)}
          lateReasonDefault={revertFromQueryForSelector(props.params?.late_reason)}
          waittingForReturnActionDefault={revertFromQueryForSelector(
            props.params?.wait_return_action
          )}
          waittingForReturnReasonDefault={revertFromQueryForSelector(
            props.params?.wait_return_reason
          )}
          returningActionDefault={revertFromQueryForSelector(props.params?.returning_action)}
          returningReasonDefault={revertFromQueryForSelector(props.params?.returning_reason)}
          returnedActionDefault={revertFromQueryForSelector(props.params?.returned_action)}
          returnedReasonDefault={revertFromQueryForSelector(props.params?.returned_reason)}
          reasonCreatedDefault={revertFromQueryForSelector(props.params?.reasons_created)}
          referringSiteDefault={revertFromQueryForSelector(props.params?.source)}
          trackingCompanyDefault={revertFromQueryForSelector(props.params?.delivery_company)}
          exportData={dataExport}
          formatExportFunc={formatExportTransportation}
          exportFileName={`Cham-soc-van-dơn-${fDateTime(new Date())}`}
        />
      );
    return null;
  };

  return (
    <Page title={"Chăm sóc vận đơn"}>
      <WrapPage>
        {renderHeader()}
        <TransportationVirtualTable
          showSelectAll
          isFullRow={props.isFullRow}
          heightTable={props.heightTable}
          editInline={props.editInline}
          hiddenPagination={props.hiddenPagination}
          params={props.params}
          data={dataTable}
          totalRow={totalRow}
          columns={props.columns}
          columnWidths={props.columnWidths}
          defaultColumnWidths={props.defaultColumnWidths}
          columnOrders={props.columnOrders}
          hiddenColumnNames={props.hiddenColumnNames}
          columnExtensions={props.columnExtensions}
          columnShowSort={TRANSPORTATION_COLUMNS_SHOW_SORT}
          selection={selection}
          setSelection={selection ? setSelection : undefined}
          detailComponent={props.isToggleDetail ? renderRowDetail : undefined}
          editComponent={renderHandlePopup}
          setParams={props.setParams}
          setColumnWidths={props.setColumnWidths}
          setColumnOrders={props.setColumnOrders}
          onSubmitChangeHandleByItem={handleSubmitChangeHandleByItem}
        />
      </WrapPage>
    </Page>
  );
};
export default memo(TransportationContainer);
