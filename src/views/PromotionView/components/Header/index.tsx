import { Column } from "@devexpress/dx-react-grid";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { HeaderType } from "_types_/HeaderType";
import { PromotionType } from "_types_/PromotionType";
import vi from "locales/vi.json";
import { MButton } from "components/Buttons";
import { HeaderTableWrapper } from "components/Tables/HeaderWrapper";
import { useAppSelector } from "hooks/reduxHook";
import { useState } from "react";
import { userStore } from "store/redux/users/slice";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import { promotionFilterChipOptions, promotionFilterOptions } from "views/PromotionView/constants";

export interface PromotionHeaderProps extends Partial<HeaderType> {
  tabName: "INACTIVED" | "ACTIVED" | "DEACTIVED" | "ALL";
  onRefresh?: () => void;
  formatExportFunc?: (item: any) => any;
  onSearch?: (value: string) => void;
  exportData?: PromotionType[];
  isExport?: boolean;
  columns?: Column[];
  hiddenColumns?: string[];
  filterColumns?: boolean;
  setHiddenColumnNames: React.Dispatch<React.SetStateAction<string[]>>;
  onCreatePromotion?: () => void;

  isFilterDate?: boolean;
  isFilterType?: boolean;
  isFilterMethod?: boolean;
  isFilterCreatedBy?: boolean;
  isFilterStatus?: boolean;
  isFilterActiveDate?: boolean;
}

const Header = (props: PromotionHeaderProps) => {
  const [filterChipCount, setFilterChipCount] = useState(0);
  const userSlice = useAppSelector(userStore);

  return (
    <HeaderTableWrapper.GridWrapHeaderPage
      formatExportFunc={props.formatExportFunc}
      filterChipCount={filterChipCount}
      setFilterCount={setFilterChipCount}
      setParams={props.setParams}
      onClearFilter={(keys) => {
        const newParams = clearParamsVar(keys, props.params);
        props.setParams && props.setParams(newParams);

        setFilterChipCount(0);
      }}
      onDeleteFilter={(type: string, value: string | number) => {
        handleDeleteParam(props.params || {}, { type, value }, props.setParams);
      }}
      exportFileName="Báo_cáo_khuyến_mãi_"
      rightChildren={
        <>
          {props.onCreatePromotion && (
            <Grid item>
              <MButton onClick={props.onCreatePromotion}>
                <AddIcon />
                {vi.button.create_promotion}
              </MButton>
            </Grid>
          )}
        </>
      }
      searchPlacehoder="Nhập tên KM, SKU sản phẩm"
      filterOptions={promotionFilterOptions({ userSlice, ...props })}
      filterChipOptions={promotionFilterChipOptions({ userSlice, tabName: props.tabName })}
      {...props}
    ></HeaderTableWrapper.GridWrapHeaderPage>
  );
};

export default Header;
