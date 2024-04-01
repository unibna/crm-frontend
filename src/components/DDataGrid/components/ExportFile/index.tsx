// Libraries
import FileSaver from "file-saver";
import XLSX from "xlsx";

// Components
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import vi from "locales/vi.json";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const ExportFile = ({
  defaultData,
  disabled = false,
  label = "Xuất file",
  tooltipText = "",
  hideTooltip = false,
  fileName,
}: {
  defaultData: any[];
  disabled?: boolean;
  label?: string;
  tooltipText?: string;
  hideTooltip?: boolean;
  fileName?: string;
}) => {
  const exportFile = () => {
    const ws = XLSX.utils.json_to_sheet(defaultData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, (fileName || "sheetjs") + fileExtension);
  };

  return (
    <Tooltip title={hideTooltip ? "" : tooltipText || vi.export_excel}>
      <Button variant="outlined" onClick={exportFile} disabled={disabled}>
        <ExitToAppIcon style={iconStyle} />
        {label}
      </Button>
    </Tooltip>
  );
};

export default ExportFile;

const iconStyle: React.CSSProperties = { fontSize: 20, marginRight: 4 };
