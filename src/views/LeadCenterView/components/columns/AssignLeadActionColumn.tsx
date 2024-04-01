import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { InputNumber } from "components/Fields";
import { MultiSelect } from "components/Selectors";
import { useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { userStore } from "store/redux/users/slice";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { ReportSaleType } from "_types_/PhoneLeadType";
import { FormHelperText } from "@mui/material";
import { phoneLeadApi } from "_apis_/lead.api";
import { dispatch } from "store";
import { toastInfo } from "store/redux/toast/slice";
import { ALL_OPTION } from "constants/index";
import { formatOptionSelect } from "utils/selectOptionUtil";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

function AssignLeadActionColumn(props: Props) {
  const Formatter = ({ value, row }: { value: unknown; row?: ReportSaleType }) => {
    const userSlice = useAppSelector(userStore);
    const [handleByData, setHandleByData] = useState<{
      data?: [string, number]; // string là tên sản phẩm, number là số lượng lead được chia
      telesales?: string;
    }>({ data: [row?.lead_product || "", 0] });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAssignHandleLeadItem = async () => {
      if (!row?.lead_product) {
        setError("Sản phẩm không tồn tại");
      } else if (!handleByData.telesales) {
        setError("Vui lòng chọn người chia số");
      } else if (!handleByData.data?.[1]) {
        setError("Vui lòng chọn số lượng item");
      } else {
        setLoading(true);
        const result = await phoneLeadApi.createPhoneLead({
          form: handleByData,
          endpoint: "auto-assign/crm/",
        });
        if (result.data) {
          dispatch(toastInfo({ message: "Vui lòng chuyển sang tab Báo cáo V1 để xem kết quả!" }));
          setHandleByData({ data: [row?.lead_product || "", 0], telesales: "" });
        }
        setLoading(false);
      }
    };

    useEffect(() => {
      setError("");
    }, [handleByData]);

    const conditionDisabledSubmitAssign =
      (handleByData.data?.[1] || 0) > (row?.unassigned_lead || 0) ||
      (handleByData.data?.[1] || 0) <= 0;

    return (
      <>
        <Stack direction="row" alignItems="center">
          <MultiSelect
            simpleSelect
            fullWidth
            selectorId="assign-lead-item-for-sale-selector"
            onChange={(value) =>
              setHandleByData((prev) => ({ ...prev, telesales: value?.toString() }))
            }
            options={[ALL_OPTION, ...map(userSlice.telesaleOnlineUsers, formatOptionSelect)]}
            outlined
            style={{ minWidth: 180, maxWidth: 300 }}
            placeholder="--Chọn--"
            defaultValue={handleByData.telesales}
          />
          <InputNumber
            onChange={(value) => {
              setHandleByData((prev) => ({
                ...prev,
                data: [handleByData.data?.[0] || "", value],
              }));
            }}
            value={handleByData.data?.[1] || 0}
            containerStyles={{ padding: 0.9, ml: 0.5, maxWidth: 100 }}
            minQuantity={1}
          />
          <Button
            variant="contained"
            sx={{ py: 1, ml: 1 }}
            onClick={handleAssignHandleLeadItem}
            disabled={conditionDisabledSubmitAssign || loading}
          >
            Chia số
          </Button>
        </Stack>
        <FormHelperText error={!!error}>{error}</FormHelperText>
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["assign_action"]} />;
}

export default AssignLeadActionColumn;
