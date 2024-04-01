// Libraries
import { useMemo } from "react";
import uniq from "lodash/uniq";
import map from "lodash/map";
import find from "lodash/find";
import { useTheme } from "@mui/material/styles";

// Components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import MImage from "components/Images/MImage";
import { Span } from "components/Labels";

// Types
import { AttributeVariant, STATUS_PRODUCT, VariantEcommer } from "_types_/ProductType";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fValueVnd } from "utils/formatNumber";
import { optionPlatformEcommerce } from "views/ProductView/constants";
import { ROLE_TAB } from "constants/rolesTab";
import logoIcon from "assets/images/icon-logo.png";

// -------------------------------------------------

const VariantCard = ({ variant }: { variant: AttributeVariant }) => {
  const theme = useTheme();

  const listPlatform = useMemo(() => {
    return getObjectPropSafely(() => variant?.variants_ecommerce_map?.length)
      ? uniq(map(variant?.variants_ecommerce_map, (item) => item.ecommerce_platform))
      : [];
  }, [variant]);

  return (
    <Card
      sx={{
        width: "100%",
        px: 1.5,
        py: 1.5,
        opacity: getObjectPropSafely(() => variant.status) === STATUS_PRODUCT.ACTIVE ? 1 : 0.2,
      }}
    >
      <Stack direction="row" spacing={1}>
        <MImage
          width={100}
          height={100}
          src={getObjectPropSafely(() => variant.image.url) || logoIcon}
        />
        <Grid sx={{ width: "100%", position: "relative" }}>
          <Box sx={{ height: 66 }}>
            {/* {variant.name && (
              <CopyIconButton
                size="inherit"
                value={variant.name}
                sx={{ position: "absolute", top: -5, left: -13 }}
                iconStyle={{ fontSize: 12 }}
              />
            )} */}
            <Link
              href={`/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => variant.id)}`}
              target="_blank"
              rel="noreferrer"
              underline="hover"
            >
              <Typography
                variant="subtitle2"
                sx={{ height: "100%", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {variant.name}
              </Typography>
            </Link>
          </Box>
          <Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" fontSize={10} sx={{ mt: 1 }}>
                {variant.SKU_code}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {getObjectPropSafely(() => listPlatform.length)
                  ? map(listPlatform, (item: VariantEcommer) => {
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
                    })
                  : null}
                {!!getObjectPropSafely(() => variant?.bundle_variants?.length) && (
                  <Span
                    variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                    color="warning"
                  >
                    Combo
                  </Span>
                )}
              </Stack>
              <Typography variant="body2">{fValueVnd(variant.sale_price || 0)}</Typography>
            </Stack>
          </Stack>
        </Grid>
      </Stack>
    </Card>
  );
};

export default VariantCard;
