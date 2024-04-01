import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { UseFormClearErrors, UseFormReset } from "react-hook-form";
import { useEffect } from "react";

export interface ColumnControlType {
  setDataExcel: React.Dispatch<React.SetStateAction<[string][]>>;
  setData?: React.Dispatch<React.SetStateAction<any[]>>;
  isOpenModal?: boolean;
  clearErrors?: UseFormClearErrors<any>;
  gridBodyComponent?: JSX.Element;
  refactorDataFromFile?: () => void;
  reset?: UseFormReset<any>;
  isDisabledSubmitColumn?: boolean;
  getBackControlColumn?: () => void;
}
const ColumnControl = ({
  setDataExcel,
  setData,
  isOpenModal,
  clearErrors,
  gridBodyComponent,
  refactorDataFromFile,
  reset,
  isDisabledSubmitColumn = false,
  getBackControlColumn,
}: ColumnControlType) => {
  const handleSubmitForm = React.useCallback(() => {
    setData?.([]);
    setDataExcel([]);
    reset?.();
    clearErrors?.();
  }, [clearErrors, reset, setData, setDataExcel]);

  useEffect(() => {
    if (!isOpenModal) {
      handleSubmitForm();
    }
  }, [isOpenModal, handleSubmitForm]);

  return gridBodyComponent ? (
    <>
      <Grid container spacing={2}>
        {gridBodyComponent}
      </Grid>
      <Box sx={{ mb: 2 }}>
        <div>
          {refactorDataFromFile && (
            <Button
              variant="contained"
              onClick={refactorDataFromFile}
              sx={{ mt: 1, mr: 1 }}
              disabled={isDisabledSubmitColumn}
            >
              Continue
            </Button>
          )}

          {getBackControlColumn && (
            <Button onClick={getBackControlColumn} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
          )}
        </div>
      </Box>
    </>
  ) : null;
};

export default ColumnControl;
