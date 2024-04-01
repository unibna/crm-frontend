import { Page } from "components/Page";
import { TabRouteWrap } from "components/Tabs";
import { AttributeContext } from "contexts/AttributeContext";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { FunctionComponent, useContext, useEffect } from "react";
import { getAllAttributesTransporationCare } from "selectors/attributes";
import { getListSupplier, updateAttributesTransportationCare } from "store/redux/attributes/slice";
import { TAB_HEADER_ATTRIBUTE } from "./constants";

const AttributeView: FunctionComponent = () => {
  const { user } = useAuth();
  const dispatchStore = useAppDispatch();
  const { getTransportationData } = useContext(AttributeContext);
  const { fetched: fetchedTCData } = useAppSelector((state) =>
    getAllAttributesTransporationCare(state.attributes)
  );

  useEffect(() => {
    if (!fetchedTCData) {
      getTransportationData();
      dispatchStore(
        updateAttributesTransportationCare({
          fetched: true,
        })
      );
    }
  }, [fetchedTCData, dispatchStore, getTransportationData]);

  useEffect(() => {
    getListSupplier();
  }, []);

  return <TabRouteWrap routes={TAB_HEADER_ATTRIBUTE(user, user?.group_permission?.data)} />;
};

const Components: FunctionComponent = (props) => {
  return (
    <Page title="Thuộc tính">
      <AttributeView {...props} />
    </Page>
  );
};

export default Components;
