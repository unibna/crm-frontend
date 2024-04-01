import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { MTextLine } from "components/Labels";

const VersionView = () => {
  return (
    <Grid container direction="row" sx={{ flexWrap: "wrap" }}>
      <Grid item xs={12}>
        <MTextLine
          label="NGINX_IMAGE:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_NGINX_IMAGE}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_API_URL:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_API_URL}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_CI_COMMIT_SHORT_SHA:"
          value={
            <Typography style={titleStyle}>
              {import.meta.env.REACT_APP_CI_COMMIT_SHORT_SHA}
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_CI_COMMIT_TIMESTAMP:"
          value={
            <Typography style={titleStyle}>
              {import.meta.env.REACT_APP_CI_COMMIT_TIMESTAMP}
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_DIGITAL_OCEAN_IP_ADDRESS:"
          value={
            <Typography style={titleStyle}>
              {import.meta.env.REACT_APP_DIGITAL_OCEAN_IP_ADDRESS}
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_FACEBOOK_DEV_ID:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_FACEBOOK_DEV_ID}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_GHN_API_URL:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_GHN_API_URL}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_GHN_FE_ONLINE_API_URL:"
          value={
            <Typography style={titleStyle}>
              {import.meta.env.REACT_APP_GHN_FE_ONLINE_API_URL}
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_GHN_SHOP_ID_DEV:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_GHN_SHOP_ID_DEV}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_GHN_SHOP_ID:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_GHN_SHOP_ID}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_GHN_TOKEN_DEV:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_GHN_TOKEN_DEV}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_GHN_TOKEN:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_GHN_TOKEN}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_HOTLINE:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_HOTLINE}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_NGINX_IMAGE:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_NGINX_IMAGE}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_ORGANIZATION_ID:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_ORGANIZATION_ID}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_PRIVACY_URL:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_PRIVACY_URL}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_REPORT_API:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_REPORT_API}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_SENTRY_URL:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_SENTRY_URL}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_SHOP_ADDRESS:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_SHOP_ADDRESS}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_SHOP_NAME_2:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_SHOP_NAME_2}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_SHOP_NAME:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_SHOP_NAME}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_SHOPEE_SHOP_ID:"
          value={
            <Typography style={titleStyle}>{import.meta.env.REACT_APP_SHOPEE_SHOP_ID}</Typography>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_SKYCOM_API:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_SKYCOM_API}</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <MTextLine
          label="REACT_APP_URL_DATA:"
          value={<Typography style={titleStyle}>{import.meta.env.REACT_APP_URL_DATA}</Typography>}
        />
      </Grid>
    </Grid>
  );
};

export default VersionView;

const titleStyle = { color: "green", marginLeft: 20 };
