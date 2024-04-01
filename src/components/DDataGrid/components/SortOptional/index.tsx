// Libraries
import { useState, useRef } from "react";
import map from "lodash/map";

// Components
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MenuPopover from "components/Popovers/MenuPopover";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { SelectOptionType } from "_types_/SelectOptionType";

// ------------------------------------

const SortOptional = ({
  column,
  isSort = true,
  handleSort,
  getValueSort = () => [],
}: {
  column: { name: string; title: string };
  isSort?: boolean;
  handleSort: (valueSort: string | number) => void;
  getValueSort?: (columnName: string) => SelectOptionType[];
}) => {
  const anchorRef = useRef(null);
  const [isShowPopover, setShowPopover] = useState(false);

  return (
    <>
      <Grid
        ref={anchorRef}
        direction="row"
        sx={{
          whiteSpace: "normal",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onClick={() => setShowPopover(true)}
      >
        <Typography variant="body2" fontWeight={600} color="inherit">
          {column.title}
        </Typography>
      </Grid>
      <MenuPopover
        open={isShowPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={anchorRef.current}
        sx={{
          mt: 1,
          p: 1,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
            "& svg": { mr: 2, width: 20, height: 20 },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        arrow="top-center"
      >
        {map(getValueSort(column.name), (item) => (
          <MenuItem onClick={() => handleSort(item.value)}>
            {isSort ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
            {item.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
};

export default SortOptional;
