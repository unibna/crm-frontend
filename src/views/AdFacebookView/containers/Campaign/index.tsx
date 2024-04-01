// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreFacebook } from "views/AdFacebookView/contextStore";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import TableDetailNoneApi from "components/DDataGrid/components/TableDetailNoneApi";
import { TabWrap } from "components/Tabs";

// Types
import { SortType } from "_types_/SortType";
import { FacebookType, InitialState } from "_types_/FacebookType";

// Constants
import { actionType } from "views/AdFacebookView/constants";
import {
  columnShowDetailActivitiesCampaign,
  TYPE_EXTRA_DATA,
} from "views/AdFacebookView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "",
  },
  dataTotal: 0,
};

const storeCampaign = (state: InitialState, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_DATA_TOTAL: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_LOADING: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_PARAMS: {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }
    }
  }
};

const Campaign = () => {
  const [state, dispatch] = useReducer(storeCampaign, initState);
  const { data, loading, params, dataTotal } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreFacebook);
  const { campaign } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListFacebookCampaign(objParams);
  };

  const getListFacebookCampaign = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result = await facebookApi.get(params, "campaigns/");

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results?.map((item: any) => {
          return {
            ...item,
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_CAMPAIGN,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        limit: rowPage,
        page: 1,
      },
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_CAMPAIGN,
      payload: column,
    });
  };

  const handleFilter = (params: any) => {
    // dispatch({
    //     type: actionType.UPDATE_PARAMS,
    //     payload: {
    //         ...params
    //     },
    // });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_CAMPAIGN,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={campaign.countShowColumn}
        handleFilter={handleFilter}
        dataExport={data}
        columnShowExport={campaign.columnsShow}
        originColumns={campaign.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const dataDetail = data.length
      ? data.find((item: FacebookType) => item.campaign_id === row.campaign_id)
      : [];
    const newDataDetail = getObjectPropSafely(() => dataDetail.activities.length)
      ? dataDetail.activities.reduce((prevArr: any, current: any) => {
          const extraData = JSON.parse(current.extra_data);
          switch (extraData.type) {
            case TYPE_EXTRA_DATA.TARGETS_SPEC: {
              const extraDataTypePresent = getObjectPropSafely(() => extraData.new_value.length)
                ? extraData.new_value.reduce(
                    (prevArrHere: any, currentHere: any, index: number) => {
                      return [
                        ...prevArrHere,
                        {
                          new_value: getObjectPropSafely(() => currentHere.children.toString()),
                          old_value: getObjectPropSafely(() => extraData.old_value.length)
                            ? extraData.old_value[index].children.toString()
                            : "",
                        },
                      ];
                    },
                    []
                  )
                : getObjectPropSafely(() => extraData.old_value.length)
                ? extraData.old_value.reduce(
                    (prevArrHere: any, currentHere: any, index: number) => {
                      return [
                        ...prevArrHere,
                        {
                          new_value: getObjectPropSafely(() => extraData.new_value.length)
                            ? extraData.new_value[index].children.toString()
                            : "",
                          old_value: getObjectPropSafely(() => currentHere.children.toString()),
                        },
                      ];
                    },
                    []
                  )
                : [];

              return [
                ...prevArr,
                {
                  ...current,
                  extra_data: extraDataTypePresent,
                },
              ];
            }
            case TYPE_EXTRA_DATA.RUN_STATUS:
            case TYPE_EXTRA_DATA.OPTIMIZATION_GOAL:
            case TYPE_EXTRA_DATA.PAYMENT_AMOUNT:
            case TYPE_EXTRA_DATA.NAME:
            case TYPE_EXTRA_DATA.BID_TYPE:
            case TYPE_EXTRA_DATA.COMPOSITE_DATA: {
              return [
                ...prevArr,
                {
                  ...current,
                  extra_data: [
                    {
                      new_value:
                        getObjectPropSafely(() => extraData.new_value.new_value) ||
                        getObjectPropSafely(() => extraData.new_value) ||
                        "",
                      old_value:
                        getObjectPropSafely(() => extraData.old_value.old_value) ||
                        getObjectPropSafely(() => extraData.old_value) ||
                        "",
                    },
                  ],
                },
              ];
            }
            case TYPE_EXTRA_DATA.DURATION: {
              return [
                ...prevArr,
                {
                  ...current,
                  extra_data: [
                    {
                      new_value: getObjectPropSafely(() => extraData.new_value.time_start) || "",
                      old_value: getObjectPropSafely(() => extraData.old_value.time_start) || "",
                    },
                    {
                      new_value: getObjectPropSafely(() => extraData.new_value.time_stop) || "",
                      old_value: getObjectPropSafely(() => extraData.old_value.time_stop) || "",
                    },
                  ],
                },
              ];
            }
            default: {
              return [
                ...prevArr,
                {
                  ...current,
                  extra_data: {
                    new_value: "",
                    old_value: "",
                  },
                },
              ];
            }
          }
        }, [])
      : [];

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetailNoneApi
            data={newDataDetail}
            arrColumnEditLabel={["extra_data"]}
            columnShowDetail={columnShowDetailActivitiesCampaign}
          />
        </TabWrap>
      </>
    );
  };

  const columnOrders = useMemo(() => {
    return campaign.resultColumnsShow.map((item) => item.name);
  }, [campaign.resultColumnsShow]);

  return (
    <DDataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={campaign.resultColumnsShow}
      columnWidths={campaign.columnsWidthResize}
      columnOrders={columnOrders}
      renderHeader={renderHeader}
      isLoadingTable={loading}
      listTabDetail={["activities"]}
      setColumnWidths={handleResizeColumns}
      renderTableDetail={renderTableDetail}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSorting={handleChangeSorting}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Campaign;
