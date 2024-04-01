import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadType } from "_types_/PhoneLeadType";
import ConfirmPopover from "components/Popovers/ConfirmPopver";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import React, { useState } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import { EDIT_LEAD_STATUS_COLUMN, LEAD_STATUS } from "views/LeadCenterView/constants";

export interface AddLeadColumnProps {
  isShowAddLeadColumn?: boolean;
}

interface Props extends AddLeadColumnProps {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onRefresh?: () => void;
}

const AddLeadColumn = (props: Props) => {
  const Formatter = (formatProp: React.PropsWithChildren<DataTypeProvider.ValueFormatterProps>) => {
    const { row } = formatProp;
    const [formState, setFormState] = useState({ loading: false, error: false, type: "" });
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { user } = useAuth();

    const isControl = isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ADD_LEAD]
    );

    const handleCreateLead = async () => {
      setFormState((prev) => ({ ...prev, loading: true }));
      if (row?.id) {
        const body = {
          id: row?.id,
          lead_status: LEAD_STATUS.NEW,
          data_status: null,
        };
        const result = await phoneLeadApi.updatePhoneLead<PhoneLeadType>({
          id: row?.id,
          form: body,
        });
        if (result && result.data) {
          props.onRefresh && props.onRefresh();
        } else {
          setFormState((prev) => ({ ...prev, error: true }));
        }
      }
      setAnchorEl(null);
      setFormState((prev) => ({ ...prev, loading: false }));
    };

    return (
      <>
        {isControl && props.isShowAddLeadColumn ? (
          <>
            <ConfirmPopover
              title="Lead này không phải là spam?"
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              status={formState}
              handleCancel={() => setAnchorEl(null)}
              handleCofirm={handleCreateLead}
            ></ConfirmPopover>
            <LoadingButton
              size="small"
              color="secondary"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              loading={formState.loading}
              loadingPosition="start"
              startIcon={<AddIcon />}
              variant="contained"
              style={{ boxShadow: "unset" }}
            >
              Tạo Lead
            </LoadingButton>
          </>
        ) : null}
      </>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[EDIT_LEAD_STATUS_COLUMN, ...(props.for || [])]}
    />
  );
};

export default AddLeadColumn;
