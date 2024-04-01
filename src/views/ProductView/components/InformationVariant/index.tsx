// Libraries
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";
import find from "lodash/find";
import uniq from "lodash/uniq";

// Services
import { productApi } from "_apis_/product";

// Components
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MTextLine, Span } from "components/Labels";
import { MButton } from "components/Buttons";
import MImage from "components/Images/MImage";

//  Types
import { AttributeVariant, VariantEcommer } from "_types_/ProductType";

// Constants & Utils
import { fDateTime } from "utils/dateUtil";
import { dataRenderInfomationVariant, optionPlatformEcommerce } from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { COMMAS_REGEX, STATUS_SYNC, TYPE_DATA } from "constants/index";
import vi from "locales/vi.json";
import logoIcon from "assets/images/icon-logo.png";
import { STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
interface Props {
  variantId: any;
  openPopup: (variant: AttributeVariant) => void;
}

const SkeletonInfo = () => {
  return (
    <>
      <Skeleton variant="rectangular" sx={{ height: 200, width: "100%", borderRadius: 2 }} />
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
        <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
      </Box>
    </>
  );
};

const InformationVariant = (props: Props) => {
  const { variantId, openPopup } = props;
  const theme = useTheme();
  const [isLoading, setLoading] = useState(false);
  const [variant, setVariant] = useState<AttributeVariant>({});
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (variantId) {
      getVariants({
        variant_id: variantId,
      });
    }
  }, []);

  const getVariants = async (params: any) => {
    setLoading(true);
    const result: any = await productApi.get(params, "variant/");

    if (result && result.data) {
      const { results = [] } = result.data;
      setVariant({
        ...results[0],
        total_inventory: getObjectPropSafely(() => results[0].total_inventory) || 0,
        created_by: getObjectPropSafely(() => results[0].created_by.name),
        modified_by: getObjectPropSafely(() => results[0].modified_by.name),
        quality_confirm:
          getObjectPropSafely(() => results[0].inventory_available.quality_confirm) || 0,
        quality_non_confirm:
          getObjectPropSafely(() => results[0].inventory_available.quality_non_confirm) || 0,
        total_quatity_non_confirm:
          getObjectPropSafely(() => results[0].total_inventory) -
          getObjectPropSafely(() => results[0].inventory_available.quality_confirm) -
          getObjectPropSafely(() => results[0].inventory_available.quality_non_confirm),
        total_quantity_confirm:
          getObjectPropSafely(() => results[0].total_inventory) -
          getObjectPropSafely(() => results[0].inventory_available.quality_confirm),
        value: getObjectPropSafely(() => results[0].name),
      });

      setLoading(false);
    }
  };

  const formatValue = ({
    label,
    value: valueAgs,
    type,
  }: {
    label: string;
    value: number;
    type?: string;
  }) => {
    const value = variant[valueAgs];

    switch (type) {
      case TYPE_DATA.DATE_TIME: {
        return (
          <MTextLine
            label={<Typography variant="caption">{label}:</Typography>}
            value={fDateTime(value)}
          />
        );
      }
      case TYPE_DATA.VND: {
        return (
          <MTextLine
            label={<Typography variant="caption">{label}:</Typography>}
            value={
              value ? `${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0} đ` : ""
            }
          />
        );
      }
      default: {
        return (
          <MTextLine label={<Typography variant="caption">{label}:</Typography>} value={value} />
        );
      }
    }
  };

  const listPlatform = useMemo(() => {
    return getObjectPropSafely(() => variant?.variants_ecommerce_map?.length)
      ? uniq(map(variant?.variants_ecommerce_map, (item) => item.ecommerce_platform))
      : [];
  }, [variant]);

  return (
    <Grid item columnSpacing={5}>
      {isLoading && <SkeletonInfo />}
      {!isLoading && (
        <Grid item container sx={{ py: 3 }}>
          {!isMobile && (
            <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
              <MImage
                width={200}
                height={200}
                src={getObjectPropSafely(() => variant?.image?.url) || logoIcon}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={6} lg={9} xl={10}>
            <Grid item spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{variant.name}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MButton
                    sx={{ fontSize: 10 }}
                    onClick={() =>
                      window.open(
                        `/${STATUS_ROLE_WAREHOUSE.SHEET}/new/${STATUS_ROLE_WAREHOUSE.IMPORTS}?variant_selected=${variant.id}`
                      )
                    }
                    disabled={!!getObjectPropSafely(() => variant?.bundle_variants?.length)}
                    color="warning"
                  >
                    Nhập hàng
                  </MButton>
                  <MButton sx={{ fontSize: 10 }} onClick={() => openPopup(variant)}>
                    {vi.button.edit}
                  </MButton>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={STATUS_SYNC[variant.status] === STATUS_SYNC.ACTIVE ? "success" : "error"}
                >
                  {STATUS_SYNC[variant.status] || ""}
                </Span>
                {!!getObjectPropSafely(() => variant?.bundle_variants?.length) && (
                  <Span
                    variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                    color="warning"
                  >
                    Combo
                  </Span>
                )}
              </Stack>
            </Grid>
            <Grid item container sx={{ mt: 2 }} spacing={1}>
              <Grid item container xs={12} sm={12} md={12} lg={12} xl={7} spacing={1}>
                {map(
                  dataRenderInfomationVariant,
                  (item: { label: string; value: number; type?: string }) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        direction="row"
                        // alignItems="center"
                        key={item.label}
                      >
                        {formatValue(item)}
                      </Grid>
                    );
                  }
                )}
              </Grid>
              <Grid item container xs={12} sm={12} md={12} lg={12} xl={5} alignItems="center">
                <Grid item xs={6} md={4} direction="row" alignItems="center">
                  <Typography variant="caption">Tồn thực tổng các kho</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {variant.total_inventory}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4} direction="row" alignItems="center">
                  <Typography variant="caption">SL sản phẩm đã đặt XN</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {variant.quality_confirm}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4} direction="row" alignItems="center">
                  <Typography variant="caption">SL sản phẩm đã đặt chưa XN</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {variant.quality_non_confirm}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {getObjectPropSafely(() => listPlatform.length) ? (
              <Grid item container sx={{ mt: 2 }} columnGap={1}>
                {map(listPlatform, (item: VariantEcommer) => {
                  const objEcommerce = find(
                    optionPlatformEcommerce,
                    (obj) => obj.value === getObjectPropSafely(() => item)
                  );

                  return (
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color={objEcommerce?.color || "warning"}
                    >
                      {objEcommerce?.label}
                    </Span>
                  );
                })}
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default InformationVariant;
