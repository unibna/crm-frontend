import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import ArrowForward from "@mui/icons-material/ArrowForward";
import React, { useCallback, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import debounce from "lodash/debounce";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Theme, SxProps } from "@mui/material";
import { getStorage, setStorage } from "utils/asyncStorageUtil";
import SearchIcon from "@mui/icons-material/Search";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const SEARCH_DELAY_TIMING = 500;

export interface SearchFieldProps {
  label?: string;
  renderIcon?: React.ReactNode;
  isShowError?: boolean;
  roadster?: boolean;
  onSearch?: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
  handleFocus?: () => void;
  loading?: boolean;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  isShowEndAdornment?: boolean;
  isDebounce?: boolean;
  adornmentPosition?: "start" | "end";
  type?: string;
  minLength?: number;
}

const iconStyle = { fontSize: 20 };

export const SearchField = ({
  adornmentPosition = "start",
  isDebounce = true,
  type,
  minLength = 0,
  ...props
}: SearchFieldProps) => {
  const {
    label = "Tìm kiếm",
    renderIcon = <SearchIcon style={iconStyle} />,
    roadster,
    onSearch,
  } = props;
  const [value, setValue] = useState("");
  const [prevValue, setPrevValue] = useState("prev");
  const [isPasted, setPasted] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  React.useEffect(() => {
    setPrevValue(props.defaultValue || "prev");
    setValue(props.defaultValue || "");
  }, [props.defaultValue]);

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
      event.stopPropagation();
    }
  };

  const debouncedSearch = React.useRef(
    debounce((text) => {
      onSearch && (text.length >= minLength || !text) && onSearch(text);
      handleSaveSearch(text);
    }, SEARCH_DELAY_TIMING)
  ).current;

  const handlePaste = async () => {
    const content = await navigator.clipboard.readText();
    onSearch && (content.length >= minLength || !content) && onSearch(content);
    handleSaveSearch(content);
    setShowRecent(false);
    setPasted(true);
  };

  const handleClear = () => {
    onSearch && onSearch("");
    setValue("");
    setPasted(false);
  };

  const handleSaveSearch = useCallback(
    (value: string) => {
      if (type) {
        const searchRecent = getStorage(`search-recent-${type}`);
        if (value) {
          let recentClone: string[] = searchRecent ? [...JSON.parse(searchRecent)] : [];
          const findRecentInLocal = recentClone.findIndex((item) => item === value);
          if (findRecentInLocal !== 0) {
            if (findRecentInLocal > 0) {
              recentClone.splice(findRecentInLocal, 1);
            }
            recentClone = [value, ...recentClone];
          }

          const newRecent = recentClone.splice(0, 14);
          setRecent(newRecent);
          setStorage(`search-recent-${type}`, JSON.stringify(newRecent));
        }
      }
    },
    [type]
  );

  const handleSearch = useCallback(() => {
    if (prevValue !== value && value === "" && prevValue !== "prev" && !isDebounce) {
      onSearch && (value.length >= minLength || !value) && onSearch(value);
      handleSaveSearch(value);
      setPrevValue(value);
    }
  }, [handleSaveSearch, isDebounce, minLength, onSearch, prevValue, value]);

  const handleSetRecent = useCallback(() => {
    if (type) {
      const searchRecent = getStorage(`search-recent-${type}`);
      if (searchRecent) {
        setRecent(JSON.parse(searchRecent));
      }
    }
  }, [type]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    handleSetRecent();
  }, [handleSetRecent]);

  return (
    <Box position="relative" width={"100%"}>
      <ClickAwayListener onClickAway={() => setShowRecent(false)}>
        <Paper elevation={showRecent && type ? 3 : 0} onFocus={(e) => setShowRecent(true)}>
          <TextField
            label={label}
            size={props.size || "small"}
            style={props.style}
            sx={{ width: props.fullWidth ? undefined : 300, ...props.sx }}
            variant={roadster ? "standard" : "outlined"}
            value={value}
            fullWidth={props.fullWidth}
            placeholder={props.placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value !== " ") {
                setValue(e.target.value);
                isDebounce && debouncedSearch(e.target.value);
              }
            }}
            onKeyPress={onKeyPress}
            InputProps={{
              autoComplete: "off",
              startAdornment:
                props.loading && adornmentPosition === "start" ? (
                  <CircularProgress size={20} style={loadingAdornmentIconStyle} />
                ) : (
                  renderIcon && (
                    <InputAdornment position="start" style={adornmentIconStyle}>
                      {renderIcon}
                    </InputAdornment>
                  )
                ),
              endAdornment:
                //check show button search
                props.loading && adornmentPosition === "end" ? (
                  <CircularProgress size={20} style={loadingAdornmentIconStyle} />
                ) : (props.isShowEndAdornment ||
                    (prevValue === "prev" && value !== "") ||
                    (prevValue !== "prev" && prevValue !== value)) &&
                  !isDebounce ? (
                  <InputAdornment
                    position="end"
                    onClick={() => {
                      handleSearch();
                    }}
                    style={endAdornmentStyle}
                  >
                    <ArrowForward />
                  </InputAdornment>
                ) : (
                  <InputAdornment
                    position="end"
                    onClick={value ? handleClear : handlePaste}
                    style={endAdornmentStyle}
                  >
                    {value ? (
                      <HighlightOffIcon />
                    ) : (
                      <ContentPasteSearchIcon style={{ fontSize: 20 }} />
                    )}
                  </InputAdornment>
                ),
            }}
            name={props.name}
            disabled={props.disabled}
            error={props.error}
            helperText={props.helperText}
            required={props.required}
            autoFocus={props.autoFocus}
          />

          {/* {type && showRecent && (
            <Stack style={{ width: "100%" }}>
              <Typography fontSize={12} fontWeight={600} mt={1} mb={0.5}>
                Gần đây:
              </Typography>

              {recent.length ? (
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                  }}
                  subheader={<li />}
                >
                  {recent.map((item) => (
                    <ListItem
                      key={item}
                      disablePadding
                      onClick={() => {
                        setValue(item);
                        isDebounce && debouncedSearch(item);
                        setShowRecent(false);
                      }}
                    >
                      <ListItemButton style={{ padding: 4 }}>
                        <ListItemText primary={item} sx={{ span: { fontSize: 13 } }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <NoDataPanel
                  showImage
                  message="Không có dữ liệu"
                  wrapImageStyles={{ maxHeight: 130 }}
                />
              )}
            </Stack>
          )} */}
        </Paper>
      </ClickAwayListener>
    </Box>
  );
};

const loadingAdornmentIconStyle = { marginRight: 9 };
const adornmentIconStyle = { marginRight: 8 };
const endAdornmentStyle = { cursor: "pointer" };
