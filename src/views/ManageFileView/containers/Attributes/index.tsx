// Libraries
import { useMemo, useEffect, useContext } from "react";
import map from "lodash/map";

// Services
import { skytableApi } from "_apis_/skytable.api";

// Store & Hooks
import usePopup from "hooks/usePopup";
import { StoreManageFile } from "views/ManageFileView/contextStore";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { getAllAttributesManageFile } from "selectors/attributes";
import { updateAttributesManageFile } from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { MButton } from "components/Buttons";
import AttributeCollapse from "components/Collapses/CollapseAttribute";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import {
  DataRenderAttribute,
  AttributeValue,
  Attributes as AttributesType,
} from "_types_/AirTableType";

// Constants & Utils
import {
  titlePopupHandleAirtable,
  typeHandleAirtable,
  contentRenderDefault,
  message,
  CHANGE_TITLE,
  TYPE_ATTRIBUTE,
} from "views/ManageFileView/constants";
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { statusNotification } from "constants/index";

const Attributes = () => {
  const dispatch = useAppDispatch();
  const { setNotifications, setDataPopup, dataPopup, dataForm } = usePopup();
  const attributesManageFile = useAppSelector((state) =>
    getAllAttributesManageFile(state.attributes)
  );
  const { attributes: dataAttributes } = attributesManageFile;
  const { title: titlePopup, defaultData } = dataPopup;
  const { dispatch: dispatchStore } = useContext(StoreManageFile);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const handleClosePopup = () => {
    setDataPopup({
      ...dataPopup,
      isLoadingButton: false,
      isOpenPopup: false,
    });
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
            name: yup.string().required("Vui lòng nhập tên thuộc tính"),
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
            name: yup.string().required("Vui lòng nhập tên thuộc tính"),
            color: yup.string().required("Vui lòng chọn màu cho thuộc tính"),
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
            name: yup.string().required("Vui lòng nhập tên thuộc tính"),
            color: yup.string().required("Vui lòng chọn màu cho thuộc tính"),
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
    setDataPopup({
      ...dataPopup,
      isLoadingButton: true,
    });

    switch (titlePopup) {
      case titlePopupHandleAirtable.ADD_ATTRIBUTES: {
        const params = {
          name,
          type: TYPE_ATTRIBUTE,
        };

        const result: any = await skytableApi.create(handleParams(params), "attributes/");

        if (result && result.data) {
          const { id = "", name = "", value = [] } = result.data;

          dispatch(
            updateAttributesManageFile({
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

        const result: any = await skytableApi.create(handleParams(params), "attribute-values/");

        if (result && result.data) {
          const { id = "", value = "", attribute = "", extra } = result.data;
          const newDataAttributes = map(dataAttributes, (item: AttributesType) => {
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
            updateAttributesManageFile({
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

        const result: any = await skytableApi.update(handleParams(params), "attribute-values/");

        if (result && result.data) {
          const { id = "", value = "", attribute = "", extra } = result.data;
          const newDataAttributes = map(dataAttributes, (item: AttributesType) => {
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
            updateAttributesManageFile({
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
        title: CHANGE_TITLE[item.label],
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

export default Attributes;
