// Libraries
import { useEffect, useMemo } from "react";
import filter from "lodash/filter";
import map from "lodash/map";

// Services
import { deliveryApi } from "_apis_/delivery.api";

// Hooks
import usePopup from "hooks/usePopup";

// Context & Store
import { getAllAttributesShipping } from "selectors/attributes";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { updateAttributesShipping } from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import AttributeCollapse from "components/Collapses/CollapseAttribute";
import PopupAttributes from "views/ShippingView/components/PopupAttributes";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants
import {
  typeHandle,
  titlePopupHandle,
  TYPE_SHIPPING_COMPANIES,
  message,
} from "views/ShippingView/constants";
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { SHIPPING_COMPANIES } from "_types_/GHNType";

const Attributes = () => {
  const dispatch = useAppDispatch();
  const attributesShipping = useAppSelector((state) => getAllAttributesShipping(state.attributes));
  const { setNotifications, setDataPopup, dataPopup, dataForm, setLoadingSubmit } = usePopup<{
    id?: string;
    name: string;
    valueA: string;
    valueB: string;
    type: number;
  }>();

  useEffect(() => {
    if (Object.values(dataForm).length) {
      submitPopup();
    }
  }, [dataForm]);

  const handleUpdateAttribute = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let title = type;
    let newContentRender = (methods: any) => <PopupAttributes {...methods} />;
    let defaultData = defaultValue;
    let maxWidthForm: GridSizeType = "sm";
    let isDisabledSubmit = true;
    let isShowFooter = true;

    switch (type) {
      case titlePopupHandle.ADD_SHIPPING_COMPANIES: {
        typeProduct = typeHandle.SHIPPING_COMPANIES;
        defaultData = {
          name: "",
          type: TYPE_SHIPPING_COMPANIES[0].value,
          valueA: "",
          valueB: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên đơn vị vận chuyển").trim(),
            type: yup.number(),
            valueA: yup.string(),
            valueB: yup.string(),
          };
        };
        break;
      }
      case titlePopupHandle.EDIT_SHIPPING_COMPANIES: {
        typeProduct = typeHandle.SHIPPING_COMPANIES;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên đơn vị vận chuyển").trim(),
            type: yup.number(),
            valueA: yup.string(),
            valueB: yup.string(),
          };
        };
        defaultData = {
          name: defaultValue.label,
          id: defaultValue.value,
          type: defaultValue.type,
          valueA: defaultValue.ghn_token || defaultValue.vn_post_username,
          valueB: defaultValue.ghn_shop_id || defaultValue.vn_post_password,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
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

  const handleRemoveValueAll = (data: SelectOptionType[]) => {
    return filter(data, (item) => item.value !== "all");
  };

  const submitPopup = async () => {
    if (dataForm.type === SHIPPING_COMPANIES.GHN && (!dataForm.valueA || !dataForm.valueB)) {
      setNotifications({
        message: "Vui lòng nhập token, shop ID",
        variant: statusNotification.ERROR,
      });
    }

    if (dataForm.type === SHIPPING_COMPANIES.VNPOST && (!dataForm.valueA || !dataForm.valueB)) {
      setNotifications({
        message: "Vui lòng nhập tài khoản, mật khẩu",
        variant: statusNotification.ERROR,
      });
    }

    setLoadingSubmit(true);

    const params = handleParams({
      name: dataForm.name,
      type: dataForm.type,
      ...(dataForm.type === SHIPPING_COMPANIES.GHN
        ? {
            ghn_token: dataForm.valueA,
            ghn_shop_id: dataForm.valueB,
          }
        : {
            vn_post_username: dataForm.valueA,
            vn_post_password: dataForm.valueB,
          }),
      id: dataForm.id,
    });

    let result: any;

    if (params.id) {
      result = await deliveryApi.update(params, "delivery-company/");
    } else {
      result = await deliveryApi.create(params, "delivery-company/");
    }

    if (result && result.data) {
      const { data } = result;
      setNotifications({
        message: message[dataPopup.title].OPERATION_SUCCESS,
        variant: statusNotification.SUCCESS,
      });

      let newData = [];

      if (params.id) {
        newData = map(attributesShipping.deliveryCompany, (item) => {
          return data.id === item.value
            ? {
                ...data,
                label: data.name,
                value: data.id,
              }
            : item;
        });
      } else {
        newData = [
          ...attributesShipping.deliveryCompany,
          {
            ...data,
            label: data.name,
            value: data.id,
          },
        ];
      }

      dispatch(
        updateAttributesShipping({
          deliveryCompany: [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newData,
          ],
        })
      );

      setLoadingSubmit(false);

      setDataPopup({
        ...dataPopup,
        isOpenPopup: false,
      });
    }
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: "Đơn vị vận chuyển",
        typeProduct: typeHandle.SHIPPING_COMPANIES,
        dataItem: handleRemoveValueAll(attributesShipping.deliveryCompany),
        titlePopupAdd: titlePopupHandle.ADD_SHIPPING_COMPANIES,
        titlePopupEdit: titlePopupHandle.EDIT_SHIPPING_COMPANIES,
      },
    ];
  }, [attributesShipping.deliveryCompany]);

  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      {dataRender.map((item: any, index: number) => {
        return (
          <Grid key={index} xs={12} md={6} item>
            <AttributeCollapse
              title={item.title}
              dataRenderAttribute={item.dataItem}
              handleAdd={
                item.titlePopupAdd ? () => handleUpdateAttribute(item.titlePopupAdd) : undefined
              }
              handleEdit={
                item.titlePopupEdit
                  ? (objValue: SelectOptionType) =>
                      handleUpdateAttribute(item.titlePopupEdit, objValue)
                  : undefined
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Attributes;
