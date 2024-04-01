import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@mui/material/Checkbox";
import map from "lodash/map";
import { SxProps, Theme } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TagsAutocomplete = ({
  submit,
  error,
  setTags,
  tags,
  submitLabel = "Thêm",
  isOptionEqualToValue,
  sx,
  options,
  onClose,
  openDefault,
}: {
  options: { id: number; name: string }[];
  openDefault?: boolean;
  onClose?: () => void;
  submit?: (tags: { id: number; name: string }[]) => void;
  tags?: { id: number; name: string }[];
  setTags?: (tags: { id: number; name: string }[]) => void;
  error?: string;
  submitLabel?: string;
  isOptionEqualToValue?: (
    option: {
      id: number;
      name: string;
    },
    value: {
      id: number;
      name: string;
    }
  ) => boolean;
  sx?: SxProps<Theme>;
}) => {
  const [open, setOpen] = React.useState(openDefault || false);

  const handleChangeTags = (event: any, value: { id: number; name: string }[]) => {
    setTags && setTags(value);
  };

  const filterTags = ({ id, name }: { id: number; name: string }) => {
    const result = tags?.filter((tag) => tag.id !== id);
    setTags && setTags(result || []);
  };

  return (
    <Stack sx={sx}>
      <div style={{ display: "flex", width: "100%" }}>
        <Autocomplete
          id="asynchronous-demo"
          size="small"
          open={open}
          value={tags}
          fullWidth
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
            onClose && onClose();
          }}
          isOptionEqualToValue={
            isOptionEqualToValue ? isOptionEqualToValue : (option, value) => option.id === value.id
          }
          getOptionLabel={(option) => option.name}
          options={options}
          multiple
          sx={{
            ".MuiOutlinedInput-root": {
              div: { display: "none" },
            },
            ".MuiChip-root": { height: 24, label: { pr: 1, pl: 1 }, m: 0.25 },
          }}
          onChange={handleChangeTags}
          renderInput={(params) => <TextField {...params} label="Thẻ" error={!!error} />}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
        />
        {submit && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "primary.main", textTransform: "none", ml: 1, minWidth: 100 }}
            onClick={() => submit(tags || [])}
          >
            {submitLabel}
          </Button>
        )}
      </div>
      <Typography color="error.main" fontSize={13}>
        {error}
      </Typography>
      <Stack direction="row" spacing={1} style={{ display: "block" }}>
        {map(tags, (tag, index: number) => (
          <Chip
            key={index}
            label={tag.name}
            onDelete={() => filterTags(tag)}
            size="small"
            style={{ marginTop: 8, marginRight: 8, marginLeft: 0 }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default TagsAutocomplete;
