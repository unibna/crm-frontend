// Libraries
import { useContext, useMemo, useReducer, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

// Services
import { productApi } from "_apis_/product";

// Context
import { StoreWarehouse } from "views/WarehouseView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import usePopup from "hooks/usePopup";

// Components
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import DDataGrid from "components/DDataGrid";
import AddIcon from "@mui/icons-material/Add";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DetailWarehouse from "views/WarehouseView/components/DetailWarehouse";
import CreateWarehouse from "views/WarehouseView/components/CreateWarehouse";
import { Span } from "components/Labels";

// @Types
import { FacebookType, InitialState } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants & Utils
import { actionType, titlePopupHandle, typeHandle } from "views/WarehouseView/constants";
import { handleParamsApi } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { PHONE_REGEX } from "constants/index";

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-name",
  },
  dataTotal: 0,
  isShowFullTable: false,
};

const storeListWarehouse = (state: InitialState, action: any) => {
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
      case actionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

const ListWarehouse = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const [state, dispatch] = useReducer(storeListWarehouse, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreWarehouse);
  const { dataPopup, isSubmit, setDataPopup } = usePopup();
  const { listWarehouse, params: paramsStore } = store;
  const { data, params, dataTotal, loading, isShowFullTable } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useDidUpdateEffect(() => {
    if (isSubmit) {
      loadDataTable();
    }
  }, [isSubmit]);

  useEffect(() => {
    return () => {
      dispatchStore({
        type: actionType.UPDATE_DATA_POPUP,
        payload: {
          isOpenPopup: false,
        },
      });
    };
  }, []);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
      },
      ["name"]
    );
    getListWarehouse(objParams);
  };

  const getListWarehouse = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result = await productApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "warehouse/"
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            operation: {
              isShowEdit: true,
            },
            is_default: {
              content: (
                <>
                  {item.is_default ? (
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color="info"
                    >
                      Kho giao
                    </Span>
                  ) : null}
                </>
              ),
            },
            is_sales: {
              content: (
                <>
                  {item.is_sales ? (
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color="warning"
                    >
                      Kho bán hàng
                    </Span>
                  ) : null}
                </>
              ),
            },
            address: getObjectPropSafely(() => item.address.address),
            fullAddress: item.address,
            name: {
              value: item.name,
              content: (
                <Link
                  underline="hover"
                  variant="subtitle2"
                  color="primary.main"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleOpenPopup(titlePopupHandle.INFORMATION_WAREHOUSE, item)}
                >
                  {item.name}
                </Link>
              ),
            },
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
      type: actionType.RESIZE_COLUMN_LIST_WAREHOUSE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_LIST_WAREHOUSE,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_LIST_WAREHOUSE,
      payload: column,
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

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleOpenPopup = (type: string, optional: any = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender: any;
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    let maxWidthForm: GridSizeType = "sm";
    let isFullScreen = false;

    switch (type) {
      case titlePopupHandle.CREATE_WAREHOUSE: {
        typeProduct = typeHandle.CREATE_WAREHOUSE;
        defaultData = {
          name: "",
          address: "",
          description: "",
          province: "",
          district: "",
          ward: "",
          manager_name: "",
          manager_phone: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            manager_phone: yup
              .string()
              .required("Vui lòng nhập số điện thoại")
              .trim()
              //eslint-disable-next-line
              .matches(PHONE_REGEX, {
                message: "Vui lòng nhập đúng số điện thoại",
                excludeEmptyString: true,
              }),
            name: yup.string().required("Vui lòng nhập tên kho"),
            manager_name: yup.string().required("Vui lòng nhập quản lí kho"),
            description: yup.string(),
            address: yup.string().required("Vui lòng nhập địa chỉ"),
            province: yup.string(),
            district: yup.string(),
            ward: yup.string().required("Vui lòng chọn phường xã"),
          };
        };
        newContentRender = (methods: any) => {
          return <CreateWarehouse {...methods} />;
        };
        buttonTextPopup = "Tạo";
        maxWidthForm = "md";
        isFullScreen = false;
        break;
      }
      case titlePopupHandle.EDIT_WAREHOUSE: {
        typeProduct = typeHandle.EDIT_WAREHOUSE;
        defaultData = {
          id: optional.id,
          name: getObjectPropSafely(() => optional.name.value) || "",
          address: getObjectPropSafely(() => optional.fullAddress.street) || "",
          description: optional.description || "",
          province: getObjectPropSafely(() => optional.fullAddress.location.province_id) || "",
          district: getObjectPropSafely(() => optional.fullAddress.location.district_id) || "",
          ward: getObjectPropSafely(() => optional.fullAddress.location.ward_id) || "",
          manager_name: optional.manager_name || "",
          manager_phone: optional.manager_phone || "",
        };
        funcContentSchema = (yup: any) => {
          return {
            manager_phone: yup
              .string()
              .required("Vui lòng nhập số điện thoại")
              .trim()
              //eslint-disable-next-line
              .matches(PHONE_REGEX, {
                message: "Vui lòng nhập đúng số điện thoại",
                excludeEmptyString: true,
              }),
            name: yup.string().required("Vui lòng nhập tên kho"),
            manager_name: yup.string().required("Vui lòng nhập quản lí kho"),
            description: yup.string(),
            address: yup.string().required("Vui lòng nhập địa chỉ"),
            province: yup.string(),
            district: yup.string(),
            ward: yup.string().required("Vui lòng chọn phường xã"),
          };
        };
        newContentRender = (methods: any) => {
          return <CreateWarehouse {...methods} />;
        };
        buttonTextPopup = "Cập nhật";
        maxWidthForm = "md";
        isFullScreen = false;
        break;
      }
      case titlePopupHandle.INFORMATION_WAREHOUSE: {
        typeProduct = typeHandle.INFORMATION_WAREHOUSE;

        newContentRender = () => {
          return (
            <Stack sx={{ mb: 2 }}>
              <DetailWarehouse data={optional} />
            </Stack>
          );
        };

        title = `${type} ${optional.name}`;
        isShowFooter = false;
        maxWidthForm = "md";
        isFullScreen = true;
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
      isFullScreen,
    });
  };

  const handleShowFullTable = () => {
    dispatch({
      type: actionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
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

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Tạo kho
          </>
        ),
        handleClick: () => handleOpenPopup(titlePopupHandle.CREATE_WAREHOUSE),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "name",
            label: "Nhập kho",
          },
        ]}
        columnsCount={listWarehouse.countShowColumn}
        originColumns={listWarehouse.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={handleFilter}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return listWarehouse.resultColumnsShow.map((item) => item.name);
  }, [listWarehouse.resultColumnsShow]);

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      isLoadingTable={loading}
      columns={listWarehouse.resultColumnsShow}
      columnWidths={listWarehouse.columnsWidthResize}
      columnOrders={columnOrders}
      renderHeader={renderHeader}
      listTabDetail={["inventory"]}
      arrAttachUnitVnd={["sale_price", "purchase_price"]}
      arrColumnThumbImg={["thumb_img"]}
      arrColumnEditLabel={["is_confirm"]}
      contentOptional={{
        arrColumnOptional: ["is_default", "name", "is_sales"],
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: (rowDetail: FacebookType) =>
          handleOpenPopup(titlePopupHandle.EDIT_WAREHOUSE, rowDetail),
      }}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default ListWarehouse;
