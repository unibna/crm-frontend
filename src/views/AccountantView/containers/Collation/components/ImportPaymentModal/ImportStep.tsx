import { Box, Paper, Stack, Typography } from "@mui/material";
import DragAndDropImagePanel from "components/Uploads/DragAndDropImagePanel";
import MImage from "components/Images/MImage";
import MImportStep from "components/MImportStep";
import { HEIGHT_DEVICE } from "constants/index";
import { useAppDispatch } from "hooks/reduxHook";
import map from "lodash/map";
import { useCallback, useEffect, useState } from "react";
import { toastWarning } from "store/redux/toast/slice";
import { uploadFile } from "utils/fileUtil";
import { errorLabel, validate } from "utils/formValidation";
import { commitChangesRow } from "utils/tableUtil";
import { writeFile } from "utils/xlsxFileUtil";
import {
  IMPORT_EXCEL_TEMPLATE,
  IMPORT_PAYMENT_FROM_EXCEL_COLUMNS,
  VALIDATION_IMPORT_PAYMENT_RULES,
} from "views/AccountantView/constants";
import {
  IMPORT_PAYMENT_COLUMNS,
  IMPORT_PAYMENT_COLUMN_WIDTHS,
} from "views/AccountantView/constants/columns";
import CollationTable from "../CollationTable";

const UPLOAD_FILE_URL = import.meta.env.REACT_APP_API_URL + "/api";

export interface CollationForm {
  OrderKey: string;
  Amount: string | number;
  ReceivedDate: string | null;
  ShippingUnit?: string;
  PaymentMethod?: string;
  Images?: { url: string; id: string }[];
}

export default function ImportStep({
  handleSubmit,
  isOpenModal,
  activeStep,
  setActiveStep,
}: {
  handleSubmit: (data: Partial<any>[]) => void;
  isOpenModal?: boolean;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Partial<CollationForm>[]>([]);
  const [validationStatus, setValidationStatus] = useState({});
  const [dataExcel, setDataExcel] = useState<[string][]>([]);
  const [urls, setUrls] = useState<{ url: string; id: string }[]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinishStep = () => {
    handleSubmit(data);
    handleNext();
  };

  const submitDataExcel = () => {
    handleNext();
    refactorDataFromFile();
  };

  const notificationError = useCallback(() => {
    const errorMessage = errorLabel(validationStatus);

    dispatch(toastWarning({ message: errorMessage, duration: 10000 }));
    return;
  }, [validationStatus, dispatch]);

  const refactorDataFromFile = () => {
    let validateValue: { [key: string]: any } = {};
    const OrderKeyIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.OrderKey
    );
    const AmountIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.Amount
    );
    const ReceivedDateIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.ReceivedDate
    );
    const ShippingUnitIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.ShippingUnit
    );
    const PaymentMethodIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.PaymentMethod
    );
    const TransactionCodeIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.TransactionCode
    );
    // const ImagesIdx = dataExcel[0]?.findIndex(
    //   (item) => item === IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.Images
    // );

    const resultDataFromFile: Partial<CollationForm>[] = map(dataExcel.slice(1), (column, idx) => {
      validateValue = {
        ...validateValue,
        ...validate(
          {
            [idx]: {
              OrderKey: column[OrderKeyIdx],
              Amount: column[AmountIdx],
              ReceivedDate: column[ReceivedDateIdx],
              ShippingUnit: column[ShippingUnitIdx],
              PaymentMethod: column[PaymentMethodIdx],
              TransactionCode: column[TransactionCodeIdx],
              // Images: column[ImagesIdx],
            },
          },
          validateValue,
          VALIDATION_IMPORT_PAYMENT_RULES
        ),
      };
      return {
        OrderKey: column[OrderKeyIdx],
        Amount: column[AmountIdx],
        ReceivedDate: column[ReceivedDateIdx],
        ShippingUnit: column[ShippingUnitIdx],
        PaymentMethod: column[PaymentMethodIdx],
        TransactionCode: column[TransactionCodeIdx],
        // Images: [column[ImagesIdx]],
      };
    });
    setData(resultDataFromFile);
    setValidationStatus(validateValue);
  };

  const commitChanges = ({
    added,
    changed,
    deleted,
  }: {
    added?: readonly any[];
    changed?: {
      [key: string]: any;
    };
    deleted?: readonly (string | number)[];
  }) => {
    if (changed) {
      const newData = commitChangesRow({ added, changed, deleted }, data);

      setValidationStatus(validate(changed, validationStatus, VALIDATION_IMPORT_PAYMENT_RULES));
      setData(newData as any);
    }
  };

  const getBackFromTable = () => {
    setData([]);
    handleBack();
  };

  const getBackFromForm = () => {
    handleBack();
    setDataExcel([]);
  };

  const handleUploadImage = async (files: File[]) => {
    const result = await uploadFile<{ image: string; id: string }>({
      name: "image",
      baseUrl: UPLOAD_FILE_URL,
      endpoint: "orders/payment/image/",
      file: files[0],
    });
    if (result?.data) {
      const { id, image } = result.data;
      setUrls((prev) => {
        const result = [...prev, { id, url: image }];
        handleRefreshDataByImages(result);
        return result;
      });
    }
  };

  const deleteImage = async ({ id, src }: { id: string; src: string }) => {
    setUrls((prev) => {
      const result = prev.filter((item) => item.id !== id);
      handleRefreshDataByImages(result);
      return result;
    });
  };

  const handleRefreshDataByImages = (images: { url: string; id: string }[]) => {
    setData((prev) => {
      const cloneData = [...prev];
      const newData = map(cloneData, (item) => ({ ...item, Images: images }));
      return newData;
    });
  };

  const handleAddImageColumn = (value: [string][]) => {
    const cloneColumns = [...value];
    cloneColumns[0].push(IMPORT_PAYMENT_FROM_EXCEL_COLUMNS.Images);
    setDataExcel(cloneColumns);
  };

  useEffect(() => {
    notificationError();
  }, [notificationError]);

  return (
    <MImportStep
      templateTooltip={`Format các cột thành chuỗi trước khi nạp dữ liệu`}
      getTemplate={() => writeFile(IMPORT_EXCEL_TEMPLATE)}
      getBackControlColumn={getBackFromForm}
      handleFinishStep={handleFinishStep}
      setData={setData}
      setDataExcel={handleAddImageColumn}
      submitDataExcel={submitDataExcel}
      validationStatus={validationStatus}
      isOpenModal={isOpenModal}
      activeStep={activeStep}
      dataExcel={dataExcel}
      steps={[0, , 1]}
      getBackFromTable={getBackFromTable}
      table={
        <>
          <Paper variant="outlined">
            <CollationTable
              editInline
              data={{ data: data, loading: false, count: data.length }}
              hiddenPagination
              heightTable={HEIGHT_DEVICE - 450}
              columns={IMPORT_PAYMENT_COLUMNS}
              defaultColumnWidths={IMPORT_PAYMENT_COLUMN_WIDTHS}
              editRowChangeForInline={commitChanges}
              validationCellStatus={validationStatus}
              columnEditExtensions={[{ columnName: "Images", editingEnabled: false }]}
            />
          </Paper>
          <Box my={2}>
            <Typography fontSize={14} fontWeight={600} mb={1}>
              Chọn hình ảnh của giao dịch
            </Typography>
            <Stack direction="row">
              <DragAndDropImagePanel
                handleDropFile={handleUploadImage}
                sizeSuggest=""
                width={250}
                height={130}
              />
              <Stack width="50%" direction="row" alignItems="center">
                {map(urls, (item) => {
                  return (
                    <MImage
                      src={item.url}
                      id={item.id}
                      preview
                      key={item.id}
                      height={130}
                      width={130}
                      wrapImageSX={{ m: 0, ml: 1 }}
                      style={{ margin: 0 }}
                      onDelete={deleteImage}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        </>
      }
    />
  );
}
