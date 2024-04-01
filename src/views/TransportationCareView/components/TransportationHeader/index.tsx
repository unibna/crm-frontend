// Libraries
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import Button from "@mui/material/Button";
import { useState } from "react";

// Components
import { HeaderTableWrapper } from "components/Tables/HeaderWrapper";

// Utils & Constants
import { HeaderType } from "_types_/HeaderType";
import { TransportationCareFilterProps, TransportationOrderType } from "_types_/TransportationType";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import {
  EXPORT_DATA_TO_GMAIL_KEY,
  transportationFilterChipOptions,
  transportationFilterOptions,
} from "views/TransportationCareView/constant";

// Redux
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { getAllAttributesTransporationCare } from "selectors/attributes";
import { leadStore } from "store/redux/leads/slice";
import { userStore } from "store/redux/users/slice";

// Services
import { Drawer, Grid } from "@mui/material";
import { orderApi } from "_apis_/order.api";
import Report from "../Report";

interface Props extends Partial<HeaderType>, Partial<TransportationCareFilterProps> {
  reportBy?: (value: string | number | (string | number)[]) => void;
  filterTrackingCompany?: (value: string | number | (string | number)[]) => void;
  refreshData?: () => void;
  reportByDefault?: (string | number)[] | number | string;
  isTabAll?: boolean;
  onSearch?: (value: string) => void;
  exportData?: TransportationOrderType[];
  isReport?: boolean;
  isExport?: boolean;
  filterColumns?: boolean;
  onToggleColumns?: (columns: string[]) => void;
  formatExportFunc?: (item: any) => any;
  isShowRevenue?: boolean;
  setShowRevenue?: (checked: boolean) => void;
  setFullRow?: React.Dispatch<React.SetStateAction<boolean>>;
  setParams?: (params: any) => void;
  isImportExcel?: boolean;
}

const TransportationHeader = (props: Props) => {
  const [filterChipCount, setFilterChipCount] = useState(0);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { user } = useAuth();
  const userSlice = useAppSelector(userStore);
  const leadSlice = useAppSelector(leadStore);

  const attributesTransporationCare = useAppSelector((state: any) =>
    getAllAttributesTransporationCare(state.attributes)
  );

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

  return (
    <HeaderTableWrapper.GridWrapHeaderPage
      params={props.params}
      onSearch={props.onSearch}
      searchPlacehoder="Nhập SĐT, mã vận đơn, mã đơn hàng"
      onRefresh={props.refreshData}
      columns={props.columns}
      setParams={props.setParams}
      formatExportFunc={props.formatExportFunc}
      filterChipCount={filterChipCount}
      setFilterCount={setFilterChipCount}
      setHiddenColumnNames={props.setHiddenColumnNames}
      hiddenColumnNames={props.hiddenColumnNames}
      exportData={props.exportData}
      exportFileName={props.exportFileName}
      exportFileToEmailProps={{
        service: orderApi,
        endpoint: "report/transportation-care/export",
        keysMap: EXPORT_DATA_TO_GMAIL_KEY,
      }}
      setFullRow={props.setFullRow}
      isFullRow={props.isFullRow}
      onClearFilter={(keys) => {
        const newParams = clearParamsVar(keys, props.params);
        props.setParams && props.setParams(newParams);
        setFilterChipCount(0);
      }}
      onDeleteFilter={(type: string, value: string | number) => {
        handleDeleteParam(props.params || {}, { type, value }, props.setParams);
      }}
      filterOptions={transportationFilterOptions({
        userSlice,
        leadSlice,
        attributesTransporationCare,
        ...props,
      })}
      filterChipOptions={transportationFilterChipOptions({
        userSlice,
        leadSlice,
        attributesTransporationCare,
        ...props,
      })}
      rightChildren={
        <Grid item>
          <Button variant="contained" onClick={toggleDrawer} sx={{ bgcolor: "error.main" }}>
            <RecentActorsIcon style={{ marginRight: 4 }} />
            Báo cáo chia số
          </Button>
        </Grid>
      }
      {...props}
    >
      <Drawer
        anchor={"right"}
        open={isOpenDrawer}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: `${window.innerWidth > 1000 ? 1000 : window.innerWidth - 200}px`,
            "& .MuiPaper-root": {
              overflowY: "auto",
            },
          },
        }}
      >
        <Report isHiddenDimension />
      </Drawer>
    </HeaderTableWrapper.GridWrapHeaderPage>
  );
};

export default TransportationHeader;
