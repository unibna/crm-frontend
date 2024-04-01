// Libraries
import { useEffect } from "react";
import { Controller } from "react-hook-form";

// Components
import Iconify from "components/Icons/Iconify";
import { Add } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { MultiSelect } from "components/Selectors";
import ExpressionInput from "views/DataFlow/components/NodeOperation/ExpressionInput";

// Types
import { OperationProps } from "views/DataFlow/components/NodeOperation";
import { EXP_TYPE } from "_types_/DataFlowType";

// Contants & Utils
import { OPTION_EXP_TYPE } from "views/DataFlow/constants";

// -----------------------------------------------------------

const OperationTransform = (props: OperationProps) => {
  const { control, inputFilter, setValue, watch } = props;

  useEffect(() => {
    if (inputFilter) {
      setValue("entry_values", inputFilter);
    }
  }, [inputFilter]);

  return (
    <>
      <Controller
        name="expressions"
        control={control}
        render={({ field }) => (
          <Stack
            direction="column"
            spacing={3}
            sx={{
              maxHeight: window.innerHeight - 380,
              paddingRight: 1,
              overflow: "auto",
            }}
          >
            {(Array.isArray(field.value) ? field.value : [])?.map((item: any, index: number) => (
              <Stack direction={"column"} spacing={2} key={`${item.exp_type}-${index}`}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body1">Biểu thức {index + 1}</Typography>
                  <IconButton
                    onClick={() => {
                      const list = field.value || [];
                      field.onChange([
                        ...list.slice(0, index),
                        ...list.slice(index + 1, list.length),
                      ]);
                    }}
                  >
                    <Iconify icon={"eva:trash-2-outline"} width={20} height={20} />
                  </IconButton>
                </Stack>

                <Controller
                  name={`expressions.${index}.exp_type`}
                  control={control}
                  render={({ field: fieldItem, fieldState: { error } }) => (
                    <MultiSelect
                      title="Loại xử lí"
                      size="medium"
                      outlined
                      selectorId={`expressions.${index}.exp_type`}
                      fullWidth
                      options={OPTION_EXP_TYPE}
                      onChange={(value: EXP_TYPE) => {
                        // fieldItem.onChange(value);
                        field.value[index] = {
                          exp_type: value,
                        };
                        field.onChange(field.value);
                      }}
                      error={!!error?.message}
                      helperText={error?.message}
                      defaultValue={fieldItem.value}
                      simpleSelect
                    />
                  )}
                />
                {<ExpressionInput index={index} control={control} exp_type={item.exp_type} />}
              </Stack>
            ))}
            <Button
              startIcon={<Add />}
              onClick={() => {
                field.onChange([...(field.value || []), { exp_type: EXP_TYPE.SLICE }]);
              }}
            >
              Thêm biểu thức điều kiện
            </Button>
          </Stack>
        )}
      />
    </>
  );
};

export default OperationTransform;
