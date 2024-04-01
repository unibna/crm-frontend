import * as React from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

interface Props {
  buttonTitle: string;
  buttonIcon?: React.ReactNode;
  buttonProps?: any;
  isHiddenEndIcon?: boolean;
  badgeContent?: React.ReactNode;
  children?: React.ReactNode;
  controlClose?: boolean;
  setControlClose?: (control: boolean) => void;
}

export default function MDropdown(props: Props) {
  const {
    buttonTitle,
    badgeContent,
    buttonIcon,
    isHiddenEndIcon,
    buttonProps,
    children,
    controlClose = false,
    setControlClose,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setControlClose && setControlClose(false);
  };

  React.useEffect(() => {
    controlClose && handleClose();
  }, [controlClose]);

  return (
    <Box>
      <Badge badgeContent={badgeContent} color="error">
        {
          <Button
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            variant="outlined"
            startIcon={buttonIcon}
            endIcon={
              !isHiddenEndIcon && (
                <KeyboardArrowDownIcon
                  sx={{
                    transform: "rotate(0deg)",
                    transition: "transform 0.15s linear",
                    ...(open && {
                      transform: "rotate(180deg)",
                    }),
                  }}
                />
              )
            }
            {...buttonProps}
          >
            {buttonTitle}
          </Button>
        }
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {children}
      </Popover>
    </Box>
  );
}
