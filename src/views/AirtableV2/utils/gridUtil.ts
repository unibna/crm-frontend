import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableData,
  AirTableOption,
  AirTableRow,
  InsertColumnProps,
  SelectedCellRangeType,
} from "_types_/SkyTableType";
import ObjectID from "bson-objectid";
import { KEY_CODE } from "constants/index";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import { dd_MM_yyyy_HH_mm } from "constants/time";
import { store } from "store";
import { toastInfo, toastSuccess } from "store/redux/toast/slice";
import { fDate, fDateTime } from "utils/dateUtil";
import { dateIsValid, easeInOutQuint, formatDuration } from "utils/helpers";
import { BEFieldType } from "../constants";
import { isReadAndWriteRole } from "utils/roleUtils";
import { UserType } from "_types_/UserType";

/**
 * Hàm xử lý khi user nhấn phím
 */
export const handleKeyDown = async ({
  e,
  user,
  isEdit,
  selection,
  selectedRow,
  selectedCellRange,
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
}: {
  e: KeyboardEvent;
  isEdit: boolean;
  selection: [string | null, string | null];
  selectedCellRange: SelectedCellRangeType;
  selectedRow: {};
  dataTable: AirTableData[];
  detailTable?: AirTableBase | null;
  visibleColumnOrder: string[];
  columns: AirTableColumn[];
  viewPermission?: ROLE_TYPE;
  listRecords: AirTableRow[];
  userOptions: AirTableOption[];
  setSelectedCellRange: React.Dispatch<React.SetStateAction<SelectedCellRangeType>>;
  setSelection: React.Dispatch<React.SetStateAction<[string | null, string | null]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeCell: (cell: AirTableCell, records: any[], optional?: any) => void;
  onChangeMultiCell: (cells: AirTableCell[], records: any[], optional?: any) => void;
  onChangeColumn: (
    column: AirTableColumn,
    optional?:
      | {
          insertColumn?: InsertColumnProps | undefined;
          action?: (() => void) | undefined;
          actionSuccess?: (() => void) | undefined;
          actionError?: (() => void) | undefined;
        }
      | undefined
  ) => void;
  user: Partial<UserType> | null;
}) => {
  const {
    ATTACHMENT,
    MULTIPLE_SELECT,
    MULTIPLE_USER,
    LINK_TO_RECORD,
    SINGLE_SELECT,
    SINGLE_USER,
    AUTO_NUMBER,
    CHECKBOX,
    CURRENCY,
    DATE,
    DATETIME,
    DURATION,
    NUMBER,
    PERCENT,
    LONG_TEXT,
  } = AirTableColumnTypes;

  const [rowId, colId] = selection;
  const numRows = dataTable.length;
  const numCols = visibleColumnOrder.length;
  const isNavigating = !!rowId && !!colId;

  const rowIndex = dataTable.findIndex((row: any) => row.id === rowId);
  const colIndex = visibleColumnOrder.indexOf(colId || "");

  const destinationColumn = columns.find((column) => column.id === colId);

  // Kiểm tra có đang edit các cell có dạng input không (tức là không thuộc các type ở dưới)
  const isEditTextCell =
    destinationColumn &&
    ![
      ATTACHMENT,
      SINGLE_SELECT,
      SINGLE_USER,
      MULTIPLE_SELECT,
      MULTIPLE_USER,
      LINK_TO_RECORD,
      CHECKBOX,
    ].includes(destinationColumn.type) &&
    isEdit;

  if (isNavigating && rowId && colId && detailTable) {
    const { key } = e;

    switch (key) {
      case "ArrowUp":
        if (destinationColumn?.type === LONG_TEXT && isEdit) return;
        // Up
        if (rowIndex >= 1) {
          setSelection([dataTable[rowIndex - 1].id || null, colId]);
        }
        break;
      case "ArrowDown":
        if (destinationColumn?.type === LONG_TEXT && isEdit) return;
        // Down
        if (rowIndex < numRows - 1) {
          setSelection([dataTable[rowIndex + 1].id || null, colId]);
        }
        break;
      case "ArrowRight":
        if (destinationColumn?.type === LONG_TEXT && isEdit) return;
        // Right
        if (colIndex < numCols - 1) {
          setSelection([rowId, visibleColumnOrder[colIndex + 1]]);
        }
        break;
      case "ArrowLeft":
        if (destinationColumn?.type === LONG_TEXT && isEdit) return;
        // Left
        if (colIndex >= 1) {
          setSelection([rowId, visibleColumnOrder[colIndex - 1]]);
        }
        break;
      case "Enter":
        // if (isEdit) setIsEdit(false);
        // else if (isNavigating) setIsEdit(true);
        // else if (!isEdit && rowIndex < numRows - 1) {
        //   setSelection([dataTable[rowIndex + 1].id, colId]);
        // }
        break;
      case "Escape":
        // Stop navigating
        if (isEdit) setIsEdit(false);
        else if (isNavigating) setSelection([null, null]);
        break;

      case "Delete":
      case "Backspace":
        // Xoá nhiều cell
        // isEditTextCell => đang edit các cell text, thì tức đang nhập liệu nếu người dùng nhấn Delete hoặc Backspace thì user đang xoá nội dung trong cell đó còn ở đây đang xử lý là xoá toàn bộ nội dung của 1 cell
        if (!isEditTextCell) {
          /**
           * Giải pháp: chuyển tất cả các trường hợp về 1 trường hợp chung để xử lý
           * Ví dụ: trường hợp chọn 1 cell thì suy ra mảng cell được chọn có 1 cell, trường hợp chọn 1 row và bảng đang hiển thị 10 cột thì suy ra mảng cell được chọn có 10 cell
           * trường hợp cuối là bôi đen 1 nhóm cell thì ta xác định mảng cell được chọn có bao nhiêu cell. Sau đó thì xoá các cell trong mảng cell
           * */

          let cells: AirTableCell[] = [];
          // Để lưu ví trí mảng cell bắt đầu từ cột nào và kết thúc ở cột nào, [index của cột bắt đầu, index của cột kết thúc]
          let columnRange: [number, number] | [] = [];
          // Để lưu ví trí mảng cell bắt đầu từ hàng nào và kết thúc ở hàng nào, [index của hàng bắt đầu, index của hàng kết thúc]
          let rowRange: [number, number] | [] = [];

          // TH: Đang chọn 1 cell
          if (selection[0] && selection[1]) {
            let tempRowIndex = dataTable.findIndex((item) => item.id === selection[0]);
            let tempColumnIndex = visibleColumnOrder.indexOf(selection[1]);

            columnRange = [tempColumnIndex, tempColumnIndex];
            rowRange = [tempRowIndex, tempRowIndex];
          }

          // TH: Đang chọn 1 hàng
          if (Object.keys(selectedRow).length === 1) {
            let tempRowIndex = dataTable.findIndex(
              (item) => item.id === Object.keys(selectedRow)[0]
            );
            rowRange = [tempRowIndex, tempRowIndex];
            columnRange = [0, visibleColumnOrder.length - 1];
          }

          const { columnStart, columnEnd, rowStart, rowEnd } = selectedCellRange;

          const isSelectedRange =
            columnStart !== -1 && columnEnd !== -1 && rowEnd !== -1 && rowStart !== -1;
          // TH: Đang chọn 1 nhóm cell
          if (isSelectedRange) {
            columnRange =
              columnStart > columnEnd ? [columnEnd, columnStart] : [columnStart, columnEnd];
            rowRange = rowStart > rowEnd ? [rowEnd, rowStart] : [rowStart, rowEnd];
          }

          // ở đây so sánh rowRange và columnRange bằng 2 hay không là để xác định có rơi vào 3 trường hợp kể trên, tức là đang có mảng cell hợp lệ để xoá
          if (rowRange.length === 2 && columnRange.length === 2) {
            // Duyệt để lấy thông tin của các cell có trong mảng được chọn
            for (let i = rowRange[0]; i <= rowRange[1]; i++) {
              for (let j = columnRange[0]; j <= columnRange[1]; j++) {
                const cellInTable: AirTableData = dataTable[i][visibleColumnOrder[j]];
                if (cellInTable?.id) {
                  cells = [
                    ...cells,
                    // format cell để xoá, để value = null | empty | undefined thì hàm onChangeMultiCell sẽ xoá những cell đó
                    // Note: Nếu cell chưa có nhưng gọi xoá sẽ lỗi nên ta truyền thêm id của cell, nếu cell có id tức là cell đã được tạo trước đó rồi, có thể xoá, còn không có id tức là cell rỗng sẽ bỏ qua không xoá
                    {
                      id: cellInTable?.id || "",
                      field: visibleColumnOrder[j],
                      record: dataTable[rowIndex + i]?.id || "",
                      table: detailTable?.id,
                      cell: {
                        type: "",
                        value: null,
                      },
                    },
                  ];
                }
              }
            }

            const totalCells =
              (columnRange[1] - columnRange[0] + 1) * (rowRange[1] - rowRange[0] + 1);

            onChangeMultiCell(cells, listRecords, {
              message: {
                loading: `Deleting ${totalCells} cell${totalCells > 1 ? "s" : ""}`,
                success: `Deleted ${totalCells} cell${totalCells > 1 ? "s" : ""} successfully`,
                error: `Error in Deleting`,
              },
              action: () => {
                // Sau khi xoá thì bôi đen các cell đã xoá
                setSelectedCellRange({
                  columnStart: colIndex,
                  columnEnd,
                  rowStart: rowIndex,
                  rowEnd,
                });
              },
            });
          }
        }

        break;
      default:
        break;
    }
  }

  if (isReadAndWriteRole(user?.is_superuser, viewPermission)) {
    /**
     * Đoạn code xử lý Copy, Paste
     * Tương tự như trên cũng quy tất cả trường hợp sang 1 trường hợp duy nhất, tìm ra mảng cell cần để copy và paste
     */
    let eventKey = e || window.event;
    let combineKey = eventKey.keyCode;
    let ctrlDown = eventKey.ctrlKey || eventKey.metaKey;

    // Ctrl + C
    if (ctrlDown && combineKey === KEY_CODE.COPY) {
      const { columnStart, columnEnd, rowStart, rowEnd } = selectedCellRange;

      let content: string = "";
      let columnRange: [number, number] | [] = [];
      let rowRange: [number, number] | [] = [];

      if (selection[0] && selection[1]) {
        let tempRowIndex = dataTable.findIndex((item) => item.id === selection[0]);
        let tempColumnIndex = visibleColumnOrder.indexOf(selection[1]);
        columnRange = [tempColumnIndex, tempColumnIndex];
        rowRange = [tempRowIndex, tempRowIndex];
      }

      if (Object.keys(selectedRow).length === 1) {
        let tempRowIndex = dataTable.findIndex((item) => item.id === Object.keys(selectedRow)[0]);
        rowRange = [tempRowIndex, tempRowIndex];
        columnRange = [0, visibleColumnOrder.length - 1];
      }

      const isSelectedRange =
        columnStart !== -1 && columnEnd !== -1 && rowEnd !== -1 && rowStart !== -1;

      if (isSelectedRange) {
        columnRange = columnStart > columnEnd ? [columnEnd, columnStart] : [columnStart, columnEnd];
        rowRange = rowStart > rowEnd ? [rowEnd, rowStart] : [rowStart, rowEnd];
      }

      if (rowRange.length === 2 && columnRange.length === 2) {
        for (let i = rowRange[0]; i <= rowRange[1]; i++) {
          for (let j = columnRange[0]; j <= columnRange[1]; j++) {
            const cellColumn: AirTableColumn | undefined = columns.find(
              (column) => column.id === visibleColumnOrder[j]
            );

            const cellInTable: AirTableData = dataTable[i][visibleColumnOrder[j]];

            switch (cellColumn?.type) {
              case ATTACHMENT:
                dataTable[i][visibleColumnOrder[j]]?.value?.map(
                  (item: { id: string; url: string; file: string }, itemIndex: number) => {
                    content += `${item.file} ${item.id} ${item.url}${
                      itemIndex !== dataTable[i][visibleColumnOrder[j]]?.value?.length - 1
                        ? ","
                        : ""
                    } `;
                  }
                );
                break;

              case MULTIPLE_SELECT:
                const choiceIds: string[] = cellInTable?.value || [];
                let newChoiceNames: string[] = [];
                choiceIds?.map((choiceId) => {
                  const choice = cellColumn?.options?.choices?.find(
                    (choice) => choice.id === choiceId
                  );
                  if (choice) {
                    newChoiceNames = [...newChoiceNames, choice.name];
                  }
                });
                content += choiceIds.join(", ");
                break;

              case MULTIPLE_USER:
                const userIds: string[] = cellInTable?.value || [];
                let newUserNames: string[] = [];
                userIds?.map((userId) => {
                  const user = userOptions?.find((option) => option.id === userId);
                  if (user) {
                    newUserNames = [...newUserNames, user.name];
                  }
                });
                content += userIds.join(", ");
                break;

              case LINK_TO_RECORD:
                const recordContents: {
                  record_id: string;
                  record_display: string;
                }[] = cellInTable?.value || [];

                recordContents?.map((item, itemIndex) => {
                  content += `${item.record_id} ${item.record_display} ${
                    cellColumn.options?.tableLinkToRecordId
                  }${itemIndex !== recordContents.length - 1 ? "," : ""} `;
                });
                break;

              case SINGLE_SELECT:
                const choice = cellColumn?.options?.choices?.find(
                  (item) => item.id === cellInTable?.value
                );
                if (choice) content += `${choice?.name}`;
                break;

              case SINGLE_USER:
                const user = userOptions?.find((item) => item.id === cellInTable?.value);
                if (user) content += `${user?.name}`;
                break;

              default:
                if (cellInTable?.value) content += `${cellInTable?.value}`;
                break;
            }

            if (j !== columnRange[1]) content += "\t";
          }
          if (i !== rowRange[1]) content += "\n";
        }

        const totalCells = (columnRange[1] - columnRange[0] + 1) * (rowRange[1] - rowRange[0] + 1);
        navigator.clipboard.writeText(content);
        store.dispatch(
          toastSuccess({
            message: `Copied ${totalCells} cell${totalCells > 1 ? "s" : ""}`,
          })
        );
      }
    }

    if (
      ctrlDown &&
      combineKey === KEY_CODE.PASTE &&
      destinationColumn &&
      detailTable &&
      !(isEditTextCell && isEdit)
    ) {
      const content = await navigator.clipboard.readText();
      const isParagraph = content.split('"').length === 3;

      let columnEnd = colIndex,
        rowEnd = rowIndex;

      const lines = isParagraph ? [content.split('"')?.[1]] : content.split("\n");

      rowEnd = rowIndex + lines.length - 1;

      let cells: AirTableCell[] = [];

      let columnsNeedUpdateOptions: AirTableColumn[] = [];

      lines.map((line, lineIndex) => {
        const texts = line.split("\t");

        columnEnd = colIndex + texts.length - 1;

        texts.map((text, textIndex) => {
          const cellColumn = columns.find(
            (column) => column.id === visibleColumnOrder[colIndex + textIndex]
          );

          let cellValue: any = text.toString();

          const cellInTable: AirTableData =
            dataTable?.[rowIndex + lineIndex]?.[visibleColumnOrder[colIndex + textIndex]];

          switch (cellColumn?.type) {
            case ATTACHMENT:
              const fileContents = text.split(", ");
              let files: any = [];
              fileContents.map((item) => {
                const [file, id, url] = item.split(" ");
                if (file && id && url) {
                  files = [
                    ...files,
                    {
                      id,
                      url,
                      file,
                    },
                  ];
                }
              });

              cellValue = files;
              break;

            case MULTIPLE_SELECT:
              const choiceNames = text.split(", ");
              let newChoiceIds: string[] = [];

              choiceNames.map((choiceName) => {
                const indexColumn = columnsNeedUpdateOptions.findIndex(
                  (item) => item.id === cellColumn?.id
                );
                if (indexColumn !== -1) {
                  const choice = columnsNeedUpdateOptions[indexColumn]?.options?.choices?.find(
                    (choice) => choice.name === choiceName
                  );
                  if (choice) {
                    newChoiceIds = [...newChoiceIds, choice.id];
                  } else {
                    let choiceId = new ObjectID().toHexString();
                    columnsNeedUpdateOptions[indexColumn] = {
                      ...columnsNeedUpdateOptions[indexColumn],
                      options: {
                        ...columnsNeedUpdateOptions[indexColumn].options,
                        choices: [
                          ...(columnsNeedUpdateOptions[indexColumn].options?.choices || []),
                          { name: choiceName, id: choiceId },
                        ],
                      },
                    };

                    newChoiceIds = [...newChoiceIds, choiceId];
                  }
                } else {
                  const choice = cellColumn?.options?.choices?.find(
                    (choice) => choice.name === choiceName
                  );
                  if (choice) {
                    newChoiceIds = [...newChoiceIds, choice.id];
                  } else {
                    let choiceId = new ObjectID().toHexString();
                    columnsNeedUpdateOptions = [
                      ...columnsNeedUpdateOptions,
                      {
                        ...cellColumn,
                        options: {
                          ...cellColumn.options,
                          choices: [
                            ...(cellColumn.options?.choices || []),
                            { name: choiceName, id: choiceId },
                          ],
                        },
                      },
                    ];
                    newChoiceIds = [...newChoiceIds, choiceId];
                  }
                }
              });
              cellValue = newChoiceIds;
              break;

            case MULTIPLE_USER:
              const userNames = text.split(", ");
              let newUserIds: string[] = [];
              userNames.map((userName) => {
                const user = userOptions?.find((option) => option.name === userName);
                if (user) {
                  newUserIds = [...newUserIds, user.id];
                }
              });
              cellValue = newUserIds;
              break;

            case LINK_TO_RECORD:
              const recordContents = text.split(", ");
              let records: any = [];
              recordContents.map((item) => {
                const [record_id, record_display, table_id] = item.split(" ");
                if (
                  record_id &&
                  record_display === cellColumn.options?.recordDisplay &&
                  table_id === cellColumn.options?.tableLinkToRecordId
                ) {
                  records = [
                    ...records,
                    {
                      record_id,
                      record_display,
                    },
                  ];
                }
              });

              cellValue = records;
              break;

            case SINGLE_SELECT:
              const indexColumn = columnsNeedUpdateOptions.findIndex(
                (item) => item.id === cellColumn?.id
              );

              if (indexColumn !== -1) {
                const choice = columnsNeedUpdateOptions[indexColumn]?.options?.choices?.find(
                  (item) => item.name === text
                );

                if (choice) cellValue = choice.id;
                else {
                  let choiceId = new ObjectID().toHexString();
                  (columnsNeedUpdateOptions[indexColumn] = {
                    ...columnsNeedUpdateOptions[indexColumn],
                    options: {
                      ...columnsNeedUpdateOptions[indexColumn].options,
                      choices: [
                        ...(columnsNeedUpdateOptions[indexColumn].options?.choices || []),
                        { name: text, id: choiceId },
                      ],
                    },
                  }),
                    (cellValue = choiceId);
                }
              } else {
                const choice = cellColumn?.options?.choices?.find((item) => item.name === text);

                if (choice) cellValue = choice.id;
                else {
                  let choiceId = new ObjectID().toHexString();
                  columnsNeedUpdateOptions = [
                    ...columnsNeedUpdateOptions,
                    {
                      ...cellColumn,
                      options: {
                        ...cellColumn.options,
                        choices: [
                          ...(cellColumn.options?.choices || []),
                          { name: text, id: choiceId },
                        ],
                      },
                    },
                  ];
                  cellValue = choiceId;
                }
              }

              break;

            case SINGLE_USER:
              const user = userOptions?.find((item) => item.name === text);
              if (user) cellValue = user.id;
              else {
                cellValue = "";
              }
              break;
            case AUTO_NUMBER:
              cellValue = cellInTable?.value;
              break;
            case CURRENCY:
            case NUMBER:
            case PERCENT:
              cellValue = +text;
              break;
            case CHECKBOX:
              cellValue = !!text;
              break;
            case DATE:
              if (!dateIsValid(new Date(cellValue))) cellValue = "";
              break;
            case DATETIME:
              if (!dateIsValid(new Date(cellValue))) cellValue = "";
              break;
            case DURATION:
              cellValue = formatDuration(cellValue);
              break;
            default:
              break;
          }

          if (
            cellInTable &&
            !(!cellInTable?.value && !cellValue) &&
            cellInTable?.value !== cellValue &&
            cellColumn?.type
          ) {
            cells = [
              ...cells,
              {
                id: cellInTable?.id || new ObjectID().toHexString(),
                field: visibleColumnOrder[colIndex + textIndex],
                record: dataTable[rowIndex + lineIndex]?.id || "",
                table: detailTable?.id,
                cell: {
                  type: BEFieldType[cellColumn?.type],
                  value: cellValue,
                },
              },
            ];
          }
        });
      });
      const totalCells = (columnEnd - colIndex + 1) * (rowEnd - rowIndex + 1);

      onChangeMultiCell(cells, listRecords, {
        message: {
          loading: `Pasting ${totalCells} cell${totalCells > 1 ? "s" : ""}`,
          success: `Paste ${totalCells} cell${totalCells > 1 ? "s" : ""} successfully`,
          error: `Error in Pasting`,
        },
        action: () => {
          if (columnsNeedUpdateOptions.length > 0) {
            Promise.all(
              columnsNeedUpdateOptions.map(async (col) => {
                onChangeColumn(col);
              })
            );
          }
          setSelectedCellRange({
            columnStart: colIndex,
            columnEnd,
            rowStart: rowIndex,
            rowEnd,
          });
        },
      });
    }
  }
};

export const convertValue =
  ({ userOptions }: { userOptions: AirTableOption[] }) =>
  (cellValue: any, column: AirTableColumn) => {
    const {
      ATTACHMENT,
      MULTIPLE_SELECT,
      MULTIPLE_USER,
      LINK_TO_RECORD,
      SINGLE_SELECT,
      SINGLE_USER,
      CHECKBOX,
      DATE,
      DATETIME,
    } = AirTableColumnTypes;
    if (!cellValue) return "";

    let value = cellValue;

    switch (column.type) {
      case LINK_TO_RECORD:
        value = "";
        break;
      case SINGLE_SELECT:
        value = column.options?.choices?.find((choice) => choice.id === value)?.name || "";
        break;
      case MULTIPLE_SELECT:
        value = Array.isArray(value)
          ? value
              .map(
                (item) => column.options?.choices?.find((choice) => choice.id === item)?.name || ""
              )
              .join(" ")
          : "";
        break;

      case ATTACHMENT:
        value = Array.isArray(value) ? value.map((item) => item.url).join(" ") : "";
        break;
      case CHECKBOX:
        value = `${value}`.trim() === "" ? "" : value === "True" || value ? "True" : "False";
        break;
      case SINGLE_USER:
        value = userOptions?.find((user) => user.id === value)?.name || "";
        break;
      case MULTIPLE_USER:
        value = Array.isArray(value)
          ? value.map((item) => userOptions?.find((user) => user.id === item)?.name || "").join(" ")
          : "";
        break;
      case DATE:
        value = (dateIsValid(value) && fDate(value)) || "";
        break;
      case DATETIME:
        value = (dateIsValid(value) && fDateTime(value, dd_MM_yyyy_HH_mm)) || "";
        break;
      default:
        break;
    }
    return value;
  };

export const scrollToFn =
  ({
    tableContainerRef,
    scrollingRef,
  }: {
    tableContainerRef: React.RefObject<HTMLDivElement>;
    scrollingRef: React.MutableRefObject<any>;
  }) =>
  (offset: number, defaultScrollTo?: ((offset: number) => void) | undefined) => {
    const duration = 300;
    const start = tableContainerRef.current?.scrollTop || 0;
    const startTime = (scrollingRef.current = Date.now());

    const run = () => {
      if (scrollingRef.current !== startTime) return;
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = easeInOutQuint(Math.min(elapsed / duration, 1));

      const interpolated =
        offset === 0 ? offset * progress : start + (offset + 300 - start) * progress;

      if (elapsed < duration) {
        defaultScrollTo && defaultScrollTo(interpolated);
        requestAnimationFrame(run);
      } else {
        defaultScrollTo && defaultScrollTo(interpolated);
      }
    };

    requestAnimationFrame(run);
  };
