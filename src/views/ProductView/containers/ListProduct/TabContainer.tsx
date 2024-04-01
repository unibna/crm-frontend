// Libraries
import { useReducer, useEffect, useContext, useMemo, useState } from "react";
import map from "lodash/map";
import find from "lodash/find";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

// Hooks
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Services
import { productApi } from "_apis_/product";

// Context
import { StoreProduct } from "views/ProductView/contextStore";
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesProduct } from "selectors/attributes";
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";
import useAuth from "hooks/useAuth";

// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import SyncAltIcon from "@mui/icons-material/Sync";
import ForkLeftIcon from "@mui/icons-material/ForkLeft";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import WidgetsIcon from "@mui/icons-material/Widgets";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import { Span } from "components/Labels";
import { TabWrap,  } from "components/Tabs";
import TableDetail from "components/DataGrid/components/TableDetail";
import GeneralInfo from "views/ProductView/components/GeneralInfo";
import { GroupButtonProps } from "components/Buttons/GroupButtons";
import OperationVariant from "views/ProductView/components/OperationVariant";
import MapEcommerce from "views/ProductView/components/MapEcommerce";
import VariantList from "views/ProductView/components/VariantList";
import VariantCreate from "views/ProductView/components/VariantCreate";
import ComboVariant from "views/ProductView/components/OperationVariant/ComboVariant";

// @Types
import { FacebookType, InitialState } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { ECOMMERCE_PLARFORM, ProductDTO, STATUS_PRODUCT } from "_types_/ProductType";
import { AttributeVariant } from "_types_/ProductType";
import { ColorSchema } from "_types_/ThemeColorType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants & Utils
import {
  actionType,
  dataRenderHeaderShare,
  keyFilter,
  typeHandleProduct,
  contentRenderDefault,
  titlePopupHandleProduct,
  message,
  columnShowDetailVariant,
  headerFilterStatus,
  optionPlatformEcommerce,
  headerFilterVariantType,
  initAttribuesVariant,
} from "views/ProductView/constants";
import { statusNotification } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParamsApi } from "utils/formatParamsUtil";
import {
  ROLE_TAB,
  STATUS_ROLE_LIST_PRODUCT,
  STATUS_ROLE_PRODUCT,
  STATUS_ROLE_WAREHOUSE,
} from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-created",
  },
  dataTotal: 0,
  isShowFullTable: false,
  columnSelected: {},
  columnSelectedVariant: {},
};

const storeListProduct = (state: InitialState, action: any) => {
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
      case actionType.UPDATE_DATA_POPUP: {
        return {
          ...state,
          dataPopup: {
            ...state.dataPopup,
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
      case actionType.UPDATE_COLUMN_SELECTED: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

const TabContainer = () => {
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const theme = useTheme();
  const { pathname } = useLocation();
  const attributesProduct = useAppSelector((state) => getAllAttributesProduct(state.attributes));
  const [state, dispatch] = useReducer(storeListProduct, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreProduct);
  const { dataPopup, setDataPopup, isSubmit } = usePopup();

  // State
  const [isViewProduct, setViewTable] = useState(false);
  const [isLoadingVariant, setLoadingVariant] = useState(false);
  const [dataVariants, setDataVariants] = useState<AttributeVariant[]>([]);
  const [paramsVariant, setParamsVariant] = useState({
    page: 1,
    limit: 200,
    ordering: "-created",
  });
  const [dataTotalVariant, setDataTotalVariant] = useState(0);

  const { product, variant, params: paramsStore } = store;
  const { dataCategory, dataType } = attributesProduct;
  const { data, loading, params, dataTotal, isShowFullTable } = state;

  const variantType = useMemo(() => {
    return pathname.match(/(?<=\/)[\w-]+$/g)?.toString();
  }, [pathname]);

  useEffect(() => {
    getListValueAttribute();
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsVariant, paramsStore, isViewProduct, variantType]);

  useDidUpdateEffect(() => {
    if (isSubmit) {
      loadDataTable();
    }
  }, [isSubmit]);

  useDidUpdateEffect(() => {
    dispatch({
      type: actionType.UPDATE_COLUMN_SELECTED,
      payload: {
        columnSelected: {
          ...state.columnSelected,
          ...state.columnSelectedVariant,
        },
      },
    });
  }, [state.columnSelectedVariant]);

  const isShowCreateProduct = useMemo(
    () =>
      isMatchRoles(user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.CREATE_PRODUCT]
      ),
    [user]
  );

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...(isViewProduct ? params : paramsVariant),
        ...paramsStore,
        variant_type: variantType === STATUS_ROLE_LIST_PRODUCT.ALL ? "" : variantType,
      },
      ["search", "category", "type", "status", "variant_type"]
    );

    isViewProduct ? getListProduct(objParams) : getVariants(objParams);
  };

  const getListProduct = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result: any = await productApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        ""
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          const { options } = item;
          let objType = options.find(
            (option: ProductDTO) => option.type === typeHandleProduct.TYPE
          );
          let objBrand = options.find(
            (option: ProductDTO) => option.type === typeHandleProduct.BRAND
          );

          return {
            ...item,
            thumb_img_product: getObjectPropSafely(() => item?.images[0].url),
            status: {
              value: item.status === STATUS_PRODUCT.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh",
              color: item.status === STATUS_PRODUCT.ACTIVE ? "success" : "error",
            },
            category: getObjectPropSafely(() => item.category.name),
            type: getObjectPropSafely(() => objType.name),
            supplier: getObjectPropSafely(() => item.supplier.name),
            created_by: getObjectPropSafely(() => item.created_by.name),
            modified_by: getObjectPropSafely(() => item.modified_by.name),
            categoryId: getObjectPropSafely(() => item.category.id),
            brand: getObjectPropSafely(() => objBrand.name),
            brandId: getObjectPropSafely(() => objBrand.id),
            supplierId: getObjectPropSafely(() => item.supplier.id),
            typeId: getObjectPropSafely(() => objType.id),
            operation: {
              isShowEdit: true,
              isShowAdd: isShowCreateProduct,
              labelDialog: (
                <Box>
                  <Typography>Sản phẩm đã xóa không thể phục hồi lại được.</Typography>
                  <Typography>
                    Bạn có chắc chắn muốn xóa sản phẩm{" "}
                    <Typography variant="subtitle1" component="span" color="error">
                      {item.name}
                    </Typography>{" "}
                    ?
                  </Typography>
                </Box>
              ),
            },
            status_product: item.status,
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

  const getVariants = async (params: any) => {
    setLoadingVariant(true);
    const result: any = await productApi.get({ ...params }, "variant/search/");

    if (result && result.data) {
      const { results = [], count } = result.data;
      const newResults = map(results, (item) => {
        const newEcommerce = map(item.variants_ecommerce_map, (current) => {
          const objEcommerce = find(
            optionPlatformEcommerce,
            (obj) => obj.value === getObjectPropSafely(() => current.ecommerce_platform)
          );

          return (
            <Stack direction="row">
              <Span
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={objEcommerce?.color || "warning"}
              >
                {objEcommerce?.label}
              </Span>
              <Typography variant="caption" sx={{ ml: 1.5 }}>
                {getObjectPropSafely(() => current.ecommerce_sku)}
              </Typography>
            </Stack>
          );
        });

        return {
          ...item,
          operation: {
            isShowEdit: true,
            // isShowDelete: true,
            isShowAdd: false,
            labelDialog: (
              <Box>
                <Typography>Sản phẩm đã xóa không thể phục hồi lại được.</Typography>
                <Typography>
                  Bạn có chắc chắn muốn xóa sản phẩm{" "}
                  <Typography variant="subtitle1" component="span" color="error">
                    {item.name}
                  </Typography>{" "}
                  ?
                </Typography>
              </Box>
            ),
          },
          value: item.name || "",
          created_by: getObjectPropSafely(() => item.created_by.name),
          modified_by: getObjectPropSafely(() => item.modified_by.name),
          thumb_img_variant: getObjectPropSafely(() => item?.image.url),
          name: {
            value: item.name,
            props: {
              href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => item.id)}`,
            },
          },
          status_combo: {
            value: !!getObjectPropSafely(() => item.bundle_variants.length) ? "Combo" : "",
            color: "warning",
          },
          status: {
            value: item.status === STATUS_PRODUCT.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh",
            color: item.status === STATUS_PRODUCT.ACTIVE ? "success" : "error",
          },
          quality_confirm: getObjectPropSafely(() => item.inventory_available.quality_confirm),
          quality_non_confirm: getObjectPropSafely(
            () => item.inventory_available.quality_non_confirm
          ),
          total_quantity_confirm:
            getObjectPropSafely(() => item.total_inventory) -
            getObjectPropSafely(() => item.inventory_available.quality_confirm),
          total_quantity_non_confirm:
            getObjectPropSafely(() => item.total_inventory) -
            getObjectPropSafely(() => item.inventory_available.quality_confirm) -
            getObjectPropSafely(() => item.inventory_available.quality_non_confirm),
          status_variant: item.status,
          ecommerce_platform: {
            content: <Stack spacing={1}>{newEcommerce}</Stack>,
          },
        };
      });

      setDataVariants(newResults);
      setDataTotalVariant(count);
    }

    setLoadingVariant(false);
  };

  const getListValueAttribute = async () => {
    const result: any = await productApi.get({}, "attribute/get/all/");
    if (result.data) {
      const { results = [] } = result.data;
      const newDataValueAttribute = results.reduce(
        (prevArr: any[], current: { id: number; name: string; details: string[] | [] }) => {
          return [
            ...prevArr,
            {
              id: current.id,
              value: current.details,
            },
          ];
        },
        []
      );

      dispatchStore({
        type: actionType.UPDATE_DATA_FILTER,
        payload: {
          dataValueAttribute: newDataValueAttribute,
        },
      });
    }
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_PRODUCT,
      payload: column,
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

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_PRODUCT,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_PRODUCT,
      payload: columns,
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const columnName = value[0].columnName;
    const ordering = value[0].direction === "asc" ? columnName : "-" + columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
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

  const handleCheckColumnDetail = (columnSelected: string[], dataRow: any) => {
    dispatch({
      type: actionType.UPDATE_COLUMN_SELECTED,
      payload: {
        columnSelectedVariant: {
          [dataRow.id]: columnSelected,
        },
      },
    });
  };

  const handleOpenPopup = (type: string, optional: any = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender: any = () => contentRenderDefault[type] || [];
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "sm";

    switch (type) {
      case titlePopupHandleProduct.CREATE_PRODUCT: {
        typeProduct = typeHandleProduct.CREATE_PRODUCT;
        defaultData = {
          name: "",
          SKU_code: "",
          barcode: "",
          description: "",
          unit: "",
          supplier: "",
          type: "",
          category: "",
          images: [],
          imageApi: [],
          variants: [initAttribuesVariant],
          tags: [],
          brand: "",
          status: false,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup
              .string()
              .required("Vui lòng nhập tên sản phẩm")
              .max(255, "Tên sản phẩm phải nhỏ hơn 255 kí tự"),
            SKU_code: yup.string(),
            barcode: yup.string(),
            type: yup.string(),
            category: yup.string(),
            supplier: yup.string(),
            description: yup.string(),
            images: yup.array(),
            imageApi: yup.array(),
            variants: yup.array().of(
              yup.object().shape({
                value: yup.string().required("Vui lòng nhập tên"),
                SKU_code: yup.string().required("Vui lòng nhập SKU"),
              })
            ),
            tags: yup.array(),
            brand: yup.string(),
            status: yup.bool(),
          };
        };
        newContentRender = (methods: any) => {
          return (
            <Grid container rowSpacing={4}>
              <GeneralInfo {...methods} />
              <VariantCreate {...methods} />
            </Grid>
          );
        };
        maxWidthForm = "lg";

        break;
      }
      case titlePopupHandleProduct.CREATE_COMBO: {
        typeProduct = typeHandleProduct.CREATE_COMBO;
        defaultData = {
          name: "",
          SKU_code: "",
          barcode: "",
          description: "",
          unit: "",
          supplier: "",
          type: "",
          category: "",
          images: [],
          sale_price: 0,
          neo_price: 0,
          imageApi: [],
          bundle_variants: [],
          tags: [],
          brand: "",
          status: false,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup
              .string()
              .required("Vui lòng nhập tên sản phẩm")
              .max(255, "Tên sản phẩm phải nhỏ hơn 255 kí tự"),
            SKU_code: yup.string().required("Vui lòng nhập SKU"),
            barcode: yup.string(),
            type: yup.string(),
            category: yup.string(),
            supplier: yup.string(),
            description: yup.string(),
            images: yup.array(),
            imageApi: yup.array(),
            sale_price: yup.number(),
            neo_price: yup.number(),
            bundle_variants: yup.array().min(1, "Vui lòng chọn sản phẩm cho combo"),
            tags: yup.array(),
            brand: yup.string(),
            status: yup.bool(),
          };
        };
        newContentRender = (methods: any) => {
          return (
            <Grid container rowSpacing={4}>
              <GeneralInfo {...methods} isCombo />
              <ComboVariant {...methods} />
            </Grid>
          );
        };
        maxWidthForm = "lg";

        break;
      }
      case titlePopupHandleProduct.EDIT_PRODUCT: {
        typeProduct = typeHandleProduct.EDIT_PRODUCT;
        defaultData = {
          id: optional.id,
          name: optional?.name || "",
          SKU_code: optional?.SKU_code || "",
          barcode: optional?.barcode || "",
          description: optional?.description || "",
          // unit: getObjectPropSafely(() => optional?.unitId),
          supplier: getObjectPropSafely(() => optional?.supplierId),
          type: getObjectPropSafely(() => optional?.typeId),
          category: getObjectPropSafely(() => optional?.categoryId),
          images: optional?.images || [],
          imageApi: getObjectPropSafely(() => optional?.images.length)
            ? optional?.images.map((item: { id: string; url: string }) => item.id)
            : [],
          tags: optional?.tags
            ? map(optional?.tags, (item: { id: number; tag: string }) => ({
                label: item.tag,
                value: item.id,
              }))
            : [],
          brand: getObjectPropSafely(() => optional?.brandId),
          status: optional?.status_product
            ? optional?.status_product === STATUS_PRODUCT.INACTIVE
            : false,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup
              .string()
              .required("Vui lòng nhập tên sản phẩm")
              .max(255, "Tên sản phẩm phải nhỏ hơn 255 kí tự"),
            SKU_code: yup.string(),
            barcode: yup.string(),
            type: yup.string(),
            category: yup.string(),
            // unit: yup.string(),
            supplier: yup.string(),
            description: yup.string(),
            images: yup.array(),
            imageApi: yup.array(),
            tags: yup.array(),
            brand: yup.string(),
            status: yup.bool(),
          };
        };
        newContentRender = (methods: any) => {
          return (
            <Grid container columnSpacing={2} rowSpacing={3}>
              <GeneralInfo {...methods} />
              {/* <UploadImage {...methods} /> */}
            </Grid>
          );
        };
        maxWidthForm = "lg";
        buttonTextPopup = "Cập nhật";

        break;
      }
      case titlePopupHandleProduct.EDIT_VARIANT: {
        typeProduct = typeHandleProduct.EDIT_VARIANT;
        defaultData = {
          ...optional,
          attributes: [],
          id: optional.id,
          product: optional.product,
          SKU_code: optional.SKU_code,
          barcode: optional.barcode,
          description: optional.description || "",
          sale_price: optional.sale_price || "",
          neo_price: optional.neo_price || "",
          purchase_price: optional.purchase_price || "",
          image: getObjectPropSafely(() => optional.image)
            ? [getObjectPropSafely(() => optional.image)]
            : [],
          imageApi: getObjectPropSafely(() => optional.image[0].id)
            ? [getObjectPropSafely(() => optional.image[0].id)]
            : [],
          status: optional?.status_variant
            ? optional?.status_variant === STATUS_PRODUCT.INACTIVE
            : false,
        };
        title = `${type} ${optional.value}`;
        maxWidthForm = "lg";
        funcContentSchema = (yup: any) => {
          return {
            value: yup
              .string()
              .required("Vui lòng nhập tên biến thể sản phẩm")
              .trim()
              .max(255, "Tên biến thế phải nhỏ hơn 255 kí tự"),
            sale_price: yup.string(),
            neo_price: yup.string(),
            purchase_price: yup.string(),
            description: yup.string(),
            status: yup.bool(),
            SKU_code: yup.string(),
            barcode: yup.string(),
            imageApi: yup.array(),
            image: yup.array(),
          };
        };
        newContentRender = (methods: any, optional: any) => {
          return <OperationVariant {...methods} {...optional} variantType={variantType} />;
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandleProduct.ADD_VARIANT: {
        typeProduct = typeHandleProduct.ADD_VARIANT;
        defaultData = {
          ...optional,
          value: optional.name,
          product: optional.id,
          SKU_code: "",
          barcode: "",
          description: "",
          sale_price: "",
          neo_price: "",
          purchase_price: "",
          image: [],
          imageApi: [],
          status: false,
        };
        title = type;
        maxWidthForm = "lg";
        funcContentSchema = (yup: any) => {
          return {
            value: yup
              .string()
              .required("Vui lòng nhập tên biến thể sản phẩm")
              .trim()
              .max(255, "Tên biến thế phải nhỏ hơn 255 kí tự"),
            name: yup.string(),
            sale_price: yup.string(),
            neo_price: yup.string(),
            purchase_price: yup.string(),
            description: yup.string(),
            status: yup.bool(),
            SKU_code: yup.string(),
            barcode: yup.string(),
            imageApi: yup.array(),
            image: yup.array(),
          };
        };
        newContentRender = (methods: any, optional: any) => {
          return <OperationVariant {...methods} {...optional} />;
        };
        buttonTextPopup = "Thêm";
        break;
      }
      case titlePopupHandleProduct.MAP_ECOMMERCE: {
        typeProduct = typeHandleProduct.MAP_ECOMMERCE;
        defaultData = {
          ...optional,
          ecommerce_sku: "",
          ecommerce_name: "",
          ecommerce_platform: ECOMMERCE_PLARFORM.LAZADA,
        };
        title = type;
        maxWidthForm = "sm";
        funcContentSchema = (yup: any) => {
          return {
            ecommerce_sku: yup.string().required("Vui lòng nhập sku sàn"),
            ecommerce_name: yup.string(),
            ecommerce_platform: yup.string(),
          };
        };
        newContentRender = (methods: any, optional: any) => {
          return <MapEcommerce {...methods} {...optional} />;
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      valueOptional: optional,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      isDisabledSubmit,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
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

  const handleImports = (columnSelected: string[]) => {
    if (getObjectPropSafely(() => columnSelected.length)) {
      window.open(
        `/${STATUS_ROLE_WAREHOUSE.SHEET}/new/${STATUS_ROLE_WAREHOUSE.IMPORTS}?variant_selected=${columnSelected}`
      );
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.CHOOSE_VARIANT,
          variant: statusNotification.WARNING,
        },
      });
    }
  };

  const handleExports = (columnSelected: string[]) => {
    if (getObjectPropSafely(() => columnSelected.length)) {
      window.open(
        `/${STATUS_ROLE_WAREHOUSE.SHEET}/new/${STATUS_ROLE_WAREHOUSE.EXPORTS}?variant_selected=${columnSelected}`
      );
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.CHOOSE_VARIANT,
          variant: statusNotification.WARNING,
        },
      });
    }
  };

  const handleDeleteProduct = async (row: FacebookType) => {
    const result = await productApi.remove({ id: row.id }, "");

    if (result) {
      loadDataTable();

      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message[typeHandleProduct.DELETE_PRODUCT].OPERATION_SUCCESS,
          variant: statusNotification.SUCCESS,
        },
      });
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: "Không thể xoá sản phẩm đã phát sinh tồn kho, đơn hàng, khuyến mãi",
          variant: statusNotification.ERROR,
        },
      });
    }
  };

  const handleTransfer = (columnSelected: string[]) => {
    if (getObjectPropSafely(() => columnSelected.length)) {
      window.open(
        `/${STATUS_ROLE_WAREHOUSE.SHEET}/new/${STATUS_ROLE_WAREHOUSE.TRANSFER}?variant_selected=${columnSelected}`
      );
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.CHOOSE_VARIANT,
          variant: statusNotification.WARNING,
        },
      });
    }
  };

  const handleAddVariant = (row: FacebookType) => {
    handleOpenPopup(titlePopupHandleProduct.ADD_VARIANT, row);
  };

  const renderHeader = () => {
    const columnSelected: string[] = Object.values(state.columnSelected).flatMap(
      (item: string[]) => item
    );

    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.CATEGORY,
        title: "Nhóm sản phẩm",
        options: dataCategory,
        label: "category",
        defaultValue: getObjectPropSafely(() => dataCategory[0].value),
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.TYPE,
        title: "Loại sản phẩm",
        options: dataType,
        label: "type",
        defaultValue: getObjectPropSafely(() => dataType[0].value),
      },
      ...(variantType === STATUS_ROLE_LIST_PRODUCT.ALL
        ? [
            {
              style: {
                width: 200,
              },
              title: "Loại biến thể",
              options: headerFilterVariantType,
              label: "variant_type",
              defaultValue: getObjectPropSafely(() => headerFilterVariantType[0].value),
            },
          ]
        : []),
      ...dataRenderHeaderShare,
    ];

    const contentArrButtonGroup: GroupButtonProps[] = [
      {
        direction: "up",
        isBackdrop: false,
        iconContainerButton: <WidgetsIcon />,
        contentArrayButton: [
          {
            title: "Chuyển hàng",
            icon: <SyncAltIcon />,
            color: "warning",
            handleClick: () => handleTransfer(columnSelected),
          },
          {
            title: "Xuất hàng",
            icon: <ForkRightIcon />,
            color: "info",
            handleClick: () => handleExports(columnSelected),
          },
          {
            title: "Nhập hàng",
            icon: <ForkLeftIcon />,
            handleClick: () => handleImports(columnSelected),
          },
        ],
      },
    ];

    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema | any;
      handleClick: () => void;
    }[] = [
      ...(variantType !== STATUS_ROLE_LIST_PRODUCT.SINGLE
        ? [
            {
              content: (
                <>
                  <AddIcon /> Tạo combo
                </>
              ),
              color: "warning",
              handleClick: () => handleOpenPopup(titlePopupHandleProduct.CREATE_COMBO),
            },
          ]
        : []),
      ...(variantType !== STATUS_ROLE_LIST_PRODUCT.COMBO
        ? [
            {
              content: (
                <>
                  <AddIcon /> Tạo sản phẩm
                </>
              ),
              handleClick: () => handleOpenPopup(titlePopupHandleProduct.CREATE_PRODUCT),
            },
          ]
        : []),
    ];

    return (
      <HeaderFilter
        isViewTable={isViewProduct}
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập SKU, tên sản phẩm",
          },
        ]}
        dataExport={isViewProduct ? data : dataVariants}
        columnShowExport={isViewProduct ? product.columnsShow : variant.columnsShow}
        dataRenderHeader={dataRenderHeader}
        params={paramsStore}
        paramsDefault={{
          status: getObjectPropSafely(() => headerFilterStatus[1].value),
        }}
        columnsCount={isViewProduct ? product.countShowColumn : variant.countShowColumn}
        originColumns={isViewProduct ? product.columnsShow : variant.columnsShow}
        contentArrButtonOptional={isShowCreateProduct ? contentArrButtonOptional : []}
        contentArrButtonGroup={contentArrButtonGroup}
        arrDateTime={["created", "modified"]}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
        handleChangeView={setViewTable}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApi = (item: any) => {
      const newItem = {
        ...item,
        operation: {
          isShowEdit: true,
          // isShowDelete: true,
          isShowAdd: false,
          labelDialog: (
            <Box>
              <Typography>Sản phẩm đã xóa không thể phục hồi lại được.</Typography>
              <Typography>
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <Typography variant="subtitle1" component="span" color="error">
                  {item.name}
                </Typography>{" "}
                ?
              </Typography>
            </Box>
          ),
        },
        value: item.name || "",
        created_by: getObjectPropSafely(() => item.created_by.name),
        modified_by: getObjectPropSafely(() => item.modified_by.name),
      };
      const newEcommerce = map(item.variants_ecommerce_map, (current) => {
        const objEcommerce = find(
          optionPlatformEcommerce,
          (obj) => obj.value === getObjectPropSafely(() => current.ecommerce_platform)
        );

        return (
          <Stack direction="row">
            <Span
              variant={theme.palette.mode === "light" ? "ghost" : "filled"}
              color={objEcommerce?.color || "warning"}
            >
              {objEcommerce?.label}
            </Span>
            <Typography variant="caption" sx={{ ml: 1.5 }}>
              {getObjectPropSafely(() => current.ecommerce_sku)}
            </Typography>
          </Stack>
        );
      });

      return {
        ...newItem,
        thumb_img_variant: getObjectPropSafely(() => newItem?.image.url),
        name: {
          value: item.name,
          props: {
            href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => newItem.id)}`,
          },
        },
        status_combo: {
          value: !!getObjectPropSafely(() => item.bundle_variants.length) ? "Combo" : "",
          color: "warning",
        },
        status: {
          value: item.status === STATUS_PRODUCT.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh",
          color: item.status === STATUS_PRODUCT.ACTIVE ? "success" : "error",
        },
        quality_confirm: getObjectPropSafely(() => newItem.inventory_available.quality_confirm),
        quality_non_confirm: getObjectPropSafely(
          () => newItem.inventory_available.quality_non_confirm
        ),
        total_quantity_confirm:
          getObjectPropSafely(() => newItem.total_inventory) -
          getObjectPropSafely(() => newItem.inventory_available.quality_confirm),
        total_quantity_non_confirm:
          getObjectPropSafely(() => newItem.total_inventory) -
          getObjectPropSafely(() => newItem.inventory_available.quality_confirm) -
          getObjectPropSafely(() => newItem.inventory_available.quality_non_confirm),
        created_by: getObjectPropSafely(() => item.created_by.name),
        modified_by: getObjectPropSafely(() => item.modified_by.name),
        status_variant: item.status,
        ecommerce_platform: {
          content: <Stack spacing={1}>{newEcommerce}</Stack>,
        },
      };
    };

    const newParams = handleParamsApi(
      {
        ...paramsStore,
        product_id: row.id,
        cancelToken: newCancelToken(),
      },
      ["product_id", "status", "search", "category", "type", "cancelToken", "variant_type"]
    );

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          dataRow={row}
          heightProps={500}
          isFullTable={isShowFullTable}
          host={productApi}
          params={{ ...newParams, ordering: "-created" }}
          columnShowDetail={columnShowDetailVariant}
          endpoint="variant/"
          contentColumnHandleOperation={{
            arrColumnHandleOperation: ["operation"],
            handleEdit: (row: FacebookType) =>
              handleOpenPopup(titlePopupHandleProduct.EDIT_VARIANT, row),
            handleDelete: (row: FacebookType) => handleDeleteProduct(row),
            handleAdd: (row: FacebookType) =>
              handleOpenPopup(titlePopupHandleProduct.MAP_ECOMMERCE, row),
          }}
          contentColumnShowInfo={{
            arrColumnShowInfo: ["variant", "info", "action", "ecommerce"],
            infoCell: columnShowDetailVariant.columnShowTable,
          }}
          arrColumnHandleLink={["name"]}
          arrAttachUnitVnd={["sale_price", "purchase_price"]}
          arrColumnEditLabel={["status", "status_combo"]}
          arrDateTime={["created", "modified"]}
          arrColumnThumbImg={["variant"]}
          arrColumnOptional={["ecommerce_platform"]}
          handleDataApi={handleDataApi}
          handleCheckColumn={handleCheckColumnDetail}
        />
      </TabWrap>
    );
  };

  return (
    <DataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={product.resultColumnsShow}
      columnWidths={product.columnsWidthResize}
      isLoadingTable={loading}
      renderHeader={renderHeader}
      renderTableDetail={renderTableDetail}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: (row: FacebookType) =>
          handleOpenPopup(titlePopupHandleProduct.EDIT_PRODUCT, row),
        handleDelete: handleDeleteProduct,
        handleAdd: handleAddVariant,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["product", "info", "action"],
        infoCell: product.columnsShow,
      }}
      viewOptional={
        isViewProduct ? undefined : (
          <VariantList
            variants={dataVariants}
            params={paramsVariant}
            setParams={setParamsVariant}
            isLoading={isLoadingVariant}
            isShowTableDetail={variantType !== STATUS_ROLE_LIST_PRODUCT.SINGLE}
            totalCount={dataTotalVariant}
            isShowFullTable={isShowFullTable}
            handleOpenPopup={handleOpenPopup}
            handleCheckColumn={(columnSelected: string[]) =>
              dispatch({
                type: actionType.UPDATE_COLUMN_SELECTED,
                payload: {
                  columnSelected: {
                    variants: columnSelected,
                  },
                },
              })
            }
          />
        )
      }
      arrColumnEditLabel={["status"]}
      arrDateTime={["created", "modified"]}
      arrColumnThumbImg={["product"]}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};

export default TabContainer;
