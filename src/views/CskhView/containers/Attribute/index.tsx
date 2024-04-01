// Libraries
import { useEffect, useMemo } from "react";
import map from "lodash/map";

// Services
import { skytableApi } from "_apis_/skytable.api";

// Store & Hooks
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import usePopup from "hooks/usePopup";
import { getAllAttributesCskh } from "selectors/attributes";
import { updateAttributesCskh } from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { MButton } from "components/Buttons";
import AttributeCollapse from "components/Collapses/CollapseAttribute";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { DataRenderAttribute, AttributeValue, Attributes } from "_types_/AirTableType";

// Constants & Utils
import {
  titlePopupHandleAirtable,
  typeHandleAirtable,
  contentRenderDefault,
  message,
  CHANGE_TITLE,
  TYPE_ATTRIBUTE,
} from "views/CskhView/constants";
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { statusNotification } from "constants/index";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";

const Attribute = () => {
  const { dataPopup, dataForm, isLoadingSubmit, isLoadingSubmitChild, setLoadingSubmit, setDataPopup, setNotifications } =
    usePopup();
  const { title: titlePopup, defaultData } = dataPopup;
  const dispatch = useAppDispatch();
  const attributesCskh = useAppSelector((state) => getAllAttributesCskh(state.attributes));
  const { attributes: dataAttributes } = attributesCskh;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const handleClosePopup = () => {
    setDataPopup({
      ...dataPopup,
      isOpenPopup: false,
    });
    !isLoadingSubmit && setLoadingSubmit(false);
  };

  const handleUpdateAttribute = (
    type: string = "",
    objValueAttribute: DataRenderAttribute | { [key: string]: number | string } = {},
    objValueAttributeValue: AttributeValue | { [key: string]: number | string } = {}
  ) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender = () => contentRenderDefault[type] || [];
    let defaultData = {};

    switch (type) {
      case titlePopupHandleAirtable.ADD_ATTRIBUTES: {
        typeProduct = typeHandleAirtable.ADD_ATTRIBUTES;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required(VALIDATION_MESSAGE.ENTER_ATTRIBUTE_NAME_PLEASE),
          };
        };
        defaultData = {
          name: "",
        };
        break;
      }
      case titlePopupHandleAirtable.ADD_ATTRIBUTES_VALUE: {
        typeProduct = typeHandleAirtable.ADD_ATTRIBUTES_VALUE;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required(VALIDATION_MESSAGE.ENTER_ATTRIBUTE_NAME_PLEASE),
            color: yup.string().required(VALIDATION_MESSAGE.ENTER_ATTRIBUTE_COLOR_PLEASE),
          };
        };
        defaultData = {
          name: "",
          color: "",
          attribute: objValueAttribute?.id,
        };
        break;
      }
      case titlePopupHandleAirtable.EDIT_ATTRIBUTES_VALUE: {
        typeProduct = typeHandleAirtable.EDIT_ATTRIBUTES_VALUE;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required(VALIDATION_MESSAGE.ENTER_ATTRIBUTE_NAME_PLEASE),
            color: yup.string().required(VALIDATION_MESSAGE.ENTER_ATTRIBUTE_COLOR_PLEASE),
          };
        };
        defaultData = {
          name: objValueAttributeValue.label || "",
          id: objValueAttributeValue.value || "",
          attribute: objValueAttribute?.id,
          color: getObjectPropSafely(() => objValueAttributeValue.extra.color) || "",
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
    const { name, color = "" } = form;
    switch (titlePopup) {
      case titlePopupHandleAirtable.ADD_ATTRIBUTES: {
        const params = {
          name,
          type: TYPE_ATTRIBUTE,
        };

        setLoadingSubmit(true);

        const result: any = await skytableApi.create(handleParams(params), "attributes/");

        if (result && result.data) {
          const { id = "", name = "", value = [] } = result.data;

          dispatch(
            updateAttributesCskh({
              attributes: [
                ...dataAttributes,
                {
                  value: id,
                  label: name,
                  attributeValue: map(value, (itemValue) => ({
                    value: itemValue.id,
                    label: itemValue.value,
                  })),
                },
              ],
            })
          );

          setNotifications({
            message: message[titlePopup]?.OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        } else {
          setNotifications({
            message: message[titlePopup]?.OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

        setLoadingSubmit(false);
        break;
      }
      case titlePopupHandleAirtable.ADD_ATTRIBUTES_VALUE: {
        const params = {
          value: name,
          attribute: defaultData.attribute,
          extra: {
            color,
          },
        };

        setLoadingSubmit(true);

        const result: any = await skytableApi.create(handleParams(params), "attribute-values/");

        if (result && result.data) {
          const { id = "", value = "", attribute = "", extra } = result.data;
          const newDataAttributes = map(dataAttributes, (item: Attributes) => {
            return item.value === attribute
              ? {
                  ...item,
                  attributeValue: [
                    ...item.attributeValue,
                    {
                      label: value,
                      value: id,
                      extra,
                    },
                  ],
                }
              : item;
          });

          dispatch(
            updateAttributesCskh({
              attributes: newDataAttributes,
            })
          );

          setNotifications({
            message: message[titlePopup]?.OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        } else {
          setNotifications({
            message: message[titlePopup]?.OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

       

        setLoadingSubmit(true);
        break;
      }
      case titlePopupHandleAirtable.EDIT_ATTRIBUTES_VALUE: {
        const params = {
          value: name,
          attribute: defaultData.attribute,
          extra: {
            color,
          },
          id: defaultData.id,
        };

        setLoadingSubmit(true);

        const result: any = await skytableApi.update(handleParams(params), "attribute-values/");

        if (result && result.data) {
          const { id = "", value = "", attribute = "", extra } = result.data;
          const newDataAttributes = map(dataAttributes, (item: Attributes) => {
            const newAttributeValue = item.attributeValue.reduce(
              (prevArr: any, current: AttributeValue) => {
                return current.value === id
                  ? [
                      ...prevArr,
                      {
                        ...current,
                        extra,
                        value: id,
                        label: value,
                      },
                    ]
                  : [...prevArr, current];
              },
              []
            );

            return item.value === attribute
              ? {
                  ...item,
                  attributeValue: newAttributeValue,
                }
              : item;
          });

          dispatch(
            updateAttributesCskh({
              attributes: newDataAttributes,
            })
          );

          setNotifications({
            message: message[titlePopup]?.OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });
        } else {
          setNotifications({
            message: message[titlePopup]?.OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

        setLoadingSubmit(false);
      }
    }

    handleClosePopup();
  };

  const handleRenderDataItem = (data: SelectOptionType[]) => {
    return map(data, (option) => ({
      ...option,
      content: (
        <Chip
          size="small"
          label={option.label}
          sx={{
            ...(getObjectPropSafely(() => option.extra.color) && {
              backgroundColor: getObjectPropSafely(() => option.extra.color),
              color: "#fff",
            }),
          }}
        />
      ),
    }));
  };

  const dataRender = useMemo(() => {
    return map(dataAttributes, (item) => {
      return {
        id: item.value,
        title: CHANGE_TITLE[item.label] || item.label,
        dataItem: handleRenderDataItem(item.attributeValue),
        titlePopupAdd: titlePopupHandleAirtable.ADD_ATTRIBUTES_VALUE,
        titlePopupEdit: titlePopupHandleAirtable.EDIT_ATTRIBUTES_VALUE,
      };
    });
  }, [dataAttributes]);

  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      <Grid xs={12} md={12} item sx={{ mb: 2 }}>
        <MButton
          size="medium"
          onClick={() => handleUpdateAttribute(titlePopupHandleAirtable.ADD_ATTRIBUTES)}
        >
          Thêm thuộc tính
        </MButton>
      </Grid>
      {dataRender.map((item: DataRenderAttribute, index: number) => {
        return (
          <Grid key={index} xs={12} md={6} item>
            <AttributeCollapse
              title={item.title}
              dataRenderAttribute={item.dataItem}
              handleAdd={() => handleUpdateAttribute(item.titlePopupAdd, item)}
              handleEdit={(objValue: SelectOptionType) =>
                handleUpdateAttribute(item.titlePopupEdit, item, objValue)
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Attribute;
