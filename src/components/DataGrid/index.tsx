// Libraries
import { FunctionComponent, memo, useState, useMemo, useEffect } from "react";
import {
  CustomPaging,
  PagingState,
  RowDetailState,
  SortingState,
  TableColumnWidthInfo,
  SummaryState,
  IntegratedSummary,
  SummaryItem,
  EditingState,
  GridColumnExtension,
  ColumnBands,
  GroupingState,
  Grouping,
  IntegratedGrouping,
} from "@devexpress/dx-react-grid";
import {
  Grid as TableGrid,
  PagingPanel,
  TableColumnResizing,
  TableHeaderRow,
  TableSummaryRow,
  TableColumnReordering,
  DragDropProvider,
  TableRowDetail,
  TableInlineCellEditing,
  Table,
  TableBandHeader,
  TableFixedColumns,
  TableGroupRow,
  Toolbar,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { styled, useTheme, alpha, Theme } from "@mui/material/styles";
import isEqual from "lodash/isEqual";
import filter from "lodash/filter";
import map from "lodash/map";
import groupBy from "lodash/groupBy";

// Hooks
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Components
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import MPagination from "components/Tables/MPagination";
import TabDetail from "components/DDataGrid/components/TabDetail";
import ListToolbar from "components/DDataGrid/components/ListToolbar";
import HeaderCheckbox from "components/DDataGrid/components/HeaderCheckbox";
import ColumnHandleOperation from "components/DDataGrid/components/ColumnHandleOperation";
import ColumnOptional from "components/DDataGrid/components/ColumnOptional";
import TableInlineEdit from "components/DDataGrid/components/TableInlineEdit";
import HeaderOptional from "components/DataGrid/components/HeaderOptional";
import SortOptional from "components/DataGrid/components/SortOptional";
import ColumnShowInfo from "components/DataGrid/components/ColumnShowInfo";
import ColumnCheckbox from "components/DataGrid/components/ColumnCheckbox";
import ColumnSwitch from "components/DataGrid/components/ColumnSwitch";
import Iconify from "components/Icons/Iconify";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import CardHeader from "@mui/material/CardHeader";
import TableContainer from "@mui/material/TableContainer";

// Types
import { DIRECTION_SORT_TYPE, SortType } from "_types_/SortType";

// Constants
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { arrAttachUnitVndDefault } from "components/DataGrid/constants";
import { getColumnsShow, handleSizeTable } from "utils/tableUtil";
import vi from "locales/vi.json";
import { arrDateTimeDefault } from "constants/time";
import { COMMAS_REGEX, PAGE_SIZES } from "constants/index";
import { fDateTime, fMinutesToTimeString, fSecondsToTimeString } from "utils/dateUtil";
import { fPercentOmitDecimal, fValueVnd } from "utils/formatNumber";
import ColumnSyncTanentUrl, { ColumnSyncTanentUrlProps } from "./components/ColumnSyncTanentUrl";

export interface PropsDataGrid extends ColumnSyncTanentUrlProps {
  isFullTable?: boolean;
  isTableDetail?: boolean;
  heightProps?: number | string;
  data?: any;
  dataTotal?: number;
  page?: number;
  isHeightCustom?: boolean;
  pageSize?: number;
  styleHeaderTable?: any;
  titleHeaderTable?: string;
  summaryDataColumns?: SummaryItem[];
  columns?: any;
  columnWidths?: any;
  columnWidthsDefault?: TableColumnWidthInfo[];
  columnGroupingExtensions?: { columnName: string; groupingEnabled: boolean }[];
  isLoadingTable?: boolean;
  isShowContentCheckAll?: boolean;
  isShowListToolbar?: boolean;
  leftColumns?: string[];
  rightColumns?: string[];
  arrColumnThumbImg?: string[];
  arrColumnAvatar?: string[];
  arrColumnOptional?: string[];
  arrValueNoneFormat?: string[];
  arrAttachUnitVnd?: string[];
  arrAttachUnitPercent?: string[];
  arrColumnHandleLink?: string[];
  arrColumnCheckbox?: string[];
  arrColumnEditLabel?: string[];
  arrColumnBand?: ColumnBands[];
  arrColumnPhone?: string[];
  arrHandleList?: string[];
  arrValueTitle?: string[];
  arrColumnBool?: string[];
  arrDate?: string[];
  arrDateTime?: string[];
  arrFormatMinutesToTimeString?: string[];
  arrFormatSecondsToTimeString?: string[];
  arrColumnGrouping?: Grouping[];
  arrColumnEditableCustom?: string[];
  contentColumnSwitch?: any;
  contentColumnHandleOperation?: {
    arrColumnHandleOperation: string[];
    handleDelete?: (row: any) => void;
    handleEdit?: (row: any) => void;
    handleAdd?: (row: any) => void;
    handleRefresh?: (row: any) => void;
    handleView?: (row: any) => void;
    arrValueNoneView?: string[];
  };
  contentOptional?: {
    arrColumnOptional: string[];
  };
  contentColumnShowInfo?: {
    arrColumnShowInfo: string[];
    infoCell: Partial<any>;
  };
  contentSummary?: {
    arrFormatSummaryOptional?: string[];
    handleFormatSummary?: (columnName: string, totalRow: Partial<any>) => any;
  };
  listTabDetail?: any;
  totalSummaryRow?: any;
  columnEditExtensions?: {
    columnName: string;
    editingEnabled?: boolean;
  }[];
  // columnOrders?: string[];
  setColumnWidths?: (nextColumnWidths: TableColumnWidthInfo[]) => void;
  handleChangePage?: (page: number) => void;
  handleChangeRowsPerPage?: (rowPage: number) => void;
  handleSorting?: (value: SortType[]) => void;
  handleCheckColumn?: (columnSelected: string[]) => void;
  handleEditCell?: any;
  handleWatchDetail?: () => void;
  handleChangeColumnOrder?: (columns: string[]) => void;
  handleChangeGrouping?: (grouping: Grouping[]) => void;
  renderTableDetail?: any;
  renderHeader?: any;
  tableContainerProps?: any;
  headerCellStyle?: any;
  rowComponent?: React.ComponentType<Table.DataRowProps> | undefined;
  tableId?: string;
  columnExtensions?: GridColumnExtension[];
  headerContainerStyles?: React.CSSProperties;
  cardContainerStyles?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  showGroupingControls?: boolean;
  lastUpdatedAt?: string;
  viewOptional?: JSX.Element;
  isShowCalltime?: boolean;
}

const StyleCard = styled(Card)(({ theme }) => ({
  padding: "8px",
  "& .Pagination-text*": {
    color: `${theme.palette.text.primary} !important`,
    minWidth: "16px !important",
  },
}));

const VirtualTableWrap: any = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isHeightCustom" && prop !== "isTableDetail",
})(({ isHeightCustom, theme, isTableDetail }: any) => ({
  "table:nth-child(2)": {
    marginBottom: isHeightCustom === "true" && "0px !important",
  },
  "& .MuiTableCell-head": {
    ...(isTableDetail === "true" && {
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    }),
  },
}));

const SummaryLabel = styled("p")(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.primary,
  fontWeight: "bold",
  margin: 0,
}));

const DDataGrid: FunctionComponent<PropsDataGrid> = (props) => {
  const {
    isFullTable = false,
    isHeightCustom = false,
    data,
    isTableDetail = false,
    heightProps,
    columnWidths,
    columnWidthsDefault,
    columns,
    pageSize,
    titleHeaderTable,
    isShowListToolbar = true,
    isShowContentCheckAll = true,
    page,
    dataTotal,
    isLoadingTable = false,
    listTabDetail = [],
    summaryDataColumns = [],
    columnEditExtensions = [],
    columnGroupingExtensions = [],
    arrColumnCheckbox = ["isCheck"],
    arrAttachUnitVnd = arrAttachUnitVndDefault,
    arrColumnThumbImg = [],
    arrColumnAvatar = [],
    arrColumnOptional = [],
    arrColumnBool = [],
    isShowCalltime,
    arrColumnEditLabel = ["status_sync"],
    arrHandleList = ["phones"],

    arrValueNoneFormat = [],
    arrColumnGrouping = [],
    arrValueTitle = [],
    contentColumnSwitch = {
      arrColumnSwitch: [],
    },
    contentColumnHandleOperation = {
      arrColumnHandleOperation: [],
    },
    contentColumnShowInfo = {
      arrColumnShowInfo: [],
      infoCell: {},
    },
    contentOptional = {
      arrColumnOptional: [],
    },
    contentSummary = {
      arrFormatSummaryOptional: [],
      handleFormatSummary: (columnName: string, totalRow: Partial<any>) => 0,
    },
    arrAttachUnitPercent = ["rate_post_comments_phone"],
    arrColumnHandleLink = [],
    arrColumnPhone = ["phone"],
    arrDate = [],
    arrColumnBand = [],
    arrDateTime = arrDateTimeDefault,
    arrFormatMinutesToTimeString = [],
    arrFormatSecondsToTimeString = [],
    totalSummaryRow,
    renderTableDetail,
    renderHeader,
    setColumnWidths,
    handleSorting,
    handleChangePage,
    handleEditCell,
    handleWatchDetail,
    handleChangeRowsPerPage,
    handleCheckColumn,
    handleChangeColumnOrder,
    handleChangeGrouping,
    tableContainerProps = {
      sx: {
        px: 2,
        border: "none",
        pt: 2,
      },
    },
    headerCellStyle = {
      padding: "14px 0 14px 14px",
      verticalAlign: "top",
    },
    headerStyle,
    rowComponent,
    tableId,
    columnExtensions,
    headerContainerStyles,
    cardContainerStyles,
    leftColumns,
    rightColumns,
    showGroupingControls = false,
    lastUpdatedAt,
    viewOptional,
  } = props;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // State
  const [isSort, setSort] = useState(false);
  const [columnSelected, setColumnSelected] = useState<string[]>([]);
  const [totalRow, setTotalRow] = useState<any>({});

  useDidUpdateEffect(() => {
    handleCheckColumn && handleCheckColumn(columnSelected);
  }, [columnSelected]);

  useEffect(() => {
    if (totalSummaryRow) {
      setTotalRow(totalSummaryRow);
    }
  }, [totalSummaryRow]);

  const handleSort = (valueSort: string) => {
    setSort(!isSort);
    handleSorting &&
      handleSorting([
        {
          columnName: valueSort,
          direction: isSort ? DIRECTION_SORT_TYPE.DESC : DIRECTION_SORT_TYPE.ASC,
        },
      ]);
  };

  const renderSummaryRow: any = (tableRow: any) => {
    const { column = {} } = getObjectPropSafely(() => tableRow.children.props);

    let value = null;
    const valueNumber = totalRow[column.name];

    switch (true) {
      case arrFormatMinutesToTimeString.includes(column.name): {
        value = fMinutesToTimeString(valueNumber || 0);
        break;
      }
      case arrFormatSecondsToTimeString.includes(column.name): {
        value = fSecondsToTimeString(valueNumber || 0);
        break;
      }
      case contentSummary.arrFormatSummaryOptional?.includes(column.name): {
        value =
          (contentSummary.handleFormatSummary &&
            contentSummary.handleFormatSummary(column.name, totalRow)) ||
          0;
        break;
      }
      case arrAttachUnitPercent.includes(column.name): {
        value = fPercentOmitDecimal(valueNumber);
        break;
      }
      case arrAttachUnitVnd.includes(column.name): {
        value = fValueVnd(valueNumber);
        break;
      }
      default:
        value = valueNumber?.toString().replace(COMMAS_REGEX, ",") || 0;
    }

    return <SummaryLabel key={column.name}>{value}</SummaryLabel>;
  };

  const renderTabDetail = useMemo(() => {
    return ({ row }: { row: any }): any => {
      return (
        <TabDetail row={row} renderTableDetail={renderTableDetail} listTabDetail={listTabDetail} />
      );
    };
  }, [isLoadingTable]);

  const renderToolBar = (props: any) => (
    <Box
      sx={{
        ...(!showGroupingControls && {
          display: "none",
        }),
      }}
      {...props}
    ></Box>
  );

  const checkColumn = (isCheck: boolean, row: any = {}) => {
    const newcolumnSelected = isCheck
      ? [...columnSelected, row?.id]
      : filter([...columnSelected], (item) => item !== row.id);

    setColumnSelected(newcolumnSelected);
  };

  const checkAll = (isCheck: boolean) => {
    setColumnSelected(isCheck ? map(data, (item: any) => item.id) : []);
  };

  const infoCellTable = useMemo(() => {
    const columnShow = filter(contentColumnShowInfo.infoCell, (item) => item.isShow);
    return groupBy(columnShow, (item) => item.column);
  }, [contentColumnShowInfo.infoCell]);

  const objColumn: Partial<any> = useMemo(() => {
    const newResultColumn = filter(
      columns,
      (item: { name: string }) =>
        !!infoCellTable[item.name] ||
        contentColumnHandleOperation.arrColumnHandleOperation.includes(item.name) ||
        contentColumnSwitch.arrColumnSwitch.includes(item.name) ||
        arrColumnCheckbox.includes(item.name)
    );

    return {
      resultColumns: newResultColumn,
      columnOrders: map(newResultColumn, (item: Partial<any>) => item.name),
    };
  }, [columns, infoCellTable]);

  return (
    <StyleCard sx={{ ...cardContainerStyles, mb: 3 }}>
      <Box
        display="flex"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          ...headerContainerStyles,
        }}
      >
        {!!titleHeaderTable && (
          <CardHeader title={titleHeaderTable} sx={{ mb: 2, width: "100%" }} />
        )}
        {isShowListToolbar && <ListToolbar numSelected={0} renderContent={renderHeader} />}
        {handleWatchDetail ? (
          <Box sx={{ p: 2, textAlign: "right" }}>
            <Button
              size="small"
              color="inherit"
              endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
              onClick={handleWatchDetail}
            >
              Xem thêm
            </Button>
          </Box>
        ) : null}
      </Box>
      <Box display="flex" justifyContent="flex-end" sx={{ pr: 4 }}>
        {lastUpdatedAt && (
          <Typography sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>{`Cập nhật lần cuối: ${
            lastUpdatedAt ? fDateTime(lastUpdatedAt) : "---"
          }`}</Typography>
        )}
      </Box>
      {viewOptional ? (
        viewOptional
      ) : (
        <VirtualTableWrap
          container
          isHeightCustom={isHeightCustom.toString()}
          isTableDetail={isTableDetail.toString()}
          id={tableId}
        >
          <StyledTableContainer component={Paper} variant="outlined" {...tableContainerProps}>
            {isLoadingTable && <LinearProgress />}
            <TableGrid rows={data} columns={objColumn.resultColumns}>
              <ColumnSwitch for={contentColumnSwitch.arrColumnSwitch} {...contentColumnSwitch} />
              <ColumnHandleOperation
                for={contentColumnHandleOperation.arrColumnHandleOperation}
                columns={objColumn.resultColumns}
                {...contentColumnHandleOperation}
              />
              <ColumnShowInfo
                for={contentColumnShowInfo.arrColumnShowInfo}
                {...{ ...contentColumnShowInfo, infoCell: infoCellTable }}
                arrAttachUnitVnd={arrAttachUnitVnd}
                arrAttachUnitPercent={arrAttachUnitPercent}
                arrDate={arrDate}
                arrDateTime={arrDateTime}
                arrColumnHandleLink={arrColumnHandleLink}
                arrColumnPhone={arrColumnPhone}
                arrColumnEditLabel={arrColumnEditLabel}
                arrValueTitle={arrValueTitle}
                arrColumnThumbImg={arrColumnThumbImg}
                arrColumnAvatar={arrColumnAvatar}
                arrColumnOptional={arrColumnOptional}
                arrHandleList={arrHandleList}
                arrColumnBool={arrColumnBool}
                isShowCalltime={isShowCalltime}
              />
              <ColumnSyncTanentUrl
                accountKey={props.accountKey}
                tenantKey={props.tenantKey}
                getCheckedValue={props.getCheckedValue}
                onToggleSyncTannetSwitch={props.onToggleSyncTannetSwitch}
                for={["sync_habt", "sync_jp24"]}
              />

              <ColumnCheckbox for={arrColumnCheckbox} onChangeCheckColumn={checkColumn} />
              <ColumnOptional for={contentOptional.arrColumnOptional} />

              <PagingState
                currentPage={page}
                onPageSizeChange={handleChangeRowsPerPage}
                onCurrentPageChange={handleChangePage}
                pageSize={pageSize}
              />
              <SortingState
                onSortingChange={handleSorting}
                defaultSorting={[{ columnName: "-created", direction: "asc" }]}
              />
              <EditingState
                columnExtensions={columnEditExtensions}
                onCommitChanges={(value: any) => handleEditCell(value, data)}
              />
              <CustomPaging totalCount={dataTotal} />
              <DragDropProvider />
              <GroupingState
                grouping={arrColumnGrouping}
                onGroupingChange={handleChangeGrouping}
                columnExtensions={columnGroupingExtensions}
              />
              <RowDetailState />
              <SummaryState totalItems={summaryDataColumns} />
              <IntegratedGrouping />
              <IntegratedSummary />
              <DragDropProvider />
              <VirtualTable
                messages={{ noData: vi.no_data }}
                height={
                  isHeightCustom || isFullTable
                    ? "auto"
                    : heightProps || handleSizeTable(isTablet).height
                }
                headComponent={(headProps) => (
                  <VirtualTable.TableHead {...headProps} style={headerStyle} />
                )}
                cellComponent={(cellProps) => (
                  <VirtualTable.Cell
                    {...cellProps}
                    style={{ height: arrColumnThumbImg.length ? 70 : 50 }}
                  />
                )}
                rowComponent={
                  rowComponent ? rowComponent : (rowProps) => <VirtualTable.Row {...rowProps} />
                }
                columnExtensions={columnExtensions || []}
              />
              {showGroupingControls && (
                <TableGroupRow
                  cellComponent={({ ...props }: any) => <StyledTableGroupRowCell {...props} />}
                />
              )}
              <TableColumnReordering
                order={objColumn.columnOrders}
                onOrderChange={handleChangeColumnOrder}
              />
              <TableColumnResizing
                columnWidths={columnWidths}
                minColumnWidth={50}
                onColumnWidthsChange={setColumnWidths}
                defaultColumnWidths={columnWidthsDefault}
              />

              <TableHeaderRow
                showSortingControls
                showGroupingControls={showGroupingControls}
                cellComponent={({ ...props }: any) => {
                  return (
                    <>
                      {props.column.name === "isCheck" && isShowContentCheckAll ? (
                        <HeaderCheckbox
                          tableCellProps={props}
                          isCheckAll={data.length && data.length === columnSelected.length}
                          onChangeCheckBoxAll={checkAll}
                          isTableDetail={isTableDetail}
                        />
                      ) : contentColumnShowInfo.arrColumnShowInfo?.includes(props.column.name) ? (
                        <HeaderOptional tableCellProps={props} isTableDetail={isTableDetail}>
                          <SortOptional
                            column={props.column}
                            isSort={isSort}
                            infoColumnSort={infoCellTable}
                            handleSortColumn={handleSort}
                          />
                        </HeaderOptional>
                      ) : (
                        <StyledTableHeaderRowCell
                          {...props}
                          style={{ ...styles.headerCell }}
                          headerCellStyle={{
                            ...headerCellStyle,
                            ...(isTableDetail && {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                theme.palette.action.selectedOpacity
                              ),
                            }),
                          }}
                        />
                      )}
                    </>
                  );
                }}
              />
              {arrColumnBand.length ? <TableBandHeader columnBands={arrColumnBand} /> : null}
              {handleEditCell ? (
                <TableInlineCellEditing
                  selectTextOnEditStart
                  cellComponent={({ ...props }) => {
                    return contentOptional.arrColumnOptional.includes(props.column.name) ? (
                      <TableInlineEdit
                        {...props}
                        value={getObjectPropSafely(() => props.value)}
                        onCommitChanges={(value: any) => {
                          handleEditCell(
                            {
                              changed: {
                                [props?.tableRow?.rowId || 0]: {
                                  [props.column.name]: value,
                                },
                              },
                            },
                            data
                          );
                        }}
                      />
                    ) : (
                      <TableInlineCellEditing.Cell {...props} />
                    );
                  }}
                />
              ) : null}
              {data.length && summaryDataColumns.length ? (
                <TableSummaryRow
                  formatlessSummaryTypes={["total"]}
                  itemComponent={renderSummaryRow}
                />
              ) : null}
              {renderTableDetail && <TableRowDetail contentComponent={renderTabDetail} />}
              <TableFixedColumns leftColumns={leftColumns} rightColumns={rightColumns} />
              <Toolbar rootComponent={renderToolBar} />
              {page ? (
                <PagingPanel
                  pageSizes={PAGE_SIZES}
                  containerComponent={(containerProps) => {
                    return (
                      <MPagination
                        totalData={containerProps.totalCount}
                        limit={containerProps.pageSize}
                        page={containerProps.currentPage}
                        pageCount={containerProps.totalPages}
                        onChange={containerProps.onCurrentPageChange}
                        onChangeRowPerPage={containerProps.onPageSizeChange}
                        pageSizes={containerProps.pageSizes}
                      />
                    );
                  }}
                />
              ) : null}
            </TableGrid>
          </StyledTableContainer>
        </VirtualTableWrap>
      )}
    </StyleCard>
  );
};

const areEqual = (prevProps: PropsDataGrid, nextProps: PropsDataGrid) => {
  if (
    !isEqual(prevProps.summaryDataColumns, nextProps.summaryDataColumns) ||
    !isEqual(prevProps.heightProps, nextProps.heightProps) ||
    !isEqual(prevProps.data, nextProps.data) ||
    !isEqual(prevProps.dataTotal, nextProps.dataTotal) ||
    !isEqual(prevProps.totalSummaryRow, nextProps.totalSummaryRow) ||
    !isEqual(prevProps.page, nextProps.page) ||
    !isEqual(prevProps.isHeightCustom, nextProps.isHeightCustom) ||
    !isEqual(prevProps.pageSize, nextProps.pageSize) ||
    !isEqual(prevProps.isFullTable, nextProps.isFullTable) ||
    !isEqual(prevProps.columnWidthsDefault, nextProps.columnWidthsDefault) ||
    !isEqual(prevProps.isLoadingTable, nextProps.isLoadingTable) ||
    !isEqual(prevProps.arrColumnThumbImg, nextProps.arrColumnThumbImg) ||
    !isEqual(prevProps.columnWidths, nextProps.columnWidths) ||
    !isEqual(prevProps.columns, nextProps.columns) ||
    !isEqual(prevProps.isLoadingTable, nextProps.isLoadingTable) ||
    !isEqual(prevProps.setColumnWidths, nextProps.setColumnWidths) ||
    !isEqual(prevProps.arrColumnGrouping, nextProps.arrColumnGrouping)
  ) {
    return false;
  }
  return true;
};

export default memo(DDataGrid, areEqual);

const styles = {
  headerCell: { whiteSpace: "normal" },
};

const StyledTableHeaderRowCell = styled(TableHeaderRow.Cell, {
  shouldForwardProp: (props: any) => props !== "headerCellStyle",
})((props) => ({
  ...props.headerCellStyle,
  "& .GroupButton-root.GroupButton-disabled": {
    display: "none",
  },
}));

const StyledTableGroupRowCell = styled(TableGroupRow.Cell)(() => ({
  "& .Container-wrapper": {
    background: "transparent!important",
    display: "flex",
    alignItems: "center",
    "& .Content-columnTitle": {
      display: "flex",
      alignItems: "center",
      strong: {
        marginRight: "4px",
      },
    },
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }: { theme: Theme }) => ({
  "& .TableContainer-root": {
    "::-webkit-scrollbar-track, ::-webkit-scrollbar-thumb": {
      background: "transparent",
      borderRadius: 10,
      transition: "all 1s ease",
    },
    "&:hover": {
      "::-webkit-scrollbar-thumb": {
        background: theme.palette.mode === "light" ? "#B4BCC2" : "#404E5A",
      },
    },
    "::-webkit-scrollbar-corner": {
      background: "transparent",
    },
  },
}));
