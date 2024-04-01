// Libraries
import { useRef, useState } from "react";
import { isArray } from "lodash";

// Components
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import map from "lodash/map";
import MenuPopover from "components/Popovers/MenuPopover";

// Types
import { ColorSchema } from "_types_/ThemeColorType";

export interface DataTimelineProps {
  id?: string | number;
  title: string | string[];
  des?: string;
  time: string;
  icon?: JSX.Element;
  color?: ColorSchema;
  [key: string]: any;
}
interface Props {
  data: DataTimelineProps[];
  childrenPopover?: (propChildren: any) => JSX.Element;
}

interface PropsItem extends Props {
  item: DataTimelineProps;
}

const MTimeLineItem = (props: PropsItem) => {
  const anchorRef = useRef(null);
  const { item, childrenPopover } = props;
  const [isShowPopover, setShowPopover] = useState(false);

  return (
    <>
      <MenuPopover
        open={isShowPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={anchorRef.current}
        sx={{ p: 3, width: "30%" }}
      >
        {childrenPopover && childrenPopover(item)}
      </MenuPopover>
      <TimelineItem ref={anchorRef} onClick={() => childrenPopover && setShowPopover(true)}>
        <TimelineOppositeContent>
          <Typography variant="subtitle1">{item.time}</Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color={item.color}>{item.icon}</TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper
            sx={{
              p: 3,
              bgcolor: "grey.50012",
            }}
          >
            {isArray(item.title) ? (
              map(item.title, (itemTitle: string, index: number) => (
                <Typography key={index} variant="body2" sx={{ color: "text.secondary" }}>
                  {itemTitle}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item.title}
              </Typography>
            )}
            {item.des ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item.des}
              </Typography>
            ) : null}
          </Paper>
        </TimelineContent>
      </TimelineItem>
    </>
  );
};

const MTimeline = (props: Props) => {
  const { data = [] } = props;

  return (
    <Timeline position="alternate">
      {map(data, (item: DataTimelineProps, index: number) => (
        <MTimeLineItem key={index} item={item} {...props} />
      ))}
    </Timeline>
  );
};

export default MTimeline;
