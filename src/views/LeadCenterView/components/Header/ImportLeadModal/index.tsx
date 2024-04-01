import FileUploadIcon from "@mui/icons-material/FileUpload";
import Button from "@mui/material/Button";
import { Box, Paper } from "@mui/material";
import map from "lodash/map";
import FormDialog from "components/Dialogs/FormDialog";
import { useState } from "react";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import { phoneLeadApi } from "_apis_/lead.api";
import useAuth from "hooks/useAuth";
import ImportStep from "./ImportStep";
import vi from "locales/vi.json";

export interface LeadForm {
  product: string | number | (string | number)[];
  channel: string | number | (string | number)[];
  fanpage: string | number | (string | number)[];
  name?: string;
  phone?: string;
  note: string;
}

const ImportLeadModal = ({ handleRefresh }: { handleRefresh?: () => void }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<PhoneLeadResType>[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const handleCloseForm = () => {
    setIsOpen(false);
    setData([]);
    setActiveStep(0);
  };

  const handleSubmitLeadExcel = async () => {
    const leads = map(data, (item) => ({
      name: item?.name,
      phone: item.phone,
      note: item.note,
      product_id: item.product?.id,
      fanpage_id: item.fanpage?.id === "none" ? null : item.fanpage?.id,
      channel_id: item.channel?.id,
    }));
    setLoading(true);
    const result = await phoneLeadApi.createPhoneLead({
      form: { leads, created_by_id: user?.id },
      endpoint: "bulk_create/",
    });
    if (result.data) {
      handleCloseForm();
      handleRefresh && handleRefresh();
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
        onSubmit={() => handleSubmitLeadExcel()}
        isLoadingButton={loading}
        disabledSubmit={data.length <= 0 || activeStep < 3}
        sx={{ ".MuiDialogContent-root": { paddingBottom: 0, ".MuiPaper-root": { padding: 0 } } }}
      >
        <Box component={Paper} p={1}>
          <ImportStep
            handleSubmitLeadExcel={setData}
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
