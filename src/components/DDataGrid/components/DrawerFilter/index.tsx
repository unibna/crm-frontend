// Libraries
import { useEffect, useState } from "react";

// Components
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import closeFill from "@iconify/icons-eva/close-fill";
import Scrollbar from "components/Scrolls/Scrollbar";
import RangeDateV2 from "components/Pickers/RangeDateV2";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants
import map from "lodash/map";
import vi from "locales/vi.json";

export interface DataHeader {
  title: string;
  options: SelectOptionType[];
  label: string;
  multiple?: boolean;
  defaultValue?: any;
}

interface Props {
  isOpen: boolean;
  isShowFilterDate?: boolean;
  handleClose: any;
  dataRender?: DataHeader[];
  params?: { [key: string]: any };
  searchInput?: { label: string; keySearch: string };
  dateProps: { keyDate: string[]; trackingDate?: string[] };
  handleChangeFilter?: (filters: any) => void;
  handleClearFilter?: any;
}

export interface Option {
  label: string;
  value: string;
}

const DrawerFilter = (props: Props) => {
  const {
    isOpen = false,
    handleClose,
    searchInput,
    dataRender = [],
    params,
    handleChangeFilter,
    handleClearFilter,
  } = props;

  const [filter, setFilter] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (params) {
      setFilter(params);
    }
  }, [isOpen]); // eslint-disable-line

  const handleSelectFilter = (type: string, value?: Option[] | Option) => {
    setFilter({
      ...filter,
      [type]: value && (Array.isArray(value) ? map(value, (item) => item.value) : value.value),
    });
  };

  const handleChangeTime = (
    created_from: string | undefined,
    created_to: string | undefined,
    dateValue: string | undefined | number
  ) => {
    setFilter({
      ...filter,
      [props.dateProps.keyDate[0]]: created_from,
      [props.dateProps.keyDate[1]]: created_to,
      dateValue: dateValue,
    });
  };

  const handleSaveChange = () => {
    if (Object.keys(filter).length) {
      const newFilter = Object.keys(filter).reduce((prevValue: any, current: any) => {
        return (filter[current]?.length && !filter[current].includes("all")) ||
          [
            [props.dateProps.keyDate[0]],
            [props.dateProps.keyDate[1]],
            "dateValue",
            searchInput?.keySearch,
          ].includes(current)
          ? {
              ...prevValue,
              [current]: filter[current],
            }
          : {
              ...prevValue,
              [current]: "all",
            };
      }, {});

      handleClose();
      handleChangeFilter && handleChangeFilter(newFilter);
    } else {
      handleClose();
      handleClearFilter();
    }
  };

  const renderDataHeaderShare = () => {
    return map(dataRender, (item, index) => {
      const { title, options, label, defaultValue = [], multiple = true } = item;
      const newValue =
        filter && filter[label]
          ? options.filter((option: any) =>
              multiple ? filter[label].includes(option.value) : filter[label] === option.value
            )
          : options.filter((option: any) => defaultValue === option.value);
      return (
        <Box
          key={index}
          sx={{
            width: "100%",
            "& .MuiAutocomplete-option": {
              typography: "span2",
              "& > span": { mr: 1, fontSize: 15 },
            },
          }}
        >
          <Autocomplete
            fullWidth
            multiple={multiple}
            options={options}
            value={multiple ? newValue : newValue[0]}
            disableCloseOnSelect
            onChange={(event: any, value: any) => handleSelectFilter(label, value)}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props} style={selectorStyle}>
                {multiple && <Checkbox checked={selected} />}
                {option.label}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label={title} />}
          />
        </Box>
      );
    });
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 280, border: "none", overflow: "hidden" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1, py: 2 }}
      >
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Filters
        </Typography>
        <Button onClick={handleClose}>
          <Icon icon={closeFill} width={20} height={20} />
        </Button>
      </Stack>
      <Divider />
      <Scrollbar style={scrollBarStyle}>
        <Stack spacing={3} sx={{ p: 3 }}>
          {searchInput?.label ? (
            <Box
              sx={{
                width: "100%",
                "& .MuiAutocomplete-option": {
                  typography: "span2",
                  "& > span": { mr: 1, fontSize: 15 },
                },
              }}
            >
              <TextField
                fullWidth
                value={filter[searchInput?.keySearch]}
                label={searchInput?.label}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    [searchInput?.keySearch]: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          ) : null}
          <Box
            sx={{
              width: "100%",
              "& .MuiAutocomplete-option": {
                typography: "body2",
                "& > span": { mr: 1, fontSize: 15 },
              },
            }}
          >
            <RangeDateV2
              handleSubmit={handleChangeTime}
              defaultDateValue={filter?.dateValue}
              created_from={filter && filter[props.dateProps.keyDate[0]]}
              created_to={filter && filter[props.dateProps.keyDate[1]]}
            />
          </Box>
          {dataRender?.length ? renderDataHeaderShare() : null}
          {props.dateProps.trackingDate && (
            <Box
              sx={{
                width: "100%",
                "& .MuiAutocomplete-option": {
                  typography: "body2",
                  "& > span": { mr: 1, fontSize: 15 },
                },
              }}
            >
              <RangeDateV2
                handleSubmit={handleChangeTime}
                defaultDateValue={filter?.dateValue}
                created_from={filter && filter[props.dateProps.keyDate[0]]}
                created_to={filter && filter[props.dateProps.keyDate[1]]}
                label="Ngày tạo mã vận đơn"
              />
            </Box>
          )}
        </Stack>
      </Scrollbar>
      {handleClearFilter ? (
        <Box sx={{ p: 3, pb: 1 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={() => setFilter({})}
            startIcon={<Icon icon={roundClearAll} />}
          >
            {vi.clear_filter}
          </Button>
        </Box>
      ) : null}
      <Box sx={{ p: 3, pt: 1 }}>
        <Button type="submit" fullWidth variant="contained" size="large" onClick={handleSaveChange}>
          Save Changes
        </Button>
      </Box>
    </Drawer>
  );
};

export default DrawerFilter;

const selectorStyle = { fontSize: 13 };
const scrollBarStyle = { height: "100%" };
