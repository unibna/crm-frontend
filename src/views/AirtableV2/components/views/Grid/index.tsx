import ObjectID from "bson-objectid";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useColumnOrder, useFlexLayout, useResizeColumns, useTable } from "react-table";
import { useSticky } from "react-table-sticky";
import { useVirtual } from "react-virtual";

import { alpha, ClickAwayListener, LinearProgress, Stack, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";

import { GridSizeType } from "_types_/GridLayoutType";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import { AirtableContext } from "../../../context";

import { useAppSelector } from "hooks/reduxHook";
import useContextMenu from "hooks/useContextMenu";
import usePopup from "hooks/usePopup";

import FormDialog from "components/Dialogs/FormDialog";
import { FormInput } from "components/Popups/FormPopup";
import ButtonAddRow from "views/AirtableV2/components/views/Grid/ButtonAddRow";
import {
  TableContainerStyled,
  TableStyled,
} from "views/AirtableV2/components/views/Grid/CommonComponents";
import MenuRowActions from "views/AirtableV2/components/views/Grid/MenuRowActions";
import AttachmentReviewer from "../../AttachmentReviewer";
import FilterSet from "../../Filter/FilterSet";
import Form from "../../Form";
import LinkRecordForm from "../../Form/LinkRecordForm";
import UploadAttachment from "../../UploadAttachment";

import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableData,
  AirTableFieldConfig,
  AirTableOption,
  AirTableRow,
  AirTableView,
  Alignment,
  GridViewPropsType,
  InsertColumnProps,
  ReactTableRowType,
  ROW_HEIGHT_TYPES,
  SelectedCellRangeType,
  SortItem,
} from "_types_/SkyTableType";
import useScrollOnEdges from "hooks/useScrollOnEdges";
import { store } from "store";
import { toastSuccess } from "store/redux/toast/slice";
import {
  checkFilterSet,
  compareFunction,
  getFixedDirection,
  getTotalLeft,
} from "utils/skyTableUtil";
import {
  AirTableRowHeightSizes,
  BEFieldType,
  DefaultData,
  OPTIONS_TYPES,
} from "views/AirtableV2/constants";
import { convertValue, handleKeyDown, scrollToFn } from "views/AirtableV2/utils/gridUtil";
import ButtonScrollToBottom from "./ButtonScrollToBottom";
import GridBody from "./GridBody";
import GridCell from "./GridCell";
import GridColumnFooter from "./GridColumnFooter";
import GridColumnHeader from "./GridColumnHeader";
import GridFooter from "./GridFooter";
import GridHeader from "./GridHeader";
import Toolbar from "./Toolbar";
import { isReadAndWriteRole } from "utils/roleUtils";
import useAuth from "hooks/useAuth";

export default function GridView(props: GridViewPropsType) {
  const {
    columns = [],
    data = [],
    view,
    fieldConfigsObject,
    viewPermission,
    linkTables,
    setLinkTables,
    onChangeColumn,
    onChangeRow,
    onChangeCell,
    onChangeMultiCell,
    onChangeView,
    onDeleteField,
    onDeleteRow,
    onOpenLinkRecordPopup,
    onUpdateTable,
  } = props;

  const {
    ATTACHMENT,
    MULTIPLE_SELECT,
    MULTIPLE_USER,
    LINK_TO_RECORD,
    SINGLE_SELECT,
    SINGLE_USER,
    AUTO_NUMBER,
    CHECKBOX,
  } = AirTableColumnTypes;

  const {
    state: {
      data: { listRecords, detailTable },
      loading,
    },
  } = useContext(AirtableContext);

  const { user } = useAuth();

  const userList = useAppSelector<any>((state) => state.users).users;

  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const theme = useTheme();

  const { dataPopupChild, setDataPopupChild, dataFormChild, closePopupChild } = usePopup();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<any>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const newRecordIdJustAdded = useRef<string>("");
  const lastRowRef = useRef<HTMLElement>();
  const lastColRef = useRef<HTMLElement>();

  const [selection, setSelection] = useState<[string | null, string | null]>([null, null]);
  const [selectedRow, setSelectedRow] = useState<{ [key: string]: string }>({});
  const [selectedCellRange, setSelectedCellRange] = useState<SelectedCellRangeType>({
    columnStart: -1,
    columnEnd: -1,
    rowStart: -1,
    rowEnd: -1,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [fileReviewConfig, setFileReviewConfig] = useState<{
    files: { url: string; id: string; file: string }[];
    currentIndex: number;
    cell?: AirTableCell;
  }>({
    files: [],
    currentIndex: -1,
    cell: undefined,
  });
  const [isNeedScroll, setIsNeedScroll] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<string>("");
  const [linkRecord, setLinkRecord] = useState<{
    recordId: string | undefined;
    tableId: string | undefined;
  }>({
    recordId: "",
    tableId: "",
  });
  const [filter, setFilter] = useState<FilterSet>();
  const [sort, setSort] = useState<SortItem[]>();

  const getEdgeScrollingProps = useScrollOnEdges({ canAnimate: isSelecting });

  useEffect(() => {
    setFilter(view.options?.filterSet);
  }, [view.options?.filterSet]);

  useEffect(() => {
    setSort(view.options?.sortSet);
  }, [view.options?.sortSet]);

  // const ids = useMemo(
  //   () => data.reduce((prev, current) => ({ ...prev, [current.id]: current }), {}),
  //   [data]
  // );

  // const dataTable = useMemo(() => {
  //   if (!view?.options?.rowOrder || !Object.values(ids).length) return data;
  //   return Object.values(view?.options?.rowOrder).map((id: string) => ids[id]);
  // }, [ids, view?.options?.rowOrder]);

  const dataTable = useMemo(() => {
    let temp = data;
    if (columns.length > 0 && filter && filter?.filterSet?.length > 0 && temp.length > 0) {
      temp = data.filter((item) => checkFilterSet(item, filter as any));
    }

    if (columns.length > 0 && sort && sort?.length > 0 && temp.length > 1) {
      temp = temp.sort(compareFunction(columns, sort));
    }

    return temp;
  }, [data, filter, sort, columns]);

  const userOptions: AirTableOption[] = useMemo(
    () =>
      userList.map(
        (item: any) =>
          ({
            ...item,
            label: item.name,
            value: item.id,
            image: item?.image?.url,
          } || [])
      ),
    [userList]
  );

  const detailRecordData = useMemo(
    () => data.find((item) => item.id === recordId),
    [data, recordId]
  );

  const onChange =
    (
      cell: {
        id: string;
        value: any;
      },
      column: AirTableColumn,
      row: AirTableData,
      records: AirTableRow[]
    ) =>
    (newValues: any) => {
      onChangeCell(
        {
          id: cell?.id || new ObjectID().toHexString(),
          field: column.id,
          record: row.id || "",
          table: detailTable?.id || "",
          cell: {
            type: BEFieldType[column.type],
            value: newValues,
          },
        },
        records
      );
      setIsEdit(false);
    };

  const onChangeOptions =
    (id: any) => (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => {
      const index = columns.findIndex((col) => col.id === id);
      if (index !== -1 && columns?.[index]?.options?.choices) {
        (columns[index].options || { choices: [] }).choices = newValue;
        onChangeColumn(columns[index], optional);
      }
    };

  const onAddColumn = (
    column: AirTableColumn,
    optional?: {
      insertColumn: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => {
    const newCol: AirTableColumn = {
      ...column,
      ...(OPTIONS_TYPES.includes(column.type) && {
        options: {
          choices: [],
          choiceOrder: [],
        },
      }),
      ...(column.type === AirTableColumnTypes.CHECKBOX && {
        align: Alignment.CENTER,
      }),
    };

    if (optional) {
      onChangeColumn(newCol, optional);
    } else {
      onChangeColumn(newCol);
      setIsNeedScroll(true);
    }
  };

  const onAddRow = () => {
    const newRow = columns.reduce(
      (prev, current) => ({
        ...prev,
        [current.id]:
          current.type === AirTableColumnTypes.AUTO_NUMBER
            ? data.length + 1
            : DefaultData[current.type],
      }),
      {}
    );

    onChangeRow(newRow, listRecords, {
      action: ({ newRecord }) => {
        newRecordIdJustAdded.current = newRecord?.id;
        store.dispatch(toastSuccess({ message: "Đã thêm 1 dòng" }));
      },
    });
  };

  const onOpenPopup = ({ cell, column, row }: { cell: any; column: AirTableColumn; row: any }) => {
    let funcContentSchema: any;
    let buttonTextPopup = "Upload";
    let defaultData = { files: [], cell, column, row };
    let title = "Attachment";
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "md";

    let newContentRender = (methods: any) => {
      return <UploadAttachment {...methods} />;
    };

    funcContentSchema = (yup: any) => {
      return {
        files: yup.mixed(),
      };
    };

    setDataPopupChild({
      ...dataPopupChild,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isDisabledSubmit,
      isOpenPopup: true,
      title,
      defaultData,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const onContextMenu = (rowId: string) => (e: any) => {
    e.preventDefault();
    handleSelectedRow({ rowId })(true);
    setClicked(true);
    setPoints({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const onToggleHideColumn = (col: AirTableColumn) => {
    const newFieldConfig = view.visible_fields.map((field: AirTableFieldConfig) => ({
      ...field,
      visible: field.field_id === col.id ? false : field.visible,
    }));
    onChangeView({
      ...view,
      visible_fields: newFieldConfig,
    });
  };

  const handleClickCell = (
    e: any,
    { row, col, type }: { row: string; col: string; type: AirTableColumnTypes }
  ) => {
    e.preventDefault();
    if (
      selectedCellRange.columnEnd !== 1 ||
      selectedCellRange.columnStart !== -1 ||
      selectedCellRange.rowStart !== -1 ||
      selectedCellRange.rowEnd !== -1
    ) {
      setSelectedCellRange({
        columnStart: -1,
        columnEnd: -1,
        rowStart: -1,
        rowEnd: -1,
      });
    }
    Object.keys(selectedRow).length > 0 && setSelectedRow({});
    const [rowId, colId] = selection;
    const isMatch = rowId === row && colId === col;

    // TH1: Single Click vào 1 ô khác ô trước đó
    if (!isMatch) {
      setSelection([row, col]);
      if (type === AUTO_NUMBER) {
        isEdit && setIsEdit(false);
        return;
      }
      if (
        [
          ATTACHMENT,
          SINGLE_SELECT,
          SINGLE_USER,
          MULTIPLE_SELECT,
          MULTIPLE_USER,
          LINK_TO_RECORD,
          CHECKBOX,
        ].includes(type)
      ) {
        !isEdit && setIsEdit(true);
        return;
      }
      isEdit && setIsEdit(false);
    }

    // TH2: Single Click vào 1 ô trùng ô trước đó và edit mode = false
    if (isMatch && !isEdit) {
      if (type === AUTO_NUMBER) return;
      setIsEdit(true);
    }
  };

  const handleSubmit = ({ files, column, row, cell }: FormInput) => {
    const newImage = [...(cell?.value || []), ...files];
    onChange(cell, column, row, listRecords)(newImage);
    closePopupChild();
  };

  const handleSelectedRow =
    ({ rowId, isAll }: { rowId?: string; isAll?: boolean }) =>
    (checked: boolean) => {
      if (
        selectedCellRange.columnEnd !== -1 ||
        selectedCellRange.columnStart !== -1 ||
        selectedCellRange.rowEnd !== -1 ||
        selectedCellRange.rowStart !== -1
      ) {
        setSelectedCellRange({
          columnEnd: -1,
          columnStart: -1,
          rowEnd: -1,
          rowStart: -1,
        });
      }
      if (isAll) {
        if (!checked && Object.keys(selectedRow).length > 0) {
          setSelectedRow({});
          return;
        }
        const newSelections = dataTable.reduce(
          (prev: { [key: string]: string }, current: any) => ({
            ...prev,
            [current.id]: current.id,
          }),
          {}
        );
        setSelectedRow(newSelections);
        return;
      }

      if (rowId) {
        if (checked) {
          setSelectedRow({
            ...selectedRow,
            [rowId]: rowId,
          });
          return;
        }
        delete selectedRow[rowId];
        setSelectedRow({ ...selectedRow });
      }
    };

  const handleClickAway = () => {
    const [rowId, colId] = selection;

    const column = columns.find((col) => col.id === colId);

    if (
      rowId &&
      colId &&
      column &&
      [...OPTIONS_TYPES, AirTableColumnTypes.DATETIME, AirTableColumnTypes.DATE].includes(
        column.type
      ) &&
      isEdit
    ) {
      return;
    }
    setSelection([null, null]);
    setIsEdit(false);
    // setSelectedRow({});
  };

  const handleSetAttachmentCurrentIndex = (newCurrentIndex: number) => {
    setFileReviewConfig({
      ...fileReviewConfig,
      currentIndex: newCurrentIndex,
    });
  };

  const handleDeleteAttachment = (id: string) => {
    if (fileReviewConfig.cell) {
      onChangeCell(
        {
          ...fileReviewConfig.cell,
          cell: {
            ...fileReviewConfig.cell.cell,
            value: fileReviewConfig.cell.cell.value?.filter((file: any) => file.id !== id) || [],
          },
        },
        listRecords,
        {
          action: () =>
            setFileReviewConfig({
              currentIndex: -1,
              cell: undefined,
              files: [],
            }),
        }
      );
    }
  };

  const handleCloseDetailRecordDialog = () => {
    setRecordId("");
  };

  const handleCloseDetailLinkRecordDialog = () => {
    setLinkRecord({
      recordId: undefined,
      tableId: undefined,
    });
  };

  const handleSetNewLinkTable = (newLinkTable?: AirTableBase | undefined) => {
    newLinkTable && setLinkTables({ ...linkTables, [newLinkTable?.id]: newLinkTable });
  };

  const defaultColumn = useMemo(
    () => ({
      minWidth: 90,
      width: 90,
      maxWidth: 1000,
    }),
    []
  );

  const convertColumns = useMemo(
    () =>
      columns.map((col, colIndex) => ({
        Header: ({ columnWidth, table }: { columnWidth: number; table: AirTableBase }) => (
          <GridColumnHeader
            column={col}
            table={table}
            columns={columns}
            columnWidth={columnWidth}
            viewPermission={viewPermission}
            onAddColumn={onAddColumn}
            onToggleHideColumn={onToggleHideColumn}
            onChangeColumn={onChangeColumn}
            onDeleteField={onDeleteField}
            onUpdateTable={onUpdateTable}
          />
        ),
        Footer: ({ dataFooter }: any) => <GridColumnFooter column={col} dataFooter={dataFooter} />,

        Cell: ({
          value,
          selection,
          isEdit,
          records,
          column,
          row,
          dataTable,
          view,
        }: {
          value: { id: string; value: any };
          selection: [string | null, string | null];
          isEdit: boolean;
          records: AirTableRow[];
          column: AirTableColumn;
          row: any;
          dataTable: AirTableBase;
          view: AirTableView;
        }) => (
          <GridCell
            col={col}
            colIndex={colIndex}
            value={value}
            selection={selection}
            isEdit={isEdit}
            records={records}
            column={column}
            row={row}
            dataTable={dataTable}
            view={view}
            detailTable={detailTable}
            viewPermission={viewPermission}
            userOptions={userOptions}
            setFileReviewConfig={setFileReviewConfig}
            onOpenPopup={onOpenPopup}
            onChange={onChange}
            onOpenLinkRecordPopup={onOpenLinkRecordPopup}
            setLinkRecord={setLinkRecord}
            onChangeOptions={onChangeOptions}
          />
        ),
        sticky:
          !!view.options?.fixedFields?.includes(col.id) || col.id === detailTable?.primary_key
            ? getFixedDirection(
                view.visible_fields,
                col.id,
                tableContainerRef?.current?.clientWidth || 0
              )
            : "",
        accessor: col.id,
        width: col.width,
        type: col.type,
        options: col.options,
      })),
    [
      columns,
      viewPermission,
      detailTable?.primary_key,
      view.options?.fixedFields,
      view.visible_fields,
      !!tableContainerRef?.current?.clientWidth,
    ]
  );

  const isCheckAll = useMemo(() => {
    if (Object.keys(selectedRow).length > 0) {
      if (selection[0] && selection[1]) {
        setSelection([null, null]);
      }
    }
    return (
      Object.keys(selectedRow).length === dataTable.length &&
      Object.values(selectedRow).every((item) => !!item)
    );
  }, [selectedRow, dataTable]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    visibleColumns = [],
    setHiddenColumns,
    setColumnOrder,
    state: { columnResizing, columnOrder },
  }: any = useTable(
    {
      columns: convertColumns,
      data: [...dataTable],
      defaultColumn,
      initialState: {
        hiddenColumns:
          view?.visible_fields?.reduce((prev: string[], current: AirTableFieldConfig) => {
            if (!current.visible) {
              prev = [...prev, current.field_id];
            }
            return prev;
          }, []) || [],
      },
    },
    useFlexLayout,
    useResizeColumns,
    useSticky,
    useColumnOrder
  );

  const scrollToFnCallback = useCallback(
    scrollToFn({
      tableContainerRef,
      scrollingRef,
    }),
    []
  );

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 1,
    estimateSize: useCallback(
      () => AirTableRowHeightSizes[view?.options?.rowHeight || ROW_HEIGHT_TYPES.SHORT],
      [view?.options?.rowHeight]
    ),
    scrollToFn: scrollToFnCallback,
  });

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const visibleColumnOrder = useMemo(() => {
    return (
      view?.visible_fields?.reduce((prev: string[], field) => {
        if (field.visible) prev = [...prev, field.field_id];
        return prev;
      }, []) || []
    );
  }, [view?.visible_fields]);

  const dataExport = useMemo(() => {

    const columnObject: {[key: string]: AirTableColumn} = columns.reduce(
      (prev, current) => ({ ...prev, [current.id]: current }),
      {}
    );

    const rows = dataTable.map((item: any) => {
      let newItem = visibleColumnOrder.reduce((prev, current) => {
        return {
          ...prev,
          [columnObject?.[current]?.name]: convertValue({ userOptions })(
            item[current]?.value,
            columnObject?.[current]
          ),
        };
      }, {});
      return newItem;
    });

    return rows;
  }, [visibleColumnOrder, dataTable, columns]);

  const disabledFixedFields = useMemo(() => {
    const distances = getTotalLeft(view.visible_fields);
    return Object.keys(distances).filter(
      (item: any) =>
        distances[item] === -1 ||
        distances[item] > (tableContainerRef?.current?.clientWidth || 0) ||
        item === detailTable?.primary_key
    );
  }, [!!tableContainerRef?.current?.clientWidth, view.visible_fields, detailTable?.primary_key]);

  const handleKeyDownCallback = useCallback(
    (e: KeyboardEvent) =>
      handleKeyDown({
        e,
        isEdit,
        selectedCellRange,
        selection,
        selectedRow,
        dataTable,
        visibleColumnOrder,
        columns,
        detailTable,
        viewPermission,
        listRecords,
        userOptions,
        setSelectedCellRange,
        setSelection,
        setIsEdit,
        onChangeCell,
        onChangeMultiCell,
        onChangeColumn,
        user,
      }),
    [
      selection,
      isEdit,
      dataTable,
      visibleColumnOrder,
      selectedRow,
      listRecords,
      selectedCellRange,
      userOptions,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownCallback);

    return () => {
      window.removeEventListener("keydown", handleKeyDownCallback);
    };
  }, [handleKeyDownCallback]);

  const handleMouseMove = (e: any) => {
    if (e.which === 1) {
      if (!isSelecting && selection[0] && selection[1]) {
        e.preventDefault();
        const rowIndex = rows.findIndex(
          (row: ReactTableRowType) => row.original.id === selection[0]
        );
        const columnIndex = visibleColumns.findIndex((column: any) => column.id === selection[1]);
        if (rowIndex !== -1 && columnIndex !== -1) {
          Object.keys(selectedRow).length > 0 && setSelectedRow({});
          setSelectedCellRange({
            columnStart: columnIndex,
            columnEnd: columnIndex,
            rowStart: rowIndex,
            rowEnd: rowIndex,
          });
          setIsSelecting(true);
          setIsEdit(false);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    // Submit form upload attachment
    if (Object.values(dataFormChild).length) {
      handleSubmit(dataFormChild);
    }
  }, [dataFormChild]);

  useEffect(() => {
    // Scroll đến cột mới thêm
    if (isNeedScroll) {
      lastColRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setIsNeedScroll(false);
    }
  }, [columns]);

  useEffect(() => {
    // Có newRecordIdJustAdded.current và dataTable thay đổi -> vừa thêm 1 dòng mới và cần scroll đến dòng đó
    if (newRecordIdJustAdded.current && dataTable.length > 0 && rowVirtualizer) {
      // Scroll đến dòng vừa thêm
      const index = dataTable.findIndex((item) => item.id === newRecordIdJustAdded.current);
      if (index !== -1) {
        rowVirtualizer.scrollToIndex(index);
      }

      // Focus vào dòng mới thêm
      newRecordIdJustAdded.current &&
        setSelectedRow({
          [newRecordIdJustAdded.current]: newRecordIdJustAdded.current,
        });

      newRecordIdJustAdded.current = "";
    }
  }, [!!newRecordIdJustAdded.current]);

  useEffect(() => {
    // Khi visible_fields cập nhật thì cập nhật lại hidden columns
    view.visible_fields &&
      setHiddenColumns(
        view?.visible_fields?.reduce((prev: string[], current: AirTableFieldConfig) => {
          if (!current.visible) {
            prev = [...prev, current.field_id];
          }
          return prev;
        }, []) || []
      );
  }, [view.visible_fields]);

  useEffect(() => {
    // Khi object visible_fields cập nhật thì cập nhật lại column order
    fieldConfigsObject && setColumnOrder(Object.keys(fieldConfigsObject));
  }, [fieldConfigsObject]);

  useEffect(() => {
    // Cập nhật lại column width (call api) khi người dùng vừa resize column
    if (!columnResizing?.isResizingColumn && Object.keys(columnResizing?.columnWidths).length > 0) {
      const [[columnId, originalColumnWidth]] = columnResizing.headerIdWidths;
      const columnWidth = columnResizing.columnWidths[columnId];

      if (originalColumnWidth !== columnWidth && fieldConfigsObject[columnId]) {
        fieldConfigsObject[columnId].width = columnWidth;
        onChangeView({
          ...view,
          visible_fields: Object.values(fieldConfigsObject),
        });
      }
    }
  }, [columnResizing?.isResizingColumn]);

  return (
    <Paper
      title={`${detailTable?.name} - ${view.name}`}
      sx={{
        width: "100%",
        p: 2,
        backgroundColor: alpha(theme.palette.grey[500], 0.1),
        minWidth: "1200px",
      }}
    >
      {/* Note: Không tách dialog ra component riêng để khi người dùng chỉnh sửa form tự render lại */}

      {/* Dialog chi tiết bản ghi của 1 record(row) */}
      <FormDialog
        enableCloseByDropClick
        open={Boolean(recordId)}
        maxWidth="md"
        isShowFooter={false}
        title="Chi tiết bản ghi"
        onClose={handleCloseDetailRecordDialog}
      >
        {loading && <LinearProgress sx={{ mt: 1 }} />}
        <Form
          view={view}
          columns={columns}
          row={detailRecordData}
          records={listRecords}
          tableId={detailTable?.id || ""}
          linkTables={linkTables}
          viewPermission={viewPermission}
          setFileReviewConfig={setFileReviewConfig}
          onChange={onChange}
          onChangeOptions={onChangeOptions}
          onOpenAttachmentPopup={onOpenPopup}
          onOpenLinkRecordPopup={onOpenLinkRecordPopup}
          onOpenLinkRecordFormPopup={setLinkRecord}
        />
      </FormDialog>

      {/* Dialog chi tiết bản ghi của 1 record(row) của bảng được liên kết nếu trong bảng có chứa bảng khác (link to record) */}
      <FormDialog
        enableCloseByDropClick
        isShowFooter={false}
        open={Boolean(linkRecord.recordId)}
        maxWidth="md"
        title="Chi tiết bản ghi"
        onClose={handleCloseDetailLinkRecordDialog}
      >
        {loading && <LinearProgress sx={{ mt: 1 }} />}
        <LinkRecordForm
          tableId={linkRecord.tableId}
          recordId={linkRecord.recordId}
          linkTable={(linkRecord?.tableId && linkTables?.[linkRecord?.tableId]) || undefined}
          mainTable={detailTable as any}
          setLinkTable={handleSetNewLinkTable}
        />
      </FormDialog>

      <AttachmentReviewer
        listFile={fileReviewConfig.files}
        currentIndex={fileReviewConfig.currentIndex}
        setCurrentIndex={handleSetAttachmentCurrentIndex}
        onDelete={handleDeleteAttachment}
      />
      <Toolbar
        view={view}
        sort={sort}
        filter={filter}
        loading={loading}
        columns={columns}
        dataExport={dataExport}
        detailTable={detailTable}
        viewPermission={viewPermission}
        visibleColumns={visibleColumns}
        disabledFixedFields={disabledFixedFields}
        setFilter={setFilter}
        setSort={setSort}
        onChangeView={onChangeView}
        onAddColumn={onAddColumn}
      />

      <TableContainerStyled ref={tableContainerRef} {...getEdgeScrollingProps({ style: {} })}>
        <TableStyled stickyHeader aria-label="sticky table" {...getTableProps()} className="table">
          <GridHeader
            view={view}
            detailTable={detailTable}
            headerGroups={headerGroups}
            isCheckAll={isCheckAll}
            selectedRow={selectedRow}
            columnOrder={columnOrder}
            lastColRef={lastColRef}
            fieldConfigsObject={fieldConfigsObject}
            onSelectedRow={handleSelectedRow}
            onChangeView={onChangeView}
          />
          <ClickAwayListener onClickAway={handleClickAway}>
            <GridBody
              data={data}
              rows={rows}
              view={view}
              isEdit={isEdit}
              isSelecting={isSelecting}
              selection={selection}
              selectedRow={selectedRow}
              linkTables={linkTables}
              listRecords={listRecords}
              detailTable={detailTable}
              viewPermission={viewPermission}
              getTableBodyProps={getTableBodyProps}
              prepareRow={prepareRow}
              newRecordIdJustAdded={newRecordIdJustAdded}
              lastRowRef={lastRowRef}
              virtualRows={virtualRows}
              totalSize={totalSize}
              selectedCellRange={selectedCellRange}
              setSelection={setSelection}
              setIsEdit={setIsEdit}
              setIsSelecting={setIsSelecting}
              setSelectedCellRange={setSelectedCellRange}
              setRecordId={setRecordId}
              onSelectedRow={handleSelectedRow}
              onContextMenu={onContextMenu}
              onClickCell={handleClickCell}
            />
          </ClickAwayListener>
          <GridFooter footerGroups={footerGroups} dataTable={dataTable} rows={rows} />
        </TableStyled>
      </TableContainerStyled>

      <Stack width="100%" alignItems="center" direction="row">
        {isReadAndWriteRole(user?.is_superuser, viewPermission) && (
          <ButtonAddRow onAddRow={onAddRow} />
        )}
        <ButtonScrollToBottom rows={rows} btnRef={btnRef} rowVirtualizer={rowVirtualizer} />
      </Stack>

      {/* Menu context của 1 hàng */}
      {isReadAndWriteRole(user?.is_superuser, viewPermission) && (
        <MenuRowActions
          clicked={clicked}
          points={points}
          records={listRecords}
          selectedRow={selectedRow}
          viewPermission={viewPermission as ROLE_TYPE}
          setSelectedRow={setSelectedRow}
          onChangeRow={onChangeRow}
          onDeleteRow={onDeleteRow}
        />
      )}
    </Paper>
  );
}
