// Libraries
import { useEffect, useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import some from "lodash/some";
import reduce from "lodash/reduce";
import find from "lodash/find";
import { useTheme } from "@mui/material/styles";

// Services
import { deliveryApi } from "_apis_/delivery.api";
import { orderApi } from "_apis_/order.api";

// Hooks
import usePopup from "hooks/usePopup";
import useAuth from "hooks/useAuth";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { useAppSelector } from "hooks/reduxHook";

// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Product from "./Product";
import InformationMore from "./InformationMore";
import Information from "./Information";
import { MButton } from "components/Buttons";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { AttributeVariant, BatchType } from "_types_/ProductType";
import { InventoryType } from "_types_/WarehouseType";

// Constants & Utils
import { statusNotification } from "constants/index";
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import vi from "locales/vi.json";
import { SHIPPING_COMPANIES } from "_types_/GHNType";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";

// ---------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  handleReloadOrder?: () => void;
}

const ContentShip = (props: Props) => {
  const theme = useTheme();
  const { watch, setValue, handleReloadOrder, setError, handleSubmit } = props;
  const { user } = useAuth();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const [activeStep, setActiveStep] = useState(0);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [isCallApiList, setCallApiList] = useState(false);
  const { closePopup, setNotifications, setSubmit } = usePopup<any>();
  const values = watch();
  const {
    shippingCompanies,
    addressSend,
    products,
    products_promotion,
    addressReceived,
    informationShip,
  } = values;

  useEffect(() => {
    getListWarehouse();
  }, []);

  useEffect(() => {
    if (Object.values(addressSend).length) {
      getList();
    }
  }, [addressSend]);

  useEffect(() => {
    changeValueDeliveryCompany();
  }, [addressReceived]);

  const changeValueDeliveryCompany = async () => {
    let arrDeliveryCompany: any[] = [
      {
        id: SHIPPING_COMPANIES.GRAB,
        name: "Grab",
        type: SHIPPING_COMPANIES.GRAB,
        value: SHIPPING_COMPANIES.GRAB,
        label: "Grab",
      },
      {
        id: SHIPPING_COMPANIES.LALAMOVE,
        name: "Lalamove",
        type: SHIPPING_COMPANIES.LALAMOVE,
        value: SHIPPING_COMPANIES.LALAMOVE,
        label: "Lalamove",
      },
      {
        id: SHIPPING_COMPANIES.VIETTEL_POST,
        name: "Viettel Post",
        type: SHIPPING_COMPANIES.VIETTEL_POST,
        value: SHIPPING_COMPANIES.VIETTEL_POST,
        label: "Viettel Post",
      },
      {
        id: SHIPPING_COMPANIES.E_COMMERCE,
        name: "TMDT",
        type: SHIPPING_COMPANIES.E_COMMERCE,
        value: SHIPPING_COMPANIES.E_COMMERCE,
        label: "Thương mại điện tử",
      },
      {
        id: SHIPPING_COMPANIES.OTHER,
        name: "Khác",
        type: SHIPPING_COMPANIES.OTHER,
        value: SHIPPING_COMPANIES.OTHER,
        label: "Khác",
      },
    ];

    if (!informationShip.isECommerce) {
      const newArr = await getListShippingCompany({
        id: getObjectPropSafely(() => addressReceived.location.ward_id) || "",
      });

      arrDeliveryCompany = [...newArr, ...arrDeliveryCompany];
    }

    setValue("shippingCompanies", arrDeliveryCompany);
    setValue("informationShip", {
      ...informationShip,
      shipCompany: informationShip.isECommerce
        ? {
            id: SHIPPING_COMPANIES.E_COMMERCE,
            name: "TMDT",
            type: SHIPPING_COMPANIES.E_COMMERCE,
            value: SHIPPING_COMPANIES.E_COMMERCE,
            label: "Thương mại điện tử",
          }
        : arrDeliveryCompany[0],
    });
  };

  const getList = () => {
    setCallApiList(true);
    setValue("products", getListBatch(products));
    // if (products_promotion.length) {
    //   getListBatchPromotion();
    // }
    setCallApiList(false);
  };

  const getListWarehouse = async () => {
    const newData = reduce(
      attributesWarehouse.listWarehouse,
      (prevArr, item: any) => {
        return item.is_default
          ? [
              ...prevArr,
              {
                ...item,
                value: item.id,
                label: item.name,
              },
            ]
          : prevArr;
      },
      []
    );

    setValue("addressSend", newData[0] || {});
  };

  const getListShippingCompany = async (params: any) => {
    const newParams = params.id ? `/${params.id}/` : "/";
    const result: any = await deliveryApi.get({}, `available_company/locations${newParams}`);

    if (result?.data) {
      const { available_companies = [] } = result.data;

      return [
        ...(available_companies.length
          ? map(available_companies, (item) => ({
              ...item,
              label: item.name,
              value: item.id,
            }))
          : []),
      ];
    }

    return [];
  };

  const handleParamCreateWarehouseSheet = ({ id, addressSend }: any) => {
    const newItemsPromotion = map(products, (item) => ({
      variant: getObjectPropSafely(() => item.id),
      quantity: item.quantity,
      batch: getObjectPropSafely(() => item.batch_selected.variant_batch.id),
      warehouse: getObjectPropSafely(() => addressSend.value),
    }));

    const params = {
      items: newItemsPromotion,
      order_id: id,
    };

    return handleParams(params);
  };

  const handleParamCreateShipping = ({
    id,
    informationShip,
    addressReceived,
    customer,
    payment,
    items,
  }: any) => {
    const defaultParams = {
      created_by: user?.id,
      to_name: customer.full_name,
      to_address: addressReceived.street,
      to_phone: customer?.phone,
      to_district_id: getObjectPropSafely(() => addressReceived.location.district_id),
      to_ward_code: getObjectPropSafely(() => addressReceived.location.ward_id),
      to_province_id: getObjectPropSafely(() => addressReceived.location.province_id),
      to_full_address: getObjectPropSafely(() => addressReceived.address),
      return_name: addressSend.name,
      return_address: getObjectPropSafely(() => addressSend.address.street),
      return_district_id: getObjectPropSafely(() => addressSend.address.location.district_id),
      return_ward_code: getObjectPropSafely(() => addressSend.address.location.ward_id),
      return_province_id: getObjectPropSafely(() => addressSend.address.location.province_id),
      return_full_address: getObjectPropSafely(() => addressSend.address.address),
      return_phone: addressSend.manager_phone,
      weight: informationShip.totalWeight,
      height: informationShip.height,
      width: informationShip.width,
      length: informationShip.length,
      note: informationShip.note,
      items,
      cod_amount: informationShip.cod,
      tracking_number: informationShip.tracking_number,
      order: id,
      delivery_company_type: getObjectPropSafely(() => informationShip.shipCompany.type),
    };

    const paramsGhn = {
      ...defaultParams,
      service_type_id: 2,
      payment_type_id: 1,
      required_note: informationShip.checkProduct,
      trans_type: getObjectPropSafely(() => informationShip.transType.value),
      quantity: payment.total_variant_quantity,
      picking_ship: getObjectPropSafely(() => informationShip.pickShift.value),
      delivery_company: getObjectPropSafely(() => informationShip.shipCompany.id),
      insurance_value: informationShip.isShowInsurance ? informationShip.insurance : "",
    };

    const paramsVnpost = {
      ...defaultParams,
      service_type_id: 4,
      pickup_type: getObjectPropSafely(() => informationShip.pickupType.value) || "",
      is_package_viewable: informationShip.isPackageViewable,
      delivery_company: getObjectPropSafely(() => informationShip.shipCompany.id),
    };

    const paramsOther = {
      ...defaultParams,
    };

    return handleParams(
      getObjectPropSafely(() => informationShip.shipCompany.type) === SHIPPING_COMPANIES.GHN
        ? paramsGhn
        : getObjectPropSafely(() => informationShip.shipCompany.type) === SHIPPING_COMPANIES.VNPOST
        ? paramsVnpost
        : paramsOther
    );
  };

  const callApiShipping = async (values: any) => {
    const newItems = map(values.products, (item) =>
      handleParams({
        name: getObjectPropSafely(() => item.name),
        price: getObjectPropSafely(() => item.sale_price),
        quantity: item.quantity,
        code: getObjectPropSafely(() => item.id),
        url: getObjectPropSafely(() => item.image.url),
      })
    );

    const result = await deliveryApi.create(
      handleParamCreateShipping({ ...values, items: newItems }),
      `create-shipping-order/${
        getObjectPropSafely(() => values.informationShip.shipCompany.type) ===
        SHIPPING_COMPANIES.GHN
          ? "ghn"
          : getObjectPropSafely(() => values.informationShip.shipCompany.type) ===
            SHIPPING_COMPANIES.VNPOST
          ? "vnpost"
          : "other"
      }`
    );

    if (result?.data) {
      setSubmit(true);
      closePopup();

      setNotifications({
        message: RESPONSE_MESSAGES.CREATE_SUCCESS,
        variant: statusNotification.SUCCESS,
      });
    }

    setLoadingSubmit(false);
  };

  const submitForm = async () => {
    setLoadingSubmit(true);

    const result = await orderApi.create({
      params: handleParamCreateWarehouseSheet({ ...values }),
      endpoint: "sheet/",
      isShowToast: false,
    });

    if (result?.data) {
      await callApiShipping(values);
      handleReloadOrder && handleReloadOrder();
    } else {
      setNotifications({
        message: "Tạo phiếu kho thất bại",
        variant: statusNotification.ERROR,
      });

      setLoadingSubmit(false);
    }
  };

  const getListBatch = (variants: { quantity: number; id?: string; batches: BatchType[] }[]) => {
    return map(variants, (item: AttributeVariant) => {
      const quantityConfirm =
        getObjectPropSafely(() => item?.inventory_available?.quality_confirm) || 0;

      const infoWarehouse = getObjectPropSafely(() => item?.batches?.length)
        ? reduce(
            item.batches,
            (prevArr, itemWarehouse) => {
              const inventory: any = find(itemWarehouse.inventory, (current: InventoryType) =>
                getObjectPropSafely(() => current?.warehouse?.id === addressSend.value)
              );

              return inventory
                ? [
                    ...prevArr,
                    {
                      variant_batch: inventory.variant_batch,
                      quantity: inventory.quantity - (itemWarehouse?.reserved_inventory || 0),
                      errorMessage:
                        inventory.quantity - (itemWarehouse?.reserved_inventory || 0) <
                        (item?.quantity || 0)
                          ? "Lô không đủ sản phẩm trong kho"
                          : "",
                      total_inventory: inventory.quantity,
                      reserved_inventory: itemWarehouse?.reserved_inventory || 0,
                    },
                  ]
                : prevArr;
            },
            []
          )
        : [];

      return {
        ...item,
        info_warehouse: infoWarehouse,
        batch_selected:
          find(infoWarehouse, (option) => !option.errorMessage) || infoWarehouse[0] || null,
      };
    });
  };

  const isDisabledContinue = useMemo(() => {
    const listPromotion = reduce(
      products_promotion,
      (prevArr, current) => [...prevArr, ...current.gifts],
      []
    );

    if (activeStep === 0 && !shippingCompanies.length) {
      return true;
    }

    if (
      activeStep === 0 &&
      (some(
        products,
        (item) =>
          !item.batch_selected || getObjectPropSafely(() => item.batch_selected.errorMessage)
      ) ||
        some(
          listPromotion,
          (item) =>
            !item.batch_selected || getObjectPropSafely(() => item.batch_selected.errorMessage)
        ))
    ) {
      return true;
    }

    return isCallApiList;
  }, [shippingCompanies, products, products_promotion, isCallApiList]);

  return (
    <Grid container>
      <Grid item container xs={12} md={12} spacing={2} sx={{ mb: 7 }}>
        <Grid item xs={12} md={8}>
          {activeStep === 0 && <Product {...props} />}
          {activeStep === 1 && <Information {...props} />}
        </Grid>
        <Grid item xs={12} md={4}>
          <InformationMore {...props} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={12}
        columnGap={2}
        justifyContent="flex-end"
        sx={{
          position: "absolute",
          borderTop: "thin solid rgba(145, 158, 171, 0.24)",
          bottom: 0,
          background: theme.palette.background.default,
          left: 0,
          py: 1,
          pr: 2,
          pb: 3,
        }}
      >
        <MButton
          sx={{ mt: 2 }}
          variant="outlined"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          {vi.back}
        </MButton>
        {activeStep === 1 && (
          <Stack direction="row" alignItems="center">
            <MButton sx={{ mt: 2 }} onClick={handleSubmit(submitForm)} disabled={isLoadingSubmit}>
              {vi.finish}
            </MButton>
            {isLoadingSubmit && <CircularProgress size={20} sx={{ ml: 1, mt: 1 }} />}
          </Stack>
        )}
        {activeStep !== 1 && (
          <MButton
            sx={{ mt: 2 }}
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={isDisabledContinue}
          >
            {vi.continue}
          </MButton>
        )}
      </Grid>
    </Grid>
  );
};

export default ContentShip;
