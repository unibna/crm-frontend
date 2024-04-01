import { Box, Chip, Grid, Stack, SxProps, Theme, Typography } from "@mui/material";

interface Props {
  is_existed?: boolean;
  is_duplicated_ip?: boolean;
  is_valid: boolean;
  ip_address?: string;
  os?: string;
  order_information?: string;
}

function ValidateInfoCard(props: Props) {
  const styles: { [key: string]: SxProps<Theme> } = {
    labelInfo: {
      fontWeight: 400,
      fontSize: "0.8125rem",
      display: "inline",
    },
    info: {
      fontWeight: 600,
      fontSize: "0.8125rem",
      display: "inline",
      whiteSpace: "break-spaces",
    },
    chip: {
      width: "fit-content",
      fontSize: "0.675rem",
      height: "26px",
      fontWeight: 600,
    },
  };

  return (
    <Box sx={{ minWidth: "200px" }}>
      <Grid container>
        <Grid item xs={4}>
          <Typography sx={styles.labelInfo} component="div">
            {`Mã đơn: `}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={styles.info}>{`${props.order_information || "---"}`}</Typography>
        </Grid>
      </Grid>
      <Stack display="flex" direction="row" spacing={2}>
        <Chip
          label={`Trùng`}
          color={props.is_existed ? "error" : "default"}
          sx={{ ...styles.chip, opacity: props.is_existed ? 1 : 0.1 }}
        />
        <Chip
          label={`Trùng IP`}
          color={props.is_duplicated_ip ? "error" : "default"}
          sx={{ ...styles.chip, opacity: props.is_duplicated_ip ? 1 : 0.1 }}
        />
        <Chip
          label={`Sai`}
          color={!props.is_valid ? "error" : "default"}
          sx={{ ...styles.chip, opacity: !props.is_valid ? 1 : 0.1 }}
        />
      </Stack>
      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={2}>
          <Typography sx={styles.labelInfo} component="div">
            {`IP: `}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography sx={styles.info}>{`${props.ip_address || "---"}`}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={styles.labelInfo} component="div">
            {`OS: `}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography
            sx={{
              ...styles.info,
              lineClamp: 2,
              WebkitLineClamp: 2,
            }}
            className="text-max-line"
          >{`${props.os || "---"}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ValidateInfoCard;
