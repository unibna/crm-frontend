import { Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { Page } from "components/Page";
import darkLogo from "assets/images/logo-text-white.svg";
import lightLogo from "assets/images/logo-text-black.svg";
import { useTheme } from "@mui/material/styles";
import {
  term1,
  term10,
  term2,
  term3,
  term4,
  term5,
  term6,
  term7,
  term8,
  term9,
  title,
} from "./assets";

const TermsOfService = () => {
  const theme = useTheme();
  return (
    <Page
      title="Điều khoản sử dụng"
      style={{ padding: 12, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={theme.palette.mode === "light" ? lightLogo : darkLogo}
        height={86}
        style={{ marginTop: 12, marginBottom: 12 }}
      />
      <Grid container px={{ xs: 2, sm: 4, md: 8, lg: 16, xl: 24 }} py={2}>
        <Typography component="h2" style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
          ĐIỀU KHOẢN SỬ DỤNG
        </Typography>
        <Typography style={{ marginTop: 12 }}>{title}</Typography>
        <TitleTermLabel>{`CẤP GIẤY PHÉP`}</TitleTermLabel>
        <TermLabel>{term1}</TermLabel>
        <TitleTermLabel>{`GIỚI HẠN SỬ DỤNG`}</TitleTermLabel>
        <TermLabel>{term2}</TermLabel>
        <TitleTermLabel>{`DỊCH VỤ`}</TitleTermLabel>
        <TermLabel>{term3}</TermLabel>
        <TitleTermLabel>{`NGHĨA VỤ CHUNG CỦA NGƯỜI DÙNG`}</TitleTermLabel>
        <TermLabel>{term4}</TermLabel>
        <TitleTermLabel>{`TÀI KHOẢN`}</TitleTermLabel>
        <TermLabel>{term5}</TermLabel>
        <TitleTermLabel>{`THANH TOÁN`}</TitleTermLabel>
        <TermLabel>{term6}</TermLabel>
        <TitleTermLabel>{`THU THẬP DỮ LIỆU, TRAO ĐỔI THÔNG TIN & CẬP NHẬT`}</TitleTermLabel>
        <TermLabel>{term7}</TermLabel>
        <TitleTermLabel>{`CHÍNH SÁCH BẢO MẬT`}</TitleTermLabel>
        <TermLabel>{term8}</TermLabel>
        <TitleTermLabel>{`BẢO MẬT`}</TitleTermLabel>
        <TermLabel>{term9}</TermLabel>
        <TitleTermLabel>{`THỜI HẠN THOẢ THUẬN VÀ CHẤM DỨT THOẢ THUẬN ĐKDV`}</TitleTermLabel>
        <TermLabel>{term10}</TermLabel>
        <Link href="/" style={{ marginTop: 12 }}>{`<<< Quay lại trang chủ`}</Link>
      </Grid>
    </Page>
  );
};

export default TermsOfService;

const TermLabel = styled(Typography)(() => ({
  textAlign: "justify",
  marginTop: 4,
  textIndent: 32,
}));

const TitleTermLabel = styled(Typography)(() => ({
  width: "100%",
  marginTop: 16,
  fontWeight: "bold",
}));
