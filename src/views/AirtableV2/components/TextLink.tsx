import { useState } from "react";

import { IconButton, Typography, useTheme } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import FormDialog from "components/Dialogs/FormDialog";
import { Stack } from "@mui/material";

const TextLink = ({ content, sx, isFullContentPopup = false, ...props }: any) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const Component = (
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 500,
        color: theme.palette.text.primary,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        ...sx,
      }}
      {...props}
    >
      {content}
    </Typography>
  );
  if (isFullContentPopup)
    return (
      <Stack width="100%" direction="row" spacing={0.5} alignItems={"flex-start"}>
        {Component}
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{ padding: "4px", backgroundColor: theme.palette.grey[200] }}
        >
          <OpenInFullIcon sx={{ color: theme.palette.primary.main, fontSize: 14 }} />
        </IconButton>
        <FormDialog
          open={open}
          enableCloseByDropClick
          onClose={() => setOpen(!open)}
          isShowFooter={false}
        >
          {content}
        </FormDialog>
      </Stack>
    );
  return Component;
};

export default TextLink;
