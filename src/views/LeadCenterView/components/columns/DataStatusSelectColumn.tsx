import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { styled } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadType } from "_types_/PhoneLeadType";
import { MultiSelect } from "components/Selectors";
import { NONE, NULL_OPTION } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { handleAddIntercept } from "features/lead/handleFilter";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import vi from "locales/vi.json";
import { useMemo } from "react";
import { dispatch } from "store";
import { leadStore } from "store/redux/leads/slice";
import { toastInfo } from "store/redux/toast/slice";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { formatOptionSelect } from "utils/selectOptionUtil";
import SpamFormModal, { SpamForm } from "../SpamFormModal";

const COLUMN_NAMES = ["data_status"];

export interface DataStatusProps {
  onDataStatusCheckbox?: ({ id, isCheck }: { id: string; isCheck: boolean }) => void;
  onSubmitChangeDataStatusItem?: (id: string) => void;
  isDataStatusLabel?: boolean;
}

interface Props extends DataStatusProps {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const DataStatusSelectColumn = (props: Props) => {
  const {
    for: columnNames = [],
    isDataStatusLabel,
    onDataStatusCheckbox,
    onSubmitChangeDataStatusItem,
  } = props;

  const Formatter = (formatProp: React.PropsWithChildren<DataTypeProvider.ValueFormatterProps>) => {
    const { row } = formatProp;
    const leadSlice = useAppSelector(leadStore);
    const { user } = useAuth();

    // handle thay đổi data_status
    const handleSubmit = async (
      dataId: number | "none",
      onChangeForm: React.Dispatch<React.SetStateAction<SpamForm>>
    ) => {
      const oldDataStatus = leadSlice.attributes?.data_status.find(
        (item) => item.id === formatProp?.row?.data_status?.id
      );
      const oldBadDataReason = leadSlice.attributes?.bad_data_reason.find(
        (item) => item.id === formatProp?.row?.bad_data_reason?.id
      );
      const dataStatus = leadSlice.attributes?.data_status.find((item) => item.id === dataId);
      // nếu old là spam mà hiện tại không spam => show popup xoá spam
      if ((oldDataStatus?.is_spam || oldBadDataReason?.is_spam) && !dataStatus?.is_spam) {
        onChangeForm((prev) => ({
          ...prev,
          buttonText: "Xoá",
          open: true,
          title: "Xác nhận để xoá",
          content: `Bạn có muốn xoá số điện thoại ${row?.phone} khỏi danh sách Spam không?`,
          type: "delete",
          data: row?.phone,
          status: dataStatus?.name || "",
          dataId: dataStatus?.id,
        }));
        return;
      }
      // nếu old không là spam mà hiện tại là spam => show thêm vào danh sách spam
      if (!oldDataStatus?.is_spam && !oldBadDataReason?.is_spam && dataStatus?.is_spam) {
        const res = await handleChangeDataStatus(dataId);
        if (res) {
          const resAddIntercept = await handleAddIntercept({
            status: dataStatus.name,
            type: "SDT",
            userId: user?.id,
            data: formatProp.row?.phone,
          });
          if (resAddIntercept) {
            dispatch(
              toastInfo({
                message: `Đã thêm số điện thoại ${row?.phone} vào danh sách Spam`,
                duration: 5000,
              })
            );
          }
        }
        return;
      }

      await handleChangeDataStatus(dataId);
    };

    const handleChangeDataStatus = async (dataId?: string | number | "none") => {
      const params = {
        id: formatProp?.row?.id,
        data_status: dataId === "none" ? null : dataId,
      };
      const updateHandle = await phoneLeadApi.updatePhoneLead<PhoneLeadType>({
        id: formatProp?.row?.id,
        form: params,
      });
      if (updateHandle.data) {
        const result = {
          ...updateHandle.data,
          id: formatProp?.row?.id,
        };
        //while query data_status not all
        onSubmitChangeDataStatusItem?.(result.id);
        return updateHandle;
      }
      return;
    };

    const handleSubmitSpam = async (formState: SpamForm) => {
      if (formState.type === "delete") {
        const res = await handleChangeDataStatus(formState.dataId);
        if (res) {
          return true;
        }
        return false;
      }
      return false;
    };

    const dataStatusOption = useMemo(() => {
      return leadSlice.attributes?.data_status?.length
        ? leadSlice.attributes.data_status.reduce((prevArr, current) => {
            return current.is_shown ? [...prevArr, formatOptionSelect(current)] : prevArr;
          }, [])
        : [];
    }, [leadSlice.attributes.data_status]);

    const value = [NULL_OPTION, ...dataStatusOption].find(
      (item) => item?.value?.toString() === formatProp?.row?.data_status?.id?.toString()
    );
    const isControllerDataStatus = isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.DATA_STATUS]
    );
    const isMatchDataStatus = isMatchRoles(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.DATA_STATUS]
    );

    return !isMatchDataStatus ? (
      <Typography fontSize={13}>{"--"}</Typography>
    ) : isDataStatusLabel || !isControllerDataStatus ? (
      <Typography fontSize={13}>{value?.label || NONE}</Typography>
    ) : (
      <SpamFormModal
        renderInput={(onChangeForm) => (
          <CellWrap style={{ display: "flex" }}>
            {onDataStatusCheckbox && (
              <Checkbox
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                checked={formatProp.row.isCheckDataStatus ? true : false}
                onChange={(e) =>
                  onDataStatusCheckbox?.({
                    id: row?.id,
                    isCheck: e.target.checked,
                  })
                }
                style={{ padding: 0 }}
              />
            )}
            <MultiSelect
              label="handle-select"
              selectorId="data-status"
              simpleSelect
              title={vi.multi_select}
              options={[NULL_OPTION, ...dataStatusOption]}
              defaultValue={
                formatProp?.row?.data_status ? formatProp?.row?.data_status?.id.toString() : "none"
              }
              onChange={(value) => handleSubmit(parseInt(value as string), onChangeForm)}
              outlined
              fullWidth
            />
          </CellWrap>
        )}
        onSubmit={handleSubmitSpam}
        phone={row?.phone}
      />
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default DataStatusSelectColumn;

const CellWrap = styled("div")({
  display: "flex",
});
