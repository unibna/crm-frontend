import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material";
import { MImportFileButton } from "components/Buttons";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { useAppDispatch } from "hooks/reduxHook";
import { toastError } from "store/redux/toast/slice";

interface Props {
  dataExcel: [string][];
  setDataExcel: React.Dispatch<React.SetStateAction<[string][]>>;
  isSubmitted?: boolean;
  submitDataExcel: () => void;
}
const ImportFile = ({ dataExcel, setDataExcel, isSubmitted, submitDataExcel }: Props) => {
  const dispatch = useAppDispatch();

  const handleChangeDataExcel = (data: [string][]) => {
    if (data.length > 500) {
      dispatch(toastError({ message: VALIDATION_MESSAGE.LIMIT_ROWS }));
      return;
    } else {
      setDataExcel(data);
    }
  };

  return (
    <>
      <GridFieldWrap item xs={12} lg={4}>
        <MImportFileButton handleImportFile={handleChangeDataExcel} />
        <FormHelperText
          style={{
            display: dataExcel.length <= 0 && isSubmitted ? "inline-block" : "none",
          }}
          error={dataExcel.length <= 0 && isSubmitted}
        >
          {VALIDATION_MESSAGE.SELECT_FILE_PLEASE}
        </FormHelperText>
      </GridFieldWrap>
      {dataExcel.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <div>
            <Button variant="contained" onClick={submitDataExcel} sx={{ mt: 1, mr: 1 }}>
              Continue
            </Button>
          </div>
        </Box>
      )}
    </>
  );
};

export default ImportFile;

const GridFieldWrap = styled(Grid)`
  padding: 10px 0px;
  div {
    margin: 0px;
  }
`;
