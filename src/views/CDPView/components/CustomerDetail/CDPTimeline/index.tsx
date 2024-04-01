import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import { timelineOppositeContentClasses } from "@mui/lab";
import map from "lodash/map";
import { NoDataPanel } from "components/DDataGrid/components";
import CDPTimelineItem from "./CDPTimelineItem";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { LabelInfo } from "components/Labels";
import format from "date-fns/format";
import { dd_MM_yyyy } from "constants/time";
import Chip from "@mui/material/Chip";

const CDPTimeline = ({
  data,
  loading,
  params,
  setParams,
  tagCategoryFilter,
  categoryFilter,
  onFilterCategory,
}: {
  data: any;
  loading: boolean;
  params?: any;
  categoryFilter: string;
  setParams?: (params?: any) => void;
  tagCategoryFilter: { [key: string]: string };
  onFilterCategory: (category: string) => void;
}) => {
  const handleShowAllTimeline = () => {
    setParams &&
      setParams({
        ...params,
        created_from: undefined,
        created_to: undefined,
        dateValue: undefined,
      });
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
      position="relative"
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={14} fontWeight="bold">
          Lịch sử
        </Typography>
        <Chip
          sx={{
            color: categoryFilter === "" ? "primary.main" : "unset",
            "&:hover": { color: "primary.main", cursor: "pointer" },
          }}
          size="small"
          label={"Tất cả"}
          onClick={() => onFilterCategory("")}
        />
        {Object.keys(tagCategoryFilter).map((item, index) => (
          <Chip
            sx={{
              color: categoryFilter === item ? "primary.main" : "unset",
              "&:hover": { color: "primary.main", cursor: "pointer" },
            }}
            size="small"
            key={index}
            label={tagCategoryFilter[item]}
            onClick={() => onFilterCategory(item)}
          />
        ))}
      </Stack>
      {params?.created_from && params?.created_to ? (
        <>
          <LabelInfo style={{ fontSize: 11 }}>{`${format(
            new Date(params.created_from),
            dd_MM_yyyy
          )} - ${format(new Date(params.created_to), dd_MM_yyyy)}`}</LabelInfo>
          <Typography
            onClick={handleShowAllTimeline}
            sx={{
              color: "secondary.main",
              fontSize: 12,
              cursor: "pointer",
              width: "fit-content",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Xem tất cả
          </Typography>
        </>
      ) : null}
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Box overflow="auto">
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
              },
              padding: 0,
              marginTop: "16px !important",
            }}
          >
            {data.length ? (
              map(data, (item, idx) => (
                <CDPTimelineItem key={idx} {...item} nextItemCreatedTime={data[idx + 1]?.created} />
              ))
            ) : (
              <NoDataPanel showImage />
            )}
          </Timeline>
        </Box>
      )}
      {data.length && params.dateValue ? (
        <Box
          position={"absolute"}
          style={{ bottom: 0, left: 16, cursor: "pointer", fontSize: 13 }}
          sx={{ color: "secondary.main" }}
          display="flex"
          alignItems={"center"}
          onClick={handleShowAllTimeline}
        >
          Xem thêm
          <KeyboardDoubleArrowDownIcon />
        </Box>
      ) : null}
    </Stack>
  );
};

export default CDPTimeline;

const SkeletonLoading = () => {
  return (
    <Stack spacing={1} overflow="auto">
      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="rectangular" width={180} height={48} />
        <Skeleton variant="rectangular" width={180} height={48} />
      </Stack>
      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="rectangular" width={180} height={48} />
        <Skeleton variant="rectangular" width={180} height={48} />
      </Stack>
      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="rectangular" width={180} height={48} />
        <Skeleton variant="rectangular" width={180} height={48} />
      </Stack>
    </Stack>
  );
};
