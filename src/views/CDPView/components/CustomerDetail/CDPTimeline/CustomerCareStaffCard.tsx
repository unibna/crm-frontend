import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";
import { UserType } from "_types_/UserType";
import { fDateTime } from "utils/dateUtil";

type Props = {
  modified_care_staff_by?: Partial<UserType>;
  customer_care_staff?: Partial<UserType>;
  datetime_modified_care_staff?: string;
};

const CustomerCareStaffCard = (props: Props) => {
  const { customer_care_staff, datetime_modified_care_staff, modified_care_staff_by } = props;
  return (
    <Stack spacing={0.5}>
      <MTextLine
        label="Người chăm sóc:"
        value={
          <Typography fontSize={13}>
            {customer_care_staff ? customer_care_staff?.name : "---"}
          </Typography>
        }
      />
      <MTextLine
        label="Người chỉnh sửa:"
        value={
          <Typography fontSize={13}>
            {modified_care_staff_by ? modified_care_staff_by?.name : "---"}
          </Typography>
        }
      />
      <MTextLine
        label="Thời gian bắt đầu tính chăm sóc:"
        value={
          <Typography fontSize={13}>
            {datetime_modified_care_staff ? fDateTime(datetime_modified_care_staff) : "---"}
          </Typography>
        }
      />
    </Stack>
  );
};

export default CustomerCareStaffCard;
