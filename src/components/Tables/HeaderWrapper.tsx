import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, alpha, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChipFilterType, KeysFilterType } from "_types_/FilterType";
import { HeaderType } from "_types_/HeaderType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { DIRECTION_SORT_TYPE } from "_types_/SortType";
import { UserType } from "_types_/UserType";
import ArrowVerticalIcon from "assets/illustrations/arrow_vertical_icon";
import WrapFilterChip from "components/Chips/FilterChip/WrapFilterChip";
import DVisibleColumns from "components/DDataGrid/components/DVisibleColumns";
import ExportExcelBE from "components/DDataGrid/components/ExportExcelBE";
import ToggleModeTable from "components/DDataGrid/components/ToggleModeTable";
import { SearchField } from "components/Fields";
import { FILTER_GROUPS } from "constants/index";
import useAuth from "hooks/useAuth";
import compact from "lodash/compact";
import flatMap from "lodash/flatMap";
import map from "lodash/map";
import React, { useMemo } from "react";
import { detectSortLabelUtil, handleCheckKeyParamsActive } from "utils/formatParamsUtil";
import { cloneData } from "utils/helpers";
import { MExportFileButton } from "../Buttons";
import AttributeChips from "../Chips/FilterChip/AttributeChips";
import DateChips from "../Chips/FilterChip/DateChips";
import SelectOptionChip from "../Chips/FilterChip/SelectOptionChip";
import RangeDateV2 from "../Pickers/RangeDateV2";
import WrapFilterPopup from "../Popups/WrapFilterPopup";
import { MultiSelect } from "../Selectors";

type LeftHeaderProps = Partial<
  Pick<HeaderType, "tableTitle" | "onSearch" | "children" | "params">
> & { searchPlacehoder?: string };

/**
 * @param tableTitle
 * @param onSearch
 * @param children
 * @param searchPlacehoder "Nhập sđt, tên khách hàng"
 * @param params
 * @returns
 */
export const LeftHeaderColumn = ({
  tableTitle,
  onSearch,
  children,
  searchPlacehoder = "Nhập sđt, tên khách hàng",
  params,
}: LeftHeaderProps) => {
  return (
    <Grid alignItems="center" item xs={12} md={4} xl={3}>
      <Stack direction="row" alignItems="flex-start" marginTop={0.5}>
        {tableTitle && (
          <Typography fontSize={18} fontWeight="bold">
            {tableTitle}
          </Typography>
        )}
        {onSearch && (
          <SearchField
            onSearch={onSearch}
            defaultValue={params?.search}
            fullWidth
            style={{ marginRight: 8 }}
            sx={{ input: { fontSize: 14 } }}
            placeholder={searchPlacehoder}
            type="search"
            minLength={4}
          />
        )}
        {children}
      </Stack>
    </Grid>
  );
};

type RightHeaderProps = Partial<
  Pick<
    HeaderType,
    | "children"
    | "exportData"
    | "formatExportFunc"
    | "exportFileName"
    | "exportFileToEmailProps"
    | "filterOptions"
    | "params"
    | "filterChipCount"
    | "setFullRow"
    | "isFullRow"
    | "hiddenColumnNames"
    | "setHiddenColumnNames"
    | "columns"
    | "onRefresh"
    | "setParams"
  >
> & {
  user?: Partial<UserType> | null;
} & Omit<SortProps, "sortKey" | "direction" | "label" | "setParams">;

export const RightHeaderColumn = ({ exportFileToEmailProps, ...props }: RightHeaderProps) => {
  const theme = useTheme();
  const { user } = useAuth();

  const filterGrouping = useMemo(() => {
    return (
      props?.filterOptions?.reduce((prev: any, current: any) => {
        if (prev.length === 0) {
          prev = cloneData(FILTER_GROUPS);
        }
        const tempIndex =
          current?.type === "time"
            ? 1
            : prev.findIndex((item: any) => item.labels.includes(current?.key));
        const indx = tempIndex !== -1 ? tempIndex : prev.length - 1;
        prev[indx].values = [...prev[indx].values, current];
        return prev;
      }, []) || []
    );
  }, [props.filterOptions]);

  const isReallyFilterOptionsExist = !!filterGrouping.reduce((prev: any, cur: any) => {
    return compact(cur.values).length ? [...prev, cur] : prev;
  }, []).length;

  const renderGroup = (group: any) => (
    <>
      {group.map((item: any, idx: number) => {
        if (item) {
          if (item.type === "select") {
            return (
              <MultiSelect
                key={idx}
                {...item.multiSelectProps}
                options={item.multiSelectProps?.options || []}
                onChange={item.multiSelectProps?.onChange}
              />
            );
          } else {
            return (
              <RangeDateV2
                key={idx}
                {...item.timeProps}
                handleSubmit={item.timeProps?.handleSubmit}
                sxProps={{ marginLeft: 0, width: "100%" }}
                buttonSubmitStyles={{
                  zIndex: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              />
            );
          }
        } else {
          return null;
        }
      })}
    </>
  );

  const sortValue = detectSortLabelUtil(props?.params?.ordering, props.sortFields);

  return (
    <Grid
      item
      justifyContent="flex-end"
      xs={12}
      md={8}
      xl={9}
      container
      spacing={1}
      alignItems="center"
    >
      {props.onRefresh && (
        <Grid item>
          <IconButton style={{ marginLeft: 8 }} onClick={props.onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Grid>
      )}
      {props.children}
      {props.exportData && (
        <Grid item>
          <MExportFileButton
            exportData={props.exportData}
            exportFileName={props.exportFileName}
            formatExportFunc={props.formatExportFunc}
          />
        </Grid>
      )}

      {user?.is_export_data && exportFileToEmailProps && (
        <Grid item>
          <ExportExcelBE
            endpoint={exportFileToEmailProps?.endpoint}
            services={exportFileToEmailProps?.service}
            keysMap={exportFileToEmailProps?.keysMap || {}}
            params={props.params}
          />
        </Grid>
      )}
      {props.filterOptions && isReallyFilterOptionsExist && (
        <Grid item>
          <WrapFilterPopup filterCount={props.filterChipCount}>
            {filterGrouping.map((group: any, index: number) =>
              group.values.length ? (
                <FilterGroupItem key={index} group={group} renderValues={renderGroup} />
              ) : null
            )}
          </WrapFilterPopup>
        </Grid>
      )}
      {props.setHiddenColumnNames && (
        <Grid item>
          <DVisibleColumns
            hiddenColumns={props.hiddenColumnNames}
            onToggleColumns={props.setHiddenColumnNames}
            columns={props.columns}
          />
        </Grid>
      )}
      {props.sortFields && (
        <Grid item>
          <SortButton
            {...sortValue}
            setParams={props.setParams}
            params={props.params}
            sortFields={props.sortFields}
          />
        </Grid>
      )}
      {props.setFullRow && (
        <Grid item>
          <ToggleModeTable
            onToggleModeTable={() => props.setFullRow && props.setFullRow((prev) => !prev)}
            isFullTable={props.isFullRow}
          />
        </Grid>
      )}
    </Grid>
  );
};

export interface FilterChipType {
  type: "date" | "attribute" | "select";
  options?: SelectOptionType[];
  keysFilter?: KeysFilterType;
  attributeOptions?: {
    id: string | number;
    name?: string | undefined;
    value?: string | undefined;
    is_shown?: boolean | undefined;
  }[];
  dateFilterKeys?: ChipFilterType[];
  isSimpleSelector?: boolean;
}

export interface FilterChipProps {
  params?: any;
  onDelete?: (type: string, value: string | number) => void;
  onClearAll?: (keysFilter: string[]) => void;
  setFilterCount?: (value: number) => void;
  filterOptions?: FilterChipType[];
}

const FilterChips = ({
  params,
  onDelete,
  onClearAll,
  setFilterCount,
  filterOptions,
}: FilterChipProps) => {
  let filterCount = 0;

  const handleDelete = (type: string, value: any) => {
    onDelete && onDelete(type, value);
  };

  const checkFilterCount = (value: number) => {
    filterCount += value;
    setFilterCount && setFilterCount(filterCount);
  };

  const isActiveClearAllButton = filterOptions?.map((item) => {
    if (item.dateFilterKeys) {
      return item.dateFilterKeys.reduce((arrKey, currKey) => {
        return [...arrKey, ...currKey.keyFilters];
      }, []);
    } else {
      return item.keysFilter;
    }
  });

  const paramsActiveKeys = handleCheckKeyParamsActive({
    keys: compact(flatMap(isActiveClearAllButton)),
    params,
  });

  return !paramsActiveKeys.disabled ? (
    <WrapFilterChip
      isActiveClearAllButton={paramsActiveKeys}
      onClearAll={(keysFilter: string[]) => {
        onClearAll && onClearAll(keysFilter);
      }}
    >
      <>
        {filterOptions?.map((item, idx) => {
          if (item) {
            if (item.type === "date") {
              return (
                <DateChips
                  key={idx}
                  handleDelete={handleDelete}
                  keysFilter={item.dateFilterKeys || []}
                  params={params}
                  setFilterCount={checkFilterCount}
                />
              );
            } else if (item.type === "attribute") {
              return (
                <AttributeChips
                  key={idx}
                  handleDelete={handleDelete}
                  attributes={item.attributeOptions}
                  keyFilter={item.keysFilter}
                  params={params}
                  setFilterCount={checkFilterCount}
                />
              );
            } else if (item.type === "select") {
              return (
                <SelectOptionChip
                  key={idx}
                  handleDelete={handleDelete}
                  options={item.options || []}
                  keyFilter={item.keysFilter}
                  params={params}
                  setFilterCount={checkFilterCount}
                  isSimple={item.isSimpleSelector}
                />
              );
            } else {
              return null;
            }
          } else {
            return null;
          }
        })}
      </>
    </WrapFilterChip>
  ) : null;
};

export interface GridWrapHeaderProps extends LeftHeaderProps, RightHeaderProps {
  filterChipOptions?: FilterChipType[];
  onClearFilter?: (keyFilters: string[]) => void;
  setFilterCount?: (value: number) => void;
  onDeleteFilter?: (type: string, value: string | number) => void;
  leftChildren?: React.ReactNode | JSX.Element;
  rightChildren?: React.ReactNode | JSX.Element;
}

const GridWrapHeaderPage = ({
  children,
  filterChipOptions,
  onClearFilter,
  setFilterCount,
  onDeleteFilter,
  leftChildren,
  rightChildren,
  ...props
}: GridWrapHeaderProps) => {
  return (
    <Box py={2} px={2} component={Paper}>
      {/* basic of header */}
      <Grid container pt={1} spacing={1.5} alignItems="flex-start">
        <LeftHeaderColumn {...props}>{leftChildren}</LeftHeaderColumn>
        <RightHeaderColumn {...props}>{rightChildren}</RightHeaderColumn>
      </Grid>

      {/* extension header */}
      <Grid container pt={1} spacing={1.5} alignItems="center">
        {children}
      </Grid>

      {/* table chip filter */}
      <Grid container alignItems="center">
        <FilterChips
          filterOptions={filterChipOptions}
          onClearAll={onClearFilter}
          onDelete={onDeleteFilter}
          params={props.params}
          setFilterCount={setFilterCount}
        />
      </Grid>
    </Box>
  );
};

interface FilterGroupItemType {
  name: string;
  label: string;
  values: any[];
}

function FilterGroupItem({
  group,
  renderValues,
}: {
  group: FilterGroupItemType;
  renderValues: any;
}) {
  const theme = useTheme();

  return (
    <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
      <Stack
        direction="column"
        spacing={0.5}
        key={group.label}
        sx={{
          border: `dashed 1px ${theme.palette.divider}`,
          borderRadius: "4px",
          padding: 0,
          overflow: "visible",
          "& .MuiButton-root": {
            zIndex: 1,
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
          p={1}
        >
          {group.name}
        </Typography>
        <Stack direction="column" spacing={1} p={1}>
          {renderValues(group.values)}
        </Stack>
      </Stack>
    </Grid>
  );
}

type SortProps = {
  setParams?: (payload: any) => void;
  params?: any;
  label?: string;
  direction: DIRECTION_SORT_TYPE;
  sortKey: string;
  sortFields?: { [key: string]: string };
};

const SortButton = ({
  setParams,
  params,
  label = "Chưa có",
  sortFields = {},
  direction,
  sortKey,
}: SortProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "sort-list-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleSort = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setParams?.({
      ...params,
      ordering: `${direction === DIRECTION_SORT_TYPE.DESC ? "" : "-"}${sortKey}`,
    });
  };

  const handleToggleSorting = (field: string) => {
    const newDirection =
      direction === DIRECTION_SORT_TYPE.ASC ? DIRECTION_SORT_TYPE.DESC : DIRECTION_SORT_TYPE.ASC;

    setParams?.({
      ...params,
      ordering: `${newDirection === DIRECTION_SORT_TYPE.DESC ? "-" : ""}${field}`,
    });
  };

  return (
    <>
      <Button variant="contained" style={{ paddingLeft: 6, paddingRight: 6 }} onClick={handleClick}>
        {direction === DIRECTION_SORT_TYPE.DESC ? (
          <ArrowDownwardIcon style={{ padding: 2, marginRight: 8 }} onClick={handleToggleSort} />
        ) : (
          <ArrowUpwardIcon style={{ padding: 2, marginRight: 8 }} onClick={handleToggleSort} />
        )}
        {label}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{ maxHeight: "60%", marginTop: 4 }}
      >
        {map(Object.keys(sortFields), (field) => (
          <Stack
            direction="row"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            key={field}
            sx={{ py: 0.25, px: 1 }}
          >
            <Stack direction="column" display="flex" justifyContent="center" alignItems="center">
              <ArrowVerticalIcon
                direction={sortKey === field ? direction : undefined}
                handleClickUp={() => setParams?.({ ...params, ordering: `${field}` })}
                handleClickDown={() => setParams?.({ ...params, ordering: `-${field}` })}
              />
            </Stack>
            <Typography
              sx={{
                fontSize: "0.8125rem",
                "&:hover": { color: "primary.main", cursor: "pointer" },
              }}
              onClick={() => handleToggleSorting(field)}
            >
              {sortFields[field]}
            </Typography>
          </Stack>
        ))}
      </Popover>
    </>
  );
};

export const HeaderTableWrapper = {
  LeftHeaderColumn,
  RightHeaderColumn,
  GridWrapHeaderPage,
};