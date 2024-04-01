import { Stack, Tooltip, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { AttributeType } from "_types_/AttributeType";
import { MTextLine } from "components/Labels";

interface Props {
  product?: AttributeType;
  channel?: AttributeType;
  fanpage?: AttributeType;
  landing_page_url?: string;
  order_information?: string;
}

function ProductInfoCard(props: Props) {
  const theme = useTheme();

  const styles = {
    mainText: {
      fontWeight: 600,
      fontSize: 13,
      color: theme.palette.primary.main,
    },
    labelInfo: {
      fontWeight: 400,
      fontSize: 13,
      display: "inline",
    },
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
    },
    infoChip: {
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "24px",
      background: theme.palette.primary.main,
      padding: "4px 8px",
      color: theme.palette.primary.contrastText,
    },
  };

  return (
    <Stack
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      direction="column"
      spacing={1}
      sx={{ width: "100%" }}
    >
      <Tooltip title={props.product?.name || ""}>
        <Typography sx={{ ...styles.mainText, display: "flex" }}>
          {`${props.product?.name}`}
        </Typography>
      </Tooltip>

      <div>
        <Typography sx={styles.labelInfo} component="div">
          {`Kênh: `}
        </Typography>
        {props.channel?.name?.includes("Landing Page") && (
          <a
            href={props.landing_page_url}
            target="_blank"
            rel="noreferrer"
            style={{ color: theme.palette.primary.main, textDecoration: "none" }}
          >
            {" "}
            <Typography
              sx={{
                ...styles.info,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >{`${props.channel?.name}`}</Typography>
          </a>
        )}
        {props.channel?.name && ["Pancake", "Zalo", "Livestream"].includes(props.channel?.name) && (
          <Typography
            sx={{ ...styles.info, ...styles.infoChip }}
          >{`${props.channel?.name}`}</Typography>
        )}
        {props.channel?.name &&
          !["Pancake", "Zalo", "Landing Page", "Landing Page 1", "Livestream"].includes(
            props.channel?.name
          ) && (
            <Typography
              sx={{ ...styles.info, ...styles.infoChip }}
            >{`${props.channel?.name}`}</Typography>
          )}
      </div>
      <div>
        <Typography sx={styles.labelInfo} component="div">
          {`Fanpage: `}
        </Typography>
        <Typography sx={styles.info}>{`${props.fanpage?.name || "Khác"}`}</Typography>
      </div>
      {props.order_information ? (
        <MTextLine
          label="Mã đơn hàng:"
          value={props.order_information || "---"}
          valueStyle={{ textAlign: "left" }}
        />
      ) : null}
    </Stack>
  );
}

export default ProductInfoCard;
