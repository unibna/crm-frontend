//components
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import MImage from "components/Images/MImage";

export const VariantPromotionItem = ({
  image,
  name,
  imageSize = 60,
  SKU_code,
  quantity,
  hiddenFields,
}: {
  image?: { url: string; id: string } | { url: string; id: string }[];
  name?: string;
  imageSize?: number;
  SKU_code?: string;
  quantity?: number;
  hiddenFields?: ["image" | "name" | "SKU_code" | "quantity"];
}) => {
  return Array.isArray(image) ? null : (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        cursor: "pointer",
      }}
      spacing={1}
    >
      {!hiddenFields?.includes("image") && (
        <MImage src={image?.url} width={imageSize} height={imageSize} preview />
      )}

      <Box>
        {!hiddenFields?.includes("name") && (
          <Tooltip title={name || ""}>
            <Typography sx={styles.name}>{name}</Typography>
          </Tooltip>
        )}
        {!hiddenFields?.includes("SKU_code") && <Typography>{SKU_code}</Typography>}
        {!hiddenFields?.includes("quantity") && <Typography>SL: {quantity || 1}</Typography>}
      </Box>
    </Stack>
  );
};

const styles: any = {
  name: {
    fontSize: "0.775rem",
    fontWeight: 600,
    display: "block",
    // maxWidth: "200px",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
};
