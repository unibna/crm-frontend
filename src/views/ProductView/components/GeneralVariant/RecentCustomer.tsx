// Libraries
import map from "lodash/map";

// Components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ColumnHandlePhone from "components/DataGrid/components/ColumnHandlePhone";

// Constants & Utils
import { fValueVnd } from "utils/formatNumber";

// ------------------------------------------------------

const RecentCustomer = ({
  data = [],
}: {
  data: { name: string; phone: string; revenue: number }[];
}) => {
  return (
    <Card sx={{ minHeight: 480 }}>
      <CardHeader title="Top khách hàng mua nhiều nhất" subheader={`${data.length} khách hàng`} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {data.length ? (
          map(data, (item, index) => (
            <Stack direction="row" alignItems="center" key={index}>
              <Avatar
                src={`https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_${
                  index + 1
                }.jpg`}
                sx={{ width: 48, height: 48 }}
              />

              <Box sx={{ flexGrow: 1, ml: 2, minWidth: 100 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }} noWrap>
                  {item.name}
                </Typography>

                <ColumnHandlePhone value={item.phone} />
              </Box>

              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                {fValueVnd(item.revenue)}
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

export default RecentCustomer;
