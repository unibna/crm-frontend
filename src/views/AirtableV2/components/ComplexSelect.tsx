import ObjectID from "bson-objectid";
import { useMemo, useState } from "react";

import Add from "@mui/icons-material/Add";
import {
  alpha,
  Box,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";

import { AirTableOption } from "_types_/SkyTableType";
import { randomHSLA, standardString } from "utils/helpers";
import ColorPicker from "./ColorPicker";
import EditText from "./EditText";
import Tag from "./Tag";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

interface Props {
  id?: string;
  options: AirTableOption[];
  defaultValue?: any;
  multiple?: boolean;
  isShowImage?: boolean;
  sx?: SxProps<Theme>;
  isOriginal?: boolean;
  onChange: (newValue: string | string[]) => void;
  onChangeOptions?: (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => void;
}

function ComplexSelect(props: Props) {
  const {
    id,
    options,
    defaultValue,
    multiple,
    isShowImage,
    sx,
    isOriginal,
    onChange,
    onChangeOptions,
  } = props;

  const [search, setSearch] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (JSON.stringify(defaultValue) !== JSON.stringify(value)) {
      onChange(value);
    }
  };

  const convertValue = (value: any) => {
    let tempValue = value;

    if (multiple && (!value || (value && !Array.isArray(value)))) tempValue = [];

    if (multiple && value && Array.isArray(value)) {
      tempValue = value.filter((item) => options.some((option) => option.id === item));
    }

    if (!multiple && ((value && !options.some((option) => value === option.id)) || !value))
      tempValue = "";

    return tempValue;
  };

  return (
    <Select
      sx={{
        width: "100%",
        position: "relative",
        ...(!isOriginal && {
          p: 0,
          ".MuiSelect-select": {
            p: 0,
          },
          svg: {
            right: 1,
            fontSize: "1.2rem",
          },
          fieldset: {
            border: "none",
          },
        }),
        ...sx,
      }}
      id={id}
      multiple={multiple}
      value={convertValue(defaultValue)}
      onChange={handleChange}
      input={<OutlinedInput id={id} />}
      renderValue={(selected) => {
        const selectedArray = options.filter((item) =>
          Array.isArray(selected)
            ? !!selected.find((itemSelected: string) => itemSelected === item.id)
            : selected === item.id
        );
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selectedArray.map((item: any) => (
              <Tag
                key={item.id}
                label={item.name}
                color={item.color}
                sx={{ py: 0, minHeight: 26 }}
                image={item.image}
                isShowImage={isShowImage}
              />
            ))}
          </Box>
        );
      }}
      MenuProps={MenuProps}
    >
      <ListOption
        options={options}
        search={search}
        isShowImage={isShowImage}
        defaultValue={defaultValue}
        onClickItem={(optionId: string) => {
          if (multiple) {
            if (!defaultValue?.includes(optionId)) {
              onChange([...defaultValue, optionId]);
            } else {
              onChange(defaultValue.filter((item: any) => item !== optionId));
            }
          } else {
            if (defaultValue !== optionId) {
              onChange(optionId);
            } else {
              onChange("");
            }
          }
        }}
      />

      <NewOption
        onSubmit={
          onChangeOptions
            ? (option: AirTableOption) => {
                onChangeOptions([...options, option], {
                  actionSuccess: () => {
                    onChange(multiple ? [...defaultValue, option.id] : option.id);
                  },
                });
              }
            : undefined
        }
        setSearch={setSearch}
      />
    </Select>
  );
}

export default ComplexSelect;

const ListOption = ({
  options,
  search,
  defaultValue,
  isShowImage,
  onClickItem,
}: {
  options: AirTableOption[];
  search?: string;
  defaultValue?: any;
  isShowImage?: boolean;
  onClickItem: (id: string) => void;
}) => {
  const theme = useTheme();

  const optionsFiltered = useMemo(() => {
    if (!search) return options;
    let list = options.filter((option) => {
      let tempName = standardString(option.name);
      let tempSearch = standardString(search);

      return tempName.includes(tempSearch);
    });

    return list;
  }, [search, options]);

  return (
    <>
      {optionsFiltered.map((item) => (
        <MenuItem
          key={item.id}
          value={item.id}
          sx={{
            ...(((Array.isArray(defaultValue) && defaultValue.includes(item.id)) ||
              (!Array.isArray(defaultValue) && item.id === defaultValue)) && {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            }),
          }}
          onClick={() => onClickItem(item.id)}
        >
          <Tag label={item.name} color={item.color} image={item.image} isShowImage={isShowImage} />
        </MenuItem>
      ))}{" "}
    </>
  );
};

const NewOption = ({
  onSubmit,
  setSearch,
}: {
  onSubmit?: (option: AirTableOption) => void;
  setSearch: any;
}) => {
  const [option, setOption] = useState<AirTableOption>({
    id: new ObjectID().toHexString(),
    name: "",
    color: randomHSLA(Math.random()),
  });

  return (
    <Stack
      direction="row"
      spacing={1}
      width="100%"
      display="flex"
      alignItems="center"
      p={2}
      py={1.5}
      bottom={0}
      position={"sticky"}
      sx={{ backgroundColor: "background.paper" }}
      // onClickCapture={stopImmediatePropagation}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {onSubmit && (
        <ColorPicker
          value={option.color}
          buttonStyles={{ minWidth: 18, minHeight: 18, width: 18, height: 18 }}
          onChange={(newValue: string) => {
            setOption({
              ...option,
              color: newValue,
            });
          }}
        />
      )}

      <EditText
        value={option.name}
        sx={{
          "& .MuiInputBase-root": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderRadius: 0,
          },
        }}
        onChange={(e: any) => {
          setOption({
            ...option,
            name: e.target.value,
          });

          setSearch(e.target.value);
        }}
        placeholder={onSubmit ? "Thêm hoặc tìm kiếm" : "Tìm kiếm"}
      />
      {onSubmit && (
        <IconButton
          disabled={!option.name}
          onClick={() => onSubmit(option)}
          sx={{ width: 22, height: 22 }}
        >
          <Add sx={{ width: 16, height: 16 }} />
        </IconButton>
      )}
    </Stack>
  );
};
