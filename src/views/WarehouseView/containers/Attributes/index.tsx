// Libraries
import { useEffect, useMemo } from "react";
import filter from "lodash/filter";
import map from "lodash/map";
import reduce from "lodash/reduce";

// Services
import { productApi } from "_apis_/product";

// Store Context
import usePopup from "hooks/usePopup";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { updateAttributesWarehouse } from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import AttributeCollapse from "components/Collapses/CollapseAttribute";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants
import {
  typeHandle,
  contentRenderDefault,
  titlePopupHandle,
  message,
  keyDataFilter,
} from "views/WarehouseView/constants";
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { TypeWarehouseSheet } from "_types_/WarehouseType";

const Attributes = () => {
  const dispatch = useAppDispatch();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { importReason, exportReason, transferReason, stocktakingReason } = attributesWarehouse;
  const { setNotifications, setDataPopup, dataPopup, dataForm, setLoadingSubmit, closePopup } =
    usePopup();
  const { listWarehouse: dataWarehouse } = attributesWarehouse;
  const { title: titlePopup, type: typePopup } = dataPopup;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const handleUpdateAttribute = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let title = type;
    let newContentRender = () => contentRenderDefault[type] || [];
    let defaultData = defaultValue;
    let maxWidthForm: GridSizeType = "sm";
    let isDisabledSubmit = true;
    let isShowFooter = true;
    let isFullScreen = false;

    switch (type) {
      case titlePopupHandle.ADD_IMPORTS_REASON: {
        typeProduct = typeHandle.IMPORTS_REASON;
        defaultData = {
          name: "",
          type: TypeWarehouseSheet.IMPORTS,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do nhập hàng"),
          };
        };
        break;
      }
      case titlePopupHandle.EDIT_IMPORTS_REASON: {
        typeProduct = typeHandle.IMPORTS_REASON;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do nhập hàng"),
          };
        };
        defaultData = {
          name: defaultValue.label,
          id: defaultValue.value,
          type: TypeWarehouseSheet.IMPORTS,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandle.ADD_EXPORTS_REASON: {
        typeProduct = typeHandle.EXPORTS_REASON;
        defaultData = {
          name: "",
          type: TypeWarehouseSheet.EXPORTS,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do xuất hàng"),
          };
        };
        break;
      }
      case titlePopupHandle.EDIT_EXPORTS_REASON: {
        typeProduct = typeHandle.EXPORTS_REASON;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do xuất hàng"),
          };
        };
        defaultData = {
          name: defaultValue.label,
          id: defaultValue.value,
          type: TypeWarehouseSheet.EXPORTS,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandle.ADD_TRANSFER_REASON: {
        typeProduct = typeHandle.TRANSFER_REASON;
        defaultData = {
          name: "",
          type: TypeWarehouseSheet.TRANSFER,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do chuyển hàng"),
          };
        };
        break;
      }
      case titlePopupHandle.EDIT_TRANSFER_REASON: {
        typeProduct = typeHandle.TRANSFER_REASON;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do chuyển hàng"),
          };
        };
        defaultData = {
          name: defaultValue.label,
          id: defaultValue.value,
          type: TypeWarehouseSheet.TRANSFER,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandle.ADD_STOCKTAKING_REASON: {
        typeProduct = typeHandle.STOCKTAKING_REASON;
        defaultData = {
          name: "",
          type: TypeWarehouseSheet.STOCKTAKING,
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do kiểm hàng"),
          };
        };
        break;
      }
      case titlePopupHandle.EDIT_STOCKTAKING_REASON: {
        typeProduct = typeHandle.STOCKTAKING_REASON;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập lí do kiểm hàng"),
          };
        };
        defaultData = {
          name: defaultValue.label,
          id: defaultValue.value,
          type: TypeWarehouseSheet.STOCKTAKING,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      isFullScreen,
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

  const handleUpdateDefaultWarehouse = async (objItem: Partial<any>, objData: SelectOptionType) => {
    const param = {
      id: objData.id,
      ...objItem,
    };

    const result = await productApi.update(param, "warehouse/");

    if (result && result.data) {
      const newDataWarehouse = map(dataWarehouse, (item) => {
        return item.id === objData.id
          ? {
              ...item,
              ...objItem,
            }
          : item;
      });

      setNotifications({
        message: "Cập nhật thành công",
        variant: statusNotification.SUCCESS,
      });

      dispatch(
        updateAttributesWarehouse({
          listWarehouse: newDataWarehouse,
        })
      );
    }
  };

  const handleRemoveValueAll = (data: SelectOptionType[]) => {
    return filter(data, (item) => item.value !== "all");
  };

  const handleSubmitPopup = async (form: any) => {
    switch (titlePopup) {
      case titlePopupHandle.ADD_IMPORTS_REASON:
      case titlePopupHandle.ADD_EXPORTS_REASON:
      case titlePopupHandle.ADD_TRANSFER_REASON:
      case titlePopupHandle.ADD_STOCKTAKING_REASON: {
        const params = {
          name: form.name,
          type: form.type,
        };

        setLoadingSubmit(true);

        const newParams = handleParams(params);

        const result: any = await productApi.create(newParams, "warehouse-sheet/reason/");

        if (result && result.data) {
          const { id, name } = result.data;
          let newData = [
            ...attributesWarehouse[keyDataFilter[typePopup] as keyof typeof attributesWarehouse],
          ];

          dispatch(
            updateAttributesWarehouse({
              [keyDataFilter[typePopup]]: [
                ...newData,
                {
                  label: name,
                  value: id,
                },
              ],
            })
          );

          setNotifications({
            message: message[typePopup]?.OPERATION_SUCCESS,
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
          }
        }
        setLoadingSubmit(false);

        break;
      }
      default: {
        const params = {
          id: form.id,
          name: form.name,
          type: form.type,
        };

        setLoadingSubmit(true);

        const newParams = handleParams(params);

        const result: any = await productApi.update(newParams, "warehouse-sheet/reason/");

        if (result && result.data) {
          const { id, name } = result.data;
          const newData = reduce(
            [...attributesWarehouse[keyDataFilter[typePopup] as keyof typeof attributesWarehouse]],
            (prevArr, current) => {
              return current.value === id
                ? [
                    ...prevArr,
                    {
                      label: name,
                      value: id,
                    },
                  ]
                : [...prevArr, current];
            },
            []
          );

          dispatch(
            updateAttributesWarehouse({
              [keyDataFilter[typePopup]]: newData,
            })
          );

          setNotifications({
            message: message[typePopup]?.OPERATION_SUCCESS,
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
          }
        }
        setLoadingSubmit(false);
      }
    }
  };

  const handleRenderWarehouseSend = () => {
    return map(dataWarehouse, (item) => ({
      ...item,
      content: (
        <Grid container direction="row" alignItems="center" sx={{ py: 2 }}>
          <Grid item xs={11.5}>
            <Typography style={{ width: "100%", fontSize: 14 }}>{item.label}</Typography>
          </Grid>
          <Grid item xs={0.5}>
            <Switch
              checked={item.is_default}
              onChange={(event, checked) =>
                handleUpdateDefaultWarehouse({ is_default: checked }, item)
              }
            />
          </Grid>
        </Grid>
      ),
    }));
  };

  const handleRenderWarehouseSale = () => {
    return map(dataWarehouse, (item) => ({
      ...item,
      content: (
        <Grid container direction="row" alignItems="center" sx={{ py: 2 }}>
          <Grid item xs={11.5}>
            <Typography style={{ width: "100%", fontSize: 14 }}>{item.label}</Typography>
          </Grid>
          <Grid item xs={0.5}>
            <Switch
              checked={item.is_sales}
              onChange={(event, checked) =>
                handleUpdateDefaultWarehouse({ is_sales: checked }, item)
              }
            />
          </Grid>
        </Grid>
      ),
    }));
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: "Lý do nhập hàng",
        typeProduct: typeHandle.IMPORTS_REASON,
        dataItem: handleRemoveValueAll(importReason),
        titlePopupAdd: titlePopupHandle.ADD_IMPORTS_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_IMPORTS_REASON,
      },
      {
        title: "Lý do xuất hàng",
        typeProduct: typeHandle.EXPORTS_REASON,
        dataItem: handleRemoveValueAll(exportReason),
        titlePopupAdd: titlePopupHandle.ADD_EXPORTS_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_EXPORTS_REASON,
      },
      {
        title: "Lý do chuyển hàng",
        typeProduct: typeHandle.TRANSFER_REASON,
        dataItem: handleRemoveValueAll(transferReason),
        titlePopupAdd: titlePopupHandle.ADD_TRANSFER_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_TRANSFER_REASON,
      },
      {
        title: "Lý do kiểm hàng",
        typeProduct: typeHandle.STOCKTAKING_REASON,
        dataItem: handleRemoveValueAll(stocktakingReason),
        titlePopupAdd: titlePopupHandle.ADD_STOCKTAKING_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_STOCKTAKING_REASON,
      },
      {
        title: "Kho giao mặc định",
        typeProduct: typeHandle.DEFAULT_WAREHOUSE_SEND,
        dataItem: handleRenderWarehouseSend(),
      },
      {
        title: "Kho bán hàng mặc định",
        typeProduct: typeHandle.DEFAULT_WAREHOUSE_SALE,
        dataItem: handleRenderWarehouseSale(),
      },
    ];
  }, [importReason, exportReason, transferReason, stocktakingReason, dataWarehouse]);

  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      {map(dataRender, (item: any, index: number) => {
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
