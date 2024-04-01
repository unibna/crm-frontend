import { SxProps, TextField, Theme } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import map from "lodash/map";
import { useEffect, useState } from "react";

const REGEX_NUMBER = /^[+-]?\d*(?:[.,]\d*)?$/;

const formatPaginationLabel = (
  page: number,
  limit: number,
  totalData: number,
  pageCount: number
) => {
  const isEmpty = totalData ? 1 : 0;
  const from = (page - 1) * limit + isEmpty;
  const target = (page - 1) * limit + (totalData ? limit : 0);
  const to = page === pageCount ? totalData : target;
  return `${from} - ${to} / ${totalData}`;
};

function MPagination({
  pageCount, //total page
  page, //curren page
  onChange,
  limit,
  onChangeRowPerPage,
  totalData,
  pageSizes,
}: {
  pageCount: number;
  page: number;
  onChange?: (value: number) => void;
  onChangeRowPerPage?: (value: number) => void;
  limit: number;
  totalData: number;
  pageSizes: number[];
}) {
  const [currentPage, setCurrentPage] = useState<any>(page);
  const handleChange = (event: SelectChangeEvent) => {
    onChangeRowPerPage && onChangeRowPerPage(parseInt(event.target.value));
  };

  const handleChangePage = () => {
    +currentPage && onChange && onChange(+currentPage);
  };

  useEffect(() => {
    setCurrentPage(+page);
  }, [page]);

  return (
    <>
      <Divider />

      <Grid
        container
        py={1}
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          "& button": {
            fontSize: 13,
            width: 32,
            margin: 0,
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <span style={lineInPageStyle}>Số dòng/ trang</span>
          <FormControl>
            <Select
              style={pageOptionsStyle}
              size="small"
              labelId="pagination-row-in-page-label"
              id="pagination-row-in-page"
              value={limit?.toString()}
              onChange={handleChange}
            >
              {map(pageSizes, (size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <span style={pageNumberStyle}>
          {formatPaginationLabel(page, limit, totalData, pageCount)}
        </span>
        <Pagination
          color="primary"
          count={pageCount}
          page={page}
          onChange={(event, value) => onChange && onChange(value)}
          siblingCount={0}
          boundaryCount={1}
          sx={{ "& .MuiPaginationItem-root": { mx: 1 } }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <span style={lineInPageStyle}>Đến trang</span>
          <FormControl disabled={totalData < limit}>
            <TextField
              disabled={totalData < limit}
              sx={currentPageStyle}
              size="small"
              value={currentPage}
              onChange={(e) => {
                const newPage = e.target.value;
                REGEX_NUMBER.test(newPage) &&
                  setCurrentPage(+newPage > pageCount ? pageCount : newPage);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleChangePage();
                }
              }}
            />
          </FormControl>
        </Stack>
      </Grid>
    </>
  );
}
export default MPagination;

const lineInPageStyle: React.CSSProperties = {
  fontSize: 14,
};

const pageOptionsStyle: React.CSSProperties = {
  fontSize: 13,
};

const pageNumberStyle: React.CSSProperties = {
  fontSize: 13,
  marginLeft: 8,
  marginRight: 8,
};

const currentPageStyle: React.CSSProperties & SxProps<Theme> = {
  ".MuiOutlinedInput-root": {
    fontSize: 13,
    padding: "0 4px",
  },
  ".MuiOutlinedInput-input": {
    padding: "7px",
  },
  width: 90,
};
