import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import FormDialog from "components/Dialogs/FormDialog";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import vi from "locales/vi.json";
import join from "lodash/join";
import map from "lodash/map";
import { useState } from "react";
import { fDate } from "utils/dateUtil";
import { uploadFile } from "utils/fileUtil";
import { formatFile } from "utils/xlsxFileUtil";
import ImportStep, { CollationForm } from "./ImportStep";

const UPLOAD_COLLATION_URL = import.meta.env.REACT_APP_API_URL + "/api";

const ImportLeadModal = ({ handleRefresh }: { handleRefresh?: () => void }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<CollationForm>[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const handleCloseForm = () => {
    setIsOpen(false);
    setData([]);
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    const collation = map(data, (item) => {
      const listImages = map(item.Images, (item) => item.id);
      return {
        ...item,
        Images: join(listImages, ","),
        ReceivedDate: item.ReceivedDate ? fDate(item.ReceivedDate, yyyy_MM_dd) : undefined,
      };
    });
    setLoading(true);
    const file = formatFile({ defaultData: collation });

    const result = await uploadFile({
      baseUrl: UPLOAD_COLLATION_URL,
      endpoint: "orders/upload/file/payments/",
      file,
      name: "file",
    });
    if (result.data) {
      handleCloseForm();
      handleRefresh?.();
    } else {
      setActiveStep((prev) => prev - 1);
    }
    setLoading(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="contained">
        <FileUploadIcon style={{ fontSize: 22 }} />
        {vi.import_excel}
      </Button>
      <FormDialog
        transition
        maxWidth="xl"
        buttonText={vi.button.create}
        title={vi.import_excel}
        open={isOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isLoadingButton={loading}
        disabledSubmit={data.length <= 0 || activeStep < 2}
        sx={{ ".MuiDialogContent-root": { paddingBottom: 0, ".MuiPaper-root": { padding: 0 } } }}
      >
        <Box component={Paper} p={1}>
          <ImportStep
            handleSubmit={setData}
            isOpenModal={isOpen}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Box>
      </FormDialog>
    </>
  );
};

export default ImportLeadModal;
