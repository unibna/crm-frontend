import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ImportFile from "./ImportFile";
import ColumnControl, { ColumnControlType } from "./ColumnControl";
import SubmitFormFile, { SubmitFormFileType } from "./SubmitFormFile";
import StepWrap from "./StepWrap";
import vi from "locales/vi.json";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";

interface Props extends ColumnControlType, SubmitFormFileType {
  isOpenModal?: boolean;
  submitDataExcel: () => void;
  dataExcel: [string][];
  isSubmitted?: boolean;
  activeStep: number;
  getTemplate?: () => void;
  steps: (number | undefined)[];
  templateTooltip?: string;
}

/**
 * Is modal include step to transfer from file to table
 * 0. import file step
 * 1. fill value for columns
 * 2. review and submit
 * @param isOpenModal
 * @param clearErrors
 * @param gridBodyComponent form to validate columns
 * @param refactorDataFromFile function to format data file to data table
 * @param reset reset form
 * @param setData set data table
 * @param setDataExcel import data file
 * @param getBackFromTable
 * @param handleFinishStep
 * @param validationStatus validate data table
 * @param submitDataExcel
 * @param dataExcel
 * @param isSubmitted submit status
 * @param activeStep
 * @param isDisabledSubmitColumn
 * @param getBackControlColumn
 * @param table table component to show data
 * @param getTemplate template
 * @param steps define steps start with 0 (zero)
 * @returns
 */
export default function MImportStep({
  isOpenModal,
  clearErrors,
  gridBodyComponent,
  refactorDataFromFile,
  reset,
  setData,
  setDataExcel,
  getBackFromTable,
  handleFinishStep,
  validationStatus,
  submitDataExcel,
  dataExcel,
  isSubmitted,
  activeStep,
  isDisabledSubmitColumn,
  getBackControlColumn,
  table,
  getTemplate,
  steps,
  templateTooltip = "Format cột số điện thoại thành chuỗi trước khi nạp dữ liệu",
}: Props) {
  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {/* 1. import file step */}
        {typeof steps[0] === "number" && (
          <StepWrap
            activeStep={activeStep}
            index={steps[0]}
            title={
              <Stack direction="row" alignItems="center">
                {vi.import_excel}
                {getTemplate && (
                  <Tooltip title={templateTooltip}>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={getTemplate}
                      style={{ marginLeft: 8 }}
                    >
                      <DownloadIcon />
                      File mẫu
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            }
          >
            <ImportFile
              isSubmitted={isSubmitted}
              dataExcel={dataExcel}
              setDataExcel={setDataExcel}
              submitDataExcel={submitDataExcel}
            />
          </StepWrap>
        )}
        {/* 2. fill value for columns */}
        {typeof steps[1] === "number" && (
          <StepWrap activeStep={activeStep} index={steps[1]} title={vi.select_column_value}>
            <ColumnControl
              getBackControlColumn={getBackControlColumn}
              clearErrors={clearErrors}
              gridBodyComponent={gridBodyComponent}
              refactorDataFromFile={refactorDataFromFile}
              reset={reset}
              setData={setData}
              setDataExcel={setDataExcel}
              isOpenModal={isOpenModal}
              isDisabledSubmitColumn={isDisabledSubmitColumn}
            />
          </StepWrap>
        )}
        {/* 3.review and submit */}
        {typeof steps[2] === "number" && (
          <StepWrap activeStep={activeStep} index={steps[2]} title={vi.edit_cell}>
            <SubmitFormFile
              getBackFromTable={getBackFromTable}
              handleFinishStep={handleFinishStep}
              validationStatus={validationStatus}
              table={table}
            />
          </StepWrap>
        )}
      </Stepper>
    </Box>
  );
}
