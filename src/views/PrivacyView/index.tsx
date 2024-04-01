import { Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { Page } from "components/Page";
import darkLogo from "assets/images/logo-text-white.svg";
import lightLogo from "assets/images/logo-text-black.svg";
import { useTheme } from "@mui/material/styles";
import { privacy1, privacy2 } from "./assets";

const Privacy = () => {
  const theme = useTheme();
  return (
    <Page
      title="Chính sách"
      style={{ padding: 12, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={theme.palette.mode === "light" ? lightLogo : darkLogo}
        height={86}
        style={{ marginTop: 12, marginBottom: 12 }}
      />
      <Grid container px={{ xs: 2, sm: 4, md: 8, lg: 16, xl: 24 }} py={2}>
        <Typography component="h2" style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
          CHÍNH SÁCH
        </Typography>
        <TitleTermLabel>{`BẢO MẬT THÔNG TIN`}</TitleTermLabel>
        <TermLabel>{privacy1}</TermLabel>
        <TermLabel>{privacy2}</TermLabel>
        <Link href="/" style={{ marginTop: 12 }}>{`<<< Quay lại trang chủ`}</Link>
      </Grid>
    </Page>
  );
};

export default Privacy;

const TermLabel = styled(Typography)(() => ({
  textAlign: "justify",
  marginTop: 16,
  textIndent: 32,
}));

const TitleTermLabel = styled(Typography)(() => ({
  width: "100%",
  marginTop: 18,
  fontWeight: "bold",
}));
