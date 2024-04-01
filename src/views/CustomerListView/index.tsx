// Libraries
import { useEffect, useReducer, useContext, useMemo, FunctionComponent } from "react";
import produce from "immer";

// Context
import { StoreCustomerList, reducerCustomerList, initialState } from "./contextStore";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import AddIcon from "@mui/icons-material/Add";
import PopupCustomer from "views/CustomerListView/containers/PopupCustomer";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { FacebookColumnType } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { ColorSchema } from "_types_/ThemeColorType";

// Constants
import {
  actionType,
  columnShowCustomerList,
  titlePopup,
  typeFilter,
} from "views/CustomerListView/constants";
import { chooseParams } from "utils/formatParamsUtil";

const initState: InitialStateReport = {
  data: {
    dataTable: [],
  },
  column: {
    columnsShow: columnShowCustomerList.columnsShowHeader,
    resultColumnsShow: columnShowCustomerList.columnsShowHeader,
    countShowColumn: columnShowCustomerList.columnsShowHeader.length,
    columnsWidthResize: columnShowCustomerList.columnWidths,
    columnSelected: [],
  },
  popup: {
    isOpenPopup: false,
    title: titlePopup.CREATE_CUSTOMER,
    buttonText: "Tạo",
  },
  loading: false,
  params: {
    page: 0,
    limit: 200,
    ordering: "",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeCustomerList = (state: InitialStateReport, action: any) => {
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
      case actionType.UPDATE_TOTAL_ROW: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_COLUMN: {
        return {
          ...state,
          column: {
            ...state.column,
            ...payload,
          },
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

const CustomerList: FunctionComponent = () => {
  const [state, dispatch] = useReducer(storeCustomerList, initState);
  const { dispatch: dispatchStore } = useContext(StoreCustomerList);

  const defaultData = [
    {
      id: "123",
      name: "Kem",
      customers_match: 100,
      account_sync: "aaa",
      status_sync: "Hoàn thành",
      title_operation: "Kem",
      namePopup: "Storm",
      customers: [
        [
          {
            id: "123444",
            type: typeFilter.INCLUDE,
            field: "total_order",
            operator: "less_than",
            value: "1234",
            isValid: true,
          },
        ],
        [
          {
            id: "1234445555",
            type: typeFilter.EXCLUDE,
            field: "categories_purchased",
            operator: "contain",
            value: ["kem"],
            isValid: true,
          },
        ],
      ],
    },
  ];

  const {
    data: { dataTable },
    loading,
    params,
    dataTotal,
    column,
    popup: { isOpenPopup, title, buttonText },
  } = state;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };

    const newParams = chooseParams(objParams, [
      "date_from",
      "date_to",
      "page_id",
      "type",
      "has_content_id",
    ]);

    getListDataLead({ type: "Message", ...newParams });
  };

  const getListDataLead = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve("aaa");
        }, 2000);
      });

      const result = await promise;

      if (result) {
        // const { results = [], count, total } = result.data;
        const newData = defaultData.map((item: any) => {
          return {
            ...item,
            number_day_use: item.number_day_use || "",
            operation: {
              labelDialog:
                "Dữ liệu tập khách hàng này sẽ được xóa tất cả. Bạn có chắc chắn với điều này",
              isShowDelete: true,
              isShowEdit: true,
            },
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            dataTable: newData,
          },
        });

        // dispatch({
        //   type: actionType.UPDATE_DATA_TOTAL,
        //   payload: {
        //     dataTotal: count,
        //   },
        // });

        // dispatch({
        //   type: actionType.UPDATE_TOTAL_ROW,
        //   payload: {
        //     totalRow: total,
        //   },
        // });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const handleToggleVisibleColumn = (
    column: any,
    arrColumnsShow: FacebookColumnType<FacebookType>[],
    arrResultColumnsShow: FacebookColumnType<FacebookType>[]
  ) => {
    const { isShow, name } = column;
    let resultColumnsShow = [];
    const index = arrColumnsShow.findIndex((item) => item.name === name);
    const columnsShow = produce(arrColumnsShow, (draft) => {
      draft[index].isShow = !isShow;
    });

    if (isShow) {
      resultColumnsShow = arrResultColumnsShow.filter((item) => item.name !== name);
    } else {
      resultColumnsShow = [...arrResultColumnsShow];
      resultColumnsShow.splice(index, 0, column);
    }

    return {
      columnsShow,
      resultColumnsShow,
      countShowColumn: resultColumnsShow.length,
    };
  };

  const handleChangeColumnOrders = (
    payload: any,
    arrResultColumnsShow: FacebookColumnType<FacebookType>[]
  ) => {
    const { columnsOrder } = payload;
    const arrResult = columnsOrder.reduce((prevArr: any, name: string) => {
      const column = arrResultColumnsShow.find((item) => item.name === name);
      return [...prevArr, column];
    }, []);

    return {
      resultColumnsShow: arrResult,
    };
  };

  const handleResizeColumns = (value: any) => {
    dispatch({
      type: actionType.UPDATE_COLUMN,
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
        page: 0,
      },
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? "-" + value[0].columnName : value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleChangeColumn = (columnProps: any) => {
    const columns = handleToggleVisibleColumn(
      columnProps,
      column.columnsShow,
      column.resultColumnsShow
    );

    dispatch({
      type: actionType.UPDATE_COLUMN,
      payload: columns,
    });
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ...params,
        page: 1,
      },
    });
  };

  const handleChangeColumnOrder = (columnProps: string[]) => {
    const columns = handleChangeColumnOrders(
      {
        columnsOrder: columnProps,
      },
      column.resultColumnsShow
    );

    dispatch({
      type: actionType.UPDATE_COLUMN,
      payload: columns,
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleOperationDelete = async (row: any) => {
    // dispatch({
    //   type: actionType.UPDATE_LOADING,
    //   payload: {
    //     loading: true,
    //   },
    // });
    // const result: any = await facebookApi.remove(params, "accounts/");
    // if (result) {
    //   loadDataTable()
    // }
    // dispatch({
    //   type: actionType.UPDATE_LOADING,
    //   payload: {
    //     loading: false,
    //   },
    // });
  };

  const handleOperationEdit = async (row: any) => {
    dispatchStore({
      type: actionType.UPDATE_NAME,
      payload: {
        name: row.namePopup,
      },
    });

    dispatchStore({
      type: actionType.UPDATE_CUSTOMER_STATE,
      payload: {
        customers: row.customers,
      },
    });

    dispatch({
      type: actionType.UPDATE_POPUP,
      payload: {
        isOpenPopup: true,
        buttonText: "Chỉnh sửa",
        title: titlePopup.EDIT_CUSTOMER,
      },
    });
  };

  const handleShowPopup = () => {
    dispatch({
      type: actionType.UPDATE_POPUP,
      payload: {
        isOpenPopup: true,
        buttonText: "Tạo",
        title: titlePopup.CREATE_CUSTOMER,
      },
    });
  };

  const handleSubmitPopup = () => {};

  const handleClosePopup = () => {
    dispatch({
      type: actionType.UPDATE_POPUP,
      payload: {
        isOpenPopup: false,
      },
    });

    dispatchStore({
      type: actionType.INIT_CUSTOMER,
      payload: {},
    });
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Tạo tập khách hàng
          </>
        ),
        handleClick: handleShowPopup,
      },
    ];

    return (
      <HeaderFilter
        columnsCount={column.countShowColumn}
        originColumns={column.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return column.resultColumnsShow.map((item: any) => item.name);
  }, [column.resultColumnsShow]);

  return (
    <>
      <PopupCustomer
        isOpen={isOpenPopup}
        title={title}
        handleClose={handleClosePopup}
        arrCustomer={[]}
        buttonText={buttonText}
        handleSubmit={handleSubmitPopup}
      />
      <DDataGrid
        data={dataTable}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        isLoadingTable={loading}
        columns={column.resultColumnsShow}
        columnWidths={column.columnsWidthResize}
        columnOrders={columnOrders}
        renderHeader={renderHeader}
        setColumnWidths={handleResizeColumns}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleSorting={handleChangeSorting}
        contentColumnHandleOperation={{
          arrColumnHandleOperation: ["operation"],
          handleDelete: handleOperationDelete,
          handleEdit: handleOperationEdit,
        }}
        handleChangeColumnOrder={handleChangeColumnOrder}
      />
    </>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerCustomerList, initialState);

  return (
    <StoreCustomerList.Provider value={{ state, dispatch }}>
      <CustomerList {...props} />
    </StoreCustomerList.Provider>
  );
};

export default Components;
