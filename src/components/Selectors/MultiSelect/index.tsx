import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import { SelectOptionType } from "_types_/SelectOptionType";
import LoadingModal from "components/Loadings/LoadingModal";
import { ALL_OPTION } from "constants/index";
import filter from "lodash/filter";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import includes from "lodash/includes";
import isBoolean from "lodash/isBoolean";
import isEqual from "lodash/isEqual";
import join from "lodash/join";
import map from "lodash/map";
import React, { useEffect } from "react";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { toSimplest } from "utils/stringsUtil";
import ArrowDropAdornment from "./ArrowDropAdornment";
import ClearAdornment from "./ClearAdornment";
import Option from "./Option";

export const formatValueChangeMultiSelector = (
  value: "all" | (string | number)[] | string | number
) => {
  let formatValue: string | undefined | number | null | (string | number)[] = value;
  if (value === "all") {
    formatValue = undefined;
  } else if (value === "none") {
    formatValue = "null";
  }
  return formatValue;
};

// ---------------------------------------------------
export interface MultiSelectProps {
  options: SelectOptionType[];
  title?: string;
  onChange: (values: "all" | (string | number)[] | string | number) => void;
  label?: string;
  simpleSelect?: boolean;
  defaultValue?: string | number | (string | number)[];
  outlined?: boolean;
  style?: React.CSSProperties;
  isLoading?: boolean;
  isShowLoading?: boolean;
  loadMoreData?: () => void;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  placeholder?: string;
  /** Used to get the width of the selector to set the width of the popover. */
  selectorId: string;
  inputStyle?: React.CSSProperties;
  contentRender?: React.ReactNode;
  zIndex?: number;
  autoFocus?: boolean;
  renderOptionTitleFunc?: ({
    idx,
    option,
    onClick,
  }: {
    option: SelectOptionType;
    idx: number;
    onClick?: () => void;
  }) => React.ReactNode;
  inputProps?: BaseTextFieldProps;
  isAllOption?: boolean;
  visibled?: boolean;
}
export const MultiSelect = ({
  title,
  size = "small",
  options,
  onChange,
  defaultValue,
  simpleSelect,
  outlined,
  style,
  fullWidth,
  isShowLoading = false,
  isLoading = false,
  autoFocus,
  error,
  helperText,
  loadMoreData,
  disabled,
  required,
  selectorId,
  inputStyle,
  contentRender,
  zIndex = 1301,
  renderOptionTitleFunc,
  placeholder,
  inputProps,
  isAllOption = true,
  visibled = true,
}: MultiSelectProps) => {
  const defaultOptions = React.useRef<SelectOptionType[] | null>(null);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = React.useState<SelectOptionType[]>([]);
  const [preSelect, setPreSelect] = React.useState<SelectOptionType[]>([]);
  const [searchOption, setSearchOption] = React.useState<SelectOptionType[]>([]);
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState<any>("");
  const firstOption = options[0]; //is all value

  let id = open ? "selector-popover" : undefined;

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const fullSearchOptions = map(options, (item) => {
      const isExist = findIndex(
        preSelect,
        (prev) => prev.value?.toString() === item.value?.toString()
      );
      if (isExist >= 0) {
        return preSelect[isExist];
      }
      return item;
    });
    const dataSearch =
      input !== join(map(selected, (option) => option.label))
        ? filter(fullSearchOptions, (option) => {
            return includes(toSimplest(option.label), toSimplest(input));
          })
        : options;
    setSearchOption(dataSearch);
  }, [input, options, selected, preSelect]);

  useEffect(() => {
    setInput(join(map(selected, (option) => option.label)));
  }, [selected]);

  /* Nó kiểm tra xem chỗ dựa `defaultValue` là trung thực hay không boolean, 
  và nếu vậy, nó lọc mảng `options` để tìm (các) giá trị mặc định và đặt trạng thái `đã chọn` thành (các) giá trị mặc định được tìm thấy. 
  Nếu prop `defaultValue` là một mảng và bao gồm tất cả các tùy chọn ngoại trừ một tùy chọn, 
  nó sẽ thêm một đối tượng "ALL_OPTION" vào mảng `findDefault`.*/
  useEffect(() => {
    if (defaultValue || defaultValue === 0 || defaultValue === "" || isBoolean(defaultValue)) {
      let findDefault = [];
      if (Array.isArray(defaultValue)) {
        findDefault = options.filter((option) => defaultValue.includes(option.value));
        if (defaultValue.length === options.length - 1) {
          findDefault = isAllOption ? [...options, ALL_OPTION] : findDefault;
        }
      } else {
        findDefault = options.filter(
          (option) => getObjectPropSafely(() => option.value.toString()) === defaultValue.toString()
        );
      }

      if (findDefault) {
        setSelected(findDefault);
      }
    }
    // run one time while mount search input
  }, [defaultValue, options, isAllOption]);

  //get preSelect from selected
  useEffect(() => {
    if (id) {
      if (simpleSelect) {
        setPreSelect(selected);
        defaultOptions.current = selected;
      } else {
        const isFullOption = selected.find((option) => option.value === "all");
        if (isFullOption) {
          setPreSelect(options);
          defaultOptions.current = options;
        } else {
          setPreSelect(selected);
          defaultOptions.current = selected;
        }
      }
    } else {
      setInput(join(map(selected, (option) => option.label)));
    }
  }, [id, options, selected, simpleSelect]);

  const handleScroll = (e: any) => {
    const bottom = e.target.scrollHeight - Math.round(e.target.scrollTop) === e.target.clientHeight;
    if (bottom) {
      loadMoreData && loadMoreData();
    }
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  /**
   * Chức năng này xử lý việc lựa chọn nhiều tùy chọn và cập nhật trạng thái tương ứng.
   * @param option
   */
  const handleMultiChange = (option: { label: string; value: string | number }) => {
    if (option.value === "all") {
      //if option is all
      find(preSelect, (item) => item.value === option.value) //  check is is exist in state
        ? setPreSelect([]) //if true set state to empty array
        : setPreSelect(options); //if false set state = option
    } else {
      //if single option
      let result: SelectOptionType[] = [];
      const isSelected = find(preSelect, (item) => item.value === option.value);
      // nếu option đã được chọn trước đó
      if (isSelected) {
        // if full state
        if (preSelect.length === options.length) {
          // remove option in state and option "all"
          result = filter(preSelect, (name) => name.value !== "all" && name.value !== option.value);
        } else {
          //remove optoin in state
          result = filter(preSelect, (name) => name.value !== option.value);
        }
      } else {
        // option chưa được chọn trước đó
        if (preSelect.length === options.length - 2 && isAllOption) {
          //set state to full
          result = options;
          //else state not asymptotic full
        } else {
          // add option into state
          result = [...preSelect, option];
        }
      }
      //set state
      setPreSelect(result);
    }
  };

  const handleSimpleChange = (option: { label: string; value: string | number }) => {
    //set selected state = option
    setSelected([option]);
    selected.length > 0
      ? option.value !== selected[0].value && onChange(option.value) //if option is new
      : onChange(option.value); //else option is old

    handleToggle(); //hidden popper
  };

  //for multi selector
  const onSubmit = () => {
    //default select all
    if (isAllOption && (preSelect.length === options.length || preSelect.length === 0)) {
      const preSelectedIsAll = find(selected, (option) => option.value === "all");
      //if option is "all" and selected not all then update else not update
      if (!preSelectedIsAll) {
        onChange("all");
        setSelected([firstOption]);
      }
      //else option not "all"
    } else {
      // while popover close to selected get by value of preselect
      setSelected(preSelect);
      const formatOptions = map(preSelect, (option) => option.value);
      setInput(join(map(selected, (option) => option.label)));
      onChange(formatOptions);
    }
    handleToggle();
  };

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setOpen(true);
    }
  };

  const fullWidthSelector = selectorId && document.getElementById(selectorId)?.offsetWidth;

  return visibled ? (
    <ClickAwayListener onClickAway={handleClose}>
      <FormControl
        style={{
          width: fullWidth ? "100%" : undefined,
          minWidth: 150,
          ...style,
        }}
        sx={{ ".MuiInputBase-root": { paddingRight: 0 } }}
        id={selectorId}
      >
        <TextField
          style={inputStyle}
          value={input}
          size={size}
          onClick={() => setOpen(true)}
          inputRef={anchorRef as any}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          label={title}
          autoFocus={autoFocus}
          InputProps={{
            endAdornment: open ? (
              <ClearAdornment onClear={() => setInput("")} />
            ) : (
              <ArrowDropAdornment />
            ),
            autoComplete: "off",
          }}
          sx={{ pointerEvents: disabled ? "none" : "auto" }}
          variant={outlined ? "outlined" : "standard"}
          onChange={(e) => setInput(e.target.value)}
          error={error}
          helperText={helperText}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          onKeyPress={onKeyPress}
          {...inputProps}
        />
        <PopoverWrap
          id={id}
          open={open}
          transition
          anchorEl={anchorRef.current}
          placement="bottom-start"
          // disablePortal
          className="popper-selector"
          style={{
            width: fullWidth && fullWidthSelector ? fullWidthSelector : undefined,
            zIndex,
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={3} sx={{ maxWidth: 550 }}>
                <div style={{ width: "100%" }}>
                  {!simpleSelect && (
                    <Button
                      onClick={onSubmit}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      variant="contained"
                      disabled={isEqual(defaultOptions.current, preSelect)}
                    >
                      Chọn
                    </Button>
                  )}
                  {contentRender}
                  <ListOptionWrap
                    onScroll={handleScroll}
                    sx={{ maxHeight: [400, 400, 300, 400, 400] }}
                  >
                    {map(searchOption, (option, index) => {
                      return (
                        <Option
                          key={option.label + option.value + index}
                          option={option}
                          handleSimpleChange={handleSimpleChange}
                          handleMultiChange={handleMultiChange}
                          preSelect={preSelect}
                          simpleSelect={simpleSelect}
                          fullWidth={fullWidth}
                          renderOptionTitle={({ onClick }) =>
                            renderOptionTitleFunc &&
                            renderOptionTitleFunc({
                              option,
                              idx: index,
                              onClick,
                            })
                          }
                        />
                      );
                    })}
                  </ListOptionWrap>
                  {isShowLoading ? isLoading ? <LoadingModal size={25} /> : null : null}
                </div>
              </Paper>
            </Fade>
          )}
        </PopoverWrap>
      </FormControl>
    </ClickAwayListener>
  ) : null;
};

const PopoverWrap = styled(Popper)(({ theme }) => {
  const modalIndex = theme.zIndex as { modal: number };
  return {
    zIndex: modalIndex.modal + 1,
  };
});

const ListOptionWrap = styled(List)({
  maxHeight: 300,
  minWidth: 150,
  overflowY: "auto",
});
