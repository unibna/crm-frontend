import Add from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { alpha, IconButton, List, ListItem, Stack, styled } from "@mui/material";
import { AirTableOption } from "_types_/SkyTableType";
import ObjectID from "bson-objectid";
import { MButton } from "components/Buttons";
import { useRef } from "react";
import { randomHSLA } from "utils/helpers";
import ColorPicker from "./ColorPicker";
import EditText from "./EditText";

interface Props {
  options: AirTableOption[];
  setOptions: (newOptions: AirTableOption[]) => void;
}

const ItemOption = ({
  option,
  onChange,
  onRemove,
}: {
  option: AirTableOption;
  onChange: (option: AirTableOption) => void;
  onRemove: (id: AirTableOption["id"]) => void;
}) => {
  const inputRef = useRef<any>();
  return (
    <ListItemStyled>
      <Stack direction="row" spacing={1} width="100%" display="flex" alignItems="center">
        <ColorPicker
          value={option.color}
          onChange={(newValue: string) => {
            onChange({
              ...option,
              color: newValue,
            });
          }}
        />
        <EditText
          ref={inputRef}
          defaultValue={option.name}
          sx={{
            "& .MuiInputBase-root": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              borderRadius: 0,
            },
          }}
          onBlur={() =>
            onChange({
              ...option,
              name: inputRef?.current?.value || option.name,
            })
          }
        />
      </Stack>
      <IconButton
        edge="end"
        aria-label="delete"
        sx={{ width: 20, height: 20 }}
        onClick={() => onRemove(option.id)}
      >
        <ClearIcon sx={{ width: 14, height: 14 }} />
      </IconButton>
    </ListItemStyled>
  );
};

function MenuOption({ options = [], setOptions }: Props) {
  const handleChange = (index: number) => (newOption: AirTableOption) => {
    options[index] = newOption;
    setOptions([...options]);
  };

  const handleAddNewOption = () => {
    const newOption = {
      id: new ObjectID().toHexString(),
      name: "New Option",
      color: randomHSLA(),
    };
    setOptions([...options, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    const newOptions = options.filter((option) => option.id !== id);
    setOptions(newOptions);
  };

  return (
    <>
      <ListStyled>
        {options.map((option, index) => (
          <ItemOption
            key={option.id}
            option={option}
            onChange={handleChange(index)}
            onRemove={handleRemoveOption}
          />
        ))}
      </ListStyled>
      <Stack direction="row" width="100%" justifyContent="flex-end" pr={1} pt={1}>
        <ButtonStyled variant="text" startIcon={<Add />} onClick={handleAddNewOption}>
          {"Add option"}
        </ButtonStyled>
      </Stack>
    </>
  );
}

export default MenuOption;

const ListStyled = styled(List)(({ theme }) => ({
  maxHeight: 250,
  backgroundColor: theme.palette.background.neutral,
  padding: 8,
  overflow: "auto",
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  borderRadius: 4,
  border: `1px dashed ${theme.palette.divider}`,
  marginBottom: 4,
  cursor: "pointer",
  paddingLeft: 8,
}));

const ButtonStyled = styled(MButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  fontSize: 12,
}));
