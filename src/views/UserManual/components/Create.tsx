import { styled } from "@mui/material";
import { MButton } from "components/Buttons";
import Editor from "components/Editors";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useState } from "react";

function Create() {
  const [value, setValue] = useState<any>("**Hello world!!!**");
  return (
    <Wrapper>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Nội dung
      </Typography>
      <Editor
        id="userManual"
        value={value}
        simple
        onChange={setValue}
        placeholder="Nhập nội dung"
        sx={{
          "& .quill": {
            height: "100%",
          },
        }}
      />

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <MButton onClick={() => {}} isLoading={false} sx={{ mr: 2 }} variant="outlined">
          Thoát
        </MButton>
        <MButton onClick={() => {}} isLoading={false}>
          Lưu
        </MButton>
      </Stack>
    </Wrapper>
  );
}

export default Create;

const Wrapper = styled(Card)(() => ({
  padding: 24,
}));
