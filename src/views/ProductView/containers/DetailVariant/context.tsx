// Libraries
import { createContext, ReactNode, useState } from "react";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";
import { useParams } from "react-router-dom";

// Constants
import { yyyy_MM_dd } from "constants/time";

// -----------------------------------------------------------------------

const DetailVariantContext = createContext<{
  params: Partial<{
    date_from: string;
    date_to: string;
    dateValue: number;
  }>;
  variantId: string;
  isRefresh: boolean;
  handleRefresh: () => void;
  handleParams: (objParams: Partial<any>) => void;
}>({
  params: {
    dateValue: -1,
    date_from: format(startOfMonth(new Date()), yyyy_MM_dd),
    date_to: format(new Date(), yyyy_MM_dd),
  },
  variantId: "",
  isRefresh: false,
  handleRefresh: () => {},
  handleParams: () => {},
});

const DetailVariantProvider = ({ children }: { children: ReactNode }) => {
  const paramRouter = useParams();
  const [params, setParams] = useState({
    dateValue: -1,
    date_from: format(startOfMonth(new Date()), yyyy_MM_dd),
    date_to: format(new Date(), yyyy_MM_dd),
  });
  const [isRefresh, setRefresh] = useState(false);

  const handleParams = (objParams: Partial<any>) => {
    setParams({
      ...params,
      ...objParams,
    });
  };

  const handleRefresh = () => {
    setRefresh(!isRefresh);
  };

  return (
    <DetailVariantContext.Provider
      value={{
        params,
        variantId: paramRouter.variantId || "",
        isRefresh,
        handleRefresh,
        handleParams,
      }}
    >
      {children}
    </DetailVariantContext.Provider>
  );
};

export { DetailVariantProvider, DetailVariantContext };
