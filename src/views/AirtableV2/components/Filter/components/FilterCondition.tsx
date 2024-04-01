import { useMemo, useRef, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Checkbox,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  alpha,
  styled,
} from "@mui/material";

import { DatePicker, DateTimePicker } from "@mui/lab";
import { useTheme } from "@mui/material";
import { AirTableColumn, AirTableColumnTypes } from "_types_/SkyTableType";
import { useAppSelector } from "hooks/reduxHook";
import { userStore } from "store/redux/users/slice";
import { dateIsValid } from "utils/helpers";
import {
  AirTableColumnIcons,
  AirTableConjunctionLabel,
  AirTableModeLabels,
  AirTableOperatorLabels,
  MAP_OPERATOR_WITH_COLUMN_TYPE,
} from "views/AirtableV2/constants";
import ComplexSelect from "../../ComplexSelect";
import TextLink from "../../TextLink";
import { Conjunction, Mode, Operator } from "../AbstractFilterItem";

interface Props {
  id: string;
  filterItemIndex: number;
  columns: AirTableColumn[];
  columnsObject: { [key: string]: AirTableColumn };
  conjunction: Conjunction;
  columnId?: AirTableColumn["id"];
  operator?: Operator;
  value?: any;
  onChange: (name: string) => (value: any) => void;
  onDelete: (id: string) => void;
}

const ConditionComponent = (props: Props) => {
  const {
    id,
    filterItemIndex,
    columns,
    columnsObject,
    conjunction,
    columnId,
    operator,
    value,
    onChange,
    onDelete,
  } = props;

  const theme = useTheme();
  const { users } = useAppSelector(userStore);

  const inputRef = useRef<any>();
  const [temp, setTemp] = useState<any>();

  const columnType = useMemo(() => {
    return columns.find((column) => column.id === columnId)?.type;
  }, [columnId, columns]);

  const operators = useMemo(() => {
    return (
      (columnType &&
        Object.keys(Operator).filter((operatorKey: keyof typeof Operator) =>
          MAP_OPERATOR_WITH_COLUMN_TYPE[Operator[operatorKey]].includes(columnType)
        )) ||
      []
    );
  }, [columnType]);

  const renderValueComponent = () => {
    if (
      !columnsObject ||
      !columnId ||
      operator === Operator.IS_EMPTY ||
      operator === Operator.IS_NOT_EMPTY
    )
      return null;

    let tempValue: any = {
      mode: operator === Operator.IS_WITHIN ? Mode.THE_NEXT_NUMBER_OF_DAYS : Mode.EXACT_DATE,
      value: value?.value || "",
    };

    switch (operator) {
      case Operator.CONTAINS:
      case Operator.DOES_NOT_CONSTAINS:
      case Operator.EQUAL:
      case Operator.NOT_EQUAL:
      case Operator.GREATER:
      case Operator.GREATER_OR_EQUAL:
      case Operator.SMALLER:
      case Operator.SMALLER_OR_EQUAL:
        return (
          <OutlinedInputStyled
            inputRef={inputRef}
            defaultValue={value}
            onBlur={() => {
              inputRef.current?.value !== value && onChange("value")(inputRef.current?.value);
            }}
            onKeyUp={(event: any) => {
              if (event.key == "Enter") {
                inputRef?.current?.value !== value && onChange("value")(inputRef?.current?.value);
              }
            }}
            placeholder="Nhập giá trị"
          />
        );

      case Operator.IS:
      case Operator.IS_NOT:
        if (
          [AirTableColumnTypes.SINGLE_SELECT, AirTableColumnTypes.SINGLE_USER].includes(
            columnsObject[columnId].type
          )
        ) {
          return (
            <ComplexSelect
              id={id}
              options={
                columnsObject[columnId].type === AirTableColumnTypes.SINGLE_USER
                  ? users
                  : columnsObject[columnId].options?.choices || []
              }
              defaultValue={value}
              onChange={onChange("value")}
              sx={{
                width: 180,
                p: "6px 16px 6px 12px",
                fieldset: {
                  borderColor: "initial",
                },
                svg: {
                  fontSize: "1.5rem",
                },
              }}
            />
          );
        }

        if (
          columnsObject[columnId].type === AirTableColumnTypes.DATE ||
          columnsObject[columnId].type === AirTableColumnTypes.DATETIME
        ) {
          const modes = Object.keys(Mode).slice(0, 10);
          return (
            <Stack direction="row" spacing={1}>
              <SelectStyled
                value={tempValue?.mode}
                onChange={(e) => onChange("value")({ ...tempValue, mode: e.target.value })}
                input={
                  <OutlinedInputStyled
                    sx={{
                      minWidth: `80px!important`,
                      width: 80,
                    }}
                  />
                }
              >
                {modes.map((key: keyof typeof Mode) => (
                  <MenuItem value={Mode[key]}>
                    <ItemText>{AirTableModeLabels[Mode[key]]}</ItemText>
                  </MenuItem>
                ))}
              </SelectStyled>
              {tempValue?.mode === Mode.EXACT_DATE && (
                <>
                  {columnsObject[columnId].type === AirTableColumnTypes.DATE && (
                    <DatePicker
                      value={tempValue?.value || null}
                      onChange={(date) => {
                        setTemp(date);
                      }}
                      renderInput={(params) => (
                        <TextFieldStyled
                          {...params}
                          onKeyUp={(event: any) => {
                            if (event.key == "Enter" && temp && dateIsValid(temp)) {
                              onChange("value")({
                                mode: tempValue.mode,
                                value: new Date(temp).toISOString(),
                              });
                            }
                          }}
                        />
                      )}
                      inputRef={inputRef}
                      onAccept={(date) => {
                        onChange("value")({
                          mode: tempValue.mode,
                          value: date ? new Date(date).toISOString() : "",
                        });
                      }}
                    />
                  )}
                  {columnsObject[columnId].type === AirTableColumnTypes.DATETIME && (
                    <DateTimePicker
                      value={tempValue?.value || null}
                      onChange={(date) => {
                        setTemp(date);
                      }}
                      renderInput={(params) => (
                        <TextFieldStyled
                          {...params}
                          onKeyUp={(event: any) => {
                            if (event.key == "Enter" && temp && dateIsValid(temp)) {
                              onChange("value")({
                                mode: tempValue.mode,
                                value: new Date(temp).toISOString(),
                              });
                            }
                          }}
                        />
                      )}
                      inputRef={inputRef}
                      onAccept={(date) => {
                        onChange("value")({
                          mode: tempValue.mode,
                          value: date ? new Date(date).toISOString() : "",
                        });
                      }}
                    />
                  )}
                </>
              )}
              {[
                Mode.NUMBER_OF_DAYS_AGO,
                Mode.NUMBER_OF_DAYS_FROM_NOW,
                Mode.THE_NEXT_NUMBER_OF_DAYS,
                Mode.THE_PAST_NUMBER_OF_DAYS,
              ].includes(tempValue.mode) && (
                <OutlinedInputStyled
                  inputRef={inputRef}
                  defaultValue={tempValue?.value}
                  onBlur={() => {
                    inputRef.current?.value !== tempValue?.value &&
                      onChange("value")({ mode: tempValue.mode, value: inputRef.current?.value });
                  }}
                  onKeyUp={(event: any) => {
                    if (event.key == "Enter") {
                      inputRef?.current?.value !== value?.value &&
                        onChange("value")({
                          mode: tempValue.mode,
                          value: inputRef?.current?.value,
                        });
                    }
                  }}
                  placeholder="Nhập giá trị"
                />
              )}
            </Stack>
          );
        }

        if (columnsObject[columnId].type === AirTableColumnTypes.CHECKBOX) {
          return (
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange("value")(e.target.checked)}
              // inputProps={{ "aria-label": "controlled" }}
            />
          );
        }
        return (
          <OutlinedInputStyled
            inputRef={inputRef}
            defaultValue={value}
            onBlur={() => {
              inputRef.current?.value !== value && onChange("value")(inputRef.current?.value);
            }}
            onKeyUp={(event: any) => {
              if (event.key == "Enter") {
                inputRef?.current?.value !== value && onChange("value")(inputRef?.current?.value);
              }
            }}
            placeholder="Nhập giá trị"
          />
        );

      case Operator.IS_EXACTLY:
      case Operator.IS_ANY_OF:
      case Operator.IS_NONE_OF:
      case Operator.HAS_ANY_OF:
      case Operator.HAS_ALL_OF:
      case Operator.HAS_NONE_OF:
        return (
          <ComplexSelect
            id={id}
            options={
              columnsObject[columnId].type === AirTableColumnTypes.MULTIPLE_USER ||
              columnsObject[columnId].type === AirTableColumnTypes.SINGLE_USER
                ? users
                : columnsObject[columnId].options?.choices || []
            }
            defaultValue={Array.isArray(value) ? value : []}
            onChange={onChange("value")}
            sx={{
              width: 180,
              p: "6px 16px 6px 12px",

              fieldset: {
                borderColor: "initial",
              },
              svg: {
                fontSize: "1.5rem",
              },
            }}
            multiple
          />
        );

      // case Operator.IS_BEFORE:
      // case Operator.IS_AFTER:
      // case Operator.IS_ON_OR_BEFORE:
      // case Operator.IS_ON_OR_AFTER:
      //   if (columnsObject[columnId].type === AirTableColumnTypes.DATE) {
      //     return (
      //       <DatePicker
      //         value={value || null}
      //         onChange={(date) => {
      //           setTemp(date);
      //         }}
      //         renderInput={(params) => (
      //           <TextFieldStyled
      //             {...params}
      //             onKeyUp={(event: any) => {
      //               if (event.key == "Enter" && temp && dateIsValid(temp)) {
      //                 onChange("value")(new Date(temp).toISOString());
      //               }
      //             }}
      //           />
      //         )}
      //         inputRef={inputRef}
      //         onAccept={(date) => {
      //           onChange("value")(date ? new Date(date).toISOString() : "");
      //         }}
      //       />
      //     );
      //   }
      //   if (columnsObject[columnId].type === AirTableColumnTypes.DATETIME) {
      //     return (
      //       <DateTimePicker
      //         value={value || null}
      //         onChange={(date) => {
      //           setTemp(date);
      //         }}
      //         renderInput={(params) => (
      //           <TextFieldStyled
      //             {...params}
      //             onKeyUp={(event: any) => {
      //               if (event.key == "Enter" && temp && dateIsValid(temp)) {
      //                 onChange(new Date(temp).toISOString());
      //               }
      //             }}
      //           />
      //         )}
      //         inputRef={inputRef}
      //         onAccept={(date) => {
      //           onChange(date ? new Date(date).toISOString() : "");
      //         }}
      //       />
      //     );
      //   }

      case Operator.IS_BEFORE:
      case Operator.IS_AFTER:
      case Operator.IS_ON_OR_BEFORE:
      case Operator.IS_ON_OR_AFTER:
      case Operator.IS_WITHIN:
        const modes =
          operator !== Operator.IS_WITHIN
            ? Object.keys(Mode).slice(0, 10)
            : Object.keys(Mode).slice(11, Object.keys(Mode).length);

        return (
          <Stack direction="row" spacing={1}>
            <SelectStyled
              value={tempValue?.mode}
              onChange={(e) => onChange("value")({ ...tempValue, mode: e.target.value })}
              input={
                <OutlinedInputStyled
                  sx={{
                    minWidth: `80px!important`,
                    width: 80,
                  }}
                />
              }
            >
              {modes.map((key: keyof typeof Mode) => (
                <MenuItem value={Mode[key]}>
                  <ItemText>{AirTableModeLabels[Mode[key]]}</ItemText>
                </MenuItem>
              ))}
            </SelectStyled>
            {tempValue?.mode === Mode.EXACT_DATE && (
              <>
                {columnsObject[columnId].type === AirTableColumnTypes.DATE && (
                  <DatePicker
                    value={tempValue?.value || null}
                    onChange={(date) => {
                      setTemp(date);
                    }}
                    renderInput={(params) => (
                      <TextFieldStyled
                        {...params}
                        onKeyUp={(event: any) => {
                          if (event.key == "Enter" && temp && dateIsValid(temp)) {
                            onChange("value")({
                              mode: tempValue.mode,
                              value: new Date(temp).toISOString(),
                            });
                          }
                        }}
                      />
                    )}
                    inputRef={inputRef}
                    onAccept={(date) => {
                      onChange("value")({
                        mode: tempValue.mode,
                        value: date ? new Date(date).toISOString() : "",
                      });
                    }}
                  />
                )}
                {columnsObject[columnId].type === AirTableColumnTypes.DATETIME && (
                  <DateTimePicker
                    value={tempValue?.value || null}
                    onChange={(date) => {
                      setTemp(date);
                    }}
                    renderInput={(params) => (
                      <TextFieldStyled
                        {...params}
                        onKeyUp={(event: any) => {
                          if (event.key == "Enter" && temp && dateIsValid(temp)) {
                            onChange("value")({
                              mode: tempValue.mode,
                              value: new Date(temp).toISOString(),
                            });
                          }
                        }}
                      />
                    )}
                    inputRef={inputRef}
                    onAccept={(date) => {
                      onChange("value")({
                        mode: tempValue.mode,
                        value: date ? new Date(date).toISOString() : "",
                      });
                    }}
                  />
                )}
              </>
            )}
            {[
              Mode.NUMBER_OF_DAYS_AGO,
              Mode.NUMBER_OF_DAYS_FROM_NOW,
              Mode.THE_NEXT_NUMBER_OF_DAYS,
              Mode.THE_PAST_NUMBER_OF_DAYS,
            ].includes(tempValue.mode) && (
              <OutlinedInputStyled
                inputRef={inputRef}
                defaultValue={tempValue?.value}
                onBlur={() => {
                  inputRef.current?.value !== tempValue?.value &&
                    onChange("value")({ mode: tempValue.mode, value: inputRef.current?.value });
                }}
                onKeyUp={(event: any) => {
                  if (event.key == "Enter") {
                    inputRef?.current?.value !== value?.value &&
                      onChange("value")({ mode: tempValue.mode, value: inputRef?.current?.value });
                  }
                }}
                placeholder="Nhập giá trị"
              />
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <TableRow>
      <TableCell>
        {filterItemIndex === 0 ? (
          <SelectStyled
            value={conjunction}
            onChange={(e) => onChange("conjunction")(e.target.value)}
            input={
              <OutlinedInputStyled
                sx={{
                  minWidth: `80px!important`,
                  width: 80,
                }}
              />
            }
          >
            <MenuItem value={Conjunction.AND}>
              <ItemText>{AirTableConjunctionLabel[Conjunction.AND]}</ItemText>
            </MenuItem>
            <MenuItem value={Conjunction.OR}>
              <ItemText>{AirTableConjunctionLabel[Conjunction.OR]}</ItemText>
            </MenuItem>
          </SelectStyled>
        ) : (
          <TextLink content={AirTableConjunctionLabel[conjunction]} sx={{ pl: 1 }} />
        )}
      </TableCell>
      <TableCell>
        <SelectStyled
          value={columnId}
          onChange={(e) => onChange("columnId")(e.target.value)}
          input={<OutlinedInputStyled />}
        >
          {columns.map((column) => (
            <MenuItem key={column.id} value={column.id}>
              <ItemIcon>{AirTableColumnIcons[column.type]}</ItemIcon>
              <ItemText>{column.name}</ItemText>
            </MenuItem>
          ))}
        </SelectStyled>
      </TableCell>
      <TableCell>
        <SelectStyled
          value={operator}
          onChange={(e) => onChange("operator")(e.target.value)}
          input={<OutlinedInputStyled />}
          sx={{ minWidth: 120, width: 120 }}
        >
          {operators.map((operatorKey: keyof typeof Operator) => (
            <MenuItem key={operatorKey} value={Operator[operatorKey]}>
              <ItemText>{AirTableOperatorLabels[Operator[operatorKey]]}</ItemText>
            </MenuItem>
          ))}
        </SelectStyled>
      </TableCell>
      <TableCell>{renderValueComponent()}</TableCell>

      <TableCell>
        <ButtonStyled onClick={() => onDelete(id)}>
          <DeleteIcon />
        </ButtonStyled>
      </TableCell>
    </TableRow>
  );
};

export default ConditionComponent;

const SelectStyled = styled(Select)(() => ({
  minWidth: 140,
  fontSize: 12,
  height: "fit-content",
  ".MuiSelect-select": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
  },
}));

const OutlinedInputStyled = styled(OutlinedInput)(() => ({
  width: 140,
  ".MuiOutlinedInput-input": {
    padding: "6px 12px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const TextFieldStyled = styled(TextField)(() => ({
  width: 140,
  ".MuiOutlinedInput-input": {
    padding: "6px 12px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const ItemText = styled(ListItemText)(() => ({
  ".MuiTypography-root": {
    fontSize: 12,
    fontWeight: 500,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const ItemIcon = styled(ListItemIcon)(() => ({
  "&.MuiListItemIcon-root": {
    minWidth: "24px!important",
    marginRight: "4px",
  },

  ".MuiSvgIcon-root": { fontSize: 16 },
}));

const ButtonStyled = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  ".MuiSvgIcon-root": { fontSize: 16, color: theme.palette.primary.main },
}));
