// Libraries
import { reduce } from "lodash";
import { useMemo } from "react";
import { Controller } from "react-hook-form";

// Components
import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { MultiSelect } from "components/Selectors";

// Types
import { OperationProps } from "views/DataFlow/components/NodeOperation";

// Contants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { HOW_TYPE, OPTION_HOW } from "views/DataFlow/constants";

// -----------------------------------------------------------

const OperationMergeParameter = (props: OperationProps) => {
  const { control, flowSelected, watch } = props;
  const valueNode = watch();

  const optionNode = useMemo(() => {
    return reduce(
      flowSelected.nodes,
      (prevArr, current) => {
        return valueNode.id !== current.id
          ? [
              ...prevArr,
              {
                ...current,
                label: getObjectPropSafely(() => current.data.name),
                value: current.id,
              },
            ]
          : prevArr;
      },
      []
    );
  }, []);

  return (
    <Stack
      direction={"column"}
      sx={{
        maxHeight: window.innerHeight - 380,
        overflow: "hidden",
        "&:hover": {
          overflow: "auto",
        },
      }}
      spacing={3}
    >
      <Controller
        name="right_values"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="Input 1"
            size="medium"
            outlined
            error={!!error?.message}
            helperText={error?.message}
            selectorId="right_values"
            fullWidth
            options={optionNode}
            onChange={field.onChange}
            defaultValue={field.value}
            simpleSelect
          />
        )}
      />
      <Controller
        name="left_values"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="Input 2"
            size="medium"
            outlined
            error={!!error?.message}
            helperText={error?.message}
            selectorId="left_values"
            fullWidth
            options={optionNode}
            onChange={field.onChange}
            defaultValue={field.value}
            simpleSelect
          />
        )}
      />
      <Controller
        name="how"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="How"
            size="medium"
            outlined
            selectorId="how"
            fullWidth
            options={OPTION_HOW}
            onChange={(value: HOW_TYPE) => field.onChange(value)}
            error={!!error?.message}
            helperText={error?.message}
            defaultValue={field.value}
            style={{ marginTop: "16px" }}
            simpleSelect
          />
        )}
      />
      <Controller
        name="on"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="On"
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      {/* <Controller
        name="left_on"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="Left On"
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      <Controller
        name="right_on"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="Right On"
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      <Controller
        name="left_index"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="Left Index"
            type="number"
            onChange={(e) => field.onChange(+e.target.value)}
          />
        )}
      />
      <Controller
        name="right_index"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="Right Index"
            type="number"
            onChange={(e) => field.onChange(+e.target.value)}
          />
        )}
      /> */}
      <Controller
        name="sort"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch value={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            }
            label="Sort"
          />
        )}
      />
      <Controller
        name="indicator"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch value={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            }
            label="Indicator"
          />
        )}
      />
    </Stack>
  );
};

export default OperationMergeParameter;
