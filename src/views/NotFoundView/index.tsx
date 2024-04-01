import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
// material
import { Box, Button, Typography, Container } from "@mui/material";
// components
import { Page } from "components/Page";
import PageNotFoundIllustration from "assets/illustrations/illustration_404";

const NotFoundView = () => {
  return (
    <Page
      title="404 Page Not Found | Minimal-UI"
      alignItems="center"
      display="flex"
      flexGrow={1}
      pt={15}
      pb={10}
    >
      <Container>
        <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
          <motion.div>
            <Typography variant="h3" paragraph>
              Sorry, page not found!
            </Typography>
          </motion.div>
          <Typography sx={{ color: "text.secondary" }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>

          <motion.div>
            <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </motion.div>

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </Box>
      </Container>
    </Page>
  );
};

export default NotFoundView;
