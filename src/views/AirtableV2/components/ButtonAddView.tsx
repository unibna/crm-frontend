import { useState } from "react";

import Add from "@mui/icons-material/Add";
import { IconButton, Popover, Tooltip, useTheme } from "@mui/material";

import { AirTableBase, AirTableView } from "_types_/SkyTableType";
import NewViewForm from "./NewViewForm";

function ButtonAddView({
  views = [],
  table,
  onAddView,
}: {
  views: AirTableView[];
  table?: AirTableBase;
  onAddView: (newView: AirTableView) => void;
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
      <Tooltip title="Add View">
        <IconButton
          onClick={handleClick}
          sx={{
            borderRadius: 0.5,
            fontSize: 13,
            height: 36,
            backgroundColor: theme.palette.background.neutral,
          }}
        >
          <Add /> {"New View"}
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
        <NewViewForm table={table} views={views} onAddView={onAddView} onClose={handleClose} />
      </Popover>
    </>
  );
}

export default ButtonAddView;
