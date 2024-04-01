import { Box, Popover, Stack, SxProps, Theme, styled } from "@mui/material";
import { useState } from "react";
import { randomHSLA } from "utils/helpers";

const ColorPicker = ({
  value,
  buttonStyles,
  onChange,
}: {
  value?: string;
  buttonStyles?: SxProps<Theme>;
  onChange: (newValue: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <ColorButton sx={{ background: value, ...buttonStyles }} onClick={handleClick} />
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
        <Stack direction={"row"} gap={2} flexWrap={"wrap"} p={2} maxWidth="256px">
          {Array.from({ length: 36 }, (v, k) => k + 1).map((value) => (
            <Box
              key={value}
              sx={{
                minWidth: 24,
                minHeight: 24,
                width: 24,
                height: 24,
                borderRadius: "2px",
                background: randomHSLA(value / 36),
                cursor: "pointer",
              }}
              onClick={() => {
                onChange(randomHSLA(value / 36));
                handleClose();
              }}
            />
          ))}
        </Stack>
      </Popover>
    </>
  );
};

export default ColorPicker;

const ColorButton = styled(Box)(({ theme }) => ({
  minWidth: 24,
  minHeight: 24,
  width: 24,
  height: 24,
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: "50%",
  cursor: "pointer",
}));
