//hooks
import { useNavigate, useParams } from "react-router-dom";
import useQuery from "hooks/useQuery";
import { useState } from "react";

//components
import Box from "@mui/material/Box";
import OrderDetail from "./OrderDetail";

//utils
import { HEADER_PAGE_HEIGHT } from "constants/index";
import { BOTTOM_PAGE_HEIGHT } from "utils/tableUtil";
import { Page } from "components/Page";

const OrderDetailPage = () => {
  const { id } = useParams();
  let query = useQuery();
  const sourceName = query.get("sourceName");
  const ecommerceCode = query.get("ecommerceCode") || "";

  const [isFullPage, setIsFullPage] = useState(false);

  const navigate = useNavigate();
  return (
    <Page title={`Chi tiết đơn hàng`} className="order-detail-page">
      <Box
        display="flex"
        flexDirection="column"
        overflow="auto"
        sx={{
          ".MuiDialogContent-root": {
            overflowY: isFullPage ? "unset" : "auto",
          },
        }}
        height={
          isFullPage
            ? undefined
            : [
                `calc(100vh - 16px - ${HEADER_PAGE_HEIGHT}px - ${BOTTOM_PAGE_HEIGHT}px)`, //xs
                `calc(100vh - 16px - ${HEADER_PAGE_HEIGHT}px - ${BOTTOM_PAGE_HEIGHT}px)`, //sm
                `calc(100vh - 16px - ${HEADER_PAGE_HEIGHT}px - ${BOTTOM_PAGE_HEIGHT}px)`, //md
                `calc(100vh - 16px - ${BOTTOM_PAGE_HEIGHT}px)`, //lg
              ]
        }
      >
        <OrderDetail
          open
          row={{ id, source: { id: 0, name: sourceName || "" }, ecommerce_code: ecommerceCode }}
          isPage
          onClose={() => navigate(-1)}
          isFullPage={isFullPage}
          onFullPage={() => setIsFullPage((prev) => !prev)}
        />
      </Box>
    </Page>
  );
};

export default OrderDetailPage;
