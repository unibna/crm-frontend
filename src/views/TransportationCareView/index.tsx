// Libraries
import { createContext, useContext, useEffect } from "react";

// Components
import { TabRouteWrap } from "components/Tabs";
import AttributeTab from "./components/tabs/AttributeTab";
// Hooks
import useAuth from "hooks/useAuth";

// Contexts
import { AttributeContext } from "contexts/AttributeContext";
import { TransportationProblemContextType, useTransportationContext } from "./context";

// Redux
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { useLocation } from "react-router-dom";
import { getAllAttributesTransporationCare } from "selectors/attributes";
import { updateAttributesTransportationCare } from "store/redux/attributes/slice";
import { TRANSPORTATION_TABS } from "./constant";

export const TransportationContext = createContext<TransportationProblemContextType | null>(null);

const TransportationPage = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const dispatchStore = useAppDispatch();
  const { getTransportationData } = useContext(AttributeContext);
  const { fetched } = useAppSelector((state) =>
    getAllAttributesTransporationCare(state.attributes)
  );

  useEffect(() => {
    // Kiểm tra trong store đã load các thuộc tính của CSVĐ (lý do, hướng xử lý) lên chưa, nếu chưa thì gọi để lấy và cập nhật lại biến fetched
    if (!fetched) {
      getTransportationData();
      dispatchStore(
        updateAttributesTransportationCare({
          fetched: true,
        })
      );
    }
  }, [fetched]);

  return <TabRouteWrap routes={TRANSPORTATION_TABS(user, user?.group_permission?.data)} />;
};

/**
 * @param isRenderOnlyAttributeTab Bằng true sẽ render tab thuộc tính, ngược lại là false hoặc undefined thì render các tab trạng thái CSVĐ
 */

const TransportationCareView = (props: { isRenderOnlyAttributeTab?: boolean }) => {
  return (
    <TransportationContext.Provider
      value={{
        ...useTransportationContext(),
      }}
    >
      {/*  */}
      {props.isRenderOnlyAttributeTab ? <AttributeTab /> : <TransportationPage />}
    </TransportationContext.Provider>
  );
};

export default TransportationCareView;
