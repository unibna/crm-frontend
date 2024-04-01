import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";

const CommentCard = ({ message, content_id }: { content_id?: string; message?: string }) => {
  return (
    <Stack spacing={0.5}>
      {message && (
        <MTextLine label="Nội dung:" value={<Typography fontSize={13}>{message}</Typography>} />
      )}
      {content_id && (
        <MTextLine label="ContentID:" value={<Typography fontSize={13}>{content_id}</Typography>} />
      )}
    </Stack>
  );
};

export default CommentCard;
