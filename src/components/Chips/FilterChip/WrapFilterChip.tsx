import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { MExpandMoreIconButton } from "components/Buttons";
import vi from "locales/vi.json";
import { useState } from "react";

const WrapFilterChip = ({
  children,
  isActiveClearAllButton,
  onClearAll,
  style = {},
}: {
  children?: JSX.Element;
  isActiveClearAllButton: {
    disabled: boolean;
    keysFilter: string[];
  };
  style?: React.CSSProperties;
  onClearAll?: (keysFilter: string[]) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return isActiveClearAllButton.keysFilter.length > 0 ? (
    <>
      <Stack direction="row" style={{ marginRight: 4, ...containerStyle, ...style }}>
        {onClearAll && (
          <Button
            variant="outlined"
            size="small"
            style={buttonStyle}
            onClick={() => onClearAll(isActiveClearAllButton.keysFilter)}
            disabled={isActiveClearAllButton.disabled}
          >
            {vi.clear_filter}
          </Button>
        )}
        <Tooltip title={expanded ? "Ẩn bộ lọc" : "Xem bộ lọc"}>
          <MExpandMoreIconButton
            sx={{
              height: 30,
              width: 30,
              border: "1px solid",
              mt: 1,
              borderColor: "primary.main",
            }}
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
          />
        </Tooltip>
      </Stack>
      <Stack direction="row" style={{ marginRight: 4, ...containerStyle, ...style }}>
        <Collapse in={expanded} timeout="auto" collapsedSize={48} style={containerStyle}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              py: 0.5,
            }}
          >
            {children}
          </Box>
        </Collapse>
      </Stack>
    </>
  ) : null;
};

export default WrapFilterChip;

const containerStyle = { width: "100%" };
const buttonStyle = { marginTop: 8, marginRight: 8 };
