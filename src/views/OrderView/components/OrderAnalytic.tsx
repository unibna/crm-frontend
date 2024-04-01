// @mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// utils
import { fNumber } from "../../../utils/formatNumber";

// icons
import Iconify from "components/Icons/Iconify";

// ----------------------------------------------------------------------

type Props = {
  icon: string;
  title: string;
  total: number;
  percent: number;
  price: number;
  color?: string;
};

function OrderAnalytic({ title, total, icon, color, percent, price }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: "relative" }}>
        <Iconify icon={icon} sx={{ color, width: 24, height: 24, position: "absolute" }} />

        <CircularProgress
          variant="determinate"
          value={percent}
          size={56}
          thickness={4}
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={4}
          sx={{ color: "grey.50016", position: "absolute", top: 0, left: 0, opacity: 0.48 }}
        />
      </Stack>

      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="subtitle2">
          {fNumber(total)}{" "}
          <Box component="span" sx={{ color: "text.secondary", typography: "body2" }}>
            Đơn
          </Box>
        </Typography>
      </Stack>
    </Stack>
  );
}

export default OrderAnalytic;
