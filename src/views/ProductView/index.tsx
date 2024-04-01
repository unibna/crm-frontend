// Libraries
import { FunctionComponent, useReducer, useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import map from "lodash/map";
import filter from "lodash/filter";

// Services
import { productApi } from "_apis_/product";

// Context
import { reducerProduct, StoreProduct, initialState } from "./contextStore";
import { showToast } from "contexts/ToastContext";
import { getListSupplier } from "store/redux/attributes/slice";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import usePopup from "hooks/usePopup";

// Components
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AttributeVariant, VARIANT_TYPE } from "_types_/ProductType";

// Constants & Utils
import { message, randomSkuCode, typeHandleProduct } from "./constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParams } from "utils/formatParamsUtil";
import { statusNotification } from "constants/index";
import { translate } from "constants/translate";

export const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export const LabelContentStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const ProductView: FunctionComponent = () => {
  const { state: store } = useContext(StoreProduct);
  const { notifications } = store;

  const { dataPopup, dataForm, closePopup, setNotifications, setLoadingSubmit } = usePopup();
  const { type: typeProduct } = dataPopup;

  useEffect(() => {
    getListSupplier();
  }, []);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  useDidUpdateEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  const handleSubmitPopup = async (form: any) => {
    switch (typeProduct) {
      case typeHandleProduct.CREATE_PRODUCT: {
        setLoadingSubmit(true);

        const newVariants = getObjectPropSafely(() => form.variants.length)
          ? map(form.variants, (item: AttributeVariant) => {
              const { sale_price = 0, neo_price = 0 } = item;

              return handleParams({
                name: `${form.name} ${item.value}`,
                SKU_code: item.SKU_code,
                description: item.description,
                barcode: item.barcode,
                sale_price: +sale_price,
                neo_price: +neo_price,
                image: item?.imageApi?.[0] || "",
                product: form.id || "",
                status: form.status ? "INACTIVE" : "ACTIVE",
                variant_type: VARIANT_TYPE.SIMPLE,
              });
            })
          : [];

        const newOptions = filter([+form.type, +form.brand], (item) => item);

        const params = {
          name: form.name,
          barcode: form.barcode,
          SKU_code: (form.SKU_code || randomSkuCode()).toLocaleUpperCase(),
          description: form.description,
          images: form.imageApi,
          category: form.category ? +form.category : "",
          options: newOptions,
          variants: newVariants,
          supplier: form.supplier,
          tags: map(form.tags, (item) => item.value),
          status: form.status ? "INACTIVE" : "ACTIVE",
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "");

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
                message: message[item],
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
      case typeHandleProduct.CREATE_COMBO: {
        const bundleVariant = map(
          getObjectPropSafely(() => form?.bundle_variants),
          (item) => {
            return handleParams({
              variant: item.id,
              quantity: item.quantity || 0,
              variant_total: item.sale_price || "",
            });
          }
        );

        const newVariants = [
          handleParams({
            name: form.name,
            SKU_code: form.SKU_code,
            description: form.description,
            barcode: form.barcode,
            sale_price: +form.sale_price,
            image: getObjectPropSafely(() => form.imageApi[0]) || "",
            product: form.id || "",
            status: form.status ? "INACTIVE" : "ACTIVE",
            bundle_variants: getObjectPropSafely(() => bundleVariant.length) ? bundleVariant : [],
            variant_type: VARIANT_TYPE.BUNDLE,
          }),
        ];

        const newOptions = filter([+form.type, +form.brand], (item) => item);

        const params = {
          name: form.name,
          barcode: form.barcode,
          SKU_code: (form.SKU_code || randomSkuCode()).toLocaleUpperCase(),
          description: form.description,
          images: form.imageApi,
          category: form.category ? +form.category : "",
          options: newOptions,
          variants: newVariants,
          supplier: form.supplier,
          tags: map(form.tags, (item) => item.value),
          status: form.status ? "INACTIVE" : "ACTIVE",
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "");

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
                message: message[item],
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

        break;
      }
      case typeHandleProduct.EDIT_PRODUCT: {
        setLoadingSubmit(true);
        const newOptions = filter([+form.type, +form.brand], (item) => item);

        const params = {
          id: form.id,
          name: form.name,
          barcode: form.barcode,
          SKU_code: form.SKU_code,
          description: form.description,
          images: form.imageApi,
          category: form.category ? +form.category : "",
          supplier: form.supplier,
          options: newOptions,
          tags: map(form.tags, (item) => item.value),
          status: form.status ? "INACTIVE" : "ACTIVE",
        };

        const newParams = handleParams(params);
        const result = await productApi.update(newParams, "");

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
      case typeHandleProduct.EDIT_VARIANT: {
        const params = {
          id: form.id,
          name: form.value,
          SKU_code: form.SKU_code,
          barcode: form.barcode,
          description: form.description,
          sale_price: +form.sale_price,
          neo_price: +form.neo_price,
          image: form.imageApi[0] || "",
          product: form.product,
          status: form.status ? "INACTIVE" : "ACTIVE",
        };

        const newParams = handleParams(params);
        const result: any = await productApi.update(newParams, "variant/");

        if (result && result.data) {
          setNotifications({
            message: "Chỉnh sửa thành công",
            variant: statusNotification.SUCCESS,
          });

          closePopup();
        } else {
          const { error = {} } = result;

          if (Object.keys(error).length) {
            Object.keys(error).forEach((item: any) => {
              setNotifications({
                message: message[item],
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

        break;
      }
      case typeHandleProduct.ADD_VARIANT: {
        const params = {
          name: form.value,
          SKU_code: form.SKU_code,
          barcode: form.barcode,
          description: form.description,
          sale_price: +form.sale_price,
          neo_price: +form.neo_price,
          image: form.imageApi[0] || "",
          product: form.product,
          status: form.status ? "INACTIVE" : "ACTIVE",
          variant_type: VARIANT_TYPE.SIMPLE,
        };

        const newParams = handleParams(params);
        const result: any = await productApi.create(newParams, "variant/");

        if (result && result.data) {
          setNotifications({
            message: "Thêm thành công",
            variant: statusNotification.SUCCESS,
          });

          closePopup();
        } else {
          const { error = {} } = result;

          if (Object.keys(error).length) {
            Object.keys(error).forEach((item: any) => {
              setNotifications({
                message: message[item],
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
        break;
      }
      case typeHandleProduct.MAP_ECOMMERCE: {
        setLoadingSubmit(true);
        const params = {
          ecommerce_sku: form.ecommerce_sku,
          ecommerce_name: form.ecommerce_name,
          ecommerce_platform: form.ecommerce_platform,
          variant: form.id,
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "ecommerce-map/");

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

  return (
    <Stack sx={{ mt: 3 }}>
      <Outlet />
    </Stack>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerProduct, initialState);

  return (
    <StoreProduct.Provider value={{ state, dispatch }}>
      <ProductView {...props} />
    </StoreProduct.Provider>
  );
};

export default Components;
