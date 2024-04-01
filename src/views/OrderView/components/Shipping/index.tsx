// Libraries
import reduce from "lodash/reduce";
import map from "lodash/map";

// Hooks
import usePopup from "hooks/usePopup";

// Components
import { MButton } from "components/Buttons";
import ContentShip from "./ContentShip";

// Types
import { GridSizeType } from "_types_/GridLayoutType";
import { OrderFormType } from "_types_/OrderType";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  optionPickupType,
  CHECK_PRODUCT_OPTIONSGhn,
  SHIPPING_VEHICEL_OPTIONS,
  CHECK_PRODUCT_OPTIONSVnPost,
} from "views/ShippingView/constants";
import { random } from "utils/randomUtil";
import { SHIPPING_COMPANIES } from "_types_/GHNType";

// ----------------------------------------------------------

interface Props {
  dataRow?: OrderFormType;
  handleReloadOrder?: () => void;
}

const Shipping = (props: Props) => {
  const { dataRow } = props;
  const { setDataPopup, dataPopup } = usePopup<any>();

  const openPopup = (row: any) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Thêm";
    let newContentRender: any;
    let defaultData = {};
    let title = "Giao hàng";
    let isShowFooter = false;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "xl";

    const newProducts = reduce(
      row.line_items,
      (prevArr, current) => {
        return [
          ...prevArr,
          ...(!!getObjectPropSafely(() => current.bundle_variants.length)
            ? map(current.bundle_variants, (item) => ({
                ...item.variant,
                quantity: item.quantity,
                variant_id: random(7),
              }))
            : [{ ...current, variant_id: random(7) }]),
          ...(!!getObjectPropSafely(() => current.promotion.gift_variants.length)
            ? map(current.promotion.gift_variants, (item) => ({
                ...item.variant,
                quantity: item.quantity,
                variant_id: random(7),
              }))
            : []),
        ];
      },
      []
    );

    // const trackingNumber = `Khac_${new Date().getTime()}`;

    defaultData = {
      id: row?.id,
      products: newProducts,
      products_promotion: [],
      customer: {
        ...row?.customer,
        full_name: row?.customer_name,
      },
      addressReceived: row?.shipping_address,
      shippingCompanies: [],
      addressSend: {},
      payment: row,
      informationShip: {
        shipCompany: null,
        checkProduct: CHECK_PRODUCT_OPTIONSGhn[0]?.value,
        transType: SHIPPING_VEHICEL_OPTIONS[0],
        pickupType: optionPickupType[0],
        isPackageViewable: CHECK_PRODUCT_OPTIONSVnPost[0]?.value,
        promotion: "",
        pickShift: null,
        totalWeight: 500,
        width: 10,
        height: 10,
        length: 10,
        note: row.delivery_note || "",
        cod: getObjectPropSafely(() => row?.cost),
        insurance: getObjectPropSafely(() => row?.total_variant_all),
        isShowInsurance: false,
        tracking_number: row.tracking_number || "",
        isECommerce: !!getObjectPropSafely(() => row.ecommerce_code),
      },
    };

    newContentRender = (methods: any) => {
      return <ContentShip {...methods} handleReloadOrder={props.handleReloadOrder} />;
    };

    funcContentSchema = (yup: any) => {
      return {
        option: yup.object(),
        payment: yup.object(),
        products: yup.array(),
        products_promotion: yup.array(),
        shippingCompanies: yup.array(),
        customer: yup.object(),
        addressReceived: yup.object(),
        addressSend: yup.object(),
        informationShip: yup.object().shape({
          shipCompany: yup.object(),
          pickShift: yup.mixed(),
          cod: yup.number(),
          transType: yup.object(),
          pickupType: yup.object(),
          totalWeight: yup.number(),
          width: yup.number(),
          height: yup.number(),
          length: yup.number(),
          insurance: yup.number(),
          checkProduct: yup.string(),
          isPackageViewable: yup.bool(),
          isShowInsurance: yup.bool(),
          isECommerce: yup.bool(),
          note: yup.string(),
          promotion: yup.string(),
          tracking_number: yup.string(),
          // tracking_number: yup.string().when("shipCompany", {
          //   is: (shipCompany: { value: SHIPPING_COMPANIES }) =>
          //     shipCompany.value === SHIPPING_COMPANIES.E_COMMERCE,
          //   then: yup.string().required("Vui lòng nhập mã vận đơn"),
          // }),
        }),
      };
    };

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isDisabledSubmit,
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  return (
    <MButton
      size="medium"
      variant="outlined"
      onClick={() => openPopup(dataRow)}
      sx={{ width: 110 }}
    >
      Giao hàng
    </MButton>
  );
};

export default Shipping;
