import styled from "@emotion/styled";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Theme } from "@mui/material";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import * as React from "react";

interface Props {
  title?: string;
  options: {
    label: string;
    value: string | number;
  }[];
  values?: (string | number)[];
  setValues?: any;
  buttonIcon?: React.ReactNode;
  isShowHidden?: boolean;
  defaultValues?: (string | number)[];
  disabledValues?: (string | number)[];
}

export function DropdownMultiSelect(props: Props) {
  const {
    title,
    options,
    values = [],
    setValues,
    buttonIcon,
    isShowHidden = false,
    defaultValues = [],
    disabledValues = [],
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckAll = () => {
    const activeOptions = options.filter((option) => !disabledValues?.includes(option.value));
    const trueValues = activeOptions.filter((option) => values.includes(option.value));
    const trueDisabledValues = disabledValues.filter((value) => values.includes(value));
    if (trueValues.length === 0) {
      setValues([...activeOptions.map((option) => option.value), ...trueDisabledValues]);
    } else {
      setValues(trueDisabledValues);
    }
  };

  return (
    <Box>
      <Badge
        badgeContent={
          !isShowHidden
            ? values.length
            : options.filter((option) => !values.includes(option.value)).length
        }
        color="error"
      >
        <Button
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="outlined"
          startIcon={buttonIcon}
          endIcon={
            <KeyboardArrowDownIcon
              sx={{
                transform: "rotate(0deg)",
                transition: "transform 0.15s linear",
                ...(open && {
                  transform: "rotate(180deg)",
                }),
              }}
            />
          }
          sx={{}}
        >
          {title}
        </Button>
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
        <Box sx={{ p: 2 }}>
          <Grid display="flex" justifyContent="space-between" alignItems="center">
            {title && <Title>{title}</Title>}
            {defaultValues && (
              <BtnText
                variant="text"
                onClick={() => {
                  setValues(defaultValues);
                }}
              >
                Mặc định
              </BtnText>
            )}
          </Grid>
          <Grid sx={{ mt: 1 }}>
            <BtnText variant="text" onClick={handleCheckAll}>
              Chọn / Bỏ chọn tất cả
            </BtnText>
          </Grid>

          <FormGroup sx={{ minWidth: 220 }}>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={!!values?.includes(option.value)}
                    disabled={!!disabledValues?.includes(option.value)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked && values.includes(option.value)) return;
                      const newValues = isChecked
                        ? [...values, option.value]
                        : values.filter((value) => value !== option.value);

                      setValues(newValues);
                    }}
                    name={option.label}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>
    </Box>
  );
}

const Title = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: 600,
}));

const BtnText: any = styled(Button)(({ theme }: { theme: Theme }) => ({
  fontSize: "0.8125rem",
  color: theme.palette.primary.main,
  padding: 0,
  mt: 2,
  mb: 0.3,
  "&:hover": {
    textDecoration: "underline",
    background: "none",
  },
}));
