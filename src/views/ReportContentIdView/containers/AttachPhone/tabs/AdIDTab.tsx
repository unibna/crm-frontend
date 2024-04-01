import Stack from "@mui/material/Stack";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadType } from "_types_/PhoneLeadType";
import { NoDataPanel } from "components/DDataGrid/components";
import FormDialog from "components/Dialogs/FormDialog";
import { MTextLine } from "components/Labels";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useTable from "hooks/useTable";
import vi from "locales/vi.json";
import { useState } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { EDIT_HANDLE_BY_COLUMN, EDIT_LEAD_STATUS_COLUMN } from "views/LeadCenterView/constants";
import {
  LEAD_CENTER_COLUMNS,
  LEAD_CENTER_COLUMNS_SHOW_SORT,
} from "views/LeadCenterView/constants/columns";
import compact from "lodash/compact";
import { Typography } from "@mui/material";

type Props = {};

const AdIDTab = (props: Props) => {
  const { channel } = useAppSelector(getDraftSafeSelector("leads")).attributes;
  const [params, setParams] = useState({ limit: 30, page: 1, ordering: "-created" });
  const tableProps = useTable({
    columns: LEAD_CENTER_COLUMNS,
    columnWidths: [
      { width: 160, columnName: "customer_info" },
      { width: 220, columnName: "handle_info" },
      { width: 130, columnName: "lead_info" },
      { width: 150, columnName: "created_info" },
      { width: 200, columnName: "product_info" },
      { width: 150, columnName: "assign_info" },
      { width: 200, columnName: "validate_info" },
      { width: 250, columnName: EDIT_HANDLE_BY_COLUMN },
      { width: 150, columnName: EDIT_LEAD_STATUS_COLUMN },
      { width: 120, columnName: "data_status" },
      { width: 150, columnName: "note" },
      { width: 200, columnName: "ads_info" },
      { width: 250, columnName: "additional_data" },
    ],
    hiddenColumnNames: [],
    isFullRow: false,
    columnOrders: [
      EDIT_HANDLE_BY_COLUMN,
      EDIT_LEAD_STATUS_COLUMN,
      "lead_info",
      "data_status",
      "customer_info",
      "handle_info",
      "created_info",
      "assign_info",
      "product_info",
      "validate_info",
      "note",
      "ads_info",
      "additional_data",
    ],
  });
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  const validateLDP = channel.find((item) => item.name === "Validate LDP");
  return (
    <LeadContainer
      {...tableProps}
      params={{ ...params, channel: [validateLDP?.id] }}
      columns={LEAD_CENTER_COLUMNS}
      tabName="all"
      isFilterFanpage
      isFilterHandler
      disableExcuteRowPath="ad_id"
      isFilterCustomerType
      isFilterProcessTime
      isFilterCreator
      isFilterLeadStatus
      isFilterProduct
      isFilterFailReason
      isFilterAds
      isFilterHandleStatus
      isFilterCallLaterAt
      isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      isFilterBadDataReason
      isSearchInput
      isHandleByLabel
      isDataStatusLabel
      isExportData={false}
      setParams={(list) =>
        setParams((params: any) => {
          return { ...params, ...list };
        })
      }
      editComponent={
        validateLDP
          ? (editProps) => <AdIDModal {...editProps} onRefresh={() => setParams({ ...params })} />
          : undefined
      }
      columnShowSort={columnShowSort}
      setColumnShowSort={setColumnShowSort}
      hiddenColumnNames={[
        EDIT_HANDLE_BY_COLUMN,
        EDIT_LEAD_STATUS_COLUMN,
        "handle_info",
        "assign_info",
      ]}
    />
  );
};

export default AdIDTab;

const AdIDModal = (editProps: {
  row: PhoneLeadType;
  onChange: ({ name, value }: { name: string; value: any }) => void;
  onApplyChanges: () => void;
  onCancelChanges: () => void;
  open: boolean;
  editingRowIds?: number[] | undefined;
  onRefresh: () => void;
}) => {
  const { id = "", additional_data = {}, ad_channel, ad_id, ad_id_content } = editProps.row;

  const [loading, setLoading] = useState(false);

  const handleAttachAdId = async (
    leadId: string,
    additionalData: {
      ad_id?: string;
      ad_id_content?: string;
      ad_channel?: string;
    } = {}
  ) => {
    setLoading(true);
    const updateRes = await phoneLeadApi.updatePhoneLead<PhoneLeadType>({
      id: leadId,
      form: {
        ad_channel: ad_channel ? undefined : additionalData.ad_channel,
        ad_id: ad_id ? undefined : additionalData.ad_id,
        ad_id_content: ad_id_content ? undefined : additionalData.ad_id_content,
      },
    });
    if (updateRes.data) {
      editProps.onRefresh();
      setLoading(false);
      return updateRes.data;
    }
    setLoading(false);
    return undefined;
  };

  const dataForm = {
    ad_channel: additional_data.ad_channel,
    ad_id: additional_data.ad_id,
    ad_id_content: additional_data.ad_id_content,
  };
  const formState = compact(Object.values(dataForm)).length;

  const isExistAdID =
    dataForm.ad_channel === ad_channel &&
    dataForm.ad_id === ad_id &&
    dataForm.ad_id_content === ad_id_content;

  return (
    <FormDialog
      transition
      maxWidth={"sm"}
      buttonText={vi.button.confirm}
      title={vi.attach_ad_id}
      subTitle={"Xác nhận để gắn Ad ID"}
      open={editProps.open}
      onClose={editProps.onCancelChanges}
      disabledSubmit={!formState || isExistAdID}
      isLoadingButton={loading}
      onSubmit={async () => {
        const update = await handleAttachAdId(id, dataForm);
        if (update) {
          editProps.onCancelChanges();
        }
      }}
    >
      {formState ? (
        <Stack spacing={1}>
          {isExistAdID && (
            <Typography color="warning.main" fontSize={14}>
              Dữ liệu đã được thêm
            </Typography>
          )}
          {dataForm?.ad_id && <MTextLine label="Ad ID:" value={dataForm.ad_id} />}
          {dataForm?.ad_id_content && (
            <MTextLine label="Ad ID Content:" value={dataForm.ad_id_content} />
          )}
          {dataForm?.ad_channel && <MTextLine label="Ad Channel:" value={dataForm.ad_channel} />}
        </Stack>
      ) : (
        <NoDataPanel />
      )}
    </FormDialog>
  );
};
