import HistoryIcon from "@mui/icons-material/History";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import React, { useEffect, useMemo, useState } from "react";

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from "@mui/lab";
import { AirTableBase, AirTableLogs } from "_types_/SkyTableType";
import { fDateTime } from "utils/dateUtil";
import EmptyContent from "views/DataFlow/components/EmptyContent";

export default function ButtonHistoryLog({
  data,
  onLoadData,
}: {
  data: AirTableLogs[];
  onLoadData: () => void;
}) {
  const [state, setState] = useState(false);

  useEffect(() => {
    state && onLoadData();
  }, [state]);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <HistoryIcon />
      </IconButton>
      <Drawer anchor={"right"} open={state} onClose={toggleDrawer(false)}>
        <Box sx={{ minWidth: 320, p: 1, pt: 0 }}>
          <Typography variant="h5" py={1}>
            History
          </Typography>
          <Divider />

          {(!data || data.length === 0) && (
            <EmptyContent
              title="No history"
              description="Your history will appear here"
              imgStyles={{ height: 120 }}
            />
          )}
          <Box sx={{ height: "90vh", overflow: "auto" }}>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {data?.map((item) => {
                return (
                  <TimelineItem key={item.id}>
                    <TimelineOppositeContent color="text.secondary" sx={{ fontSize: 10 }}>
                      {fDateTime(item.created)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography color="primary.main" sx={{ fontSize: 13, fontWeight: 600 }}>
                        {item.user_name}
                      </Typography>
                      <Typography sx={{ fontSize: 12 }} component="span">
                        {"Cập nhật"}{" "}
                        <Typography
                          color="primary.main"
                          sx={{ fontWeight: 600, display: "inline", fontSize: 12 }}
                        >
                          {item.object_type?.toUpperCase()}
                        </Typography>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
