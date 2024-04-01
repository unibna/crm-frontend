// Libraries
import { DataTypeProvider } from "@devexpress/dx-react-grid";

// MUI
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

// Components
import { MTextLine, Span } from "components/Labels";

// Utils & Constants
import { fDateTime } from "utils/dateUtil";
import { OPTIONS_REASON_CREATED, TASK_REASON_LABELS } from "views/TransportationCareView/constant";
import { TransportationCareTaskType } from "_types_/TransportationType";
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
}

const ReasonAndActionColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    const nullValue = "---";

    const isShowLate = row?.late_reason || row?.late_action || row?.late_created;
    const isShowWaitReturn =
      row?.wait_return_reason || row?.wait_return_action || row?.wait_return_created;
    const isShowReturning =
      row?.returning_reason || row?.returning_action || row?.returning_created;
    const isShowReturned = row?.returned_reason || row?.returned_action || row?.returned_created;

    if (!(isShowLate || isShowWaitReturn || isShowReturning || isShowReturned)) {
      return (
        <Span color={"default"} sx={styles?.chip}>
          Chưa có dữ liệu
        </Span>
      );
    }

    const commonProps: any = {
      displayType: "grid",
      xsLabel: 4,
      xsValue: 8,
    };

    return (
      <Stack
        display="flex"
        justifyContent="center"
        direction="column"
        spacing={1.5}
        sx={{ width: 300, py: 2 }}
      >
        {isShowLate && (
          <Box sx={{ p: 1.2 }}>
            <Stack direction="column" spacing={1}>
              <MTextLine
                label="Lí do tạo task:"
                value={
                  <Span
                    color={
                      OPTIONS_REASON_CREATED.find(
                        (item) => item.value === TransportationCareTaskType.LATE
                      )?.color
                    }
                    sx={{ width: "fit-content" }}
                  >
                    {TASK_REASON_LABELS.LATE}
                  </Span>
                }
                {...commonProps}
              />

              <MTextLine
                label="Ngày tạo task:"
                value={row?.late_created ? fDateTime(row?.late_created) : nullValue}
                {...commonProps}
              />
              <MTextLine
                label={"Lí do xử lý:"}
                value={row?.late_reason ? row?.late_reason?.label : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Hướng xử lý:"
                value={row?.late_action ? row?.late_action?.label : nullValue}
                {...commonProps}
              />
            </Stack>
          </Box>
        )}

        {isShowWaitReturn && (
          <Box sx={{ p: 1.2 }}>
            <Stack direction="column" spacing={1}>
              <MTextLine
                label="Lí do tạo task:"
                value={
                  <Span
                    color={
                      OPTIONS_REASON_CREATED.find(
                        (item) => item.value === TransportationCareTaskType.WAIT_RETURN
                      )?.color
                    }
                    sx={{ width: "fit-content" }}
                  >
                    {TASK_REASON_LABELS.WAIT_RETURN}
                  </Span>
                }
                {...commonProps}
              />

              <MTextLine
                label="Ngày tạo task:"
                value={row?.wait_return_created ? fDateTime(row?.wait_return_created) : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Lí do xử lý:"
                value={row?.wait_return_reason ? row?.wait_return_reason?.label : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Hướng xử lý:"
                value={row?.wait_return_action ? row?.wait_return_action?.label : nullValue}
                {...commonProps}
              />
            </Stack>
          </Box>
        )}

        {isShowReturning && (
          <Box sx={{ p: 1.2 }}>
            <Stack direction="column" spacing={1}>
              <MTextLine
                label="Lí do tạo task:"
                value={
                  <Span
                    color={
                      OPTIONS_REASON_CREATED.find(
                        (item) => item.value === TransportationCareTaskType.RETURNING
                      )?.color
                    }
                    sx={{ width: "fit-content" }}
                  >
                    {TASK_REASON_LABELS.RETURNING}
                  </Span>
                }
                {...commonProps}
              />

              <MTextLine
                label="Ngày tạo task:"
                value={row?.returning_created ? fDateTime(row?.returning_created) : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Lí do xử lý:"
                value={row?.returning_reason ? row?.returning_reason?.label : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Hướng xử lý:"
                value={row?.returning_action ? row?.returning_action?.label : nullValue}
                {...commonProps}
              />
            </Stack>
          </Box>
        )}

        {isShowReturned && (
          <Box sx={{ p: 1.2 }}>
            <Stack direction="column" spacing={1}>
              <MTextLine
                label="Lí do tạo task:"
                value={
                  <Span
                    color={
                      OPTIONS_REASON_CREATED.find(
                        (item) => item.value === TransportationCareTaskType.RETURNED
                      )?.color
                    }
                    sx={{ width: "fit-content" }}
                  >
                    {TASK_REASON_LABELS.RETURNED}
                  </Span>
                }
                {...commonProps}
              />

              <MTextLine
                label="Ngày tạo task:"
                value={row?.returned_created ? fDateTime(row?.returned_created) : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Lí do xử lý:"
                value={row?.returned_reason ? row?.returned_reason?.label : nullValue}
                {...commonProps}
              />
              <MTextLine
                label="Hướng xử lý:"
                value={row?.returned_action ? row?.returned_action?.label : nullValue}
                {...commonProps}
              />
            </Stack>
          </Box>
        )}
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["reason_action"]} />;
};

export default ReasonAndActionColumn;

const styles: any = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
