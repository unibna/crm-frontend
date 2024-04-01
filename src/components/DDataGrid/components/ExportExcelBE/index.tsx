// Libraries
import usePopup from "hooks/usePopup";

// Components
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { MButton } from "components/Buttons";

// Constants & Utils
import vi from "locales/vi.json";
import { statusNotification } from "constants/index";
import { useState } from "react";

const ExportExcelBE = ({
  disabled = false,
  label = vi.export_excel,
  params = {},
  services = "",
  endpoint = "",
  keysMap,
}: {
  disabled?: boolean;
  label?: string;
  params?: Partial<any>;
  services: any;
  endpoint: string;
  keysMap: { [key: string]: string };
}) => {
  const { setNotifications } = usePopup();
  const [isLoading, setLoading] = useState(false);

  const exportFile = async () => {
    setLoading(true);

    const result = await services.get({
      endpoint,
      params: { keys_map: JSON.stringify(keysMap), ...params },
    });

    if (result && result.data) {
      setNotifications({
        message: "Xuất excel thành công",
        variant: statusNotification.SUCCESS,
      });
    } else {
      setNotifications({
        message: "Xuất excel thất bại",
        variant: statusNotification.ERROR,
      });
    }

    setLoading(false);
  };

  return (
    <Tooltip title={vi.export_excel}>
      <Box>
        <MButton
          variant="outlined"
          disabled={isLoading || disabled}
          color="warning"
          onClick={exportFile}
          isLoading={isLoading}
        >
          <ExitToAppIcon style={iconStyle} />
          {label}
        </MButton>
      </Box>
    </Tooltip>
  );
};

export default ExportExcelBE;

const iconStyle: React.CSSProperties = { fontSize: 20, marginRight: 4 };
