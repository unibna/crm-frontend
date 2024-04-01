// Libraries
import { useState, useRef, useMemo } from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import some from "lodash/some";

// Components
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MenuPopover from "components/Popovers/MenuPopover";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Tooltip from "@mui/material/Tooltip";

// ------------------------------------

const SortOptional = ({
  column,
  isSort = true,
  handleSortColumn,
  infoColumnSort = {},
}: {
  column: { name: string; title: string; description?: string };
  isSort?: boolean;
  infoColumnSort: Partial<any>;
  handleSortColumn: (valueSort: string | number) => void;
}) => {
  const anchorRef = useRef(null);
  const [isShowPopover, setShowPopover] = useState(false);

  const dataRender = useMemo(
    () => filter(infoColumnSort[column.name], (item) => item.title),
    [column, infoColumnSort]
  );

  const isShowMenuSort = useMemo(() => some(dataRender, (item) => item.title), [dataRender]);

  return (
    <>
      <Tooltip title={column.description || ""} placement="top">
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
          onClick={() => (isShowMenuSort ? setShowPopover(true) : null)}
        >
          <Typography variant="body2" fontWeight={600} color="inherit">
            {column.title}
          </Typography>
        </Grid>
      </Tooltip>
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
        {map(dataRender, (item, index) => (
          <MenuItem key={index} onClick={() => handleSortColumn(item.name)}>
            {isSort ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
            {item.title}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
};

export default SortOptional;
