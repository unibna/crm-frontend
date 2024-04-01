import { orderApi } from "_apis_/order.api";
import { DGridType } from "_types_/DGridType";
import {
  DISCOUNT_METHOD,
  PROMOTION_TYPE,
  PromotionRequireType,
  PromotionType,
} from "_types_/PromotionType";
import { SortType } from "_types_/SortType";
import { Page } from "components/Page";
import WrapPage from "layouts/WrapPage";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import { useCancelToken } from "hooks/useCancelToken";
import map from "lodash/map";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fDateTime } from "utils/dateUtil";
import { handleChangeSortingTableToParams } from "utils/tableUtil";
import {
  PROMOTION_COLUMNS,
  PROMOTION_COLUMN_WIDTHS,
  PROMOTION_HIDDEN_COLUMN_NAMES,
  formatExportPromotionData,
} from "../constants";
import Header, { PromotionHeaderProps } from "./Header";
import PromotionDialog from "./PromotionDialog";
import PromotionTable from "./PromotionTable";
import { TITLE_PAGE } from "constants/index";

export const REQUIREMENT_DEFAULT: PromotionRequireType[] = [
  {
    requirement: 0,
    requirement_type: "TOTAL_BILL", // yêu cầu tổng đơn hàng
  },
  {
    requirement: 0,
    requirement_type: "QUANTITY_MIN", // yêu cầu số lượng sản phẩm tối thiểu
  },
  {
    limit: 0,
    limit_type: "TOTAL_MAX", // giới hạn số tiền
  },
  {
    requirement: 0,
    limit_type: "QUANTITY_MAX", // giới hạn số lượng sản phẩm
  },
];

export const [TOTAL_BILL, QUANTITY_MIN, TOTAL_MAX, QUANTITY_MAX] = REQUIREMENT_DEFAULT;

export const PROMOTION_FORM_DEFAULT: Partial<PromotionType> = {
  type: PROMOTION_TYPE.ORDER,
  discount_method: DISCOUNT_METHOD.AMOUNT,
  date_start: format(new Date(), yyyy_MM_dd),
  discount_amount: 0,
  discount_percent: 0,
  requirements: REQUIREMENT_DEFAULT,
  is_cumulative: true,
};

interface PromotionProps extends Partial<DGridType>, Partial<PromotionHeaderProps> {
  params: any;
  setParams: (params: any) => void;
  isFilterType?: boolean;
  isFilterMethod?: boolean;
  isFilterCreatedBy?: boolean;
  isFilterActiveDate?: boolean;
  isFilterDate?: boolean;
  isFilterStatus?: boolean;
  tabName: "INACTIVED" | "ACTIVED" | "DEACTIVED" | "ALL";
}

const PromotionContainer = ({
  params,
  setParams,
  isFilterActiveDate,
  isFilterCreatedBy,
  isFilterDate,
  isFilterMethod,
  isFilterStatus,
  isFilterType,
  tabName,
  isExport,
}: PromotionProps) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [columns, _setColumns] = useState(PROMOTION_COLUMNS);
  const [columnWidths, _setColumnWidths] = useState(PROMOTION_COLUMN_WIDTHS);
  const [columnOrders, _setColumnOrders] = useState(
    map(PROMOTION_COLUMN_WIDTHS, (item) => item.columnName)
  );
  const [hiddenColumnNames, setHiddenColumnNames] = useState(PROMOTION_HIDDEN_COLUMN_NAMES);
  const [isFullRow, setFullRow] = useState(false);
  const { newCancelToken } = useCancelToken([params]);

  const [data, setData] = useState<{
    data: PromotionType[];
    total: number;
    loading: boolean;
  }>({
    data: [],
    total: 0,
    loading: false,
  });

  /**
   * It gets data from the API and sets the data state
   */
  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<PromotionType>({
      endpoint: "promotion/",
      params: { ...params, cancelToken: newCancelToken() },
    });
    if (result.data) {
      setData({ data: result.data.results, loading: false, total: result.data.count || 0 });
    } else {
      if (result?.error?.name === "CANCEL_REQUEST") {
        return;
      }

      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [newCancelToken, params]);

  const handleCreatePromotion = async () => {
    navigate("/promotions/all");
    getData();
  };

  const handleSetParams = (name: keyof PromotionType, value: any) => {
    setParams((prevParams: any) => {
      return { ...prevParams, [name]: value, page: 1 };
    });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Page title={TITLE_PAGE.PROMOTION}>
      <WrapPage>
        <PromotionDialog
          onApplyChanges={handleCreatePromotion}
          onClose={() => setOpenModal(false)}
          open={openModal}
          row={{ ...PROMOTION_FORM_DEFAULT, status: tabName === "ALL" ? "INACTIVED" : tabName }}
          tabName={tabName}
        />
        <Header
          isFilterDate={isFilterDate}
          isFilterType={isFilterType}
          isFilterStatus={isFilterStatus}
          isFilterMethod={isFilterMethod}
          isFilterCreatedBy={isFilterCreatedBy}
          isFilterActiveDate={isFilterActiveDate}
          isExport={isExport}
          columns={columns}
          hiddenColumnNames={hiddenColumnNames}
          setHiddenColumnNames={setHiddenColumnNames}
          onCreatePromotion={() => setOpenModal(true)}
          onSearch={(value) => handleSetParams("search", value)}
          onRefresh={getData}
          params={params}
          setParams={(newParams) => setParams((prev: any) => ({ ...prev, ...newParams }))}
          tabName={tabName}
          setFullRow={() => setFullRow((prev) => !prev)}
          isFullRow={isFullRow}
          exportData={data.data}
          exportFileName={`Danh_sach_khuyen_mai_${fDateTime(new Date())}`}
          formatExportFunc={formatExportPromotionData}
        />
        <PromotionTable
          handleSorting={(value: SortType[]) =>
            setParams &&
            setParams({
              ...params,
              ...handleChangeSortingTableToParams(value),
            })
          }
          iconFullRowVisible="edit"
          editComponent={(contentProps) => {
            return (
              <PromotionDialog
                {...contentProps}
                onClose={contentProps.onCancelChanges}
                onApplyChanges={getData}
              />
            );
          }}
          onRefresh={getData}
          isFullRow={isFullRow}
          columns={columns}
          defaultColumnWidths={columnWidths}
          hiddenColumnNames={hiddenColumnNames}
          defaultColumnOrders={columnOrders}
          data={{ data: data.data, loading: data.loading, count: data.total }}
          params={params}
          setParams={setParams}
        />
      </WrapPage>
    </Page>
  );
};

export default memo(PromotionContainer);
