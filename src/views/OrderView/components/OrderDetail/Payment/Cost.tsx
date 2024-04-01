//components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { LabelInfo, TextInfo } from "components/Labels";

//utils
import { fValueVnd } from "utils/formatNumber";

const Cost = ({ cost, isConfirm }: { cost: number; isConfirm?: boolean }) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1} paddingTop={1}>
      <Grid item xs={6}>
        <LabelInfo sx={{ fontSize: "1rem", color: "inherit", textTransform: "uppercase" }}>
          Số tiền cần thanh toán
        </LabelInfo>
      </Grid>
      <Grid item xs={6}>
        <Stack direction={"row"} alignItems="center" justifyContent={"flex-end"} width={"100%"}>
          {isConfirm && (
            <Button
              disableTouchRipple
              variant="outlined"
              sx={{
                borderColor: "success.main",
                color: "success.main",
                marginRight: 2,
                "&:hover": {
                  borderColor: "success.main",
                  backgroundColor: "transparent",
                  cursor: "unset",
                },
              }}
            >
              Đã thanh toán
            </Button>
          )}
          <TextInfo
            sx={{
              color: "error.main",
              fontWeight: 700,
              fontSize: "1rem",
              textAlign: "end",
            }}
          >
            {fValueVnd(cost)}
          </TextInfo>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Cost;
