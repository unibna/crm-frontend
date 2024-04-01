import AddIcon from "@mui/icons-material/Add";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { AttributeType } from "_types_/AttributeType";
import { LeadFilterProps, ParamsPhoneLeadType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { formatValueChangeMultiSelector, MultiSelect } from "components/Selectors";
import { HeaderTableWrapper, GridWrapHeaderProps } from "components/Tables/HeaderWrapper";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { memo, useContext, useState } from "react";
import { leadStore } from "store/redux/leads/slice";
import { userStore } from "store/redux/users/slice";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";
import ImportLeadModal from "./ImportLeadModal";
import ReportDailyHandleByDrawer from "./ReportDailyHandleByDrawer";
import { exportExcelPhoneLeadUtil } from "features/lead/exportData";
import { leadFilterChipOptions, leadFilterOptions } from "features/lead/handleFilter";

export interface LeadHeaderProps<RowType = any>
  extends Partial<LeadFilterProps>,
    Partial<GridWrapHeaderProps> {
  isSearchInput?: boolean;
  handleByID?: string | null;
  dataStatusID?: string;
  setHandleBy?: (value: number | string) => void;
  setDataStatus?: (value: number | string) => void;
  onAutoLeadHandleBy?: () => Promise<void>;
  handleSubmitDataStatus?: () => void;
  setFormIsOpen?: (open: boolean) => void;
  isImportFile?: boolean;
  isReportHandleByDaily?: boolean;
  isAddLeadPhone?: boolean;
  tableTitle?: string;
}

/**
 *
 * @param dataStatusID ""
 * @returns
 */

const PhoneLeadHeader = (props: LeadHeaderProps) => {
  const {
    dataStatusID = "",
    onAutoLeadHandleBy,
    setDataStatus,
    handleSubmitDataStatus,
    setParams,
    params,
    onRefresh,
    tabName,
    isFilterHandler,
    isFilterCreator,
    isAddLeadPhone,
    setFormIsOpen,
    isImportFile,
    isReportHandleByDaily,
    formatExportFunc = exportExcelPhoneLeadUtil,
  } = props;

  const { user } = useAuth();
  const userSlice = useAppSelector(userStore);
  const [filterCount, setFilterCount] = useState(0);
  const leadSlice = useAppSelector(leadStore);
  const [autoHandleByLoading, setAutoHandleLoading] = useState(false);
  const context = useContext(PhoneLeadContext);

  const handleAutoHandleBy = async () => {
    setAutoHandleLoading(true);
    await onAutoLeadHandleBy?.();
    setAutoHandleLoading(false);
  };

  const onSetParams = (
    name: keyof ParamsPhoneLeadType,
    value: string | number | "all" | "none" | (string | number)[]
  ) => {
    const formatValue = formatValueChangeMultiSelector(value);
    setParams?.({ ...params, [name]: formatValue, page: 1 });
  };

  const isAddLeadRole = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ADD_LEAD]
  );

  const landingPageDomainOptions: SelectOptionType[] = map(context?.landingPageDomain, (item) => ({
    label: item.landing_page_url || "",
    value: item.landing_page_url || "",
  }));

  const isReadAndWriteHandleLead = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
  );

  return (
    <HeaderTableWrapper.GridWrapHeaderPage
      filterChipCount={filterCount}
      searchPlacehoder="Nhập sđt, tên khách hàng, Ads Id, Ads Content"
      filterOptions={
        tabName !== "user"
          ? leadFilterOptions({
              onSetParams,
              leadSlice,
              telesales: userSlice.telesaleUsers,
              telesalesAndLeaders: userSlice.leaderAndTelesaleUsers,
              isFilterHandler: isFilterHandler && isReadAndWriteHandleLead,
              isFilterCreator: isFilterCreator && isReadAndWriteHandleLead,
              ...props,
            })
          : undefined
      }
      tableTitle={props.tableTitle}
      user={user}
      rightChildren={
        <>
          <AddLeadButton
            visibled={!!isAddLeadPhone && !!isAddLeadRole}
            onClick={() => setFormIsOpen?.(true)}
          />
          <ImportLead
            onRefresh={onRefresh}
            visibled={
              isReadAndWriteRole(
                user?.is_superuser,
                user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.IMPORT_LEAD_EXCEL]
              ) && !!isImportFile
            }
          />
          <ReportDailyHandler
            visibled={
              isMatchRoles(
                user?.is_superuser,
                user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[
                  STATUS_ROLE_LEAD.REPORT_DAILY_HANDLE_BY
                ]
              ) && !!isReportHandleByDaily
            }
          />
        </>
      }
      filterChipOptions={
        tabName !== "user"
          ? leadFilterChipOptions({
              tabName,
              leadSlice,
              user,
              telesales: userSlice.telesaleUsers,
              landingPageDomain: landingPageDomainOptions,
            })
          : undefined
      }
      setFilterCount={setFilterCount}
      onClearFilter={(keys) => {
        const newParams = clearParamsVar(keys, params);
        setParams?.(newParams);
        setFilterCount?.(0);
      }}
      onDeleteFilter={(type, value) => handleDeleteParam(params || {}, { type, value }, setParams)}
      formatExportFunc={formatExportFunc}
      {...props}
    >
      <Grid container item xs={12} spacing={1} justifyContent="flex-end">
        <AssignedButton
          visibled={!!onAutoLeadHandleBy}
          onClick={handleAutoHandleBy}
          loading={autoHandleByLoading}
        />
        <DataStatusButton
          visibled={!!setDataStatus}
          dataStatus={leadSlice.attributes.data_status}
          onChange={(value: string) => setDataStatus?.(value)}
          onSubmit={handleSubmitDataStatus}
          dataStatusID={dataStatusID}
        />
      </Grid>
      {props.children}
    </HeaderTableWrapper.GridWrapHeaderPage>
  );
};

export default memo(PhoneLeadHeader);

const AddLeadButton = ({
  visibled,
  onClick,
}: {
  visibled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return visibled ? (
    <Grid item>
      <Button variant="contained" onClick={onClick}>
        <AddIcon />
        Thêm SĐT
      </Button>
    </Grid>
  ) : null;
};

const ImportLead = ({ visibled, onRefresh }: { visibled?: boolean; onRefresh?: () => void }) => {
  return visibled ? (
    <Grid item>
      <ImportLeadModal handleRefresh={onRefresh} />
    </Grid>
  ) : null;
};

const ReportDailyHandler = ({ visibled }: { visibled?: boolean }) => {
  return visibled ? (
    <Grid item>
      <ReportDailyHandleByDrawer />
    </Grid>
  ) : null;
};

const AssignedButton = ({
  visibled,
  loading,
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  visibled?: boolean;
}) => {
  return visibled ? (
    <Grid item>
      <LoadingButton
        color="secondary"
        onClick={onClick}
        loading={loading}
        loadingPosition="start"
        startIcon={<ContactPhoneIcon />}
        variant="contained"
      >
        Chia số
      </LoadingButton>
    </Grid>
  ) : null;
};

const DataStatusButton = ({
  visibled,
  onSubmit,
  dataStatus,
  dataStatusID,
  onChange,
}: {
  onSubmit?: React.MouseEventHandler<HTMLButtonElement>;
  visibled?: boolean;
  dataStatus: AttributeType[];
  dataStatusID?: string;
  onChange: (values: string | number | (string | number)[]) => void;
}) => {
  return visibled ? (
    <Grid item>
      <Stack direction="row" alignItems="center">
        <MultiSelect
          title="Chọn trạng thái dữ liệu"
          options={filterIsShowOptions(dataStatus)}
          label="handle-select"
          defaultValue={dataStatusID}
          onChange={onChange}
          simpleSelect
          autoFocus
          outlined
          style={{ width: "100%" }}
          selectorId="data-status-lead-selector"
        />
        <Button variant="contained" style={{ marginLeft: 5 }} onClick={onSubmit}>
          Chọn
        </Button>
      </Stack>
    </Grid>
  ) : null;
};
