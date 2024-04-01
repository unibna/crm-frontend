// Libraries
import { useEffect, useMemo } from "react";
import filter from "lodash/filter";
import map from "lodash/map";

// Services
import { windflowApi } from "_apis_/windflow.api";

// Hooks
import usePopup from "hooks/usePopup";

// Context & Store
import { getAllAttributesDataFlow } from "selectors/attributes";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { updateAttributesDataFlow } from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import AttributeCollapse from "components/Collapses/CollapseAttribute";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { GridSizeType } from "_types_/GridLayoutType";
import { CREDENTIAL_TYPE } from "_types_/DataFlowType";

// Constants
import { contentRenderDefault, titlePopupHandle } from "views/DataFlow/constants";
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

const Attributes = () => {
  const dispatch = useAppDispatch();
  const attributesDataFlow = useAppSelector((state) => getAllAttributesDataFlow(state.attributes));
  const { setNotifications, setDataPopup, dataPopup, dataForm, setLoadingSubmit, closePopup } =
    usePopup<{
      id?: string;
      name: string;
      type: number;
      token?: string;
      url?: string;
      email?: string;
      password?: string;
      api_token?: string;
    }>();

  useEffect(() => {
    if (Object.values(dataForm).length) {
      submitPopup();
    }
  }, [dataForm]);

  const handleUpdateAttribute = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = type;
    let funcContentSchema: any;
    let buttonTextPopup = "Cập nhật";
    let title = titlePopupHandle[type];
    let newContentRender = (methods: any) => contentRenderDefault[type];
    let defaultData = defaultValue;
    let maxWidthForm: GridSizeType = "sm";
    let isDisabledSubmit = true;
    let isShowFooter = true;

    switch (type) {
      case CREDENTIAL_TYPE.SKY_FEATURE:
      case CREDENTIAL_TYPE.WORKPLACE_CHATBOT:
      case CREDENTIAL_TYPE.GOOGLE: {
        defaultData = {
          id: defaultValue.id || "",
          name: defaultValue.name || "",
          type: type,
          token: getObjectPropSafely(() => defaultValue.credential.token) || "",
          email: getObjectPropSafely(() => defaultValue.credential.email) || "",
          password: getObjectPropSafely(() => defaultValue.credential.password) || "",
          api_token: getObjectPropSafely(() => defaultValue.credential.api_token) || "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên tài khoản").trim(),
            type: yup.string(),
            token: yup.string(),
            email: yup.string(),
            password: yup.string(),
            api_token: yup.string(),
          };
        };
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
    setLoadingSubmit(true);

    switch (dataPopup.type) {
      case CREDENTIAL_TYPE.SKY_FEATURE:
      case CREDENTIAL_TYPE.WORKPLACE_CHATBOT:
      case CREDENTIAL_TYPE.GOOGLE: {
        const params = handleParams({
          name: dataForm.name,
          id: dataForm.id,
          credential: {
            type: dataForm.type,
            data: handleParams({
              token: dataForm.token,
              url: dataPopup.type === CREDENTIAL_TYPE.SKY_FEATURE ? window.location.origin : "",
              email: dataForm.email || "",
              password: dataForm.password || "",
              api_token: dataForm.api_token || "",
            }),
          },
        });

        let result: any;

        if (params.id) {
          result = await windflowApi.update({ ...params }, "credentials/");
        } else {
          result = await windflowApi.create({ ...params }, "credentials");
        }

        if (result && result.data) {
          const { data } = result.data;
          let newData = [];
          if (params.id) {
            newData = map(attributesDataFlow[dataPopup.type], (item) => {
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
              ...attributesDataFlow[dataPopup.type],
              {
                ...data,
                label: data.name,
                value: data.id,
              },
            ];
          }

          setNotifications({
            message: "Cập nhật thành công",
            variant: statusNotification.SUCCESS,
          });

          dispatch(
            updateAttributesDataFlow({
              [dataPopup.type]: newData,
            })
          );
          closePopup();
        }
      }
    }

    setLoadingSubmit(false);
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: "Tài khoản Google",
        typeProduct: CREDENTIAL_TYPE.GOOGLE,
        dataItem: handleRemoveValueAll(attributesDataFlow[CREDENTIAL_TYPE.GOOGLE]),
        titlePopupAdd: CREDENTIAL_TYPE.GOOGLE,
        titlePopupEdit: CREDENTIAL_TYPE.GOOGLE,
      },
      {
        title: "Tài khoản Sky",
        typeProduct: CREDENTIAL_TYPE.SKY_FEATURE,
        dataItem: handleRemoveValueAll(attributesDataFlow[CREDENTIAL_TYPE.SKY_FEATURE]),
        titlePopupAdd: CREDENTIAL_TYPE.SKY_FEATURE,
        titlePopupEdit: CREDENTIAL_TYPE.SKY_FEATURE,
      },
      {
        title: "Tài khoản Workplace",
        typeProduct: CREDENTIAL_TYPE.WORKPLACE_CHATBOT,
        dataItem: handleRemoveValueAll(attributesDataFlow[CREDENTIAL_TYPE.WORKPLACE_CHATBOT]),
        titlePopupAdd: CREDENTIAL_TYPE.WORKPLACE_CHATBOT,
        titlePopupEdit: CREDENTIAL_TYPE.WORKPLACE_CHATBOT,
      },
    ];
  }, [attributesDataFlow]);

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
