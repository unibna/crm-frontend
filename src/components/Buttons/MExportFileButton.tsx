import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button, { ButtonProps } from "@mui/material/Button";
import { HeaderType } from "_types_/HeaderType";
import { writeFile } from "utils/xlsxFileUtil";

type Props = Pick<HeaderType, "exportData" | "formatExportFunc" | "exportFileName"> & {
  buttonProps?: ButtonProps;
  label?: string;
};

export const MExportFileButton = ({ label = "Xuất File", ...props }: Props) => {
  const handleEport = () => {
    writeFile({
      defaultData: props.exportData || [],
      formatExportFunc: props.formatExportFunc,
      fileName: props.exportFileName,
    });
  };
  return (
    <Button
      {...props.buttonProps}
      onClick={handleEport}
      variant="outlined"
      disabled={!props.exportData.length}
      style={{ paddingTop: 6, paddingBottom: 6 }}
    >
      <ExitToAppIcon style={{ fontSize: 20, marginRight: 4 }} />
      {label}
    </Button>
  );
};
