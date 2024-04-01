import { Add } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  COMPARISON_TYPE,
  ConditionType,
  EXP_COMBINATION_TYPE,
  EXP_TYPE,
  OPERATION_TYPE,
} from "_types_/DataFlowType";
import { SORT_TYPE } from "_types_/SortType";
import Iconify from "components/Icons/Iconify";
import { FormValuesProps } from "components/Popups/FormPopup";
import { MultiSelect } from "components/Selectors";
import { Control, Controller } from "react-hook-form";
import { groupBy } from "utils/helpers";
import {
  OPTION_COMBINATION_EXP,
  OPTION_COMPARISON,
  OPTION_OPERATION,
  OPTION_SORT,
} from "views/DataFlow/constants";

function ExpressionInput({
  index,
  control,
  exp_type,
}: {
  index: number;
  control: Control<FormValuesProps, object>;
  exp_type: EXP_TYPE;
}) {
  const operationOptionsByComparisonType = groupBy(OPTION_OPERATION, "usableTypes");

  switch (exp_type) {
    case EXP_TYPE.COMPARE:
      return (
        <Controller
          name={`expressions.${index}.conditions`}
          control={control}
          render={({ field }) => (
            <Stack direction="column" spacing={3} sx={{ marginLeft: "16px!important" }}>
              {(Array.isArray(field.value) ? field.value : [])?.map(
                (item: ConditionType, itemIndex: number) => {
                  return (
                    <Stack direction={"column"} spacing={2} key={`${itemIndex}`}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">Điều kiện {itemIndex + 1}</Typography>
                        <IconButton
                          onClick={() => {
                            const list = field.value || [];
                            field.onChange([
                              ...list.slice(0, itemIndex),
                              ...list.slice(itemIndex + 1, list.length),
                            ]);
                          }}
                        >
                          <Iconify icon={"eva:trash-2-outline"} width={20} height={20} />
                        </IconButton>
                      </Stack>

                      <Controller
                        render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                          <MultiSelect
                            title="Loại so sánh"
                            size="medium"
                            outlined
                            selectorId={`conditions.${itemIndex}.type`}
                            fullWidth
                            options={OPTION_COMPARISON}
                            onChange={(value: COMPARISON_TYPE) => {
                              field.value[itemIndex] = {
                                ...item,
                                type: value,
                                value: "",
                                operation: operationOptionsByComparisonType?.[value]?.[0]?.value,
                              };

                              field.onChange([...field.value]);
                            }}
                            error={!!errorItem?.message}
                            helperText={errorItem?.message}
                            defaultValue={fieldItem.value}
                            style={{ marginTop: 16 }}
                            simpleSelect
                          />
                        )}
                        name={`expressions.${index}.conditions.${itemIndex}.type`}
                        control={control}
                      />

                      <Controller
                        render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                          <TextField
                            fullWidth
                            type="text"
                            value={fieldItem.value}
                            error={!!errorItem?.message}
                            helperText={errorItem?.message}
                            label="Key"
                            onChange={(e) => fieldItem.onChange(e.target.value)}
                          />
                        )}
                        name={`expressions.${index}.conditions.${itemIndex}.key`}
                        control={control}
                      />
                      <Controller
                        name={`expressions.${index}.conditions.${itemIndex}.operation`}
                        control={control}
                        render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                          <MultiSelect
                            title="Toán tử điều kiện"
                            size="medium"
                            outlined
                            selectorId={`conditions.${itemIndex}.operation`}
                            fullWidth
                            options={operationOptionsByComparisonType?.[item.type] || []}
                            onChange={(value: OPERATION_TYPE) => fieldItem.onChange(value)}
                            error={!!errorItem?.message}
                            helperText={errorItem?.message}
                            defaultValue={item.operation}
                            style={{ marginTop: 16 }}
                            simpleSelect
                          />
                        )}
                      />

                      {!(
                        [OPERATION_TYPE.IS_EMPTY, OPERATION_TYPE.IS_NOT_EMPTY].includes(
                          item.operation
                        ) || item.type === COMPARISON_TYPE.BOOLEAN
                      ) && (
                        <Controller
                          render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                            <TextField
                              fullWidth
                              type={item.type === COMPARISON_TYPE.NUMBER ? "number" : "text"}
                              value={fieldItem.value}
                              error={!!errorItem?.message}
                              helperText={errorItem?.message}
                              label="Value"
                              onChange={(e) =>
                                fieldItem.onChange(
                                  item.type === COMPARISON_TYPE.NUMBER
                                    ? +e.target.value
                                    : item.type === COMPARISON_TYPE.STRING
                                    ? `${e.target.value}`
                                    : !!e.target.value
                                )
                              }
                            />
                          )}
                          name={`expressions.${index}.conditions.${itemIndex}.value`}
                          control={control}
                        />
                      )}
                      {item.type === COMPARISON_TYPE.BOOLEAN && (
                        <Controller
                          render={({ field: fieldItem }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  value={!!fieldItem.value}
                                  onChange={(e) => fieldItem.onChange(e.target.checked)}
                                />
                              }
                              label={(!!fieldItem.value).toString().toUpperCase()}
                            />
                          )}
                          name={`expressions.${index}.conditions.${itemIndex}.value`}
                          control={control}
                        />
                      )}
                    </Stack>
                  );
                }
              )}
              <Button
                startIcon={<Add />}
                onClick={() => {
                  field.onChange([
                    ...(field.value || []),
                    {
                      key: "",
                      operation:
                        operationOptionsByComparisonType?.[COMPARISON_TYPE.STRING]?.[0]?.value,
                      value: "",
                      type: COMPARISON_TYPE.STRING,
                    },
                  ]);
                }}
              >
                Thêm điều kiện
              </Button>
            </Stack>
          )}
        />
      );
    case EXP_TYPE.SLICE: {
      return (
        <>
          <Controller
            name={`expressions.${index}.start`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="number"
                value={field.value}
                error={!!error?.message}
                helperText={error?.message}
                label="Giá trị bắt đầu"
                onChange={(e) => field.onChange(+e.target.value)}
              />
            )}
          />

          <Controller
            name={`expressions.${index}.stop`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="number"
                value={field.value}
                error={!!error?.message}
                helperText={error?.message}
                label="Giá trị kết thúc"
                onChange={(e) => field.onChange(+e.target.value)}
              />
            )}
          />

          <Controller
            name={`expressions.${index}.step`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="number"
                value={field.value}
                error={!!error?.message}
                helperText={error?.message}
                label="Giá trị từng bước"
                onChange={(e) => field.onChange(+e.target.value)}
              />
            )}
          />
        </>
      );
    }

    case EXP_TYPE.SORT: {
      return (
        <>
          <Controller
            name={`expressions.${index}.sort_key`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                type="text"
                value={field.value}
                error={!!error?.message}
                helperText={error?.message}
                label="Key để sắp xếp"
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />

          <Controller
            name={`expressions.${index}.sort_type`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                title="Kiểu sắp xếp"
                size="medium"
                outlined
                selectorId="sort-type"
                fullWidth
                options={OPTION_SORT}
                onChange={(value: SORT_TYPE) => field.onChange(value)}
                error={!!error?.message}
                helperText={error?.message}
                defaultValue={field.value}
                style={{ marginTop: 16 }}
                simpleSelect
              />
            )}
          />
        </>
      );
    }

    case EXP_TYPE.FILTER:
      return (
        <>
          <Controller
            name={`expressions.${index}.combine_conditions`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                title="Toán tử kết hợp điều kiện"
                size="medium"
                outlined
                selectorId="combine-conditions"
                fullWidth
                options={OPTION_COMBINATION_EXP}
                onChange={(value: EXP_COMBINATION_TYPE) => field.onChange(value)}
                error={!!error?.message}
                helperText={error?.message}
                defaultValue={field.value}
                style={{ marginTop: 16 }}
                simpleSelect
              />
            )}
          />
          <Controller
            name={`expressions.${index}.conditions`}
            control={control}
            render={({ field }) => (
              <Stack direction="column" spacing={3} sx={{ marginLeft: "16px!important" }}>
                {(Array.isArray(field.value) ? field.value : [])?.map(
                  (item: ConditionType, itemIndex: number) => {
                    return (
                      <Stack direction={"column"} spacing={2} key={`${itemIndex}`}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body1">Điều kiện {itemIndex + 1}</Typography>
                          <IconButton
                            onClick={() => {
                              const list = field.value || [];
                              field.onChange([
                                ...list.slice(0, itemIndex),
                                ...list.slice(itemIndex + 1, list.length),
                              ]);
                            }}
                          >
                            <Iconify icon={"eva:trash-2-outline"} width={20} height={20} />
                          </IconButton>
                        </Stack>

                        <Controller
                          render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                            <MultiSelect
                              title="Loại so sánh"
                              size="medium"
                              outlined
                              selectorId={`conditions.${itemIndex}.type`}
                              fullWidth
                              options={OPTION_COMPARISON}
                              onChange={(value: COMPARISON_TYPE) => {
                                field.value[itemIndex] = {
                                  ...item,
                                  type: value,
                                  value: "",
                                  operation: operationOptionsByComparisonType?.[value]?.[0]?.value,
                                };

                                field.onChange([...field.value]);
                              }}
                              error={!!errorItem?.message}
                              helperText={errorItem?.message}
                              defaultValue={fieldItem.value}
                              style={{ marginTop: 16 }}
                              simpleSelect
                            />
                          )}
                          name={`expressions.${index}.conditions.${itemIndex}.type`}
                          control={control}
                        />

                        <Controller
                          render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                            <TextField
                              fullWidth
                              type="text"
                              value={fieldItem.value}
                              error={!!errorItem?.message}
                              helperText={errorItem?.message}
                              label="Key"
                              onChange={(e) => fieldItem.onChange(e.target.value)}
                            />
                          )}
                          name={`expressions.${index}.conditions.${itemIndex}.key`}
                          control={control}
                        />
                        <Controller
                          name={`expressions.${index}.conditions.${itemIndex}.operation`}
                          control={control}
                          render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                            <MultiSelect
                              title="Toán tử điều kiện"
                              size="medium"
                              outlined
                              selectorId={`conditions.${itemIndex}.operation`}
                              fullWidth
                              options={operationOptionsByComparisonType?.[item.type] || []}
                              onChange={(value: OPERATION_TYPE) => fieldItem.onChange(value)}
                              error={!!errorItem?.message}
                              helperText={errorItem?.message}
                              defaultValue={item.operation}
                              style={{ marginTop: 16 }}
                              simpleSelect
                            />
                          )}
                        />

                        {!(
                          [OPERATION_TYPE.IS_EMPTY, OPERATION_TYPE.IS_NOT_EMPTY].includes(
                            item.operation
                          ) || item.type === COMPARISON_TYPE.BOOLEAN
                        ) && (
                          <Controller
                            render={({ field: fieldItem, fieldState: { error: errorItem } }) => (
                              <TextField
                                fullWidth
                                type={item.type === COMPARISON_TYPE.NUMBER ? "number" : "text"}
                                value={fieldItem.value}
                                error={!!errorItem?.message}
                                helperText={errorItem?.message}
                                label="Value"
                                onChange={(e) =>
                                  fieldItem.onChange(
                                    item.type === COMPARISON_TYPE.NUMBER
                                      ? +e.target.value
                                      : item.type === COMPARISON_TYPE.STRING
                                      ? `${e.target.value}`
                                      : !!e.target.value
                                  )
                                }
                              />
                            )}
                            name={`expressions.${index}.conditions.${itemIndex}.value`}
                            control={control}
                          />
                        )}
                        {item.type === COMPARISON_TYPE.BOOLEAN && (
                          <Controller
                            render={({ field: fieldItem }) => (
                              <FormControlLabel
                                control={
                                  <Switch
                                    value={!!fieldItem.value}
                                    onChange={(e) => fieldItem.onChange(e.target.checked)}
                                  />
                                }
                                label={(!!fieldItem.value).toString().toUpperCase()}
                              />
                            )}
                            name={`expressions.${index}.conditions.${itemIndex}.value`}
                            control={control}
                          />
                        )}
                      </Stack>
                    );
                  }
                )}
                <Button
                  startIcon={<Add />}
                  onClick={() => {
                    field.onChange([
                      ...(field.value || []),
                      {
                        key: "",
                        operation:
                          operationOptionsByComparisonType?.[COMPARISON_TYPE.STRING]?.[0]?.value,
                        value: "",
                        type: COMPARISON_TYPE.STRING,
                      },
                    ]);
                  }}
                >
                  Thêm điều kiện
                </Button>
              </Stack>
            )}
          />
        </>
      );
    case EXP_TYPE.GET_OBJECT:
      return (
        <Controller
          name={`expressions.${index}.get_key`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              type="text"
              value={field.value}
              error={!!error?.message}
              helperText={error?.message}
              label="Tên key của object"
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      );

    case EXP_TYPE.INDEX:
      return (
        <Controller
          name={`expressions.${index}.index`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              type="number"
              value={field.value}
              error={!!error?.message}
              helperText={error?.message}
              label="Vị trí phần tử trong mảng"
              onChange={(e) => field.onChange(+e.target.value)}
            />
          )}
        />
      );
    case EXP_TYPE.LENGTH:
      return (
        <Controller
          name={`expressions.${index}.length_key`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              type="text"
              value={field.value}
              error={!!error?.message}
              helperText={error?.message}
              label="Tên key để lấy độ dài mảng"
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      );
    case EXP_TYPE.MULTISELECT:
      return (
        <Controller
          name={`expressions.${index}.select_keys`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              open={false}
              multiple
              id="select-keys"
              options={[]}
              freeSolo
              value={field.value}
              renderTags={(value: readonly string[], getTagProps) =>
                (Array.isArray(value) ? value : []).map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              onChange={(e, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Danh sách key"
                  placeholder="Nhập tên key và Enter để lưu"
                  error={!!error?.message}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
      );

    default:
      return null;
  }
}

export default ExpressionInput;
