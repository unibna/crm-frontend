// Libraries
import { useEffect, useState } from "react";
import every from "lodash/every";
import reduce from "lodash/reduce";
import map from "lodash/map";
import isEqual from "lodash/isEqual";
import some from "lodash/some";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

// Services
import { productApi } from "_apis_/product";

// Context
import usePopup from "hooks/usePopup";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { useAppSelector } from "hooks/reduxHook";

// Components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MButton } from "components/Buttons";
import CircularProgress from "@mui/material/CircularProgress";
import AttachLot from "views/WarehouseView/components/AttachLot";
import InformationVariant from "views/WarehouseView/components/InformationVariant";
import WarehouseCheck from "views/WarehouseView/components/WarehouseCheck";

// Types
import { AttributeVariant, BatchType } from "_types_/ProductType";
import { FormValuesProps } from "components/Popups/FormPopup";
import { InventorySheetDetailType, TypeWarehouseSheet } from "_types_/WarehouseType";

// Constants
import { NameSheetOperation } from "views/WarehouseView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import vi from "locales/vi.json";
import { ROLE_TAB, STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import { handleParams } from "utils/formatParamsUtil";
import { statusNotification } from "constants/index";
import { message } from "views/WarehouseView/constants";
import { PATH_DASHBOARD } from "routes/paths";

// -------------------------------------------------------------------

const SheetOperation = () => {
  const paramRouter = useParams();
  const { setNotifications } = usePopup();
  const navigate = useNavigate();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { listWarehouse: dataWarehouse } = attributesWarehouse;

  // State
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [defaultValue, setDefaultValue] = useState({
    variantsSelected: [],
    note: "",
    isConfirm: false,
    reason: "",
    order_id: null,
    warehouse: "all",
    list: [],
  });
  const typeWarehouseSheet: TypeWarehouseSheet =
    TypeWarehouseSheet[paramRouter?.type?.toLocaleUpperCase() as keyof typeof TypeWarehouseSheet];

  const NewProductSchema = Yup.object().shape(
    typeWarehouseSheet === TypeWarehouseSheet.STOCKTAKING
      ? {
          note: Yup.string(),
          isConfirm: Yup.bool(),
          reason: Yup.string().required("Vui lòng chọn lý do"),
          list: Yup.array(),
          warehouse: Yup.string().required("Vui lòng chọn kho"),
        }
      : {
          variantsSelected: Yup.array().test({
            name: "variantsSelected",
            message: "Vui lòng chọn lô",
            test: (value: any) =>
              !!value.length &&
              every(value, (item) => getObjectPropSafely(() => item.batchesSelected.length)),
          }),
          note: Yup.string(),
          order_id: Yup.mixed(),
          isConfirm: Yup.bool(),
          reason: Yup.string().required("Vui lòng chọn lý do"),
        }
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
  });

  const { watch, reset, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    reset({
      ...defaultValue,
      warehouse:
        typeWarehouseSheet === TypeWarehouseSheet.STOCKTAKING
          ? getObjectPropSafely(() => dataWarehouse[0].value)
          : defaultValue.warehouse,
    });
  }, []);

  const timeOutRedirect = (value: STATUS_ROLE_WAREHOUSE) => {
    setTimeout(
      () =>
        navigate(
          `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][value as keyof typeof PATH_DASHBOARD.warehouse]}`
        ),
      1000
    );
  };

  const saveInformationSheet = async () => {
    setLoadingSubmit(true);

    switch (paramRouter?.type) {
      case STATUS_ROLE_WAREHOUSE.IMPORTS: {
        let inventoriesCreate: any[] = [];

        const newInventories = getObjectPropSafely(() => values.variantsSelected.length)
          ? reduce(
              values.variantsSelected,
              (prevArr: any, current: AttributeVariant) => {
                const newSelected = getObjectPropSafely(() => current?.batchesSelected?.length)
                  ? reduce(
                      current.batchesSelected,
                      (prevArrChil, item) => {
                        if (item.isNew) {
                          inventoriesCreate = [
                            ...inventoriesCreate,
                            {
                              quantity: item.quantity,
                              warehouse: getObjectPropSafely(() => current?.warehouse?.id),
                              variant_batch: handleParams({
                                batch_name: item.batch_name || "",
                                expiry_date: item.expiry_date || "",
                                variant: item.variant,
                              }),
                            },
                          ];
                          return prevArrChil;
                        } else {
                          return [
                            ...prevArrChil,
                            {
                              quantity: item.quantity,
                              warehouse: getObjectPropSafely(() => current?.warehouse?.id),
                              variant_batch: item.id,
                            },
                          ];
                        }
                      },
                      []
                    )
                  : [];

                return [...prevArr, ...newSelected];
              },
              []
            )
          : [];

        if (!newInventories.length && !inventoriesCreate.length) {
          setNotifications({
            message: message.INVENTORY_REQUIRED,
            variant: statusNotification.ERROR,
          });
          return;
        }

        const params = {
          type: typeWarehouseSheet,
          note: values.note,
          sheet_reason: values.reason,
          is_confirm: values.isConfirm,
          order: values.order_id || "",
          inventories: newInventories,
          import_create_inventories: inventoriesCreate,
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "warehouse-sheet/");

        if (result && result.data) {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });

          timeOutRedirect(STATUS_ROLE_WAREHOUSE.IMPORTS);
        } else {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

        break;
      }
      case STATUS_ROLE_WAREHOUSE.EXPORTS: {
        const newInventories = getObjectPropSafely(() => values.variantsSelected.length)
          ? values.variantsSelected.reduce((prevArr: any, current: AttributeVariant) => {
              const newSelected = getObjectPropSafely(() => current?.batchesSelected?.length)
                ? map(current.batchesSelected, (item) => ({
                    quantity: -item.quantity,
                    warehouse: getObjectPropSafely(() => current?.warehouse?.id),
                    variant_batch: item.id,
                  }))
                : [];

              return [...prevArr, ...newSelected];
            }, [])
          : [];

        if (!newInventories.length) {
          setNotifications({
            message: message.INVENTORY_REQUIRED,
            variant: statusNotification.ERROR,
          });

          return;
        }

        const params = {
          type: typeWarehouseSheet,
          note: values.note,
          sheet_reason: values.reason,
          is_confirm: values.isConfirm,
          inventories: newInventories,
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "warehouse-sheet/");

        if (result && result.data) {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });

          timeOutRedirect(STATUS_ROLE_WAREHOUSE.EXPORTS);
        } else {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

        break;
      }
      case STATUS_ROLE_WAREHOUSE.TRANSFER: {
        const newInventories = getObjectPropSafely(() => values.variantsSelected.length)
          ? values.variantsSelected.reduce((prevArr: any, current: AttributeVariant) => {
              const newSelected = getObjectPropSafely(() => current?.batchesSelected?.length)
                ? current?.batchesSelected?.reduce(
                    (prevArrSelected: any, currentSelected: BatchType) => {
                      return [
                        ...prevArrSelected,
                        {
                          quantity: -currentSelected.quantity,
                          warehouse: getObjectPropSafely(() => current?.warehouse?.id),
                          variant_batch: currentSelected.id,
                        },
                        {
                          quantity: currentSelected.quantity,
                          warehouse: getObjectPropSafely(() => current?.toWarehouse?.id),
                          variant_batch: currentSelected.id,
                        },
                      ];
                    },
                    []
                  )
                : [];

              return [...prevArr, ...newSelected];
            }, [])
          : [];

        if (!newInventories.length) {
          setNotifications({
            message: message.INVENTORY_REQUIRED,
            variant: statusNotification.ERROR,
          });

          return;
        }

        const params = {
          type: typeWarehouseSheet,
          note: values.note,
          sheet_reason: values.reason,
          is_confirm: values.isConfirm,
          from_warehouse: values.fromWarehouse ? +values.fromWarehouse : "",
          to_warehouse: values.toWarehouse ? +values.toWarehouse : "",
          inventories: newInventories,
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "warehouse-sheet/");

        if (result && result.data) {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });

          timeOutRedirect(STATUS_ROLE_WAREHOUSE.TRANSFER);
        } else {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

        break;
      }
      case STATUS_ROLE_WAREHOUSE.STOCKTAKING: {
        if (some(values.list, (item) => item.isError)) {
          setNotifications({
            message: message.INPUT_NOTE,
            variant: statusNotification.ERROR,
          });

          setLoadingSubmit(false);

          return;
        }

        const newInventorieSheetDetails = getObjectPropSafely(() => values.list.length)
          ? values.list.reduce((prevArr: any, current: InventorySheetDetailType) => {
              const newObj = handleParams({
                note: current?.note || "",
                system_quantity: current.system_quantity || 0,
                actual_quantity: current.actual_quantity ? +current.actual_quantity : "",
                inventory_log: {
                  quantity: current.different || 0,
                  warehouse: +values.warehouse,
                  variant_batch: current.variant_batch,
                },
              });

              return current.actual_quantity ? [...prevArr, newObj] : prevArr;
            }, [])
          : [];

        const params = {
          type: typeWarehouseSheet,
          sheet_reason: values.reason,
          note: values.note,
          is_confirm: values.isConfirm,
          inventory_sheet_details: newInventorieSheetDetails,
          inventoried_warehouse: +values.warehouse,
        };

        const newParams = handleParams(params);
        const result = await productApi.create(newParams, "warehouse-sheet/");

        if (result && result.data) {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_SUCCESS,
            variant: statusNotification.SUCCESS,
          });

          timeOutRedirect(STATUS_ROLE_WAREHOUSE.STOCKTAKING);
        } else {
          setNotifications({
            message: message[typeWarehouseSheet].OPERATION_FAILED,
            variant: statusNotification.ERROR,
          });
        }

        break;
      }
    }

    setLoadingSubmit(false);
  };

  const labelKey = (paramRouter?.type || "") as keyof typeof NameSheetOperation;

  return (
    <Grid container columnSpacing={2} sx={{ p: 3 }}>
      <Grid item container justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">{NameSheetOperation[labelKey]}</Typography>
        <Stack direction="row" alignItems="center">
          {isLoadingSubmit && <CircularProgress size={20} sx={{ mr: 1, mt: 1 }} />}
          <MButton
            onClick={handleSubmit(saveInformationSheet)}
            disabled={isLoadingSubmit || isEqual(defaultValue, values)}
          >
            {vi.button.save}
          </MButton>
        </Stack>
      </Grid>
      <Grid item container spacing={3}>
        <Grid item xs={12} md={12} lg={12} xl={9}>
          {typeWarehouseSheet === TypeWarehouseSheet.STOCKTAKING ? (
            <WarehouseCheck {...methods} />
          ) : (
            <AttachLot
              {...methods}
              type={typeWarehouseSheet}
              setDefaultValue={(value: Partial<any>) =>
                setDefaultValue({ ...defaultValue, ...value })
              }
            />
          )}
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={3}>
          <InformationVariant {...methods} type={typeWarehouseSheet} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SheetOperation;
