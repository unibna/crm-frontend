import React, { useState } from "react";

import Popover from "@mui/material/Popover";
import Add from "@mui/icons-material/Add";

import BaseBox from "./BaseBox";
import FormConfig from "./FormConfig";

interface Props {
  value?: string;
  onSubmit: (newValues: string) => void;
  ButtonComponent?: any;
}

export default function EditBaseConfig(props: Props) {
  const { value, onSubmit, ButtonComponent } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "new-base-box-popover" : undefined;

  return (
    <div>
      {ButtonComponent ? (
        <ButtonComponent onClick={handleClick} />
      ) : (
        <BaseBox id="#" name="Tạo mới" icon={<Add />} onClick={handleClick} />
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ mt: 2 }}
      >
        <FormConfig
          value={{ name: value }}
          onSubmit={(newValues: { name: string }) => onSubmit(newValues.name)}
          onClose={handleClose}
        />
      </Popover>
    </div>
  );
}
