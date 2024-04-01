import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { FONT_PRIMARY } from "theme/typography";

function CouponItem({
  value,
  name,
  description,
  expiredAt,
  note,
}: {
  value: number | string | JSX.Element;
  name: string | JSX.Element;
  description: string | JSX.Element;
  expiredAt: string | JSX.Element;
  note: string;
}) {
  return (
    <Tooltip arrow title={<pre style={{ fontFamily: FONT_PRIMARY }}>{note || ""}</pre>}>
      <Box sx={styles.card}>
        <Box sx={styles.left}>
          <Typography sx={{ ...styles.textLeft, color: "primary.contrastText" }}>
            {value}
          </Typography>
        </Box>
        <Box sx={styles.right}>
          <Typography sx={styles.name}>{name}</Typography>
          <Typography sx={styles.description} component="div">
            {description}
          </Typography>
          <Typography sx={styles.exp}>HSD: {expiredAt}</Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

export default CouponItem;

const styles: any = {
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  left: {
    padding: 1,
    width: "auto",
    height: "100%",
    minHeight: "74px",
    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
    // clipPath: "polygon(0% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 20% 100%, 0% 100%, 0% 10%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "primary.dark",
    border: "1px dashed",
    borderColor: "primary.contrastText",
    marginRight: "2px",
    borderRadius: "4px",
    aspectRatio: "1/1",
  },
  right: {
    padding: 1,
    minHeight: 70,
    clipPath: "polygon(5% 0%, 100% 0%, 100% 0%, 100% 100%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)",
    border: "1px dashed",
    borderColor: "primary.dark",
    minWidth: 220,
    backgroundColor: "#fff7cd2b",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
  textLeft: {
    textTransform: "uppercase",
    fontSize: "1.2rem",
    fontWeight: 800,
  },
  description: {
    "& .MuiTypography-root": {
      fontSize: "0.775rem",
      fontWeight: 600,
      color: "#2e2e2e",
    },
  },
  name: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "primary.dark",
  },
  exp: {
    fontSize: "0.775rem",
    fontWeight: 600,
    color: "primary.dark",
  },
};
