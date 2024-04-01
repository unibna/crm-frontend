// Libraries
import { useState } from "react";
import isArray from "lodash/isArray";
import map from "lodash/map";
import { useTheme, alpha } from "@mui/material/styles";

// Components
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Span } from "components/Labels";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

export type DataRenderType = {
  title?: string;
  value?:
    | {
        label: string;
        onRemove?: any;
      }[]
    | {
        label: string;
        onRemove?: any;
      };
};

const FilterChipItem = ({ value, title }: DataRenderType) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const arrayValue: any = isArray(value) ? value.slice(0, 2) : [value];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `popover-${title}` : undefined;

  const renderChips = (options: DataRenderType["value"]) => (
    <>
      {isArray(options) ? (
        <Box>
          {map(options, (option, optIndex) => {
            return (
              <Chip
                key={optIndex}
                label={option.label}
                variant="outlined"
                size="small"
                sx={{
                  span: { maxWidth: 250 },
                  m: 0.5,
                }}
                onDelete={option?.onRemove || undefined}
              />
            );
          })}
        </Box>
      ) : (
        <Chip
          label={getObjectPropSafely(() => options?.label)}
          variant="outlined"
          size="small"
          sx={{ span: { maxWidth: 250 }, m: 0.5 }}
          onDelete={options?.onRemove || undefined}
        />
      )}
    </>
  );

  return (
    <>
      <Stack
        direction="row"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "8px",
          overflow: "hidden",
          width: "fit-content",
          mr: 1,
          my: 0.5,
        }}
      >
        <Box
          sx={{
            p: 0.25,
            px: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.action.hover,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              whiteSpace: "nowrap",
            }}
          >
            {title}:
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ p: 0.25, px: 0.5 }}>
          {renderChips(arrayValue)}
        </Stack>
        <Box
          sx={{
            p: 0.25,
            px: 0.5,
            pl: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isArray(value) && value.slice(2, value.length).length > 0 && (
            <IconButton onClick={handleClick} aria-describedby={id} sx={{ p: 0 }}>
              <Span
                color="primary"
                sx={{
                  fontSize: 13,
                  cursor: "pointer",
                  transition: theme.transitions.create("all", {
                    duration: ".15s",
                    easing: theme.transitions.easing.easeInOut,
                  }),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                {`+${value.slice(2, value.length).length}`}
              </Span>
            </IconButton>
          )}
        </Box>
      </Stack>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ borderRadius: 3 }}
      >
        <Stack direction="row" spacing={1} sx={{ p: 1, maxWidth: 500 }}>
          {renderChips(value)}
        </Stack>
      </Popover>
    </>
  );
};

export default FilterChipItem;
