import { Page } from "components/Page";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomerType } from "_types_/CustomerType";
import { CommentType, MessageType } from "_types_/FacebookType";
import compact from "lodash/compact";
import { CDP_COLUMNS, CDP_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import map from "lodash/map";
import filter from "lodash/filter";
import { customerApi } from "_apis_/customer.api";
import produce from "immer";
import Header from "views/CDPView/components/Header";
import useAuth from "hooks/useAuth";
import { ROLE_TAB, STATUS_ROLE_CDP } from "constants/rolesTab";
import CDPTable from "views/CDPView/components/CDPTable";
import WrapPage from "layouts/WrapPage";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";
import { isMatchRoles } from "utils/roleUtils";
import { fDateTime } from "utils/dateUtil";
import { formatExportCustomer } from "views/CDPView/constants/utils";
import { TITLE_PAGE } from "constants/index";

const initParamsCdpTable = {
  limit: 200,
  page: 1,
  ranking: "all",
};
export interface CDPDataType {
  messData: { count: number; data: MessageType[] };
  commentData: { count: number; data: CommentType[] };
}

export interface CDPProps {
  customerDefault?: CustomerType;
}

const CustomerView = (props: CDPProps) => {
  const { customerDefault } = props;
  const { user } = useAuth();

  const [isFullRow, setFullRow] = useState(false);
  const [tags, setTags] = useState<{ id: number; name: string }[] | undefined>([]);

  const [phoneInfo, setPhoneInfo] = useState<Partial<CustomerType>>();
  const [selection, setSelection] = useState<(string | number)[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [data, setData] = useState<{
    data: Partial<CustomerType>[];
    loading: boolean;
    count: number;
  }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = useState<any>(initParamsCdpTable);
  const [filterCount, setFilterCount] = useState(0);
  const { newCancelToken } = useCancelToken();

  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const phone = query.get("phone") || "";
    const name = query.get("name") || "";

    setPhoneInfo(
      search
        ? {
            phone: phone,
            full_name: name,
            ...customerDefault,
          }
        : customerDefault
    );
  }, [customerDefault, search]);

  const goToDetail = (value: CustomerType) => {
    navigate(`/cdp/detail/?name=${value.full_name}&phone=${value.phone}`);
  };

  const handleRefresh = () => {
    setSelection([]);
    setParams((prev: any) => ({ ...prev }));
  };

  const handleResetPage = () => {
    setTags([]);
    setSelection([]);
    setParams((prev: any) => ({ ...prev, page: 1 }));
  };

  const handleUpdateTagsForCustomer = async (
    tags: {
      id: number;
      name: string;
    }[]
  ) => {
    const tagsBody = map(tags, (tag) => tag.id);
    const customerBody = filter(data.data, (cdp, idx) => selection.includes(idx));
    const result = await customerApi.update({
      endpoint: "bulk_update_tags/",
      params: {
        tags: tagsBody,
        customer_ids: compact(map(customerBody, (ctm) => ctm.id)),
      },
    });
    if (result.data) {
      handleResetPage();
    }
  };

  const getCDPData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await customerApi.get({
      endpoint: "",
      params: {
        ...params,
        cancelToken: newCancelToken(),
      },
    });
    if (result.data) {
      setData((prev) => ({
        ...prev,
        data: result.data.results,
        loading: false,
        count: result.data.count || 0,
      }));
      return;
    }

    if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [newCancelToken, params]);

  const handleClearParams = (keysFilter: string[]) => {
    let paramsClone = { ...params };
    map(keysFilter, (item: keyof typeof initParamsCdpTable) => {
      paramsClone[item] = initParamsCdpTable[item];
    });
    setParams(paramsClone);
  };

  const handleRefreshCustomerRow = (customer: CustomerType) => {
    const newData = produce(data.data, (draft) => {
      const freshIndex = draft.findIndex((item) => item.id === customer.id);
      draft[freshIndex] = customer;
    });
    setData((prev) => ({ ...prev, data: newData }));
  };

  useEffect(() => {
    getCDPData();
  }, [getCDPData]);

  useEffect(() => {
    setSelection([]);
    setTags([]);
  }, [params]);

  return (
    <Page title={TITLE_PAGE.CDP}>
      <WrapPage sx={{ "&> .MuiCard-root": { padding: 0, boxShadow: "none" } }}>
        <Header
          onSearch={(value) => setParams((prev: any) => ({ ...prev, search: value }))}
          goToDetail={goToDetail}
          customer={phoneInfo}
          selection={selection}
          params={params}
          setParams={setParams}
          columns={CDP_COLUMNS}
          hiddenColumnNames={hiddenColumns}
          setHiddenColumnNames={setHiddenColumns}
          handleRefresh={handleRefresh}
          handleUpdateTagsForCustomer={handleUpdateTagsForCustomer}
          tags={tags}
          setTags={setTags}
          filterCount={filterCount}
          onClearAll={handleClearParams}
          setFilterCount={setFilterCount}
          isFullRow={isFullRow}
          setFullRow={() => setFullRow((prev) => !prev)}
          exportData={data.data}
          exportFileName={`Danh_sanh_khach_hang_${fDateTime(new Date())}`}
          formatExportFunc={formatExportCustomer}
        />
        <CDPTable
          elevation
          data={data}
          pickCustomer={goToDetail}
          setSelection={setSelection}
          selection={selection}
          hiddenColumnNames={hiddenColumns}
          isFullRow={isFullRow}
          showEditCommand={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.HANDLE]
          )}
          columns={CDP_COLUMNS}
          defaultColumnWidths={CDP_COLUMNS_WIDTH}
          defaultColumnOrders={map(CDP_COLUMNS, (column) => column.name)}
          onRefresh={() => setParams((prev: any) => ({ ...prev }))}
          onRefreshCDPRow={handleRefreshCustomerRow}
          params={params}
          setParams={setParams}
          iconFullRowVisible="selection"
          hiddenPagination={false}
        />
      </WrapPage>
    </Page>
  );
};

export default CustomerView;
