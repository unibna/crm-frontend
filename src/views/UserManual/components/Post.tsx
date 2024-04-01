import EditRounded from "@mui/icons-material/EditRounded";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

import vi from "locales/vi.json";
import { MButton } from "components/Buttons";
import { FormControlLabelStyled } from "components/Labels";
import Markdown from "components/Markdown";
import { IOSSwitch } from "components/Switches";

function Post({ content, title }: { title?: string; content?: string }) {
  return (
    <Wrapper>
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width={"100%"}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Stack direction="row" display="flex" alignItems="center" spacing={2}>
          <MButton startIcon={<EditRounded />}>{vi.button.edit}</MButton>
          <FormControlLabelStyled control={<IOSSwitch sx={{ mr: 1 }} />} label="Hiển thị" />
        </Stack>
      </Stack>
      <Markdown>{content || ""}</Markdown>
    </Wrapper>
  );
}

export default Post;

const Wrapper = styled(Card)(() => ({
  padding: 24,
}));
