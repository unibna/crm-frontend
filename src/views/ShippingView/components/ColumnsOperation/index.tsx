// Libraries
import { useRef, useState } from "react";

// Components
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { MButton } from "components/Buttons";
import MenuPopover from "components/Popovers/MenuPopover";

// Constants & Utils
import { ShippingType } from "_types_/ShippingType";

// --------------------------------------------

interface Props extends ShippingType {
  handleCancel?: VoidFunction;
}

const ColumnsPackage = (props: Props) => {
  const { handleCancel } = props;
  const anchorRef = useRef(null);
  const [isShowPopover, setShowPopover] = useState(false);

  return (
    <Grid container>
      <Grid item xs={12}>
        <MenuPopover
          open={isShowPopover}
          onClose={() => setShowPopover(false)}
          anchorEl={anchorRef.current}
          sx={{ p: 3, width: "20%" }}
        >
          <Typography variant="body2">
            Đơn sẽ chuyển qua trạng thái hủy và không được giao. Bạn có chắc
            chắn với điều này ?
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <MButton
              variant="outlined"
              color="error"
              onClick={() => setShowPopover(false)}
            >
              Hủy
            </MButton>
            <MButton onClick={handleCancel}>Đồng ý</MButton>
          </Stack>
        </MenuPopover>
        <Button
          ref={anchorRef}
          variant="outlined"
          color="error"
          onClick={() => setShowPopover(!isShowPopover)}
        >
          Hủy vận đơn
        </Button>
      </Grid>
    </Grid>
  );
};

export default ColumnsPackage;
