import { ClickAwayListener, Theme, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { skycallApi } from "_apis_/skycall.api";
import { LeadStatusType } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import { SkycallType } from "_types_/SkycallType";
import { NoDataPanel } from "components/DDataGrid/components";
import { MTextLine } from "components/Labels";
import { Mp3ControlDialog } from "components/Tables/columns/PlayMediaColumn";
import { VoidChip } from "components/Tables/columns/VoipStatusColum";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import { leadStatusColor } from "features/lead/formatStatusColor";
import { useCancelToken } from "hooks/useCancelToken";
import vi from "locales/vi.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fDateTime, formatISOToLocalDateString } from "utils/dateUtil";
import { FULL_LEAD_STATUS_OPTIONS, HANDLE_STATUS_OPTIONS } from "views/LeadCenterView/constants";

const LeadCard = ({
  lead_status,
  order_information,
  fanpage,
  fail_reason,
  channel,
  handle_by,
  nextItemCreatedTime,
  process_done_at,
  handle_status,
  created,
  phone,
}: {
  lead_status: LeadStatusType;
  order_information?: string;
  fanpage?: { id: number; name: string };
  channel?: { id: number; name: string };
  handle_by?: { id: number; name: string };
  fail_reason?: { id: number; name: string };
  nextItemCreatedTime?: string;
  process_done_at?: string;
  created?: string;
  handle_status?: number;
  phone?: string;
}) => {
  const theme = useTheme();
  const styles = styled(theme);
  const { newCancelToken } = useCancelToken();

  const [voip, setVoip] = useState<{ data: SkycallType[]; loading: boolean }>({
    data: [],
    loading: false,
  });
  const leadStatus = FULL_LEAD_STATUS_OPTIONS.find((item) => item.value === lead_status);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setVoip((prev) => ({ ...prev, data: [] }));
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  //lấy voip từ ngày tạo lead => ngày hoàn thành lead
  const rangeDateFilter = useMemo(
    () => ({
      date_from: created ? format(new Date(created), yyyy_MM_dd) : undefined,
      // nếu có ngày hoàn thành thì lấy,
      // không có thì lấy ngày tạo lead ở lần sau làm ngày hoàn thành,
      // nếu không có lead ở sau nữa thì không lấy gì
      date_to: process_done_at
        ? format(new Date(process_done_at), yyyy_MM_dd)
        : nextItemCreatedTime
        ? format(new Date(nextItemCreatedTime), yyyy_MM_dd)
        : undefined,
    }),
    [created, nextItemCreatedTime, process_done_at]
  );

  const getVoip = useCallback(async () => {
    if (open) {
      if (phone) {
        setVoip((prev) => ({ ...prev, loading: true }));

        const result = await skycallApi.get<SkycallType>({
          params: {
            search: phone,
            limit: 100,
            page: 1,
            ...rangeDateFilter,
            ordering: "-date_from",
            cancelToken: newCancelToken(),
          },
          endpoint: "sky-calls/",
        });
        if (result.data) {
          const { data = [] } = result.data;
          setVoip((prev) => ({ ...prev, data, loading: false }));
          return;
        }
        if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
          return;
        }
        setVoip((prev) => ({ ...prev, loading: false }));
      } else {
        setVoip((prev) => ({ ...prev, data: [] }));
      }
    }
  }, [open, phone, rangeDateFilter, newCancelToken]);

  useEffect(() => {
    getVoip();
  }, [getVoip]);

  return (
    <Stack onClick={handlePopoverOpen}>
      <Stack
        spacing={0.5}
        display="flex"
        flexDirection={"column"}
        aria-owns={open ? "mouse-over-lead-popover" : undefined}
        aria-haspopup="true"
        style={{ position: "relative" }}
      >
        {leadStatus && (
          <Chip
            size="small"
            variant="outlined"
            label={`${leadStatus.label}`}
            style={{
              backgroundColor: leadStatusColor(lead_status),
              borderColor: leadStatusColor(lead_status),
              color: "#fff",
              width: "fit-content",
            }}
          />
        )}
        {order_information && (
          <MTextLine
            label="Mã đơn:"
            value={
              <a
                //   href={`${window.location.origin}/orders/${row?.id}?sourceName=${row?.source?.name}&ecommerceCode=${row?.ecommerce_code}`}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.mainText, textDecoration: "none" }}
              >
                {order_information}
              </a>
            }
          />
        )}
        {fanpage && (
          <MTextLine
            label="Fanpage:"
            value={<Typography fontSize={13}>{fanpage.name}</Typography>}
          />
        )}
        {fail_reason && (
          <MTextLine
            label="Lý do:"
            value={<Typography fontSize={13}>{fail_reason?.name}</Typography>}
          />
        )}

        {/* anchor origin */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "green",
            position: "absolute",
            top: -10,
            right: -10,
          }}
        />
      </Stack>

      <Popover
        id="mouse-over-popover"
        sx={{ maxHeight: 600, maxWidth: 500 }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <ClickAwayListener onClickAway={handlePopoverClose} disableReactTree>
          <Stack padding={1} spacing={1}>
            {channel && (
              <MTextLine
                label="Kênh bán hàng:"
                value={<Typography fontSize={13}>{channel?.name}</Typography>}
              />
            )}
            {handle_by && (
              <MTextLine
                label="Người xử lý:"
                value={<Typography fontSize={13}>{handle_by?.name}</Typography>}
              />
            )}
            {handle_status && (
              <MTextLine
                label="Trạng thái xử lý:"
                value={
                  <Typography fontSize={13}>
                    {
                      HANDLE_STATUS_OPTIONS.find(
                        (item) => item.value.toString() === handle_status.toString()
                      )?.label
                    }
                  </Typography>
                }
              />
            )}
            {fail_reason && (
              <MTextLine
                label="Lý do:"
                value={<Typography fontSize={13}>{fail_reason?.name}</Typography>}
              />
            )}
            <Typography fontSize={13}>Danh sách cuộc gọi:</Typography>
            <TableContainer component={Paper}>
              {voip.loading && <LinearProgress />}
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Người trực</TableCell>
                    <TableCell>Cuộc gọi</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thời gian</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voip.data.map((row) => {
                    return (
                      <TableRow
                        key={row.sky_call_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          td: { fontSize: 12 },
                        }}
                      >
                        <TableCell>{row.telephonist_name}</TableCell>
                        <TableCell>
                          <Mp3ControlDialog maxWidth="md" title={vi.audio} url={row.record_url} />
                        </TableCell>
                        <TableCell>
                          <VoidChip value={row.call_status} />
                        </TableCell>
                        <TableCell>
                          {row.date_from
                            ? fDateTime(formatISOToLocalDateString(row.date_from))
                            : ""}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {voip.data.length == 0 ? <NoDataPanel showImage /> : null}
          </Stack>
        </ClickAwayListener>
      </Popover>
    </Stack>
  );
};

export default LeadCard;

const styled = (theme: Theme) => {
  return {
    mainText: {
      fontWeight: 400,
      fontSize: 14,
      color: theme.palette.primary.main,
    },
  };
};
