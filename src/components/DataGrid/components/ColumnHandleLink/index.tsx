// Libraries
import { useState } from "react";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

// Services
import { orderApi } from "_apis_/order.api";

// Components
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LoadingModal from "components/Loadings/LoadingModal";

// Types
import { OrderType } from "_types_/OrderType";

// Utils
import { Stack } from "@mui/material";
import { CopyIconButton } from "components/Buttons";
import { statusNotification } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -----------------------------------------------

const ColumnHandleLink = ({
  valueColumn,
  columnTitle,
}: {
  columnTitle?: string;
  valueColumn: { props: Partial<any>; value: string };
}) => {
  const [isLoading, setLoading] = useState(false);
  const { newCancelToken } = useCancelToken();
  const { setNotifications } = usePopup();
  const { isShowCopy = true } = valueColumn?.props || {};

  const handleClickLink = async () => {
    const params = {
      search: valueColumn.value,
    };
    setLoading(true);

    const result = await orderApi.get<OrderType>({
      params: {
        ...params,
        cancelToken: newCancelToken(),
      },
      endpoint: "get/all/",
    });

    if (result.data) {
      const { results } = result?.data;
      if (getObjectPropSafely(() => results[0]?.id)) {
        window.open(
          `${
            getObjectPropSafely(() => valueColumn.props.domain) ||
            `${window.location.origin}/orders/`
          }${results[0]?.id}`,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        setNotifications({
          variant: statusNotification.ERROR,
          message: `${columnTitle} không tồn tại`,
        });
      }
    }

    setLoading(false);
  };

  return (
    <Stack direction="row" alignItems="center" position="relative">
      {!!valueColumn.value && isShowCopy && (
        <CopyIconButton
          value={
            getObjectPropSafely(() => valueColumn.props.isCallApi)
              ? valueColumn.value
              : getObjectPropSafely(() => valueColumn.props.title)
          }
          iconStyle={{ fontSize: 12 }}
        />
      )}
      {getObjectPropSafely(() => valueColumn.props.isCallApi) ? (
        <Grid sx={{ position: "relative" }}>
          <Link
            onClick={handleClickLink}
            sx={{ display: "flex", alignItems: "center" }}
            component="button"
          >
            {valueColumn.value}
          </Link>
          {isLoading && <LoadingModal size={13} />}
        </Grid>
      ) : (
        <Link
          variant="subtitle1"
          {...getObjectPropSafely(() => valueColumn.props)}
          target="_blank"
          rel="noreferrer"
          underline="hover"
          sx={{ cursor: "pointer" }}
        >
          {getObjectPropSafely(() => valueColumn.props.title) ||
            getObjectPropSafely(() => valueColumn.value)}
        </Link>
      )}
    </Stack>
  );
};

export default ColumnHandleLink;
