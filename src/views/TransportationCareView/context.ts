import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ROLE_TAB, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useState } from "react";
import { leadStore } from "store/redux/leads/slice";
import { isReadAndWriteRole } from "utils/roleUtils";
import { TRANSPORTATION_COLUMNS, TRANSPORTATION_COLUMN_WIDTHS } from "./constant";

const DEFAULT_HIDDEN_SOURCES = ["tiki", "lazada", "shopee", "tiktok shop", "offline", "other"];

export const initTransportationParams = {
  limit: 200,
  page: 1,
  ordering: "-created",
};

export interface TransportationProblemContextType {
  transportationHC: string[];
  setTransportationHC: Dispatch<SetStateAction<string[]>>;
  transportationCO: string[];
  setTransportationCO: Dispatch<SetStateAction<string[]>>;
  transportationParams: any;
  setTransportationParams: Dispatch<SetStateAction<any>>;
  isFullTransportation: boolean;
  setFullTransportation: Dispatch<SetStateAction<boolean>>;
  transportationCW: TableColumnWidthInfo[];
  setTransportationCW: React.Dispatch<React.SetStateAction<TableColumnWidthInfo[]>>;
}

export const useTransportationContext = (): TransportationProblemContextType => {
  let transportationStorage;

  const leadSlice = useAppSelector(leadStore);

  const { user } = useAuth();

  const isLeader = isReadAndWriteRole(user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION]?.[
      STATUS_ROLE_TRANSPORTATION.ADD_HANDLE_BY
    ]
  );

  const [transportationParams, setTransportationParams] = useState({
    ...initTransportationParams,
    handle_by: isLeader ? undefined : [user?.id],
    source: leadSlice.attributes.channel
      .filter((item) => !DEFAULT_HIDDEN_SOURCES.includes(item.name.toLowerCase()))
      .map((item) => `${item.id}`),
  });

  const [transportationHC, setTransportationHC] = useState<string[]>(
    transportationStorage && JSON.parse(transportationStorage).columnsHidden
      ? JSON.parse(transportationStorage).columnsHidden
      : []
  );

  const [transportationCO, setTransportationCO] = useState<string[]>(
    transportationStorage && JSON.parse(transportationStorage)?.columnsOrder
      ? JSON.parse(transportationStorage).columnsOrder
      : TRANSPORTATION_COLUMNS.map((item) => item.name)
  );

  const [isFullTransportation, setFullTransportation] = useState(false);

  const [transportationCW, setTransportationCW] = useState<TableColumnWidthInfo[]>(
    transportationStorage &&
      JSON.parse(transportationStorage)?.columnWidths?.length ===
        TRANSPORTATION_COLUMN_WIDTHS.length
      ? JSON.parse(transportationStorage).columnWidths
      : TRANSPORTATION_COLUMN_WIDTHS
  );

  return {
    transportationCW,
    setTransportationCW,
    transportationHC,
    setTransportationHC,
    transportationCO,
    setTransportationCO,
    transportationParams,
    setTransportationParams,
    isFullTransportation,
    setFullTransportation,
  };
};
