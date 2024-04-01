import Grid from "@mui/material/Grid";
import { HeaderTableWrapper, GridWrapHeaderProps } from "components/Tables/HeaderWrapper";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { memo, useState } from "react";
import { userStore } from "store/redux/users/slice";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import {
  CollationFilter,
  collationChipOptions,
  collationOptions,
} from "views/AccountantView/constants/utils";
import ImportPaymentModal from "./ImportPaymentModal";

export interface CollationProps extends CollationFilter, Partial<GridWrapHeaderProps> {
  isSearchInput?: boolean;
  isImportFile?: boolean;
  tableTitle?: string;
  setParams: (payload: any) => void;
}

const CollationHeader = (props: CollationProps) => {
  const {
    setParams,
    params,
    onRefresh,
    formatExportFunc,
    // isFilterAmount,
    // isFilterReceivedDate,
    // isFilterUploadBy,
    tableTitle,
  } = props;

  const { user } = useAuth();
  const userSlice = useAppSelector(userStore);
  const [filterCount, setFilterCount] = useState(0);

  return (
    <HeaderTableWrapper.GridWrapHeaderPage
      filterChipCount={filterCount}
      filterOptions={collationOptions({
        users: userSlice.activeUsers,
        setParams,
        isFilterAmount: true,
        isFilterReceivedDate: true,
        isFilterUploadBy: true,
        isFilterUploadTime: true,
        params,
      })}
      tableTitle={tableTitle}
      user={user}
      rightChildren={
        <>
          <ImportPayment onRefresh={onRefresh} visibled />
        </>
      }
      filterChipOptions={collationChipOptions({ users: userSlice.activeUsers })}
      setFilterCount={setFilterCount}
      onClearFilter={(keys) => {
        const newParams = clearParamsVar(keys, params);
        setParams?.(newParams);

        setFilterCount?.(0);
      }}
      onDeleteFilter={(type, value) => handleDeleteParam(params || {}, { type, value }, setParams)}
      formatExportFunc={formatExportFunc}
      {...props}
    ></HeaderTableWrapper.GridWrapHeaderPage>
  );
};

export default memo(CollationHeader);

const ImportPayment = ({ visibled, onRefresh }: { visibled?: boolean; onRefresh?: () => void }) => {
  return visibled ? (
    <Grid item>
      <ImportPaymentModal handleRefresh={onRefresh} />
    </Grid>
  ) : null;
};
