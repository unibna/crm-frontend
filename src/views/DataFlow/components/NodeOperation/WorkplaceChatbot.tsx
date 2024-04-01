// Libraries
import { Controller } from "react-hook-form";

// Context
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesDataFlow } from "selectors/attributes";

// Components
import { Autocomplete, Chip, TextField } from "@mui/material";
import { MultiSelect } from "components/Selectors";

// Types
import { OperationProps, ProviderFilter } from "views/DataFlow/components/NodeOperation";
import { CONTENT_TYPE, CREDENTIAL_TYPE } from "_types_/DataFlowType";

// Contants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { checkValueReg } from "views/DataFlow/constants";

// -----------------------------------------------------------

const OperationWorkplaceChatbot = (props: OperationProps) => {
  const { control, watch } = props;
  const valueNode = watch();
  const attributesDataFlow = useAppSelector((state) => getAllAttributesDataFlow(state.attributes));

  return (
    <>
      <Controller
        name="recipient"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <ProviderFilter {...props} field={field}>
            <Autocomplete
              open={false}
              multiple
              id="recipient"
              options={[]}
              freeSolo
              value={checkValueReg(
                field.value,
                getObjectPropSafely(() => valueNode.static_data.formatFilter.recipient)
              )}
              renderTags={(value: readonly string[], getTagProps) =>
                (Array.isArray(value) ? value : []).map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              onChange={(e, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tài khoản thông báo"
                  error={!!error?.message}
                  helperText={error?.message}
                />
              )}
              sx={{ minWidth: 200 }}
            />
          </ProviderFilter>
        )}
      />
      <Controller
        name="messages"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <ProviderFilter {...props} field={field}>
            <TextField
              fullWidth
              value={checkValueReg(
                field.value,
                getObjectPropSafely(() => valueNode.static_data.formatFilter.messages)
              )}
              error={!!error?.message}
              helperText={error?.message}
              label="Nội dung thông báo"
              onChange={(e) => field.onChange(e.target.value)}
            />
          </ProviderFilter>
        )}
      />
      <Controller
        name="credential"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="Credential"
            size="medium"
            outlined
            error={!!error?.message}
            helperText={error?.message}
            selectorId="credential"
            fullWidth
            options={attributesDataFlow[CREDENTIAL_TYPE.WORKPLACE_CHATBOT]}
            onChange={(value: CONTENT_TYPE) => field.onChange(value)}
            defaultValue={field.value}
            simpleSelect
          />
        )}
      />
    </>
  );
};

export default OperationWorkplaceChatbot;
