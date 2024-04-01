// Libraries
import { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import map from "lodash/map";
import { useTheme } from "@mui/material/styles";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Hooks
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MButton } from "components/Buttons";
import { Span } from "components/Labels";
import Scrollbar from "components/Scrolls/Scrollbar";

// Contants & Utils
import { fDateTime } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -------------------------------------------------------------

const SkeletonLoad = () => (
  <Grid container spacing={3} sx={{ mt: 2 }}>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" width="100%" sx={{ height: 50, borderRadius: 2 }} />
    </Grid>
  </Grid>
);

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const ContentNote = ({ contentId }: { contentId: string }) => {
  const { newCancelToken } = useCancelToken();
  const theme = useTheme();

  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoadingSave, setLoadingSave] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (contentId) {
      getListNote({
        page,
        limit: 10,
      });
    }
  }, [page]);

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", handleScroll);

    return () => scrollRef.current?.removeEventListener("scroll", handleScroll);
  });

  const getListNote = async (params: Partial<any>) => {
    setLoading(true);
    const newParams = {
      ...params,
      content_id: contentId,
      ordering: "-created",
      cancelToken: newCancelToken(),
    };

    const result = await reportMarketing.get(newParams, "content-id-notes/");

    if (result && result.data) {
      const { results, count = 0 } = result.data;
      const newData: any = map(
        results,
        (item: {
          id: string;
          note: string;
          created: string;
          created_by_id: string;
          created_by_name: string;
        }) => ({
          id: item.id,
          title: item.note,
          time: fDateTime(item.created),
          name: item.created_by_name,
        })
      );

      setData([...data, ...newData]);
      setLoading(false);
      !total && setTotal(count);
    }
  };

  const handleSaveNote = async () => {
    setLoadingSave(true);
    const params = {
      content_id: contentId,
      note: value,
      created_by_id: user?.id,
      created_by_name: user?.name,
    };

    const result = await reportMarketing.create(params, "content-id-notes/");

    if (result && result.data) {
      const objValue: any = result.data;

      setData([
        {
          id: objValue.id,
          title: objValue.note,
          time: fDateTime(objValue.created),
          name: objValue.created_by_name,
        },
        ...data,
      ]);
      setValue("");
      setLoadingSave(false);
    }
  };

  const handleScroll = (event: any) => {
    const scrollHeight = getObjectPropSafely(() => event.target.scrollHeight, "");
    const scrollTop = getObjectPropSafely(() => event.target.scrollTop, "");
    const clientHeight = getObjectPropSafely(() => event.target.clientHeight, "");
    const activeScroll = scrollHeight - scrollTop - clientHeight <= 1;
    const isNoData = data.length < total;

    if (activeScroll && isNoData && !isLoading) {
      setPage(page + 1);
    }
  };

  return (
    <Card sx={{ p: 3, minWidth: 1200 }}>
      <Grid container spacing={2}>
        <Grid
          id="note-scrollbar"
          item
          container
          sx={{ maxHeight: 500, overflow: "auto" }}
          xs={6}
          spacing={2}
          className="relative"
        >
          <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, pt: 1, height: 1 }}>
            {map(data, (item, index) => (
              <Box sx={{ mt: 2 }} key={index}>
                <Stack direction="row" justifyContent="space-between">
                  <Span color="warning">{item.name}</Span>
                  <InfoStyle variant="caption">{item.time}</InfoStyle>
                </Stack>
                <TextField
                  value={item.title.replace(/(<p>|<\/p>)/gi, "")}
                  size="small"
                  minRows={2}
                  multiline
                  disabled
                  sx={{
                    width: "100%",
                    backgroundColor: theme.palette.success.lighter,
                    mt: 0.5,
                  }}
                />
              </Box>
            ))}
            {isLoading && <SkeletonLoad />}
          </Scrollbar>
        </Grid>
        <Grid item xs={6}>
          <TextField
            onChange={(event) => setValue(event.target.value)}
            label="Nhập ghi chú"
            size="small"
            minRows={2}
            multiline
            value={value}
            sx={{ width: "100%" }}
          />

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <MButton onClick={handleSaveNote} isLoading={isLoadingSave}>
              Lưu
            </MButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ContentNote;
