// Libraries
import { FunctionComponent, useContext, useEffect } from "react";
import reduce from "lodash/reduce";

// Services
import { orderApi } from "_apis_/order.api";

// Hooks
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import {
  ReportOrderContext,
  ReportOrderProvider,
} from "views/AccountantView/containers/ReportOrderDetail/context";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { TAB_HEADER_REPORT_ORDER_DETAIL } from "views/AccountantView/constants";

// -----------------------------------------------------------------

const ReportOrderDetailView: FunctionComponent = () => {
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const { updateTags } = useContext(ReportOrderContext);

  useEffect(() => {
    getListTag();
  }, []);

  const getListTag = async () => {
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "tag/",
      params: { limit: 200, page: 1, cancelToken: newCancelToken() },
    });

    if (result.data) {
      const newData = getObjectPropSafely(() => result.data.results.length)
        ? reduce(
            result.data.results,
            (prevArr, current: { is_shown: boolean; name: string; id: number }) => {
              return current.is_shown
                ? [
                    ...prevArr,
                    {
                      label: current.name,
                      value: current.id,
                    },
                  ]
                : prevArr;
            },
            []
          )
        : [];

      updateTags({
        tags: newData,
      });
    }
  };

  return (
    <TabRouteWrap
      title="Báo cáo đơn hàng chi tiết"
      routes={TAB_HEADER_REPORT_ORDER_DETAIL(user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <ReportOrderProvider>
      <ReportOrderDetailView {...props} />
    </ReportOrderProvider>
  );
};

export default Components;
