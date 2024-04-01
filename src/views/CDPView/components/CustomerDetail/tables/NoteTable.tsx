import { useCallback, useEffect, useState } from "react";
import { NOTE_COLUMNS, NOTE_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import CDPTable from "views/CDPView/components/CDPTable";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { customerApi } from "_apis_/customer.api";
import DragAndDropImagePanel from "components/Uploads/DragAndDropImagePanel";
import { uploadImage } from "utils/uploadUtil";
import MImage from "components/Images/MImage";
import map from "lodash/map";
import vi from "locales/vi.json";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";

const InputArea = ({
  customerID,
  refreshData,
}: {
  customerID?: string;
  refreshData: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [urls, setUrls] = useState<{ url: string; id: string }[]>([]);
  const [note, setNote] = useState("");

  const uploadFile = async (files: any[]) => {
    const result = await uploadImage(files);
    if (result) {
      setUrls((prev) => [...prev, result]);
    }
  };

  const submitNote = async () => {
    if (customerID) {
      const listUrl = map(urls, (item) => item.id);

      const result = await customerApi.create({
        params: {
          images: listUrl,
          customer: customerID,
          message: note.trim(),
        },
        endpoint: `${customerID}/notes/`,
      });
      if (result.data) {
        setUrls([]);
        setNote("");
        refreshData();
      }
    }
  };

  const deleteImage = async ({ id, src }: { id: string; src: string }) => {
    const result = await customerApi.removeFileById({ id });
    if (result.data) {
      setUrls((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginBottom: 24,
        }}
      >
        {!isMobile && (
          <Typography style={{ marginBottom: 10, fontSize: 13, width: "100%" }}>
            Thêm ghi chú
          </Typography>
        )}
        <Stack direction="row" width="100%" alignItems="center" style={{ marginBottom: 16 }}>
          <DragAndDropImagePanel
            handleDropFile={uploadFile}
            iconSize={isMobile ? 20 : 35}
            sizeSuggest=""
            width="50%"
            height={85}
          />
          <Stack width="50%" direction="row" alignItems="center">
            {map(urls, (item) => (
              <MImage
                id={item.id}
                src={item.url}
                key={item.id}
                preview
                onDelete={deleteImage}
                height={85}
                width={85}
              />
            ))}
          </Stack>
        </Stack>
        <TextField
          aria-label="empty textarea"
          placeholder="Ghi chú"
          fullWidth
          multiline
          minRows={2}
          maxRows={2}
          value={note || ""}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button style={{ marginTop: 5 }} color="primary" variant="contained" onClick={submitNote}>
          {vi.button.note_customer_add}
        </Button>
      </Paper>
    </>
  );
};

export interface NoteCustomerType {
  id: string;
  images: string[];
  customer: string;
  message: string;
  type: string;
  modified: string;
  created: string;
}

const NoteTable = ({
  customerID,
  isMutationNote,
}: {
  customerID?: string;
  isMutationNote?: boolean;
}) => {
  const { newCancelToken } = useCancelToken();
  const [data, setData] = useState<{ data: NoteCustomerType[]; loading: boolean; count: number }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = useState({ limit: 200, page: 1 });

  const getData = useCallback(async () => {
    if (customerID) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await customerApi.get<NoteCustomerType>({
        endpoint: `${customerID}/notes/`,
        params: { ...params, cancelToken: newCancelToken() },
      });
      if (result.data) {
        setData((prev) => ({
          ...prev,
          data: result.data.results,
          loading: false,
          count: result.data.count || 0,
        }));
        return;
      }

      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }

      setData((prev) => ({ ...prev, loading: false }));
    } else {
      setData((prev) => ({
        ...prev,
        data: [],
        loading: false,
        count: 0,
      }));
    }
  }, [customerID, newCancelToken, params]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Stack spacing={2}>
      <CDPTable
        isFullRow
        columns={NOTE_COLUMNS}
        defaultColumnOrders={map(NOTE_COLUMNS, (column) => column.name)}
        defaultColumnWidths={NOTE_COLUMNS_WIDTH}
        data={data}
        customerType={["type"]}
        label="Ghi chú"
        params={params}
        setParams={setParams}
        heightTable={480}
      />
      {isMutationNote && <InputArea customerID={customerID} refreshData={getData} />}
    </Stack>
  );
};

export default NoteTable;
