import React from "react";
import { readFile } from "utils/xlsxFileUtil";
import map from "lodash/map";

const SheetJSFT = map(
  [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm",
  ],
  (x) => `.${x}`
).join(",");

export const MImportFileButton = ({
  handleImportFile,
}: {
  handleImportFile: (data: [string][]) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      readFile(files[0], handleImportFile);
    }
  };

  return (
    <div className="form-group">
      <input
        type="file"
        className="form-control"
        id="file"
        aria-label="Chọn file"
        accept={SheetJSFT}
        onChange={handleChange}
      />
    </div>
  );
};
