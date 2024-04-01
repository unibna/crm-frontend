import { useState } from "react";

import Add from "@mui/icons-material/Add";
import { IconButton, Popover, Tooltip, useTheme } from "@mui/material";

import { AirTableColumn } from "_types_/SkyTableType";

import NewFieldForm from "./NewFieldForm";

function ButtonAddFileld({
  onAddColumn,
  columns,
}: {
  onAddColumn: (newCol: AirTableColumn) => void;
  columns: AirTableColumn[];
}) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "add-fields-popover" : undefined;

  return (
    <>
      <Tooltip title="Add Field">
        <IconButton
          onClick={handleClick}
          sx={{
            borderRadius: 0.5,
            fontSize: 13,
            height: 36,
            backgroundColor: theme.palette.background.neutral,
          }}
        >
          <Add /> {"New Field"}
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <NewFieldForm columns={columns} onAddColumn={onAddColumn} onClose={handleClose} />
      </Popover>
    </>
  );
}

export default ButtonAddFileld;
