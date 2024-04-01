import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export interface SubmitFormFileType {
  handleFinishStep: () => void;
  getBackFromTable: () => void;
  validationStatus: {};
  table: JSX.Element;
}
const SubmitFormFile = ({
  getBackFromTable,
  handleFinishStep,
  validationStatus,
  table,
}: SubmitFormFileType) => {
  return (
    <>
      {table}
      <Box sx={{ mb: 2 }}>
        <div>
          <Button
            variant="contained"
            onClick={handleFinishStep}
            sx={{ mt: 1, mr: 1 }}
            disabled={Object.keys(validationStatus).length > 0}
          >
            Finish
          </Button>
          <Button onClick={getBackFromTable} sx={{ mt: 1, mr: 1 }}>
            Back
          </Button>
        </div>
      </Box>
    </>
  );
};

export default SubmitFormFile;
