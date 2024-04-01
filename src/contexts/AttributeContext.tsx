import map from "lodash/map";
import { createContext, FC } from "react";
import {
  getListTransporationCareAction,
  getListTransporationCareReason,
} from "store/redux/attributes/slice";
import { TransportationCareTaskType } from "_types_/TransportationType";
import { useAppSelector } from "hooks/reduxHook";
import { getAllKeyMapReport } from "selectors/attributes";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

export const AttributeContext = createContext<{
  getTransportationData: () => void;
  convertDescription: (keyName: string) => string;
  convertTitle: (keyName: string) => string;
}>({
  getTransportationData: () => {},
  convertDescription: () => "",
  convertTitle: () => "",
});

export const AttributeProvider: FC = ({ children }) => {
  const keyMapReport = useAppSelector((state) => getAllKeyMapReport(state.attributes));

  const getTransportationData = () => {
    map(TransportationCareTaskType, (item) => {
      getListTransporationCareReason(item);
      getListTransporationCareAction(item);
    });
  };

  const convertDescription = (keyName: string) => {
    return getObjectPropSafely(() => keyMapReport[keyName].description) || "";
  };

  const convertTitle = (keyName: string) => {
    return getObjectPropSafely(() => keyMapReport[keyName].name) || "";
  };

  return (
    <AttributeContext.Provider value={{ getTransportationData, convertDescription, convertTitle }}>
      {children}
    </AttributeContext.Provider>
  );
};
