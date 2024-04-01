// Libraries
import map from "lodash/map";
import { useTheme } from "@mui/material/styles";

// Components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

// Constants & Utils
import { OrderType } from "_types_/OrderType";
import { fValueVnd } from "utils/formatNumber";
import { fDate } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// ------------------------------------------------------

const RecentOrder = ({ data }: { data: OrderType[] }) => {
  const theme = useTheme();

  return (
    <Card sx={{ minHeight: 480 }}>
      <CardHeader title="Đơn hàng gần đây" subheader={`${data.length} đơn hàng`} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {data.length ? (
          map(data, (item, index) => (
            <Stack direction="row" alignItems="center" key={index}>
              <Box sx={{ flexGrow: 1, ml: 1, minWidth: 100 }}>
                <Link
                  variant="body2"
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{ cursor: "pointer" }}
                  href={`${window.location.origin}/orders/${item?.id}`}
                  color={theme.palette.info.main}
                >
                  {getObjectPropSafely(() => item.order_key)}
                </Link>

                <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                  {fDate(item.created)}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                {fValueVnd(item.total_actual || 0)}
              </Typography>
            </Stack>
          ))
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="space-around">
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              Không có khách hàng
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default RecentOrder;
