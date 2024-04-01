// Libraries
import {
  ColumnBands,
  CustomPaging,
  EditingState,
  GridColumnExtension,
  Grouping,
  GroupingState,
  IntegratedGrouping,
  IntegratedSummary,
  PagingState,
  RowDetailState,
  SortingState,
  SummaryItem,
  SummaryState,
  TableColumnWidthInfo,
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  PagingPanel,
  Table,
  TableBandHeader,
  TableColumnReordering,
  TableColumnResizing,
  TableFixedColumns,
  Grid as TableGrid,
  TableGroupRow,
  TableHeaderRow,
  TableInlineCellEditing,
  TableRowDetail,
  TableSummaryRow,
  Toolbar,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TableContainer from "@mui/material/TableContainer";
import { SxProps, Theme, alpha, styled, useTheme } from "@mui/material/styles";
import isEqual from "lodash/isEqual";
import isPlainObject from "lodash/isPlainObject";
import map from "lodash/map";
import { FunctionComponent, memo, useEffect, useMemo, useState } from "react";

// Components
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ColumnCellShowPopup from "components/DDataGrid/components/ColumnCellShowPopup";
import ColumnDetailProduct from "components/DDataGrid/components/ColumnDetailProduct";
import ColumnEditLabel from "components/DDataGrid/components/ColumnEditLabel";
import ColumnHandleButton from "components/DDataGrid/components/ColumnHandleButton";
import ColumnHandleCheckBox from "components/DDataGrid/components/ColumnHandleCheckBox";
import ColumnHandleLink from "components/DDataGrid/components/ColumnHandleLink";
import ColumnHandleList from "components/DDataGrid/components/ColumnHandleList";
import ColumnHandleOperation from "components/DDataGrid/components/ColumnHandleOperation";
import ColumnHandlePhone from "components/DDataGrid/components/ColumnHandlePhone";
import ColumnHandleValue from "components/DDataGrid/components/ColumnHandleValue";
import ColumnOptional from "components/DDataGrid/components/ColumnOptional";
import ColumnShowPopover from "components/DDataGrid/components/ColumnShowPopover";
import ColumnSwitch from "components/DDataGrid/components/ColumnSwitch";
import ColumnThumbImg from "components/DDataGrid/components/ColumnThumbImg";
import HeaderCheckbox from "components/DDataGrid/components/HeaderCheckbox";
import HeaderOptional from "components/DDataGrid/components/HeaderOptional";
import ListToolbar from "components/DDataGrid/components/ListToolbar";
import SortOptional from "components/DDataGrid/components/SortOptional";
import TabDetail from "components/DDataGrid/components/TabDetail";
import TableInlineEdit from "components/DDataGrid/components/TableInlineEdit";
import HistoryTypeColumn from "components/Tables/columns/HistoryTypeColumn";
import Iconify from "components/Icons/Iconify";
import MPagination from "components/Tables/MPagination";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { SortType } from "_types_/SortType";

// Constants
import vi from "locales/vi.json";
import { COMMAS_REGEX, PAGE_SIZES } from "constants/index";
import { arrDateTimeDefault } from "constants/time";
import { fDateTime, fMinutesToTimeString, fSecondsToTimeString } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleSizeTable } from "utils/tableUtil";
import LeadStatusColumn from "views/LeadCenterView/components/columns/LeadStatusColumn";
import { arrAttachUnitVndDefault, arrStatusDefault } from "./constants";

export interface DDataGridProps {
  isFullTable?: boolean;
  isTableDetail?: boolean;
  heightProps?: number | string;
  data: any[];
  dataTotal?: number;
  page?: number;
  params?: any;
  isHeightCustom?: boolean;
  pageSize?: number;
  styleHeaderTable?: any;
  titleHeaderTable?: string;
  summaryDataColumns?: SummaryItem[];
  // columns: ColumnType<FacebookType>[];
  columns: any;
  // columnWidths?: TableColumnWidthInfo[];
  columnWidths?: any;
  columnWidthsDefault?: TableColumnWidthInfo[];
  columnOrders?: string[];
  columnGroupingExtensions?: { columnName: string; groupingEnabled: boolean }[];
  isCheckAll?: boolean;
  isLoadingTable?: boolean;
  isCallApiColumnHandleLink?: boolean;
  isShowContentCheckAll?: boolean;
  isShowListToolbar?: boolean;
  columnSelected?: string[];
  leftColumns?: string[];
  rightColumns?: string[];
  arrColumnThumbImg?: string[];
  arrValueNoneFormat?: string[];
  arrAttachUnitVnd?: string[];
  arrAttachUnitPercent?: string[];
  arrColumnHandleLink?: string[];
  arrColumnHandleValue?: string[];
  arrColumnCheckbox?: string[];
  arrColumnEditLabel?: string[];
  arrColumnShowPopover?: string[];
  arrColumnHistory?: string[];
  arrColumnBand?: ColumnBands[];
  arrRoleOption?: string[];
  arrColumnPhone?: string[];
  arrHandleList?: string[];
  arrDate?: string[];
  arrDateTime?: string[];
  arrLeadStatus?: string[];
  arrStatus?: string[];
  arrColumnCellShowPopup?: string[];
  arrFormatMinutesToTimeString?: string[];
  arrFormatSecondsToTimeString?: string[];
  arrColumnGrouping?: Grouping[];
  arrColumnEditableCustom?: string[];
  contentColumnHandleButton?: any;
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
  contentColumnDetailProduct?: {
    arrColumnDetailProduct: string[];
  };
  contentSortOptional?: {
    arrSortOptional: string[];
    isShowSortOptional?: boolean;
    getValueSort: (columnName: string) => SelectOptionType[];
    handleSort: (valueSort: string) => void;
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
  setColumnWidths?: (nextColumnWidths: TableColumnWidthInfo[]) => void;
  handleChangePage?: (page: number) => void;
  handleChangeRowsPerPage?: (rowPage: number) => void;
  handleSorting?: (value: SortType[]) => void;
  handleCheckColumn?: (isCheck: boolean, row: any) => void;
  handleCheckedAll?: any;
  handleEditCell?: any;
  handleWatchDetail?: () => void;
  handleChangeColumnOrder?: (columns: string[]) => void;
  handleChangeValuePopover?: (column: any, value: any, row: any) => void;
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
  headerStyle?: React.CSSProperties & SxProps<Theme>;
  showGroupingControls?: boolean;
  lastUpdatedAt?: string;
  wrapContainerType?: "card" | "grid";
  titleButtonDetail?: string;
  buttonDetailProps?: any;
  cellHeight?: number;
}

const StyleCard = styled(Card)(({ theme }) => ({
  padding: "8px",
  "& .Pagination-text*": {
    color: `${theme.palette.text.primary} !important`,
    minWidth: "16px !important",
  },
}));

const TableWrap: any = styled(Grid, {
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

const DDataGrid: FunctionComponent<DDataGridProps> = (props) => {
  const {
    isFullTable = false,
    isHeightCustom = false,
    isCallApiColumnHandleLink = false,
    data,
    isTableDetail = false,
    heightProps,
    params = {},
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
    columnSelected = [],
    columnEditExtensions = [],
    columnGroupingExtensions = [],
    arrColumnCheckbox = ["isCheck"],
    arrColumnShowPopover = [],
    arrAttachUnitVnd = arrAttachUnitVndDefault,
    arrColumnThumbImg = [],
    arrColumnEditLabel = ["status_sync"],
    arrHandleList = ["phones"],
    arrLeadStatus = ["lead_status"],
    arrColumnHandleValue = [],
    arrColumnCellShowPopup = [],
    arrValueNoneFormat = [],
    arrColumnGrouping = [],
    contentColumnHandleButton = {
      arrColumnHandleButton: [],
    },
    contentColumnSwitch = {
      arrColumnSwitch: [],
    },
    contentColumnHandleOperation = {
      arrColumnHandleOperation: [],
    },
    contentColumnDetailProduct = {
      arrColumnDetailProduct: [],
    },
    contentOptional = {
      arrColumnOptional: [],
    },
    contentSortOptional = {
      arrSortOptional: [],
      isShowSortOptional: true,
      handleSort: () => {},
      getValueSort: () => [],
    },
    contentSummary = {
      arrFormatSummaryOptional: [],
      handleFormatSummary: (columnName: string, totalRow: Partial<any>) => 0,
    },
    arrAttachUnitPercent = ["rate_post_comments_phone"],
    arrColumnHandleLink = [],
    arrColumnPhone = ["phone"],
    arrDate = [],
    arrColumnHistory = [],
    arrColumnBand = [],
    arrDateTime = arrDateTimeDefault,
    arrStatus = arrStatusDefault,
    arrRoleOption = [],
    arrFormatMinutesToTimeString = [],
    arrFormatSecondsToTimeString = [],
    totalSummaryRow,
    columnOrders,
    isCheckAll = false,
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
    handleChangeValuePopover,
    handleCheckedAll,
    handleChangeGrouping,
    tableContainerProps,
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
    wrapContainerType = "grid",
    titleButtonDetail = "Xem thêm",
    buttonDetailProps,
    cellHeight,
  } = props;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [totalRow, setTotalRow] = useState<any>({});
  const [isSort, setSort] = useState(true);

  useEffect(() => {
    if (totalSummaryRow) {
      setTotalRow(totalSummaryRow);
    }
  }, [totalSummaryRow]);

  const handleSort = (valueSort: string) => {
    setSort(!isSort);
    contentSortOptional.handleSort(isSort ? `-${valueSort}` : valueSort);
  };

  const renderSummaryRow: any = (tableRow: any) => {
    const { column } = getObjectPropSafely(() => tableRow.children.props);
    let value = null;
    const valueNumber = arrValueNoneFormat.includes(column.name)
      ? totalRow[column.name]
      : Math.trunc(
          arrAttachUnitPercent.includes(column.name)
            ? totalRow[column.name] * 100
            : totalRow[column.name]
        );

    const valueString = valueNumber?.toString().replace(COMMAS_REGEX, ",") || 0;

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
        value = `${valueString} %`;
        break;
      }
      case arrAttachUnitVnd.includes(column.name): {
        value = `${valueString} đ`;
        break;
      }
      default:
        value = valueString || 0;
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

  const arrColumnHandleValueDefault = useMemo(() => {
    if (summaryDataColumns.length) {
      return map(summaryDataColumns, (item) => item.columnName);
    }
    return [];
  }, [summaryDataColumns]);

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

  return (
    <StyleCard
      sx={{
        ...cardContainerStyles,
      }}
    >
      <Box
        display="flex"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          ...headerContainerStyles,
        }}
      >
        {titleHeaderTable ? <CardHeader title={titleHeaderTable} sx={{ mb: 2 }} /> : null}
        {isShowListToolbar ? <ListToolbar numSelected={0} renderContent={renderHeader} /> : null}
        {handleWatchDetail ? (
          <Box sx={{ p: 2, textAlign: "right" }}>
            <Button
              size="small"
              color="inherit"
              endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
              onClick={handleWatchDetail}
              {...buttonDetailProps}
            >
              {titleButtonDetail}
            </Button>
          </Box>
        ) : null}
      </Box>
      <Box display="flex" justifyContent="flex-end" sx={{ pr: 4 }}>
        {props.lastUpdatedAt && (
          <Typography sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>{`Cập nhật lần cuối: ${
            props?.lastUpdatedAt ? fDateTime(props?.lastUpdatedAt) : "---"
          }`}</Typography>
        )}
      </Box>
      <TableWrap
        container
        isHeightCustom={isHeightCustom.toString()}
        isTableDetail={isTableDetail.toString()}
        id={tableId}
      >
        <StyledTableContainer {...tableContainerProps}>
          {isLoadingTable && <LinearProgress />}
          <TableGrid rows={data} columns={columns}>
            <ColumnSwitch for={contentColumnSwitch.arrColumnSwitch} {...contentColumnSwitch} />
            <ColumnHandleLink for={arrColumnHandleLink} isCallApi={isCallApiColumnHandleLink} />
            <ColumnEditLabel for={arrColumnEditLabel} />
            <HistoryTypeColumn for={arrColumnHistory} />
            <ColumnHandlePhone for={arrColumnPhone} params={params} />
            <ColumnShowPopover
              for={arrColumnShowPopover}
              handleChangeValue={handleChangeValuePopover}
            />
            <ColumnHandleValue
              for={[
                ...arrColumnHandleValueDefault,
                ...arrColumnHandleValue,
                ...arrAttachUnitVnd,
                ...arrAttachUnitPercent,
                ...arrDate,
                ...arrStatus,
                ...arrDateTime,
                ...arrRoleOption,
                ...arrFormatMinutesToTimeString,
                ...arrFormatSecondsToTimeString,
              ]}
              arrAttachUnitVnd={arrAttachUnitVnd}
              arrAttachUnitPercent={arrAttachUnitPercent}
              arrDate={arrDate}
              arrStatus={arrStatus}
              arrDateTime={arrDateTime}
              arrRoleOption={arrRoleOption}
              arrFormatMinutesToTimeString={arrFormatMinutesToTimeString}
              arrFormatSecondsToTimeString={arrFormatSecondsToTimeString}
            />
            <LeadStatusColumn for={arrLeadStatus} />
            <ColumnCellShowPopup for={arrColumnCellShowPopup} />
            <ColumnThumbImg for={arrColumnThumbImg} />
            <ColumnHandleCheckBox for={arrColumnCheckbox} onChangeCheckColumn={handleCheckColumn} />
            <ColumnHandleList for={arrHandleList} />
            <ColumnHandleButton
              for={contentColumnHandleButton.arrColumnHandleButton}
              {...contentColumnHandleButton}
            />
            <ColumnDetailProduct
              for={contentColumnDetailProduct.arrColumnDetailProduct}
              {...contentColumnDetailProduct}
            />
            <ColumnHandleOperation
              for={contentColumnHandleOperation.arrColumnHandleOperation}
              columns={columns}
              {...contentColumnHandleOperation}
            />

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

            {/* <IntegratedSorting /> */}
            <IntegratedGrouping />
            <IntegratedSummary />

            <VirtualTable
              messages={{
                noData: vi.no_data,
              }}
              height={
                isHeightCustom || isFullTable
                  ? "auto"
                  : heightProps
                  ? heightProps
                  : handleSizeTable(isTablet).height
              }
              // bodyComponent={(bodyProps) => (
              //   <VirtualTable.TableBody
              //     {...bodyProps}
              //     style={{
              //       display: "block",
              //       height:
              //         isHeightCustom || isFullTable
              //           ? "auto"
              //           : heightProps
              //           ? heightProps
              //           : handleSizeTable(isTablet).height,
              //     }}
              //   />
              // )}
              headComponent={(headProps) => (
                <VirtualTable.TableHead
                  {...headProps}
                  style={{ ...headerStyle, ...styles.header }}
                />
              )}
              cellComponent={(cellProps) => (
                <VirtualTable.Cell
                  {...cellProps}
                  style={{ height: cellHeight ? cellHeight : arrColumnThumbImg.length ? 70 : 50 }}
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

            <TableColumnResizing
              columnWidths={columnWidths}
              minColumnWidth={50}
              onColumnWidthsChange={setColumnWidths}
              defaultColumnWidths={columnWidthsDefault}
            />
            <TableColumnReordering order={columnOrders} onOrderChange={handleChangeColumnOrder} />
            <TableHeaderRow
              showSortingControls
              showGroupingControls={showGroupingControls}
              rowComponent={(restProps) => <TableHeader {...restProps} sx={headerStyle} />}
              cellComponent={({ ...props }: any) => {
                return (
                  <>
                    {props.column.name === "isCheck" && isShowContentCheckAll ? (
                      <HeaderCheckbox
                        tableCellProps={props}
                        isCheckAll={isCheckAll}
                        onChangeCheckBoxAll={handleCheckedAll}
                        isTableDetail={isTableDetail}
                      />
                    ) : contentSortOptional.arrSortOptional?.includes(props.column.name) &&
                      contentSortOptional.isShowSortOptional ? (
                      <HeaderOptional tableCellProps={props} isTableDetail={isTableDetail}>
                        <SortOptional
                          {...contentSortOptional}
                          column={props.column}
                          handleSort={handleSort}
                          isSort={isSort}
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
                      value={
                        isPlainObject(getObjectPropSafely(() => props.value))
                          ? getObjectPropSafely(() => props.value.value)
                          : getObjectPropSafely(() => props.value)
                      }
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
      </TableWrap>
    </StyleCard>
  );
};

//return false -> update , return true => not update
const areEqual = (prevProps: DDataGridProps, nextProps: DDataGridProps) => {
  if (
    !isEqual(prevProps.summaryDataColumns, nextProps.summaryDataColumns) ||
    !isEqual(prevProps.heightProps, nextProps.heightProps) ||
    !isEqual(prevProps.data, nextProps.data) ||
    !isEqual(prevProps.dataTotal, nextProps.dataTotal) ||
    !isEqual(prevProps.page, nextProps.page) ||
    !isEqual(prevProps.isHeightCustom, nextProps.isHeightCustom) ||
    !isEqual(prevProps.params, nextProps.params) ||
    !isEqual(prevProps.pageSize, nextProps.pageSize) ||
    !isEqual(prevProps.isFullTable, nextProps.isFullTable) ||
    !isEqual(prevProps.columnWidthsDefault, nextProps.columnWidthsDefault) ||
    !isEqual(prevProps.columnOrders, nextProps.columnOrders) ||
    !isEqual(prevProps.isCheckAll, nextProps.isCheckAll) ||
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

const styles: any = {
  headerCell: { whiteSpace: "normal" },
  // header: {
  //   position: "sticky",
  //   top: 0,
  //   zIndex: 1300,
  // },
};

const TableHeader = styled(TableHeaderRow.Row)(() => ({
  "& .Title-title": {
    whiteSpace: "nowrap",
  },
}));

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
  padding: 2,
  border: "none",
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
