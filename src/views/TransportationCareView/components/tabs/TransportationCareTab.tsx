import { memo, useMemo } from "react";

import useAuth from "hooks/useAuth";

import { TRANSPORTATION_COLUMNS, TRANSPORTATION_STATUS } from "../../constant";

import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import { leadStore } from "store/redux/leads/slice";
import { useTransportationContext } from "views/TransportationCareView/context";
import TransportationContainer from "../../containers/TransportationContainer";
import AttributeTab from "./AttributeTab";
import { isReadAndWriteRole } from "utils/roleUtils";

const TransportationCarePage = ({ tabValue }: { tabValue: string }) => {
  const { user } = useAuth();
  const context = useTransportationContext();
  const leadSlice = useAppSelector(leadStore);

  const tabIndex = useMemo(() => {
    const listStatus = TRANSPORTATION_STATUS;
    const transTabValue = tabValue !== "all" ? tabValue : undefined;
    const statusIndex = listStatus.findIndex((status) => status.value === transTabValue);
    return statusIndex !== -1 ? statusIndex : 0;
  }, [tabValue]);

  const paramsPage = useMemo(() => {
    return {
      ...context?.transportationParams,
      status:
        TRANSPORTATION_STATUS[tabIndex].value != undefined
          ? [TRANSPORTATION_STATUS[tabIndex].value]
          : context?.transportationParams?.status,
      handle_by: context?.transportationParams?.handle_by,
    };
  }, [context?.transportationParams, tabIndex, leadSlice?.attributes]);

  return (
    <div>
      {tabIndex === TRANSPORTATION_STATUS.length - 1 ? (
        <AttributeTab />
      ) : (
        <TransportationContainer
          isEditRow
          isToggleDetail
          isTabAll={TRANSPORTATION_STATUS[tabIndex].value === undefined}
          updateHandleByDisabled={
            !isReadAndWriteRole(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION]?.[
                STATUS_ROLE_TRANSPORTATION.ADD_HANDLE_BY
              ]
            )
          }
          params={paramsPage}
          columns={TRANSPORTATION_COLUMNS}
          columnWidths={context?.transportationCW}
          columnOrders={context?.transportationCO}
          setParams={context?.setTransportationParams}
          hiddenColumnNames={context?.transportationHC}
          setHiddenColumnNames={context?.setTransportationHC}
          setColumnWidths={context?.setTransportationCW}
          setColumnOrders={context?.setTransportationCO}
          setFullRow={context?.setFullTransportation}
          isFullRow={context?.isFullTransportation}
        />
      )}
    </div>
  );
};

export default memo(TransportationCarePage);
