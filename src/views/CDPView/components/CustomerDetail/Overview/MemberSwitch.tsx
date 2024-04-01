import Checkbox from "@mui/material/Checkbox";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import vi from "locales/vi.json";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MemberSwitch = ({
  value,
  setCustomer,
}: {
  value?: boolean;
  setCustomer: (value: boolean) => void;
}) => {
  return (
    <Grid item xs={12}>
      <ItemLine direction="row" alignItems="center">
        <LabelStyle>{vi.member}:</LabelStyle>
        <Checkbox
          disableTouchRipple
          checked={value}
          icon={<CancelIcon color="error" />}
          checkedIcon={<CheckCircleIcon color="primary" />}
        />
        {/* <Switch checked={value || false} onChange={(e) => setCustomer(e.target.checked)} /> */}
      </ItemLine>
    </Grid>
  );
};

export default MemberSwitch;

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: 14,
  flexShrink: 0,
  marginRight: 10,
  minWidth: 50,
  color: theme.palette.text.secondary,
}));

const ItemLine = styled(Stack)({
  padding: "4px 10px",
  ".MuiTypography-root": { fontSize: 13 },
});
