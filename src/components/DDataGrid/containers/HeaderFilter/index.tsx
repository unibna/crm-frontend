// Libraries
import { Icon } from "@iconify/react";
import { SxProps, Theme, alpha, useTheme } from "@mui/material";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import filter from "lodash/filter";
import find from "lodash/find";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { memo, useMemo } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Components
import refreshFill from "@iconify/icons-eva/refresh-fill";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { GroupButtonProps, GroupButtons } from "components/Buttons";
import ChangeShowColumn from "components/DDataGrid/components/ChangeShowColumn";
import ExportExcelBE from "components/DDataGrid/components/ExportExcelBE";
import ExportFile from "components/DDataGrid/components/ExportFile";
import SearchFilter from "components/DDataGrid/components/SearchFilter";
import SliderFilter from "components/DDataGrid/components/SliderFilter";
import ToggleModeTable from "components/DDataGrid/components/ToggleModeTable";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import WrapFilterPopup from "components/Popups/WrapFilterPopup";
import { MultiSelect } from "components/Selectors";

// @Types
import { MColumnType } from "_types_/ColumnType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { ColorSchema } from "_types_/ThemeColorType";

// Utils
import Typography from "@mui/material/Typography";
import { arrAttachUnitVndDefault, arrStatusDefault } from "components/DDataGrid/constants";
import { FILTER_GROUPS, STATUS_SYNC, TYPE_FORM_FIELD } from "constants/index";
import { arrDateTimeDefault, yyyy_MM_dd } from "constants/time";
import { fDate, fDateTime } from "utils/dateUtil";
import { fNumber, fPercent } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { cloneData } from "utils/helpers";
import MDatePicker from "components/Pickers/MDatePicker";

// ----------------------------------------------------------------------
interface DataHeader {
  type?: TYPE_FORM_FIELD;
  style?: React.CSSProperties;
  headerContainerStyles?: React.CSSProperties;
  status?: string;
  title?: string;
  options?: any[];
  label?: string;
  defaultValue?: string | string[] | number;
  multiple?: boolean;

  // Filter Date
  keyDateValue?: string;
  keyDateFrom?: string;
  keyDateTo?: string;
}

interface Props {
  delay?: number;
  height?: number;
  dataExport?: any;
  searchInput?: any;
  columnsCount?: number;
  params?: any;
  isShowFilterDate?: boolean;
  isViewTable?: boolean;
  isShowPopupFilter?: boolean;
  isShowFilter?: boolean;
  isShowExpand?: boolean;
  columnSelected?: string[];
  dataHeaderFilter?: DataHeader;
  dataRenderHeader?: DataHeader[];
  hrefTokenFacebook?: string;
  contentArrButtonOptional?:
    | {
        color?: ColorSchema;
        content: JSX.Element;
        handleClick: () => void;
      }[]
    | [];
  contentArrButtonGroup?: GroupButtonProps[];
  contentFirstOption?: any;
  titleHeader?: string;
  styleTitleHeader?: any;
  dataRenderHeaderMore?: any;
  style?: any;
  headerContainerStyles?: any;
  originColumns?: any;
  onChangeColumn?: (column: MColumnType) => void;
  handleFilter?: any;
  handleRefresh?: any;
  arrAttachUnitVnd?: string[];
  arrAttachUnitPercent?: string[];
  columnShowExport?: {
    name: string;
    title: string;
  }[];
  dataExportExcel?: {
    services: any;
    endpoint: string;
    params: Partial<any>;
  };
  arrDate?: string[];
  arrDateTime?: string[];
  arrHandleList?: string[];
  arrNoneRenderSliderFilter?: string[];
  contentGetValue?: {
    arrContentGetValue: string[];
    getValue: (key: string, value: any) => void;
  };
  arrStatus?: string[];
  toggleColumnsDisable?: string[];
  isFullTable?: boolean;
  onToggleModeTable?: () => void;
  handleChangeView?: (isViewTable: boolean) => void;
  paramsDefault?: {
    [key: string]: any;
  };
  contentOptional?: JSX.Element;
  contentOptionalLeft?: JSX.Element;
  sxContentOptional?: SxProps<Theme>;
  sxContentButtonCustom?: SxProps<Theme>;
}

const Header = (props: Props) => {
  const theme = useTheme();
  const {
    height,
    delay,
    columnsCount,
    originColumns,
    params = {},
    searchInput = [],
    contentArrButtonGroup = [],
    contentArrButtonOptional = [],
    dataRenderHeader = [],
    arrAttachUnitPercent = [],
    arrHandleList = [],
    arrAttachUnitVnd = arrAttachUnitVndDefault,
    arrDate = [],
    arrDateTime = arrDateTimeDefault,
    arrStatus = arrStatusDefault,
    columnShowExport = [],
    arrNoneRenderSliderFilter = ["dateValue"],
    onChangeColumn,
    handleRefresh,
    isShowFilterDate,
    handleFilter,
    style = {},
    isViewTable = true,
    headerContainerStyles = {},
    toggleColumnsDisable = [],
    paramsDefault = {
      dateValue: 0,
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    contentGetValue = {
      arrContentGetValue: [],
      getValue: (key, value) => {},
    },
    dataExportExcel = {
      services: orderApi,
      endpoint: "",
      params: {},
    },
    isFullTable,
    isShowPopupFilter = true,
    onToggleModeTable,
    dataExport = [],
    contentOptional,
    contentOptionalLeft,
    sxContentOptional = {},
    sxContentButtonCustom = {},
    contentFirstOption,
    handleChangeView,
  } = props;

  const dataHeader = useMemo(() => {
    return map(dataRenderHeader, (item: any) => {
      return {
        ...item,
        type: item.type || TYPE_FORM_FIELD.MULTIPLE_SELECT,
        defaultValue: params[item.label] || item.defaultValue || "all",
      };
    });
  }, [params, dataRenderHeader]);

  const dataExportFile = useMemo(() => {
    const convertDataExport = (row: any) => {
      const convert = (key: string, value: string | number) => {
        switch (true) {
          case arrAttachUnitVnd.includes(key): {
            return `${fNumber(value)}`;
          }
          case arrAttachUnitPercent.includes(key): {
            return `${fPercent(value)}`;
          }
          case arrDate.includes(key): {
            return value && fDate(value);
          }
          case arrDateTime.includes(key): {
            return value && fDateTime(value);
          }
          case arrStatus.includes(key): {
            return value && STATUS_SYNC[value];
          }
          case arrStatus.includes(key): {
            return value && STATUS_SYNC[value];
          }
          case arrHandleList.includes(key): {
            return value && value.toString();
          }
          case contentGetValue.arrContentGetValue.includes(key): {
            return contentGetValue?.getValue(key, value);
          }
          default: {
            return value;
          }
        }
      };

      return columnShowExport.reduce((prevObj, current) => {
        return {
          ...prevObj,
          [current.title]: convert(
            current.name,
            isPlainObject(row[current.name])
              ? getObjectPropSafely(() => row[current.name].value)
              : row[current.name]
          ),
        };
      }, {});
    };

    return dataExport.length
      ? map(dataExport, (item: any) => {
          return convertDataExport(item);
        })
      : [];
  }, [
    dataExport,
    arrAttachUnitVnd,
    arrAttachUnitPercent,
    arrDate,
    arrDateTime,
    arrStatus,
    columnShowExport,
  ]);

  const filterGrouping = useMemo(() => {
    return dataHeader.reduce((prev, current) => {
      if (prev.length === 0) {
        prev = cloneData(FILTER_GROUPS);
      }
      const tempIndex =
        current.type === "DATE"
          ? 1
          : prev.findIndex((item: any) => item.labels.includes(current.label));
      const indx = tempIndex !== -1 ? tempIndex : prev.length - 1;
      prev[indx].values = [...prev[indx].values, current];
      return prev;
    }, []);
  }, [dataHeader]);

  const renderDataHeaderShare = (filterGroup: any) => {
    try {
      return map(filterGroup, (item, index) => {
        const {
          style,
          title,
          options,
          label,
          defaultValue,
          multiple = false,
          type = TYPE_FORM_FIELD.MULTIPLE_SELECT,
          keyDateFrom = "",
          keyDateTo = "",
          keyDateValue = "",
          renderOptionTitleFunc,
        } = item;

        switch (type) {
          case TYPE_FORM_FIELD.DATE: {
            return (
              <RangeDateV2
                key={index}
                sxProps={{
                  ...datePickerStyle,
                  ...style,
                  ...(isShowPopupFilter && { width: "100%", marginTop: 0 }),
                }}
                roadster
                handleSubmit={(
                  created_from: string | undefined,
                  created_to: string | undefined,
                  dateValue: string | undefined | number
                ) =>
                  handleFilter({
                    [keyDateFrom]: created_from,
                    [keyDateTo || ""]: created_to,
                    [keyDateValue || ""]: dateValue,
                  })
                }
                label={title}
                defaultDateValue={params?.[keyDateValue]}
                created_from={params?.[keyDateFrom]}
                created_to={params?.[keyDateTo]}
              />
            );
          }
          default: {
            return (
              <MultiSelect
                key={index}
                style={{
                  ...selectorStyle,
                  ...style,
                  ...(isShowPopupFilter && { width: "100%" }),
                  ...(!isShowPopupFilter && { marginTop: 1 }),
                }}
                title={title}
                selectorId={title + index}
                fullWidth
                options={options}
                onChange={(value: any) => handleFilter({ [label]: value })}
                label={label}
                defaultValue={defaultValue}
                simpleSelect={multiple}
                renderOptionTitleFunc={renderOptionTitleFunc}
              />
            );
          }
        }
      });
    } catch (error) {
      return;
    }
  };

  const onRemoveFilter = (keyFilter: string, valueFilter: string | number) => {
    let newValue: any = "";
    if (isArray(params[keyFilter])) {
      newValue = filter(params[keyFilter], (item) => item !== valueFilter);
    }

    handleFilter({
      [keyFilter]: isArray(newValue) && !newValue.length ? "all" : newValue,
    });
  };

  const convertValue = (keyFilter: string, valueFilter: string | string[] | any, params?: any) => {
    let value = null;

    const objValue = find(
      dataHeader,
      (item: DataHeader) => item.label === keyFilter || item.keyDateFrom === keyFilter
    );

    const funcDisableRemove = (func: any) => {
      return Object.keys(paramsDefault).includes(keyFilter) ? null : func;
    };

    if (objValue) {
      const { type = "", options = [], title = "" } = objValue;

      switch (type) {
        case TYPE_FORM_FIELD.MULTIPLE_SELECT: {
          if (isArray(valueFilter)) {
            value = reduce(
              options,
              (prevArr: any, current: any) => {
                return valueFilter.includes(current.value)
                  ? [
                      ...prevArr,
                      {
                        label: current.label,
                        onRemove: funcDisableRemove(() => onRemoveFilter(keyFilter, current.value)),
                      },
                    ]
                  : prevArr;
              },
              []
            );
          } else {
            value = {
              label:
                options.find((item: SelectOptionType) => item.value === valueFilter)?.label || "",
              onRemove: funcDisableRemove(() => onRemoveFilter(keyFilter, valueFilter)),
            };
          }
          break;
        }
        case TYPE_FORM_FIELD.DATE: {
          value = [
            {
              label: fDate(params[objValue.keyDateFrom]),
            },
            {
              label: fDate(params[objValue.keyDateTo]),
            },
          ];
        }
      }
      return {
        title,
        value,
      };
    }

    return {};
  };

  const handleClearAllFilter = () => {
    let paramsSearch = {};
    const arrKeyParamsCurrent = Object.keys(paramsDefault);
    const arrKeyParams = Object.keys(params);

    const newParams = reduce(
      arrKeyParams,
      (prevObj: any, current: string) => {
        return arrKeyParamsCurrent.includes(current)
          ? {
              ...prevObj,
              [current]: paramsDefault[current],
            }
          : {
              ...prevObj,
              [current]: isArray(params[current]) ? "all" : "",
            };
      },
      {}
    );

    if (searchInput.length) {
      paramsSearch = reduce(
        searchInput,
        (prevObj: any, current: any) => {
          return {
            ...prevObj,
            [current?.keySearch]: params[current?.keySearch],
          };
        },
        {}
      );
    }

    handleFilter({ ...newParams, ...paramsSearch });
  };

  const arrKeySearchInput = useMemo(() => {
    return map(searchInput, (item) => item.keySearch);
  }, []);

  const dataRenderSliderFilter = useMemo(() => {
    const tempData = Object.keys(params).reduce((prevArr, current) => {
      return [...arrNoneRenderSliderFilter, ...arrKeySearchInput].includes(current) ||
        params[current] === "all" ||
        (isArray(params[current]) && !params[current].length) ||
        (isString(params[current]) && !params[current])
        ? prevArr
        : [...prevArr, convertValue(current, params[current], params)];
    }, []);
    return tempData.filter((item) => !isEmpty(item));
  }, [params, dataHeader]);

  const isDisabledClearAll = useMemo(() => {
    const newParams = Object.keys(params).reduce((prevObj: any, current: string) => {
      return arrKeySearchInput.includes(current) ||
        params[current] === "all" ||
        (isArray(params[current]) && !params[current].length) ||
        (isString(params[current]) && !params[current])
        ? prevObj
        : {
            ...prevObj,
            [current]: params[current],
          };
    }, {});

    return isEqual(newParams, paramsDefault ? paramsDefault : params);
  }, [params]);

  const filterCount = useMemo(() => {
    const newParams = reduce(
      Object.keys(params),
      (prevObj: any, current: string) => {
        return [...arrNoneRenderSliderFilter, ...arrKeySearchInput].includes(current) ||
          params[current] === "all" ||
          (isArray(params[current]) && !params[current].length) ||
          (isString(params[current]) && !params[current])
          ? prevObj
          : {
              ...prevObj,
              [current]: params[current],
            };
      },
      {}
    );

    return Object.values(newParams).length;
  }, [params]);

  return (
    <Grid container alignItems="center" sx={{ pt: 3, pb: 2, ...style, ...headerContainerStyles }}>
      <Grid item xs={12} container direction="row" alignItems="center" spacing={1}>
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          xs={12}
          sm={12}
          md={4}
          sx={{ columnGap: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {searchInput.length
              ? map(searchInput, (item, itemIndex) => {
                  return (
                    <SearchFilter
                      key={itemIndex}
                      label={item.label}
                      delay={delay}
                      defaultValue={params[item?.keySearch]}
                      renderIcon={<SearchIcon />}
                      style={searchInput.style}
                      onSearch={(value: string) => handleFilter({ [item?.keySearch]: value })}
                    />
                  );
                })
              : null}
            {contentOptionalLeft ? contentOptionalLeft : null}
          </Stack>
        </Grid>
        <Grid
          item
          container
          direction="row"
          xs={12}
          sm={12}
          md={8}
          justifyContent="flex-end"
          alignItems="center"
          sx={{ columnGap: 0.9 }}
        >
          {isShowFilterDate && (
            <RangeDateV2
              handleSubmit={(date_from, date_to, dateValue) =>
                handleFilter({ ...params, date_from, date_to, dateValue })
              }
              defaultDateValue={params?.dateValue}
              created_from={params?.date_from}
              created_to={params?.date_to}
            />
          )}
          {handleRefresh ? (
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <Icon icon={refreshFill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          ) : null}
          {contentFirstOption}
          {!!contentArrButtonGroup.length && (
            <>
              {map(contentArrButtonGroup, (item, index) => {
                return <GroupButtons key={index} {...item} />;
              })}
            </>
          )}
          {!!contentArrButtonOptional.length && (
            <>
              {map(contentArrButtonOptional, (item, index) => {
                return (
                  <Button
                    key={index}
                    variant="contained"
                    size="small"
                    color={item.color || "primary"}
                    onClick={item.handleClick}
                    sx={{ ...sxContentButtonCustom, py: 0.9 }}
                  >
                    {item.content}
                  </Button>
                );
              })}
            </>
          )}
          {Object.values(dataExportFile).length ? (
            <Box>
              <ExportFile defaultData={dataExportFile} />
            </Box>
          ) : null}
          {Object.values(dataExportExcel.params).length && Object.values(dataExportFile).length ? (
            <Box>
              <ExportExcelBE
                {...dataExportExcel}
                keysMap={getObjectPropSafely(() => dataExportExcel.params.keys_map)}
              />
            </Box>
          ) : null}
          {dataRenderHeader.length && isShowPopupFilter ? (
            <WrapFilterPopup filterCount={filterCount}>
              {filterGrouping.map(
                (group: any, index: number) =>
                  Boolean(getObjectPropSafely(() => group.values.length)) && (
                    <FilterGroupItem
                      group={group}
                      renderValues={renderDataHeaderShare as any}
                      key={index}
                    />
                  )
              )}
            </WrapFilterPopup>
          ) : null}
          {onChangeColumn ? (
            <ChangeShowColumn
              columnsCount={columnsCount}
              columns={originColumns}
              onChangeColumn={onChangeColumn}
              toggleColumnsDisable={toggleColumnsDisable}
            />
          ) : null}
          {onToggleModeTable && (
            <ToggleModeTable isFullTable={isFullTable} onToggleModeTable={onToggleModeTable} />
          )}
          {handleChangeView ? (
            <Stack
              direction="row"
              sx={{ border: "1px solid grey", borderRadius: "6px" }}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <ViewListIcon
                sx={{
                  opacity: isViewTable ? 1 : 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "default",
                    opacity: 1,
                  },
                  m: 0.5,
                }}
                onClick={() => handleChangeView(!isViewTable)}
              />
              <ViewModuleIcon
                sx={{
                  opacity: !isViewTable ? 1 : 0.5,
                  cursor: "pointer",
                  m: 0.5,
                  "&:hover": {
                    backgroundColor: "default",
                    opacity: 1,
                  },
                }}
                onClick={() => handleChangeView(!isViewTable)}
              />
            </Stack>
          ) : null}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ...sxContentOptional }}
      >
        {contentOptional ? contentOptional : null}
      </Grid>
      <Grid item container xs={12} direction="row" alignItems="center">
        {!isShowPopupFilter && (
          <Grid item xs={12} container sx={{ columnGap: 2, rowGap: 1, mt: 4 }}>
            {renderDataHeaderShare(dataHeader)}
          </Grid>
        )}
        {!!dataRenderSliderFilter.length && isShowPopupFilter ? (
          <Grid item xs={12} sx={{ mt: 2 }}>
            <SliderFilter
              params={params}
              dataRender={dataRenderSliderFilter}
              onClearAll={handleClearAllFilter}
              isDisabledClearAll={isDisabledClearAll}
            />
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (
    !isEqual(prevProps.height, nextProps.height) ||
    !isEqual(prevProps.params, nextProps.params) ||
    !isEqual(prevProps.contentArrButtonOptional, nextProps.contentArrButtonOptional) ||
    !isEqual(prevProps.contentArrButtonGroup, nextProps.contentArrButtonGroup) ||
    !isEqual(prevProps.searchInput, nextProps.searchInput) ||
    !isEqual(prevProps.columnsCount, nextProps.columnsCount) ||
    !isEqual(prevProps.columnSelected, nextProps.columnSelected) ||
    !isEqual(prevProps.dataRenderHeader, nextProps.dataRenderHeader) ||
    !isEqual(prevProps.originColumns, nextProps.originColumns) ||
    !isEqual(prevProps.dataExport, nextProps.dataExport) ||
    !isEqual(prevProps.paramsDefault, nextProps.paramsDefault) ||
    !isEqual(prevProps.columnShowExport, nextProps.columnShowExport) ||
    !isEqual(prevProps.isShowFilterDate, nextProps.isShowFilterDate) ||
    !isEqual(prevProps.isShowFilter, nextProps.isShowFilter) ||
    !isEqual(prevProps.isShowExpand, nextProps.isShowExpand) ||
    !isEqual(prevProps.dataHeaderFilter, nextProps.dataHeaderFilter) ||
    !isEqual(prevProps.hrefTokenFacebook, nextProps.hrefTokenFacebook) ||
    !isEqual(prevProps.titleHeader, nextProps.titleHeader) ||
    !isEqual(prevProps.styleTitleHeader, nextProps.styleTitleHeader) ||
    !isEqual(prevProps.style, nextProps.style) ||
    !isEqual(prevProps.arrAttachUnitVnd, nextProps.arrAttachUnitVnd) ||
    !isEqual(prevProps.arrAttachUnitPercent, nextProps.arrAttachUnitPercent) ||
    !isEqual(prevProps.arrDate, nextProps.arrDate) ||
    !isEqual(prevProps.arrDateTime, nextProps.arrDateTime) ||
    !isEqual(prevProps.arrHandleList, nextProps.arrHandleList) ||
    !isEqual(prevProps.arrNoneRenderSliderFilter, nextProps.arrNoneRenderSliderFilter) ||
    !isEqual(prevProps.toggleColumnsDisable, nextProps.toggleColumnsDisable) ||
    !isEqual(prevProps.isFullTable, nextProps.isFullTable)
  ) {
    return false;
  }

  return true;
};

export default memo(Header, areEqual);

const datePickerStyle = { width: 200, marginTop: 0.8 };
const selectorStyle = { width: "100%" };

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
