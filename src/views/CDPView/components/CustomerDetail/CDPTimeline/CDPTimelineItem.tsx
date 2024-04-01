import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { fDateTime } from "utils/dateUtil";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LeadCard from "./LeadCard";
import OrderCard from "./OrderCard";
import CommentCard from "./CommentCard";
import RankCard from "./RankCard";
import CarriesCustomerCard from "./CarriesCustomerCard";
import ZaloCard from "./ZaloCard";
import CustomerCareStaffCard from "./CustomerCareStaffCard";

const CDPTimelineItem = (value: any) => {
  return (
    <TimelineItem>
      <TimelineOppositeContent color="text.secondary" minWidth={130}>
        <Typography color="primary.main" fontWeight={"bold"} fontSize={14}>
          {value.label}
        </Typography>
        <Typography fontSize={13}>{fDateTime(value.history_date)}</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Paper variant="outlined" style={{ padding: 16, width: "fit-content" }}>
          {value.category === "LEAD" && (
            <LeadCard {...value} nextItemCreatedTime={value?.nextItemCreatedTime} />
          )}
          {value.category === "ORDER" && <OrderCard {...value} />}
          {value.category === "COMMENT" && <CommentCard {...value} />}
          {value.category === "INBOX" && <CommentCard {...value} />}
          {value.category === "CDP_RANK" && <RankCard {...value} />}
          {value.category === "NCS" && <CustomerCareStaffCard {...value} />}
          {value.category === "CSKH" && <CarriesCustomerCard {...value} />}
          {value.category === "ZALO" && <ZaloCard {...value} />}
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};

export default CDPTimelineItem;
