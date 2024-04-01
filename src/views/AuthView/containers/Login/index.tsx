// material
import { styled } from "@mui/material/styles";
import { Box, Card, Stack, Container, Typography } from "@mui/material";
// components
import { Page } from "components/Page";
import MHidden from "components/MHidden";
import LoginForm from "views/AuthView/containers/Login/components/LoginForm";
import { getStorage } from "utils/asyncStorageUtil";
import useAuth from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoadingScreen from "components/Loadings/LoadingScreen";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

const BackgroundStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  // minWidth: "100vh",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  WebkitFilter: "blur(12px)" /* Safari 6.0 - 9.0 */,
  filter: "blur(12px)",
  opacity: 0.6,
}));

// ----------------------------------------------------------------------

export default function LoginView() {
  const token = getStorage("access-token");
  const { user } = useAuth();

  if (token) {
    return user ? (
      <Navigate to={user.group_permission?.route ? user.group_permission.route : "*"} replace />
    ) : (
      <LoadingScreen />
    );
  }

  return (
    <RootStyle title="Đăng nhập">
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Xin chào !
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <MHidden width="mdUp">
          <BackgroundStyle>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </BackgroundStyle>
        </MHidden>
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Đăng nhập vào Skycom
              </Typography>
            </Box>
          </Stack>

          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
