// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import Grid from "@mui/material/Grid";
import LineChart from "components/Charts/LineChart";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";
import AddIcon from "@mui/icons-material/Add";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";
import AttachAttributesPopup from "views/ReportFacebookView/components/AttachAttributesPopup";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { FBReportType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  dataRenderHeaderShare,
  contentModel,
  message,
  titlePopup,
  columnShowCampaignByDateDetail,
  summaryColumnCampaign,
  summaryColumnCampaignDetail,
  FILTER_CHART_OPTIONS,
  arrTakeValueParamsHeader,
  summaryColumnAdSet,
  columnShowCampaignAdSetDetail,
} from "views/ReportFacebookView/constants";
import { statusNotification } from "constants/index";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import { facebookApi } from "_apis_/facebook.api";

const initState: InitialStateReport = {
  data: {
    dataTable: [],
    dataChart: [],
  },
  loading: {
    isLoadingTable: false,
    isLoadingChart: false,
  },
  params: {
    page: 1,
    limit: 200,
    ordering: "-spend",
  },
  popup: {
    isOpenPopup: false,
    title: titlePopup.ATTACH_ATTRIBUTES,
    buttonText: "Tạo",
    isLoadingButton: false,
    optionsAttribute: [],
    idRow: "",
  },
  dataTotalTable: 0,
  totalRow: {},
};

const storeCampaign = (state: InitialStateReport, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          data: {
            ...state.data,
            ...payload,
          },
        };
      }
      case actionType.UPDATE_DATA_TOTAL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_LOADING: {
        return {
          ...state,
          loading: {
            ...state.loading,
            ...payload,
          },
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
      case actionType.UPDATE_TOTAL_ROW: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_POPUP: {
        return {
          ...state,
          popup: {
            ...state.popup,
            ...payload,
          },
        };
      }
    }
  }
};

const Campaign = () => {
  const [state, dispatch] = useReducer(storeCampaign, initState);

  const {
    data: { dataTable, dataChart },
    loading: { isLoadingTable, isLoadingChart },
    params,
    dataTotalTable,
    totalRow,
    popup: { isOpenPopup, title, buttonText, isLoadingButton, optionsAttribute, idRow },
  } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { adAccount, campaign, params: paramsStore } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const objParams = handleParamsApi(
      {
        ...paramsStore,
        ad_account_id: adAccount.columnSelected,
      },
      ["date_from", "date_to", "effective_status", "campaign_name", "objective", "ad_account_id"]
    );

    getDataChart(objParams);
  }, [paramsStore]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: campaign.columnSelected.length
          ? campaign.columnSelected.includes(item.campaign_id)
            ? true
            : false
          : false,
      };
    });

    dispatch({
      type: actionType.UPDATE_DATA,
      payload: {
        dataTable: newData,
      },
    });
  }, [campaign.columnSelected]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        ad_account_id: adAccount.columnSelected,
      },
      ["date_from", "date_to", "effective_status", "objective", "campaign_name", "ad_account_id"]
    );

    getListFacebookCampaign(objParams);
  };

  const convertDataAttributes = (attributes: any) => {
    if (attributes.length) {
      return attributes.map((item: any) => {
        return {
          attribute: +item.name_id,
          attributeValue: +item.value_id,
        };
      });
    }
    return [];
  };

  const getListFacebookCampaign = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          isLoadingTable: true,
        },
      });

      const result: any = await facebookApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/marketing/campaign/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            id: item.campaign_id,
            searchName: item.campaign_name,
            attributes: convertDataAttributes(item.attributes),
            isCheck: campaign.columnSelected.length
              ? campaign.columnSelected.includes(item.campaign_id)
                ? true
                : false
              : false,
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            dataTable: newData,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL_TABLE,
          payload: {
            dataTotalTable: count,
          },
        });

        dispatch({
          type: actionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: total,
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          isLoadingTable: false,
        },
      });
    }
  };

  const getDataChart = async (params: any) => {
    dispatch({
      type: actionType.UPDATE_LOADING,
      payload: {
        isLoadingChart: true,
      },
    });

    const result = await facebookApi.get<FBReportType>(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "report/marketing/chart-by-date/"
    );

    if (result.data) {
      const { results = [] } = result.data;

      dispatch({
        type: actionType.UPDATE_DATA,
        payload: {
          dataChart: results,
        },
      });
    }

    dispatch({
      type: actionType.UPDATE_LOADING,
      payload: {
        isLoadingChart: false,
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

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page: 1,
      },
    });

    dispatchStore({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ...params,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...campaign.columnSelected];
    if (isCheck) {
      columnSelected.push(row.campaign_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.campaign_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_CAMPAIGN,
      payload: {
        columnSelected,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_CAMPAIGN,
      payload: column,
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.campaign_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_CAMPAIGN,
      payload: {
        columnSelected,
      },
    });
  };

  const handleClosePopup = () => {
    dispatch({
      type: actionType.UPDATE_POPUP,
      payload: {
        isOpenPopup: false,
      },
    });
  };

  const handleShowPopup = (title: string, buttonText: string, row: any = {}) => {
    if (campaign.columnSelected.length) {
      dispatch({
        type: actionType.UPDATE_POPUP,
        payload: {
          isOpenPopup: true,
          buttonText,
          title,
          optionsAttribute: title === titlePopup.ATTACH_ATTRIBUTES ? [] : row.attributes,
          idRow: title === titlePopup.ATTACH_ATTRIBUTES ? "" : row.campaign_id,
        },
      });
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.PLEASE_SELECT_LEAST_ONE_CAMPAIGN,
          variant: statusNotification.INFO,
        },
      });
    }
  };

  const handleSubmitAttributes = (data: any) => {
    switch (title) {
      case titlePopup.ATTACH_ATTRIBUTES: {
        handleAttachAttributes(data);
        break;
      }
      case titlePopup.UPDATE_ATTRIBUTES: {
        handleUpdateAttributes(data);
        break;
      }
    }
  };

  const handleAttachAttributes = async (dataAttributes: any) => {
    const attribute_values = dataAttributes.length
      ? dataAttributes.reduce(
          (prevArr: any, item: any) =>
            item.attributeValue !== "none" ? [...prevArr, item.attributeValue] : [...prevArr],
          []
        )
      : [];

    if (attribute_values.length) {
      const params = {
        content_type_model: contentModel.FACEBOOK_CAMPAIGN,
        object_ids: campaign.columnSelected,
        attribute_values,
      };
      const result = await facebookApi.create(params, "attribute-assign/bulk-add/");

      if (result && result.data) {
        dispatchStore({
          type: actionType.UPDATE_NOTIFICATIONS,
          payload: {
            message: message.ATTACH_ATTRIBUTE_SUCCESS,
            variant: statusNotification.SUCCESS,
          },
        });
        loadDataTable();
      } else {
        dispatchStore({
          type: actionType.UPDATE_NOTIFICATIONS,
          payload: {
            message: message.ATTRIBUTE_ATTACHED,
            variant: statusNotification.ERROR,
          },
        });
      }
      handleClosePopup();
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.PLESE_SELECT_ATTRIBUTE,
          variant: statusNotification.WARNING,
        },
      });
    }
  };

  const handleUpdateAttributes = async (dataAttributes: any) => {
    const attribute_values = dataAttributes.length
      ? dataAttributes.reduce(
          (prevArr: any, item: any) =>
            item.attributeValue !== "none" ? [...prevArr, item.attributeValue] : [...prevArr],
          []
        )
      : [];
    if (attribute_values.length) {
      const params = {
        content_type_model: contentModel.FACEBOOK_CAMPAIGN,
        object_id: idRow,
        attribute_values,
      };
      const result = await facebookApi.create(params, "attribute-assign/bulk-update/");

      if (result && result.data) {
        dispatchStore({
          type: actionType.UPDATE_NOTIFICATIONS,
          payload: {
            message: message.UPDATE_ATTRIBUTE_SUCCESS,
            variant: statusNotification.SUCCESS,
          },
        });
        loadDataTable();
      } else {
        dispatchStore({
          type: actionType.UPDATE_NOTIFICATIONS,
          payload: {
            message: message.ATTRIBUTE_ATTACHED,
            variant: statusNotification.ERROR,
          },
        });
      }
      handleClosePopup();
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.PLESE_SELECT_ATTRIBUTE,
          variant: statusNotification.WARNING,
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

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_CAMPAIGN,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const columnShowExport = useMemo(() => {
    return campaign.resultColumnsShow.length
      ? campaign.resultColumnsShow.reduce((prevArr: any, current: any) => {
          return !["isCheck"].includes(current.name)
            ? [
                ...prevArr,
                {
                  name: current.name,
                  title: current.title,
                },
              ]
            : prevArr;
        }, [])
      : [];
  }, [campaign.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "effective_status",
      "objective",
      "campaign_name",
      ...arrTakeValueParamsHeader,
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Gắn thuộc tính
          </>
        ),
        handleClick: () => handleShowPopup(titlePopup.ATTACH_ATTRIBUTES, "Gắn"),
      },
    ];

    return (
      <HeaderFilter
        columnsCount={campaign.countShowColumn}
        originColumns={campaign.columnsShow}
        searchInput={[
          {
            keySearch: "campaign_name",
            label: "Nhập tên chiến dịch",
          },
        ]}
        params={newParamsStore}
        columnSelected={campaign.columnSelected}
        dataRenderHeader={dataRenderHeaderShare}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        contentArrButtonOptional={contentArrButtonOptional}
        onChangeColumn={handleChangeColumn}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const newParams = handleParamsApi(
      {
        ...paramsStore,
        campaign_id: row.campaign_id,
        ad_account_id: adAccount.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "campaign_id",
        "effective_status",
        "objective",
        "campaign_name",
        "ad_account_id",
      ]
    );

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetail
            host={facebookApi}
            params={{ ...newParams, dimension: "date", ordering: "" }}
            columnShowDetail={columnShowCampaignByDateDetail}
            summaryDataColumns={summaryColumnCampaignDetail}
            arrAttachUnitVnd={[
              "cost_per_messaging_conversation_started_7d",
              "cost_per_fb_pixel_complete_registration",
              "cost_per_comment",
              "cost_per_total_phone",
              "cost_per_total_phone_qualified",
              "spend",
            ]}
            endpoint="report/marketing/campaign/"
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <TableDetail
            host={facebookApi}
            params={{ ...newParams, ordering: "-spend" }}
            columnShowDetail={columnShowCampaignAdSetDetail}
            summaryDataColumns={summaryColumnAdSet}
            arrAttachUnitVnd={[
              "cost_per_messaging_conversation_started_7d",
              "cost_per_fb_pixel_complete_registration",
              "cost_per_comment",
              "cost_per_total_phone",
              "cost_per_total_phone_qualified",
              "spend",
              "daily_budget",
            ]}
            arrAttachUnitPercent={["rate_post_comments_phone"]}
            endpoint="report/marketing/ad-set/"
          />
        </TabWrap>
      </>
    );
  };

  const columnOrders = useMemo(() => {
    return campaign.resultColumnsShow.map((item) => item.name);
  }, [campaign.resultColumnsShow]);

  return (
    <>
      <AttachAttributesPopup
        isOpen={isOpenPopup}
        title={title}
        handleClose={handleClosePopup}
        attributes={optionsAttribute}
        buttonText={buttonText}
        contentButtonCustom="Thêm"
        isLoadingButton={isLoadingButton}
        handleSubmit={handleSubmitAttributes}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <LineChart
            title="Báo cáo theo ngày"
            data={dataChart}
            isLoading={isLoadingChart}
            optionsFilter={FILTER_CHART_OPTIONS}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <DDataGrid
            data={dataTable}
            dataTotal={dataTotalTable}
            page={params.page}
            pageSize={params.limit}
            totalSummaryRow={totalRow}
            columns={campaign.resultColumnsShow}
            columnWidths={campaign.columnsWidthResize}
            columnOrders={columnOrders}
            arrAttachUnitVnd={[
              "cost_per_messaging_conversation_started_7d",
              "cost_per_fb_pixel_complete_registration",
              "cost_per_comment",
              "cost_per_total_phone",
              "cost_per_total_phone_qualified",
              "spend",
              "daily_budget",
            ]}
            arrAttachUnitPercent={["rate_post_comments_phone"]}
            // arrColumnCellShowPopup={["attributes"]}
            listTabDetail={["by_date", "ad_set"]}
            isLoadingTable={isLoadingTable}
            isCheckAll={dataTable.length && dataTable.length === campaign.columnSelected.length}
            summaryDataColumns={summaryColumnCampaign}
            renderHeader={renderHeader}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            renderTableDetail={renderTableDetail}
            handleCheckColumn={handleCheckColumn}
            handleCheckedAll={handleCheckedAll}
            setColumnWidths={handleResizeColumns}
            handleChangeColumnOrder={handleChangeColumnOrder}
            handleSorting={handleChangeSorting}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default Campaign;
