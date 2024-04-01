// Libraries
import { useReducer, useEffect, useContext, useMemo, useState } from "react";
import find from "lodash/find";
import { useLocation } from "react-router-dom";

// Hooks
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Services
import { productApi } from "_apis_/product";

// Context
import { StoreProduct } from "views/ProductView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import MapEcommerce from "views/ProductView/components/MapEcommerce";

// @Types
import { FacebookType, InitialState } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { GridSizeType } from "_types_/GridLayoutType";
import { ECOMMERCE_PLARFORM, STATUS_PRODUCT, VariantEcommer } from "_types_/ProductType";

// Constants & Utils
import {
  actionType,
  keyFilter,
  typeHandleProduct,
  contentRenderDefault,
  titlePopupHandleProduct,
  message,
  optionPlatformEcommerce,
  headerFilterStatusMap,
} from "views/ProductView/constants";
import { statusNotification } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParams, handleParamsApi } from "utils/formatParamsUtil";

// Routes
import { translate } from "constants/translate";
import { ROLE_TAB, STATUS_ROLE_ECOMMERCE } from "constants/rolesTab";

const SHOPEE_SHOP_ID = import.meta.env.REACT_APP_SHOPEE_SHOP_ID;

const TabContainer = () => {
  const { newCancelToken } = useCancelToken();
  const { pathname } = useLocation();
  const { state: store, dispatch: dispatchStore } = useContext(StoreProduct);
  const {
    dataPopup,
    setDataPopup,
    dataForm,
    closePopup,
    setNotifications,
    isSubmit,
    setLoadingSubmit,
  } = usePopup();
  const { ecommerce, params: paramsStore } = store;

  // State
  const [data, setData] = useState<VariantEcommer[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 50, ordering: "" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  const { type: typeProduct } = dataPopup;

  const platform = useMemo(() => {
    return pathname.match(/(?<=\/)[\w-]+$/g)?.toString();
  }, [pathname]);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, platform]);

  useDidUpdateEffect(() => {
    if (isSubmit) {
      loadDataTable();
    }
  }, [isSubmit]);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        platform: platform === "all" ? "" : platform,
      },
      ["search", "platform", "is_mapped"]
    );
    getListEcommerce(objParams);
  };

  const convertLinkEcommerceProduct = (platform: ECOMMERCE_PLARFORM, ecommerceId: string) => {
    switch (platform) {
      case ECOMMERCE_PLARFORM.LAZADA: {
        return `https://www.lazada.vn/products/i${ecommerceId}.html?spm=a1zawf.24863640.table_online_product.1.4f694edfOuQtdb`;
      }
      case ECOMMERCE_PLARFORM.SHOPEE: {
        return `https://shopee.vn/product/${SHOPEE_SHOP_ID}/${ecommerceId}/`;
      }
      case ECOMMERCE_PLARFORM.TIKTOK: {
        return `https://shop.tiktok.com/view/product/${ecommerceId}`;
      }
      default:
        return "";
    }
  };

  const getListEcommerce = async (params: any) => {
    if (params) {
      setLoading(true);
      const result: any = await productApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "ecommerce-map/"
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          const objEcommerce = find(
            optionPlatformEcommerce,
            (obj) => obj.value === getObjectPropSafely(() => item.ecommerce_platform)
          );

          return {
            ...item,
            ecommerce_platform: {
              value: objEcommerce?.label,
              color: objEcommerce?.color,
            },
            ecommerce_name: {
              value: getObjectPropSafely(() => item?.ecommerce_name),
              props: {
                href: convertLinkEcommerceProduct(
                  objEcommerce?.value || ECOMMERCE_PLARFORM.LAZADA,
                  item.ecommerce_key || item.ecommerce_id
                ),
              },
            },
            platform: objEcommerce,
            operation: {
              isShowEdit: true,
              // isShowAdd: true,
            },
            variant_name: {
              value: getObjectPropSafely(() => item?.variant.name),
              props: {
                href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => item?.variant.id)}`,
              },
            },
            thumb_img_variant: getObjectPropSafely(() => item?.variant.image.url),
            thumb_img_ecommerce: getObjectPropSafely(() => item?.ecommerce_image),
            variant_SKU_code: getObjectPropSafely(() => item?.variant.SKU_code),
            sale_price: getObjectPropSafely(() => item.variant.sale_price) || "",
            purchase_price: getObjectPropSafely(() => item.variant.purchase_price) || "",
            status: getObjectPropSafely(() => item.variant)
              ? {
                  value:
                    getObjectPropSafely(() => item.variant.status) === STATUS_PRODUCT.ACTIVE
                      ? "Đang kinh doanh"
                      : "Ngừng kinh doanh",
                  color:
                    getObjectPropSafely(() => item.variant.status) === STATUS_PRODUCT.ACTIVE
                      ? "success"
                      : "error",
                }
              : null,
            status_sync: {
              value: item.variant ? "Đã đồng bộ" : "Chưa đồng bộ",
              color: item.variant ? "success" : "error",
            },
          };
        });

        setData(newData);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_ECOMMERCE,
      payload: column,
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_ECOMMERCE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_ECOMMERCE,
      payload: columns,
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const columnName = value[0].columnName;
    const ordering = value[0].direction === "asc" ? columnName : "-" + columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleFilter = (params: any) => {
    setParams({
      ...params,
      page: 1,
    });

    dispatchStore({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ...params,
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
      case titlePopupHandleProduct.MAP_ECOMMERCE:
      case titlePopupHandleProduct.EDIT_MAP_ECOMMERCE: {
        typeProduct = typeHandleProduct.EDIT_MAP_ECOMMERCE;
        defaultData = {
          ecommerce_sku: optional.ecommerce_sku || "",
          ecommerce_name: getObjectPropSafely(() => optional.ecommerce_name.value) || "",
          ecommerce_platform:
            getObjectPropSafely(() => optional.platform.value) || ECOMMERCE_PLARFORM.LAZADA,
          ...(type === titlePopupHandleProduct.EDIT_MAP_ECOMMERCE && {
            variant: optional.variant
              ? { ...optional.variant, value: getObjectPropSafely(() => optional.variant.name) }
              : null,
            id: optional.id || "",
          }),
        };
        title = type;
        maxWidthForm = "md";
        funcContentSchema = (yup: any) => {
          return {
            ecommerce_sku: yup.string(),
            ecommerce_name: yup.string(),
            ecommerce_platform: yup.string(),
            variant: yup.mixed().required("Vui lòng chọn sản phẩm"),
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

  const handleSubmitPopup = async (form: any) => {
    switch (typeProduct) {
      case typeHandleProduct.MAP_ECOMMERCE:
      case typeHandleProduct.EDIT_MAP_ECOMMERCE: {
        setLoadingSubmit(true);
        let result;
        const params = {
          ecommerce_sku: form.ecommerce_sku,
          ecommerce_name: form.ecommerce_name,
          ecommerce_platform: form.ecommerce_platform,
          variant: getObjectPropSafely(() => form.variant.id),
          id: form.id,
        };

        const newParams = handleParams(params);
        if (newParams.id) {
          result = await productApi.update(newParams, "ecommerce-map/");
        } else {
          result = await productApi.create(newParams, "ecommerce-map/");
        }

        if (result && result.data) {
          setNotifications({
            message: message[typeProduct].UPDATE_PRODUCT_SUCCESS,
            variant: statusNotification.SUCCESS,
          });

          closePopup();
        } else {
          const { error = {} } = result;

          if (Object.keys(error).length) {
            Object.keys(error).forEach((item: any) => {
              setNotifications({
                message: message[item] || translate[error[0] as keyof typeof translate],
                variant: statusNotification.ERROR,
              });
            });
          } else {
            setNotifications({
              message: message.SYSTEM_ERROR,
              variant: statusNotification.ERROR,
            });
          }
        }

        setLoadingSubmit(false);
        break;
      }
    }
  };

  const renderHeader = () => {
    const dataRenderHeader = [
      ...(platform === STATUS_ROLE_ECOMMERCE.ALL
        ? [
            {
              style: {
                width: 200,
              },
              status: keyFilter.ECOMMERCE,
              title: "Sàn",
              options: [
                {
                  label: "Tất cả",
                  value: "all",
                },
                ...optionPlatformEcommerce,
              ],
              label: "platform",
              defaultValue: "all",
            },
          ]
        : []),
      {
        style: {
          width: 200,
        },
        status: keyFilter.ECOMMERCE,
        title: "Trạng thái",
        options: headerFilterStatusMap,
        label: "is_mapped",
        defaultValue: "all",
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập SKU",
          },
        ]}
        dataExport={data}
        columnShowExport={ecommerce.columnsShow}
        dataRenderHeader={dataRenderHeader}
        params={paramsStore}
        columnsCount={ecommerce.countShowColumn}
        originColumns={ecommerce.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <DataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={ecommerce.resultColumnsShow}
      columnWidths={ecommerce.columnsWidthResize}
      isLoadingTable={isLoading}
      renderHeader={renderHeader}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: (row: FacebookType) =>
          handleOpenPopup(titlePopupHandleProduct.EDIT_MAP_ECOMMERCE, row),
        handleAdd: (row: FacebookType) =>
          handleOpenPopup(titlePopupHandleProduct.MAP_ECOMMERCE, row),
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["ecommerce", "variant", "status_sync"],
        infoCell: ecommerce.columnsShow,
      }}
      // arrValueTitle={["ecommerce_name"]}
      arrColumnEditLabel={["ecommerce_platform", "status", "status_sync"]}
      arrColumnThumbImg={["variant", "ecommerce"]}
      arrAttachUnitVnd={["ecommerce_price", "sale_price", "purchase_price"]}
      arrColumnHandleLink={["variant_name", "ecommerce_name"]}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      handleSorting={handleChangeSorting}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};

export default TabContainer;
