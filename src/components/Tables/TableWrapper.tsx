import {
  CustomPaging,
  EditingState,
  GroupingState,
  IntegratedGrouping,
  IntegratedSelection,
  IntegratedSorting,
  IntegratedSummary,
  PagingState,
  RowDetailState,
  SelectionState,
  SortingState,
  SummaryState,
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  PagingPanel,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  TableEditColumn,
  TableEditRow,
  TableFixedColumns,
  Grid as TableGrid,
  TableGroupRow,
  TableHeaderRow,
  TableInlineCellEditing,
  TableRowDetail,
  TableSelection,
  TableSummaryRow,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { Theme, Tooltip, alpha, styled, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { DGridType } from "_types_/DGridType";
import { DIRECTION_SORT_TYPE, SortType } from "_types_/SortType";
import MPagination from "components/Tables/MPagination";
import { PAGE_SIZES } from "constants/index";
import vi from "locales/vi.json";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { memo } from "react";
import {
  handleChangeOrderingUtil,
  handleChangeParamsToSortingTable,
  handleChangeSortingTableToParams,
  handleSizeTable,
} from "utils/tableUtil";
import EditingPopup from "./EditingPopup";
import SortHeader from "./SortHeader";

const TableWrapper = ({
  data = { data: [], count: 0, loading: false },
  columns = [],
  params = {},
  columnOrders,
  columnWidths,
  headerStyle,
  heightTable,
  hiddenColumnNames,
  defaultHiddenColumnNames,
  hiddenPagination,
  isFullRow = false,
  setColumnOrders,
  setParams,
  summaryColumns,
  SummaryColumnsComponent,
  grouping,
  groupSummaryItems,
  setColumnWidths,
  defaultColumnWidths,
  selection,
  setSelection,
  editComponent,
  editInline,
  detailComponent,
  columnExtensions,
  columnEditExtensions,
  children,
  columnShowSort,
  totalRow,
  defaultColumnOrders,
  showSelectAll,
  cellStyle,
  headerCellComponent = ({ ...cellProps }) => <TableHeaderRow.Cell {...cellProps} />,
  setColumnShowSort,
  editRowChangeForInline = () => {},
  isShowPrintStatus,
  tableWrapStyles,
  sortingStateColumnExtensions,
  formatGroupingItem,
  disableExcuteRowPath,
  ...props
}: Partial<DGridType>) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const handleChangePage = (newPage: number) => {
    setParams &&
      setParams({
        ...params,
        page: newPage,
      });
  };

  const handleChangeRowsPerPage = (value: number) => {
    setParams && setParams({ ...params, limit: value, page: 1 });
  };

  const handleChangeOrdering = (
    columnName: string,
    fieldName: string,
    direction: DIRECTION_SORT_TYPE
  ) => {
    const { ordering, orderingParent } = handleChangeOrderingUtil(columnName, fieldName, direction);

    setParams?.({ ...params, ordering, orderingParent });
  };

  return (
    <TableWrap container heightTable={heightTable}>
      <StyledTableContainer style={tableWrapStyles}>
        <TableGrid rows={data.data} columns={columns}>
          {data.loading && <LinearProgress />}
          {children}
          <DragDropProvider />
          <SortingState
            sorting={handleChangeParamsToSortingTable(params.orderingParent || params.ordering)}
            onSortingChange={(value: SortType[]) => {
              if (columnShowSort) {
                const columnSortIndex = columnShowSort.findIndex((column) => {
                  return column?.name === value[0].columnName;
                });

                if (columnSortIndex === -1) {
                  setParams &&
                    setParams({
                      ...params,
                      ...handleChangeSortingTableToParams(value),
                    });
                }
              } else {
                setParams &&
                  setParams({
                    ...params,
                    ...handleChangeSortingTableToParams(value),
                  });
              }
            }}
            columnExtensions={sortingStateColumnExtensions}
          />
          {/* Paging */}
          {!hiddenPagination && (
            <PagingState
              currentPage={params.page}
              onPageSizeChange={(pageSize: number) => handleChangeRowsPerPage(pageSize)}
              onCurrentPageChange={(page) => handleChangePage(page)}
              pageSize={params.limit}
            />
          )}
          {!hiddenPagination && <CustomPaging totalCount={data.count} />}

          {(editComponent || editInline) && (
            <EditingState
              onCommitChanges={editRowChangeForInline}
              columnExtensions={columnEditExtensions}
            />
          )}
          {selection && <SelectionState selection={selection} onSelectionChange={setSelection} />}

          {grouping && <GroupingState grouping={grouping} />}
          {summaryColumns && (
            <SummaryState totalItems={summaryColumns} groupItems={groupSummaryItems} />
          )}
          <IntegratedSorting />
          {selection && <IntegratedSelection />}

          {grouping && <IntegratedGrouping />}
          {summaryColumns && <IntegratedSummary />}
          <VirtualTable
            headComponent={(headProps) => (
              <VirtualTable.TableHead
                {...headProps}
                style={{
                  zIndex: 1000,
                  ...headerStyle,
                }}
              />
            )}
            messages={{ noData: vi.no_data }}
            height={
              heightTable ? heightTable : isFullRow ? "auto" : handleSizeTable(isTablet).height
            }
            cellComponent={(cellProps) => {
              const blankGroupingSubCell = cellProps.column.name === grouping?.[0].columnName;
              const {
                tableRow: { rowId },
                column: { name: columnName },
              } = cellProps;
              const columnStatus =
                typeof rowId === "number" ? props.validationCellStatus?.[rowId]?.[columnName] : "";
              const valid = !columnStatus || columnStatus.isValid;
              const style = {
                ...(!valid ? { border: "1px solid red", marginTop: 2 } : null),
              };
              const title = valid
                ? ""
                : typeof rowId === "number"
                ? props.validationCellStatus?.[rowId][columnName].error
                : "";
              return (
                <VirtualTable.Cell
                  {...cellProps}
                  value={blankGroupingSubCell ? "" : cellProps.value}
                  title={title}
                >
                  {columnName === "rowId" ? (
                    `${rowId}`
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      style={{
                        ...style,
                        ...cellStyle,
                      }}
                    >
                      <Box display="block">{cellProps.children || cellProps.value}</Box>
                    </Box>
                  )}
                </VirtualTable.Cell>
              );
            }}
            rowComponent={(rowProps) => {
              return (
                <TableRow
                  {...rowProps}
                  styleComponent={{
                    ...(rowProps.row.is_printed &&
                      isShowPrintStatus && {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          theme.palette.action.selectedOpacity
                        ),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.dark,
                            theme.palette.action.selectedOpacity
                          ),
                        },
                      }),
                  }}
                />
              );
            }}
            columnExtensions={columnExtensions}
          />
          <TableColumnResizing
            columnWidths={columnWidths}
            minColumnWidth={60}
            onColumnWidthsChange={setColumnWidths}
            defaultColumnWidths={defaultColumnWidths}
          />
          <TableColumnReordering
            order={columnOrders}
            defaultOrder={defaultColumnOrders}
            onOrderChange={setColumnOrders}
          />
          {/* Header */}
          <TableHeaderRow
            showSortingControls
            rowComponent={(restProps) => (
              <TableHeader
                {...restProps}
                sx={
                  headerStyle
                    ? {
                        th: {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                          ),
                          zIndex: 0,
                        },
                      }
                    : undefined
                }
              />
            )}
            cellComponent={({ ...cellProps }) => {
              const columnSortIndex = (columnShowSort || []).findIndex(
                (column) => column.name === cellProps.column?.name
              );
              return (
                <>
                  {columnSortIndex !== -1 ? (
                    <SortHeader
                      tableCellProps={cellProps}
                      columnSortIndex={columnSortIndex}
                      columnShowSort={columnShowSort}
                      setSortInstance={handleChangeOrdering}
                      sortInstance={handleChangeParamsToSortingTable(params?.ordering)}
                    />
                  ) : (
                    headerCellComponent(cellProps)
                  )}
                </>
              );
            }}
          />
          {editInline && <TableEditRow />}
          {editInline && (
            <TableInlineCellEditing startEditAction="doubleClick" selectTextOnEditStart={false} />
          )}
          {editComponent && (
            <TableEditColumn
              showEditCommand
              width={120}
              cellComponent={(cellProps) => {
                if (disableExcuteRowPath) {
                  let children = [...(cellProps.children || ([] as any))];

                  const isDisableExcute = (get(cellProps.row, disableExcuteRowPath) ?? "") !== "";
                  const firstChild = children.shift();
                  children = [
                    {
                      ...firstChild,
                      props: {
                        ...firstChild.props,
                        text: isDisableExcute ? "Đã xử lý" : `Xử lý`,
                      },
                    },
                    ...children,
                  ];
                  return (
                    <TableEditColumn.Cell
                      {...cellProps}
                      style={isDisableExcute ? { opacity: 0.2, pointerEvents: "none" } : undefined}
                    >
                      {children}
                    </TableEditColumn.Cell>
                  );
                }
                return <TableEditColumn.Cell {...cellProps} />;
              }}
              messages={{ editCommand: `Xử lý` }}
              commandComponent={(commandProps) => (
                <Button
                  variant="contained"
                  onClick={commandProps.onExecute}
                  size="small"
                  style={{ boxShadow: "none" }}
                >
                  {commandProps.text}
                </Button>
              )}
            />
          )}
          {selection && <TableSelection showSelectAll={showSelectAll} showSelectionColumn />}
          <TableColumnVisibility
            hiddenColumnNames={hiddenColumnNames}
            defaultHiddenColumnNames={defaultHiddenColumnNames}
          />
          {detailComponent && <RowDetailState />}
          {detailComponent && (
            <TableRowDetail
              toggleColumnWidth={55}
              contentComponent={({ row }) => {
                return detailComponent({ row });
              }}
            />
          )}

          {editComponent && <EditingPopup content={editComponent} />}

          {summaryColumns && (
            <TableSummaryRow
              formatlessSummaryTypes={["total"]}
              itemComponent={
                SummaryColumnsComponent
                  ? (itemProps) => {
                      const summaryItemProps = itemProps as any;
                      return (
                        <SummaryColumnsComponent
                          column={summaryItemProps.children?.props?.column}
                          row={totalRow}
                          value={summaryItemProps.value}
                        />
                      );
                    }
                  : (itemProps) => <TableSummaryRow.Item {...itemProps} />
              }
            />
          )}
          {grouping && (
            <TableGroupRow
              showColumnsWhenGrouped
              cellComponent={(cellProps) => {
                return <SummaryCellComponent {...cellProps} />;
              }}
              contentComponent={(cellProps) => {
                return (
                  <Tooltip title={cellProps.row.value}>
                    <Typography fontWeight={500} fontSize={14} component="span">
                      {cellProps.row.value}
                    </Typography>
                  </Tooltip>
                );
              }}
              summaryCellComponent={(cellProps) => {
                const children = cellProps.children as any;
                const columnName = children?.props?.column.name;
                const row: any = {
                  [children?.props?.column.name]: children.props.columnSummaries[0].value,
                };
                const value = children.props.columnSummaries[0].value;

                return (
                  <TableGroupRow.SummaryCell {...cellProps}>
                    <SummaryLabel>
                      {formatGroupingItem
                        ? formatGroupingItem({ columnName, value, row })
                        : (cellProps.children as any).props.columnSummaries[0].value}
                    </SummaryLabel>
                  </TableGroupRow.SummaryCell>
                );
              }}
            />
          )}
          {!hiddenPagination && (
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
          )}
          <TableFixedColumns
            leftColumns={props.fixLeftColumns}
            rightColumns={props.fixRightColumns}
          />
        </TableGrid>
      </StyledTableContainer>
    </TableWrap>
  );
};

const areEqual = (prevProps: Partial<DGridType>, nextProps: Partial<DGridType>) => {
  if (
    !isEqual(prevProps.columnOrders, nextProps.columnOrders) ||
    !isEqual(prevProps.columnShowSort, nextProps.columnShowSort) ||
    !isEqual(prevProps.columnWidths, nextProps.columnWidths) ||
    !isEqual(prevProps.columns, nextProps.columns) ||
    !isEqual(prevProps.data?.data, nextProps.data?.data) ||
    !isEqual(prevProps.data?.count, nextProps.data?.count) ||
    !isEqual(prevProps.data?.loading, nextProps.data?.loading) ||
    !isEqual(prevProps.grouping, nextProps.grouping) ||
    !isEqual(prevProps.hiddenColumnNames, nextProps.hiddenColumnNames) ||
    !isEqual(prevProps.isFullRow, nextProps.isFullRow) ||
    !isEqual(prevProps.params, nextProps.params) ||
    !isEqual(prevProps.selection, nextProps.selection) ||
    !isEqual(prevProps.totalRow, nextProps.totalRow) ||
    !isEqual(prevProps.columnExtensions, nextProps.columnExtensions)
  ) {
    return false;
  }
  return true;
};

export default memo(TableWrapper, areEqual);

const TableHeader = styled(TableHeaderRow.Row)``;

const SummaryCellComponent = styled(TableGroupRow.Cell)(() => ({
  ".Container-wrapper": {
    backgroundColor: "unset !important",
    zIndex: "1 !important",
  },
}));

const TableRow = styled(VirtualTable.Row, {
  shouldForwardProp: (props) => props !== "styleComponent",
})(({ styleComponent }) => ({
  ...styleComponent,
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
    ".MuiTableCell-head": {
      backgroundColor:
        theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
    },
  },
}));

const TableWrap: any = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "heightTable",
})(({ heightTable }: any) => ({
  "table:nth-child(2)": {
    marginBottom: heightTable === "true" && "0px !important",
  },
}));

const SummaryLabel = styled("p")(({ theme }) => ({
  fontSize: 14,
  //   color: theme.palette.primary.main,
  fontWeight: "bold",
  margin: 0,
}));
