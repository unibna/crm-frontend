// Libraries
import { FunctionComponent, useContext, useState } from "react";
import { Icon } from "@iconify/react";
import map from "lodash/map";

// Types
import { GridSizeType } from "_types_/GridLayoutType";

// Context
import {
  DetailVariantContext,
  DetailVariantProvider,
} from "views/ProductView/containers/DetailVariant/context";
import usePopup from "hooks/usePopup";

// Components
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import refreshFill from "@iconify/icons-eva/refresh-fill";
import InformationVariant from "views/ProductView/components/InformationVariant";
import Inventory from "views/ProductView/components/Inventory";
import HistoryVariant from "views/ProductView/components/HistoryVariant";
import VariantCombo from "views/ProductView/components/VariantCombo";
import GeneralVariant from "views/ProductView/components/GeneralVariant";
import OrderVariant from "views/ProductView/components/OrderVariant";
import PromotionVariant from "views/ProductView/components/PromotionVariant";
import OperationVariant from "views/ProductView/components/OperationVariant";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import { Page } from "components/Page";

// Constants & Utils
import { titlePopupHandleProduct, typeHandleProduct } from "views/ProductView/constants";
import { contentRenderDefault } from "constants/attribute";
import { AttributeVariant, STATUS_PRODUCT } from "_types_/ProductType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

const TAB_HEADER_DETAIL_VARIANT = [
  {
    value: "general",
    label: "Tổng quan",
    component: <GeneralVariant />,
  },
  {
    value: "order",
    label: "Đơn hàng",
    component: <OrderVariant />,
  },
  {
    value: "promotion",
    label: "Khuyến mãi",
    component: <PromotionVariant />,
  },
  {
    value: "inventory",
    label: "Tồn kho",
    component: <Inventory />,
  },
  {
    value: "history",
    label: "Lịch sử nhập xuất",
    component: <HistoryVariant />,
  },
  {
    value: "combo",
    label: "Combo sản phẩm",
    component: <VariantCombo />,
  },
];

const DetailVariant: FunctionComponent = () => {
  const [currentTab, setCurrentTab] = useState("general");
  const { dataPopup, setDataPopup } = usePopup();
  const { params, handleParams, variantId, handleRefresh } = useContext(DetailVariantContext);

  const handleOpenPopup = (type: string, optional: any = {}) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender: any = () => contentRenderDefault[type] || [];
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "sm";

    switch (type) {
      case titlePopupHandleProduct.EDIT_VARIANT: {
        typeProduct = typeHandleProduct.EDIT_VARIANT;
        defaultData = {
          ...optional,
          attributes: [],
          id: optional.id,
          product: optional.product,
          SKU_code: optional.SKU_code,
          barcode: optional.barcode,
          description: optional.description || "",
          sale_price: optional.sale_price || "",
          neo_price: optional.neo_price || "",
          purchase_price: optional.purchase_price || "",
          image: getObjectPropSafely(() => optional.image)
            ? [getObjectPropSafely(() => optional.image)]
            : [],
          imageApi: getObjectPropSafely(() => optional.image[0].id)
            ? [getObjectPropSafely(() => optional.image[0].id)]
            : [],
          status: optional?.status_variant
            ? optional?.status_variant === STATUS_PRODUCT.INACTIVE
            : false,
        };
        title = `${type} ${optional.value}`;
        maxWidthForm = "lg";
        funcContentSchema = (yup: any) => {
          return {
            value: yup
              .string()
              .required("Vui lòng nhập tên biến thể sản phẩm")
              .trim()
              .max(255, "Tên biến thế phải nhỏ hơn 255 kí tự"),
            sale_price: yup.string(),
            neo_price: yup.string(),
            purchase_price: yup.string(),
            description: yup.string(),
            status: yup.bool(),
            SKU_code: yup.string(),
            barcode: yup.string(),
            imageApi: yup.array(),
            image: yup.array(),
          };
        };
        newContentRender = (methods: any, optionalProps: any) => {
          return (
            <OperationVariant {...methods} {...optionalProps} variantType={optional.variant_type} />
          );
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      valueOptional: optional,
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

  return (
    <Page title="Chi tiết sản phẩm">
      <Grid container sx={{ p: 3 }} rowGap={4}>
        <Card sx={{ p: 3, width: "100%" }}>
          <InformationVariant
            variantId={variantId}
            openPopup={(variant: AttributeVariant) =>
              handleOpenPopup(titlePopupHandleProduct.EDIT_VARIANT, variant)
            }
          />
        </Card>
        <Card sx={{ p: 3, width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item container xs={12} sm={12} md={12} lg={8} xl={10}>
              <Tabs
                value={currentTab}
                scrollButtons="auto"
                variant="scrollable"
                allowScrollButtonsMobile
                onChange={(e, value) => setCurrentTab(value)}
              >
                {TAB_HEADER_DETAIL_VARIANT.map((tab: any) => (
                  <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Grid>
            <Grid item container xs={12} sm={12} md={12} lg={4} xl={2}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh}>
                  <Icon icon={refreshFill} width={20} height={20} />
                </IconButton>
              </Tooltip>
              <RangeDateV2
                roadster
                dropdownStyle
                handleSubmit={(
                  created_from: string | undefined,
                  created_to: string | undefined,
                  dateValue: string | undefined | number
                ) =>
                  handleParams({
                    date_from: created_from,
                    date_to: created_to,
                    dateValue: dateValue,
                  })
                }
                defaultDateValue={params?.dateValue}
                created_from={params?.date_from}
                created_to={params?.date_to}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 5 }} />

          {TAB_HEADER_DETAIL_VARIANT.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Card>
      </Grid>
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <DetailVariantProvider>
      <DetailVariant {...props} />
    </DetailVariantProvider>
  );
};

export default Components;
