import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import Chip from "@mui/material/Chip";
import { phoneLeadApi } from "_apis_/lead.api";
import { DGridDataType } from "_types_/DGridType";
import { InterceptDataType, PhoneLeadResType } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import { DIRECTION_SORT_TYPE } from "_types_/SortType";
import FormDialog from "components/Dialogs/FormDialog";
import SortHeader from "components/Tables/SortHeader";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { handleCheckNewLead } from "features/lead/checkNewItem";
import { formatLeadData } from "features/lead/formatData";
import {
  handleAssignSaleForLeadRow,
  handleAutoAssignerToServer,
  handleManualAssignerToServer,
  handleSelectedAllAssignerRow,
} from "features/lead/handleAssign";
import {
  handleChangeDataStatusForLeadRow,
  handleCheckingSpam,
  handleSelectedAllDataStatusRow,
  handleSubmitDataStatusToServer,
} from "features/lead/handleDataStatus";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import useIsMountedRef from "hooks/useIsMountedRef";
import WrapPage from "layouts/WrapPage";
import reduce from "lodash/reduce";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { leadStore } from "store/redux/leads/slice";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { handleChangeOrderingUtil, handleChangeParamsToSortingTable } from "utils/tableUtil";
import {
  EDIT_HANDLE_BY_COLUMN,
  EDIT_LEAD_STATUS_COLUMN,
  EXPORT_DATA_TO_GMAIL_KEY,
  EXTENSION_COLUMN_NAMES,
  LEAD_STATUS,
} from "views/LeadCenterView/constants";
import {
  LEAD_CENTER_SORT_FIELDS,
  LEAD_SORT_EXTENSIONS,
  leadTableColumnExtensions,
} from "views/LeadCenterView/constants/columns";
import CheckboxHeaderCell from "./CheckboxHeaderCell";
import PhoneLeadHeader, { LeadHeaderProps } from "./Header";
import LeadFormModal from "./LeadFormModal";
import PhoneLeadRowDetail from "./PhoneLeadRowDetail";
import TextNotification from "./TextNotification";
import Table, { LeadTableProps } from "./tables/LeadTable";
import { handleAddMultiIntercept, handleDeleteIntercept } from "features/lead/handleFilter";

const TIMING_CHECK_NEW_ITEM = 30000; //30s
const SPAM_FORM_DEFAULT = {
  loading: false,
  error: false,
  open: false,
  data: [],
  title: "",
  buttonText: "",
  isSpam: false,
};

type Provided =
  | "data"
  | "dataStatusID"
  | "handleAutoLeadHandleBy"
  | "handleSubmitDataStatus"
  | "setFormIsOpen"
  | "exportFileToEmailProps"
  | "onSearch"
  | "onAutoLeadHandleBy"
  | "exportData"
  | "sortingStateColumnExtensions"
  | "onSubmitChangeHandleByItem"
  | "onDataStatusCheckbox"
  | "onSubmitChangeDataStatusItem"
  | "onHandleByByCheckbox"
  | "detailComponent"
  | "contentOptional"
  | "columnExtensions"
  | "headerCellComponent";

interface Props extends LeadTableProps, LeadHeaderProps {
  isSearchInput?: boolean;
  rowDetail?: boolean;
  statusCheckNewItems?: string[];
  isChangeHandleByItemInSelector?: boolean;
  isEditRow?: boolean;
  isExportData?: boolean;
}

const LeadContainer = (props: Omit<Props, Provided>) => {
  const {
    isDataStatusLabel,
    isEditRow = true,
    params,
    tabName,
    setParams,
    statusCheckNewItems,
    onRefresh,
    isSearchInput,
    isFullRow,
    isShowAddLeadColumn,
    isChangeHandleByItemInSelector,
    rowDetail,
    columnShowSort,
    isHandleByLabel,
    hiddenColumnNames = [],
    isExportData = true,
  } = props;

  const { user } = useAuth();
  const isMounted = useIsMountedRef();

  const [spamFormState, setSpamFormState] = useState<{
    loading: boolean;
    error: boolean;
    open: boolean;
    data: Partial<InterceptDataType>[];
    title: string;
    buttonText: string;
    isSpam: boolean;
  }>(SPAM_FORM_DEFAULT);

  const leadSlice = useAppSelector(leadStore);

  // prettier-ignore
  const [data, setData] = useState<DGridDataType<PhoneLeadResType>>({data: [],count: 0,loading: false});

  // lưu số dữ liệu mới được update
  const [newItemCount, setNewItemCount] = useState(0);
  const [handleByUpdateData, setHandleByUpdateData] = useState<string[]>([]);
  const [dataStatusUpdateData, setDataStatusUpdateData] = useState<{
    data: string[];
    canUpdate: number | null;
    dataStatusID?: string;
  }>({ data: [], canUpdate: null, dataStatusID: undefined });
  const [formIsOpen, setFormIsOpen] = useState(false);
  const { newCancelToken } = useCancelToken();

  // giảm page xuống khi đã chia hết lead hoặc gán hết data_status ở trang hiện tại
  const decreasePage = data.previous && params?.page ? params?.page - 1 : 1;

  const isControlHandleBy = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.HANDLE_BY]
  );

  const isControlDataStatus = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.DATA_STATUS]
  );
  const isMatchDataStatus = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.DATA_STATUS]
  );

  const isReadAndWriteHandleLead = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
  );

  const isControlAddLead = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ADD_LEAD]
  );

  const resetHandleByStatusData = useCallback(() => {
    if (isControlHandleBy) {
      setHandleByUpdateData([]);
    }
  }, [isControlHandleBy]);

  const resetDataStatusData = useCallback(() => {
    if (isControlDataStatus) {
      setDataStatusUpdateData((prev) => ({ ...prev, data: [], dataStatusID: undefined }));
    }
  }, [isControlDataStatus]);

  const getData = useCallback(async () => {
    if (user) {
      setData((prev) => ({ ...prev, loading: true }));

      // reset các state đang thao tác
      resetDataStatusData();
      resetHandleByStatusData();

      const result = await phoneLeadApi.get<PhoneLeadResType>({
        params: { ...params, cancelToken: newCancelToken() },
      });
      if (result.data) {
        const { count, next = "", previous = "", results } = result.data;

        const leadData = reduce(
          results,
          (prev, cur) => {
            return [...prev, formatLeadData(cur)];
          },
          []
        );

        setData({ data: leadData, next, previous, count: count || 0, loading: false });

        //đã lấy dữ liệu mới nhất nên reset số dữ liệu vừa được update
        setNewItemCount(0);
      } else {
        // không nhận trạng thái của CANCEL_REQUEST
        if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
          return;
        }
        setData((prev) => ({ ...prev, loading: false }));
      }
    }
  }, [params, resetDataStatusData, resetHandleByStatusData, newCancelToken, user]);

  /**
   * sau khi chia số hoặc cập nhật trạng thái
   * thì check xem có get lại trang hiện tại hay quay về trang trước đó
   * @param isChangePage
   * @param newPage
   */
  const getPhoneLeadWithNewPage = useCallback(
    (isChangePage: boolean, newPage: number) => {
      isChangePage ? setParams?.({ ...params, page: newPage }) : getData();
    },
    [getData, params, setParams]
  );

  const onSubmitChangeHandleByItem = async ({
    userId,
    rowId,
  }: {
    userId: string;
    rowId: string;
  }) => {
    const result = await handleManualAssignerToServer({ rowId, userId });
    if (result) {
      // nếu dòng lead vừa được chia là dòng cuối cùng thì hạ page xuống
      if (data.data.length === 1) {
        if (tabName === "new") getPhoneLeadWithNewPage(true, decreasePage);
        else {
          // hạ page xuống nếu người nhận số không phải là user hiện tại
          const isChangePage =
            params?.handle_by && !params?.handle_by.includes(userId) ? true : false;
          getPhoneLeadWithNewPage(isChangePage, decreasePage);
        }
      } else {
        tabName === "new" ? getPhoneLeadWithNewPage(false, params?.page || 1) : getData();
      }
    }
  };

  /**
   * kiểm tra dữ liệu mỗi 30s
   */
  const handleNewItem = useCallback(async () => {
    const result = await handleCheckNewLead({ selected: statusCheckNewItems, params });
    if (result) {
      const newItem = result.count || 0;
      setNewItemCount(newItem);
    }
  }, [params, statusCheckNewItems]);

  /**
   * chia số tự động
   * @returns void
   */
  const handleAutoLeadHandleBy = useCallback(async () => {
    const result = await handleAutoAssignerToServer(handleByUpdateData);
    if (result) {
      // nếu chia số thành công thì reset lại các dữ liệu người xử lý
      resetHandleByStatusData();
      //get mới dữ liệu
      getData();
    }
  }, [getData, handleByUpdateData, resetHandleByStatusData]);

  const handleSpamMultiLead = async () => {
    const dataStatus = leadSlice.attributes.data_status.find(
      (item) => item.id.toString() === dataStatusUpdateData.dataStatusID?.toString()
    );

    const { spamList } = handleCheckingSpam({
      user,
      leadData: data.data,
      leadCheckedData: dataStatusUpdateData.data,
      dataStatus,
    });

    const isSpam = dataStatus?.is_spam || false;

    const title = isSpam ? "Xác nhận để thêm vào Spam" : "Xác nhận để xoá khỏi danh sách Spam";
    const buttonText = isSpam ? "Thêm" : "Xoá";

    setSpamFormState((prev) => ({
      ...prev,
      open: true,
      data: spamList,
      title,
      buttonText,
      isSpam,
    }));
  };

  /**
   * cập nhật trạng thái item
   * @returns
   */
  const handleSubmitDataStatus = async () => {
    const { data: listStatus, dataStatusID } = dataStatusUpdateData;
    const result = await handleSubmitDataStatusToServer({
      data: listStatus,
      id: dataStatusID,
    });
    if (result) {
      resetDataStatusData();
      const isUpdatedFullPage = listStatus.length === data.data.length;
      const isDataStatusBelongParams = params?.data_status?.includes(dataStatusID);
      const isLastedPage = !data.next;
      const isChangePage = isUpdatedFullPage && !isDataStatusBelongParams && isLastedPage;
      getPhoneLeadWithNewPage(isChangePage, decreasePage);
    }
  };

  const handleSearch = (value?: string) => {
    setParams?.({
      //nếu có quyền xử lý thì không gán người xử lý
      // nếu không có quyền xử lý thì kiểm tra search text => nếu có search text thì không gán người xử lý và ngược lại
      handle_by: isReadAndWriteHandleLead || value || [user?.id],
      search: value,
      page: 1,
    });
  };

  //
  const setCheckHandleByItem = ({ id, isCheck }: { id: string; isCheck: boolean }) => {
    const { countChecked, newData } = handleAssignSaleForLeadRow({
      data: data.data,
      saleId: id,
      checked: isCheck,
    });
    setData((prev) => ({ ...prev, data: newData })); //update checked for each data
    setHandleByUpdateData(countChecked);
  };

  /**
   * thêm item vào mãng để update trạng thái
   */
  const setCheckDataStatusItem = ({ id, isCheck }: { id: string; isCheck: boolean }) => {
    const { countCanUpdate, countChecked, newData } = handleChangeDataStatusForLeadRow({
      data: data.data,
      dataStatusId: id,
      checked: isCheck,
    });
    countChecked.length === 0 &&
      setDataStatusUpdateData((prev) => ({ ...prev, dataStatusID: undefined }));

    // kiểm tra xem dữ liệu của bảng hiện tại có cho phép cập nhật data_status không
    setData((prev) => ({ ...prev, data: newData })); //update checked for each data
    setDataStatusUpdateData({
      data: countChecked,
      canUpdate: countCanUpdate ? countCanUpdate : null,
    });
  };

  const handleCheckedAllHandleBy = (isChecked: boolean) => {
    const { countChecked, newData } = handleSelectedAllAssignerRow({
      checked: isChecked,
      data: data.data,
    });
    setData((prev) => ({ ...prev, data: newData }));
    setHandleByUpdateData(countChecked);
  };

  const handleCheckedAllStatus = (isChecked: boolean) => {
    const { checkedData, countChecked } = handleSelectedAllDataStatusRow({
      isChecked,
      data: data.data,
    });

    setData((prev) => ({ ...prev, data: checkedData }));
    setDataStatusUpdateData({
      data: countChecked,
      canUpdate: countChecked.length ? countChecked.length : null,
    });
  };

  const isFullCheckboxDataStatus =
    dataStatusUpdateData.data?.length === data.data.length ||
    dataStatusUpdateData.data?.length === dataStatusUpdateData.canUpdate;

  const isFullCheckboxHandleBy = handleByUpdateData?.length === data.data.length;

  const handleChangeOrdering = (
    columnName: string,
    fieldName: string,
    direction: DIRECTION_SORT_TYPE
  ) => {
    const { ordering, orderingParent } = handleChangeOrderingUtil(columnName, fieldName, direction);

    setParams?.({ ...params, ordering, orderingParent });
  };

  const onSubmitChangeDataStatusItem = (statusId: string) => {
    //if update data_status for all item and next page not found => reset page
    const isDataStatusBelongParams = params?.data_status?.includes(statusId);
    const isChangePage = !isDataStatusBelongParams ? true : false;
    getPhoneLeadWithNewPage(isChangePage, decreasePage);
  };

  const handleSubmitSpam = async () => {
    if (spamFormState.isSpam) {
      const res = await handleAddMultiIntercept({ data: spamFormState.data });
      if (res) {
        setSpamFormState({ ...SPAM_FORM_DEFAULT, open: false, loading: false });
        await handleSubmitDataStatus();
        return;
      }
    } else {
      const formatData = reduce(
        spamFormState.data,
        (prev: string[], cur) => {
          const { data = "" } = cur;
          return [...prev, data];
        },
        []
      );
      const res = await handleDeleteIntercept({ data: formatData });
      if (res) {
        setSpamFormState({ ...SPAM_FORM_DEFAULT, open: false, loading: false });
        await handleSubmitDataStatus();
        return;
      }
    }
  };

  useEffect(() => {
    isMounted.current && getData();
  }, [getData, isMounted]);

  useEffect(() => {
    let timeInterval: NodeJS.Timeout | null;
    timeInterval = statusCheckNewItems
      ? setInterval(() => {
          // nếu ở tab mới thì người đc quyền xử lý mới nhận đc thông báo có dữ liệu mới
          // ngược lại => có statusCheckNewItems thì được thông báo
          if (statusCheckNewItems?.[0] === LEAD_STATUS.NEW) {
            isReadAndWriteHandleLead && handleNewItem();
          } else if (statusCheckNewItems) {
            handleNewItem();
          }
        }, TIMING_CHECK_NEW_ITEM)
      : null;
    return () => {
      window.clearInterval(timeInterval as NodeJS.Timeout);
    };
  }, [isReadAndWriteHandleLead, statusCheckNewItems, handleNewItem]);

  const formProps = useMemo(
    () => ({
      name: "",
      phone: "",
      lead_status: tabName === "handling" ? LEAD_STATUS.HANDLING : undefined,
    }),
    [tabName]
  );

  const newItem = newItemCount
    ? newItemCount === data.count
      ? 0
      : Math.abs(newItemCount - data.count)
    : 0;

  const formatHiddenColumnNames = useMemo(() => {
    // nếu có quyền thì show edit column
    let cloneHiddenColumnNames = [...hiddenColumnNames];
    cloneHiddenColumnNames =
      !isControlHandleBy || isHandleByLabel
        ? [...cloneHiddenColumnNames, EDIT_HANDLE_BY_COLUMN]
        : cloneHiddenColumnNames;

    cloneHiddenColumnNames = !isMatchDataStatus
      ? [...cloneHiddenColumnNames, "data_status"]
      : cloneHiddenColumnNames;

    cloneHiddenColumnNames =
      !isControlAddLead || !isShowAddLeadColumn
        ? [...cloneHiddenColumnNames, EDIT_LEAD_STATUS_COLUMN]
        : cloneHiddenColumnNames;

    return cloneHiddenColumnNames;
  }, [
    hiddenColumnNames,
    isControlHandleBy,
    isHandleByLabel,
    isMatchDataStatus,
    isControlAddLead,
    isShowAddLeadColumn,
  ]);

  return (
    <WrapPage>
      <FormDialog
        {...spamFormState}
        isLoadingButton={spamFormState.loading}
        onClose={() => setSpamFormState((prev) => ({ ...prev, open: false }))}
        onSubmit={handleSubmitSpam}
      >
        {spamFormState.data.map((item, idx) => (
          <Chip key={idx} label={item.data} style={{ marginTop: 4, marginRight: 4 }} />
        ))}
      </FormDialog>
      <TextNotification
        newItem={newItem}
        message={`Có ${newItem} dữ liệu mới`}
        refresh={() => setParams?.({ ...params, page: 1 })}
      />
      <LeadFormModal
        tabName={tabName}
        onApplyChanges={onRefresh}
        open={formIsOpen}
        onClose={() => setFormIsOpen(false)}
        formProps={formProps}
      />
      <PhoneLeadHeader
        {...props}
        setFormIsOpen={setFormIsOpen}
        onRefresh={() => (onRefresh ? onRefresh() : setParams?.((prev: any) => ({ ...prev })))}
        exportFileToEmailProps={
          isExportData
            ? {
                endpoint: "export-file/excel/",
                service: phoneLeadApi,
                keysMap: EXPORT_DATA_TO_GMAIL_KEY,
              }
            : undefined
        }
        onSearch={isSearchInput ? handleSearch : undefined}
        setParams={(values) => setParams?.({ ...values, page: 1 })}
        dataStatusID={dataStatusUpdateData.dataStatusID}
        setDataStatus={
          // khi có item checked dataStatus thì show seletor update dataStatus
          dataStatusUpdateData.data.length
            ? (value) =>
                setDataStatusUpdateData((prev) => ({ ...prev, dataStatusID: value.toString() }))
            : undefined
        }
        handleSubmitDataStatus={handleSpamMultiLead}
        onAutoLeadHandleBy={handleByUpdateData.length > 0 ? handleAutoLeadHandleBy : undefined}
        exportData={isExportData ? data.data : undefined}
        hiddenColumnNames={formatHiddenColumnNames}
        sortFields={LEAD_CENTER_SORT_FIELDS}
      />
      <Table
        {...props}
        sortingStateColumnExtensions={LEAD_SORT_EXTENSIONS}
        hiddenColumnNames={formatHiddenColumnNames}
        onSubmitChangeHandleByItem={
          isChangeHandleByItemInSelector ? onSubmitChangeHandleByItem : undefined
        }
        data={{ data: data.data, count: data.count, loading: data.loading }}
        onRefresh={getData}
        onDataStatusCheckbox={setCheckDataStatusItem}
        onSubmitChangeDataStatusItem={onSubmitChangeDataStatusItem}
        onHandleByByCheckbox={setCheckHandleByItem}
        detailComponent={
          data.data && rowDetail
            ? ({ row }) => (
                <PhoneLeadRowDetail
                  id={row.id}
                  phone={row.phone}
                  isFullTable={isFullRow || false}
                  ipAddress={row?.ip_address}
                  tabName={tabName}
                />
              )
            : undefined
        }
        contentOptional={{
          arrColumnOptional: EXTENSION_COLUMN_NAMES,
        }}
        editComponent={
          isEditRow
            ? props.editComponent
              ? props.editComponent
              : data.data.length
              ? (editProps) => (
                  <LeadFormModal
                    formProps={editProps.row}
                    tabName={tabName}
                    {...editProps}
                    onClose={editProps.onCancelChanges}
                    onApplyChanges={onRefresh || getData}
                  />
                )
              : undefined
            : undefined
        }
        columnExtensions={leadTableColumnExtensions}
        headerCellComponent={({ ...cellProps }) => {
          const columnSortIndex = (columnShowSort || []).findIndex(
            (column) => column.name === cellProps.column?.name
          );
          return (
            <>
              {cellProps.column?.name === EDIT_HANDLE_BY_COLUMN && isControlHandleBy ? ( //cho phép chia số
                <CheckboxHeaderCell
                  tableCellProps={cellProps}
                  isCheckAll={isFullCheckboxHandleBy}
                  onChangeCheckBoxAll={handleCheckedAllHandleBy}
                  label="Chia số"
                  isControl={isControlHandleBy && !isHandleByLabel}
                />
              ) : cellProps.column?.name === "data_status" && isControlDataStatus ? ( // cho phép cập nhật trạng thái dữ liệu
                <CheckboxHeaderCell
                  isControl={isControlDataStatus && !isDataStatusLabel}
                  tableCellProps={cellProps}
                  isCheckAll={isFullCheckboxDataStatus}
                  onChangeCheckBoxAll={handleCheckedAllStatus}
                  label="Trạng thái dữ liệu"
                />
              ) : columnSortIndex !== -1 ? (
                <SortHeader
                  tableCellProps={cellProps}
                  columnSortIndex={columnSortIndex}
                  columnShowSort={columnShowSort}
                  setSortInstance={handleChangeOrdering}
                  sortInstance={handleChangeParamsToSortingTable(params?.ordering)}
                />
              ) : (
                <TableHeaderRow.Cell {...cellProps} />
              )}
            </>
          );
        }}
      />
    </WrapPage>
  );
};

/**
 *
 * @prop isSetDataStatus false
 * @prop isEditRow true
 * @returns LeadContainer
 */
export default memo(LeadContainer);
