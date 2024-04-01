// Libraries
import { useMemo, useEffect } from "react";
import filter from "lodash/filter";

// Services
import { productApi } from "_apis_/product";

// Store Context
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { getAllAttributesProduct } from "selectors/attributes";
import { updateAttributesProduct } from "store/redux/attributes/slice";
import usePopup from "hooks/usePopup";

// Components
import Grid from "@mui/material/Grid";
import AttributeCollapse from "components/Collapses/CollapseAttribute";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants
import {
  keyDataFilter,
  message,
  typeHandleProduct,
  contentRenderDefault,
  titlePopupHandleProduct,
  optionFilterOperation,
} from "views/ProductView/constants";
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";

const AttributeTab = () => {
  const attributesProduct = useAppSelector((state) => getAllAttributesProduct(state.attributes));
  const dispatch = useAppDispatch();
  const { dataForm, dataPopup, setDataPopup, setLoadingSubmit, setNotifications, closePopup } =
    usePopup();
  const {
    dataCategory: dataFilterCategory,
    dataType: dataFilterType,
    dataSupplier: dataFilterSupplier,
    dataBrand: dataFilterBrand,
    dataTags: dataFilterTags,
    variantAttributes: dataFilterAttribute,
  } = attributesProduct;
  const { type: typeProduct, title: titlePopup, defaultData } = dataPopup;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const handleUpdateAttribute = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender = () => contentRenderDefault[type] || [];
    let defaultData = defaultValue;

    switch (type) {
      case titlePopupHandleProduct.ADD_CATEGORY: {
        typeProduct = typeHandleProduct.CATEGORY;
        defaultData = {
          name: "",
          code: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhóm sản phẩm"),
            code: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.EDIT_CATEGORY: {
        typeProduct = typeHandleProduct.CATEGORY;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhóm sản phẩm"),
            code: yup.string(),
          };
        };
        defaultData = {
          name: defaultValue.label,
          code: defaultValue.code,
          value: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandleProduct.ADD_TYPE: {
        typeProduct = typeHandleProduct.TYPE;
        defaultData = {
          name: "",
          code: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên loại sản phẩm"),
            code: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.EDIT_TYPE: {
        typeProduct = typeHandleProduct.TYPE;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên loại sản phẩm"),
            code: yup.string(),
          };
        };
        defaultData = {
          name: defaultValue.label,
          code: defaultValue.code,
          value: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandleProduct.ADD_BRAND: {
        typeProduct = typeHandleProduct.BRAND;
        defaultData = {
          name: "",
          code: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên thương hiệu"),
            code: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.EDIT_BRAND: {
        typeProduct = typeHandleProduct.BRAND;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên thương hiệu"),
            code: yup.string(),
          };
        };
        defaultData = {
          name: defaultValue.label,
          code: defaultValue.code,
          value: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandleProduct.ADD_SUPPLIER: {
        typeProduct = typeHandleProduct.SUPPLIER;
        defaultData = {
          name: "",
          business_code: "",
          tax_number: "",
          country: "",
          address: "",
          status: optionFilterOperation[0].value,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhà sản xuất"),
            business_code: yup.string(),
            tax_number: yup.string(),
            country: yup.string(),
            address: yup.string(),
            status: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandleProduct.EDIT_SUPPLIER: {
        typeProduct = typeHandleProduct.SUPPLIER;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhà sản xuất"),
            business_code: yup.string(),
            tax_number: yup.string(),
            country: yup.string(),
            address: yup.string(),
            status: yup.string(),
          };
        };
        defaultData = {
          name: defaultValue.label,
          business_code: defaultValue.business_code,
          tax_number: defaultValue.tax_number,
          country: defaultValue.country,
          address: defaultValue.address,
          status: defaultValue.status,
          value: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandleProduct.ADD_ATTRIBUTE: {
        typeProduct = typeHandleProduct.ATTRIBUTE;
        defaultData = {
          name: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên thuộc tính"),
          };
        };
        break;
      }
      case titlePopupHandleProduct.EDIT_ATTRIBUTE: {
        typeProduct = typeHandleProduct.ATTRIBUTE;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên thuộc tính"),
          };
        };
        defaultData = {
          name: defaultValue.label,
          value: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandleProduct.ADD_TAGS: {
        typeProduct = typeHandleProduct.TAGS;
        defaultData = {
          name: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhãn"),
          };
        };
        break;
      }
      case titlePopupHandleProduct.EDIT_TAGS: {
        typeProduct = typeHandleProduct.TAGS;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhãn"),
          };
        };
        defaultData = {
          name: defaultValue.label,
          value: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: type,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    const { name, code } = form;
    setLoadingSubmit(true);

    switch (titlePopup) {
      case titlePopupHandleProduct.ADD_TAGS: {
        const params = {
          tag: name,
        };

        const result: any = await productApi.create(params, "tag/");

        if (result && result.data) {
          const { id = "", tag = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              dataTags: [
                ...dataFilterTags,
                {
                  value: id,
                  label: tag,
                },
              ],
            })
          );

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.EDIT_TAGS: {
        const params = {
          id: defaultData.value,
          tag: name,
        };

        const result: any = await productApi.update(params, "tag/");

        if (result && result.data) {
          const { id = "", tag = "" } = result.data;

          const newArrData = dataFilterTags.reduce((prevArr: any[], current: SelectOptionType) => {
            return defaultData.value === current.value
              ? [
                  ...prevArr,
                  {
                    ...current,
                    label: tag,
                    value: id,
                  },
                ]
              : [...prevArr, current];
          }, []);

          dispatch(
            updateAttributesProduct({
              dataTags: newArrData,
            })
          );
          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }
        break;
      }
      case titlePopupHandleProduct.ADD_ATTRIBUTE: {
        const params = {
          name,
        };

        const result: any = await productApi.create(params, "attribute/");

        if (result && result.data) {
          const { id = "", name = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              variantAttributes: [
                ...dataFilterAttribute,
                {
                  value: id,
                  label: name,
                },
              ],
            })
          );

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }
        break;
      }
      case titlePopupHandleProduct.EDIT_ATTRIBUTE: {
        const params = {
          id: defaultData.value,
          name,
        };

        const result: any = await productApi.update(params, "attribute/");

        if (result && result.data) {
          const { id = "", name = "" } = result.data;

          const newArrData = dataFilterAttribute.reduce(
            (prevArr: any[], current: SelectOptionType) => {
              return defaultData.value === current.value
                ? [
                    ...prevArr,
                    {
                      ...current,
                      label: name,
                      value: id,
                    },
                  ]
                : [...prevArr, current];
            },
            []
          );

          dispatch(
            updateAttributesProduct({
              variantAttributes: newArrData,
            })
          );

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }
        break;
      }
      case titlePopupHandleProduct.ADD_CATEGORY: {
        const params = {
          name,
          code,
        };

        const result: any = await productApi.create(handleParams(params), "category/");
        if (result && result.data) {
          const { id = "", name = "", code = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              dataCategory: [
                ...dataFilterCategory,
                {
                  value: id,
                  label: name,
                  code,
                },
              ],
            })
          );

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.EDIT_CATEGORY: {
        const params = {
          id: defaultData.value,
          name,
          code,
        };

        const result: any = await productApi.update(handleParams(params), "category/");
        if (result && result.data) {
          const { id = "", name = "", code = "" } = result.data;

          const newArrData = dataFilterCategory.reduce(
            (prevArr: any[], current: SelectOptionType) => {
              return defaultData.value === current.value
                ? [
                    ...prevArr,
                    {
                      ...current,
                      label: name,
                      value: id,
                      code,
                    },
                  ]
                : [...prevArr, current];
            },
            []
          );

          dispatch(
            updateAttributesProduct({
              dataCategory: newArrData,
            })
          );

          setNotifications({
            message: message[titlePopup]?.EDIT_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.ADD_SUPPLIER: {
        const params = {
          name: form.name,
          business_code: form.business_code,
          tax_number: form.tax_number,
          country: form.country,
          address: form.address,
          status: form.status,
        };

        const result: any = await productApi.create(handleParams(params), "supplier/");
        if (result && result.data) {
          const { id = "", name = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              dataSupplier: [
                ...dataFilterSupplier,
                {
                  value: id,
                  label: name,
                  ...result.data,
                },
              ],
            })
          );

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.EDIT_SUPPLIER: {
        const params = {
          id: defaultData.value,
          name: form.name,
          business_code: form.business_code,
          tax_number: form.tax_number,
          country: form.country,
          address: form.address,
          status: form.status,
        };

        const result: any = await productApi.update(handleParams(params), "supplier/");
        if (result && result.data) {
          const { id = "", name = "" } = result.data;

          const newArrData = dataFilterSupplier.reduce(
            (prevArr: any[], current: SelectOptionType) => {
              return defaultData.value === current.value
                ? [
                    ...prevArr,
                    {
                      ...current,
                      label: name,
                      value: id,
                    },
                  ]
                : [...prevArr, current];
            },
            []
          );

          dispatch(
            updateAttributesProduct({
              dataSupplier: newArrData,
            })
          );

          setNotifications({
            message: message[titlePopup]?.EDIT_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandleProduct.ADD_TYPE:
      case titlePopupHandleProduct.ADD_BRAND: {
        const params = {
          name,
          code,
          type: typeProduct,
        };

        const result: any = await productApi.create(handleParams(params), "option/");

        if (result && result.data) {
          const { id = "", name = "", code = "" } = result.data;

          dispatch(
            updateAttributesProduct({
              [keyDataFilter[typeProduct]]: [
                ...attributesProduct[keyDataFilter[typeProduct] as keyof typeof attributesProduct],
                {
                  value: id,
                  label: name,
                  code,
                },
              ],
            })
          );

          setNotifications({
            message: message[typeProduct]?.ADD_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }
        break;
      }
      default: {
        const params = {
          id: defaultData.value,
          name,
          code,
          type: typeProduct,
        };

        const result: any = await productApi.update(handleParams(params), "option/");

        if (result && result.data) {
          const { id = "", name = "", code = "" } = result.data;

          const arrData =
            attributesProduct[keyDataFilter[typeProduct] as keyof typeof attributesProduct];
          const newArrData = arrData.reduce((prevArr: any[], current: SelectOptionType) => {
            return defaultData.value === current.value
              ? [
                  ...prevArr,
                  {
                    ...current,
                    label: name,
                    value: id,
                    code,
                  },
                ]
              : [...prevArr, current];
          }, []);

          dispatch(
            updateAttributesProduct({
              [keyDataFilter[typeProduct]]: newArrData,
            })
          );

          setNotifications({
            message: message[titlePopup]?.EDIT_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        }
      }
    }

    setLoadingSubmit(false);
    closePopup();
  };

  const handleRemoveValueAll = (data: SelectOptionType[]) => {
    return filter(data, (item) => item.value !== "all");
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: "Nhóm sản phẩm",
        typeProduct: typeHandleProduct.CATEGORY,
        dataItem: handleRemoveValueAll(dataFilterCategory),
        titlePopupAdd: titlePopupHandleProduct.ADD_CATEGORY,
        titlePopupEdit: titlePopupHandleProduct.EDIT_CATEGORY,
      },
      {
        title: "Loại sản phẩm",
        typeProduct: typeHandleProduct.TYPE,
        dataItem: handleRemoveValueAll(dataFilterType),
        titlePopupAdd: titlePopupHandleProduct.ADD_TYPE,
        titlePopupEdit: titlePopupHandleProduct.EDIT_TYPE,
      },
      {
        title: "Thương hiệu",
        typeProduct: typeHandleProduct.BRAND,
        dataItem: handleRemoveValueAll(dataFilterBrand),
        titlePopupAdd: titlePopupHandleProduct.ADD_BRAND,
        titlePopupEdit: titlePopupHandleProduct.EDIT_BRAND,
      },
      {
        title: "Nhà sản xuất",
        typeProduct: typeHandleProduct.SUPPLIER,
        dataItem: handleRemoveValueAll(dataFilterSupplier),
        titlePopupAdd: titlePopupHandleProduct.ADD_SUPPLIER,
        titlePopupEdit: titlePopupHandleProduct.EDIT_SUPPLIER,
      },
      {
        title: "Thuộc tính sản phẩm",
        typeProduct: typeHandleProduct.ATTRIBUTE,
        dataItem: dataFilterAttribute,
        titlePopupAdd: titlePopupHandleProduct.ADD_ATTRIBUTE,
        titlePopupEdit: titlePopupHandleProduct.EDIT_ATTRIBUTE,
      },
      {
        title: "Nhãn",
        typeProduct: typeHandleProduct.TAGS,
        dataItem: dataFilterTags,
        titlePopupAdd: titlePopupHandleProduct.ADD_TAGS,
        titlePopupEdit: titlePopupHandleProduct.EDIT_TAGS,
      },
    ];
  }, [
    dataFilterCategory,
    dataFilterType,
    dataFilterBrand,
    dataFilterAttribute,
    dataFilterTags,
    dataFilterSupplier,
  ]);

  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      {dataRender.map((item: any, index: number) => {
        return (
          <Grid key={index} xs={12} md={6} item>
            <AttributeCollapse
              title={item.title}
              dataRenderAttribute={item.dataItem}
              handleAdd={() => handleUpdateAttribute(item.titlePopupAdd)}
              handleEdit={(objValue: SelectOptionType) =>
                handleUpdateAttribute(item.titlePopupEdit, objValue)
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AttributeTab;
