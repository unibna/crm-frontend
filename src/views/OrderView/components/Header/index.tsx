//components
import PrintIcon from "@mui/icons-material/Print";
import UploadIcon from "@mui/icons-material/Upload";
import Grid from "@mui/material/Grid";
import { MButton } from "components/Buttons";
import { GridWrapHeaderProps, HeaderTableWrapper } from "components/Tables/HeaderWrapper";

//hooks
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";

//utils
import vi from "locales/vi.json";
import { GENERAL_ROLES, ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { leadStore } from "store/redux/leads/slice";
import { userStore } from "store/redux/users/slice";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import { isMatchRoles } from "utils/roleUtils";
import { EXPORT_DATA_TO_GMAIL_KEY } from "views/OrderView/constants";

//types
import AddIcon from "@mui/icons-material/Add";
import { HeaderType } from "_types_/HeaderType";
import { OrderFilterProps, OrderStatusValue } from "_types_/OrderType";

//apis
import { orderApi } from "_apis_/order.api";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import { orderFilterChipOptions, orderFilterOptions } from "features/order/handleFilter";

export interface HeaderOrderProps
  extends Partial<HeaderType>,
    OrderFilterProps,
    GridWrapHeaderProps {
  tabName?: OrderStatusValue | "shipping";
  setOpen?: () => void;
  handlePrintOrder?: () => void;
  showPrintOrder?: boolean;
  loading?: boolean;
  handleExport?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onToggleUploadPaymentCheckFile?: () => void;
}

const OrderHeader = ({ tagOptions = [], ...props }: HeaderOrderProps) => {
  const [filterChipCount, setFilterChipCount] = useState(0);
  const { user } = useAuth();
  const userSlice = useAppSelector(userStore);
  const leadSlice = useAppSelector(leadStore);

  const handleClearFilter = (keys: string[]) => {
    const newParams = clearParamsVar(keys, props.params);
    props.setParams && props.setParams(newParams);

    setFilterChipCount(0);
  };

  const isHandle = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
  );

  const isHandleExport = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.GENERAL]?.[GENERAL_ROLES.EXPORT_EXCEL]
  );

  const isHandlePrint = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.PRINT]
  );

  const isUpload =
    isMatchRoles(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.UPLOAD_PAYMENT_CHECK]
    ) || !props.loading;

  return (
    <HeaderTableWrapper.GridWrapHeaderPage
      params={props.params}
      onSearch={props.onSearch}
      onRefresh={props.onRefresh}
      filterChipCount={filterChipCount}
      setFilterCount={setFilterChipCount}
      setParams={props.setParams}
      exportFileToEmailProps={{
        service: orderApi,
        endpoint: "export-file/excel/",
        keysMap: EXPORT_DATA_TO_GMAIL_KEY,
      }}
      onClearFilter={handleClearFilter}
      onDeleteFilter={(type: string, value: string | number) => {
        handleDeleteParam(props.params || {}, { type, value }, props.setParams);
      }}
      exportData={props.exportData}
      rightChildren={
        <>
          <AddButton onClick={props.setOpen} disabled={!isHandle} visibled={!!props.setOpen} />
          <UploadFileButton
            onClick={props.onToggleUploadPaymentCheckFile}
            disabled={!isUpload}
            visibled={!!props.onToggleUploadPaymentCheckFile}
          />
          <PrintButton
            visibled={!!props.showPrintOrder}
            onClick={props.handlePrintOrder}
            disabled={!isHandlePrint || props.loading}
          />
        </>
      }
      columns={props.columns}
      hiddenColumnNames={props.hiddenColumnNames}
      setHiddenColumnNames={props.setHiddenColumnNames}
      isFullRow={props.isFullRow}
      setFullRow={props.setFullRow}
      filterOptions={orderFilterOptions({
        leadSlice,
        leaderAndTelesaleUsers: userSlice.leaderAndTelesaleUsers,
        tagsOptions: filterIsShowOptions(tagOptions),
        ...props,
      })}
      filterChipOptions={orderFilterChipOptions({
        leadSlice,
        leaderAndTelesaleUsers: userSlice.leaderAndTelesaleUsers,
        tagsOptions: filterIsShowOptions(tagOptions),
        tabName: props.tabName,
      })}
      {...props}
    ></HeaderTableWrapper.GridWrapHeaderPage>
  );
};

export default OrderHeader;

const AddButton = ({
  visibled,
  disabled,
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  visibled?: boolean;
  disabled?: boolean;
}) => {
  return visibled ? (
    <Grid item>
      <MButton onClick={onClick} disabled={disabled}>
        <AddIcon />
        {vi.button.create_order}
      </MButton>
    </Grid>
  ) : null;
};

const PrintButton = ({
  visibled,
  disabled,
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  visibled?: boolean;
  disabled?: boolean;
}) => {
  return visibled ? (
    <Grid item>
      <MButton startIcon={<PrintIcon />} onClick={onClick} disabled={disabled}>
        {vi.button.print_order}
      </MButton>
    </Grid>
  ) : null;
};

const UploadFileButton = ({
  visibled,
  disabled,
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  visibled?: boolean;
  disabled?: boolean;
}) => {
  return visibled ? (
    <Grid item>
      <MButton onClick={onClick} disabled={disabled}>
        <UploadIcon />
        {vi.button.upload_payment_check_file}
      </MButton>
    </Grid>
  ) : null;
};
