import FileSaver from "file-saver";
import map from "lodash/map";

import XLSX from "xlsx";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export const writeFile = ({
  defaultData,
  formatExportFunc,
  fileName,
}: {
  fileName?: string;
} & FormatFile) => {
  const data = formatFile({ defaultData, formatExportFunc });
  /* generate XLSX file and send to client */
  // XLSX.writeFile(wb, "sheetjs.xlsx");
  FileSaver.saveAs(data, fileName || "sheetjs" + fileExtension);
};

export const readFile = (file: File, callbackData: (data: any[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    /* Parse data */
    const ab = e.target.result;
    const wb = XLSX.read(ab, {
      type: "array",
    });
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
    /* Update state */
    callbackData(data);
    // setData(data);
    // setCols(make_cols(ws["!ref"]));
  };
  reader.readAsArrayBuffer(file);
};

type FormatFile = {
  defaultData: any[];
  formatExportFunc?: (item: any) => any;
};
export const formatFile = ({ defaultData, formatExportFunc }: FormatFile) => {
  /* convert state to workbook */
  // const ws = XLSX.utils.aoa_to_sheet(defaultData);
  const formatData = map(defaultData, (item) => (formatExportFunc ? formatExportFunc(item) : item));
  const ws = XLSX.utils.json_to_sheet(formatData);
  // const wb = XLSX.utils.book_new();
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
    bookSST: true,
    cellStyles: true,
  });
  const data = new Blob([excelBuffer], { type: fileType });
  /* generate XLSX file and send to client */
  // XLSX.writeFile(wb, "sheetjs.xlsx");
  return data;
};
