import * as React from "react";

//component
import { Grid, TextField, styled } from "@mui/material";
import { MultiSelect } from "components/Selectors";
//constant
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { useForm } from "react-hook-form";
import { leadStore } from "store/redux/leads/slice";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import * as yup from "yup";
// Components
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import MImportStep from "components/MImportStep";
import { HEIGHT_DEVICE } from "constants/index";
import { useEffect, useState } from "react";
import { toastWarning } from "store/redux/toast/slice";
import { errorLabel, validate } from "utils/formValidation";
import { commitChangesRow } from "utils/tableUtil";
import { writeFile } from "utils/xlsxFileUtil";
import {
  IMPORT_EXCEL_FORM_COLUMN_ASSETS,
  IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM,
  VALIDATION_IMPORT_LEAD_RULES,
} from "views/LeadCenterView/constants";
import { IMPORT_COLUMNS, IMPORT_COLUMNS_WIDTH } from "views/LeadCenterView/constants/columns";
import LeadContainer from "../../LeadContainer";
import LeadTable from "../../tables/LeadTable";

const IMPORT_EXCEL_TEMPLATE = {
  defaultData: [{ "*Tên": "", "*Số điện thoại": "", "Ghi chú": "" }],
  fileName: "File_mau_tao_Lead",
};
const schema = yup.object().shape({
  product: yup
    .number()
    .typeError(VALIDATION_MESSAGE.SELECT_PRODUCT)
    .required(VALIDATION_MESSAGE.SELECT_PRODUCT),
  channel: yup
    .number()
    .typeError(VALIDATION_MESSAGE.SELECT_CHANNEL)
    .required(VALIDATION_MESSAGE.SELECT_CHANNEL),
  fanpage: yup
    .number()
    .typeError(VALIDATION_MESSAGE.SELECT_FANPAGE)
    .required(VALIDATION_MESSAGE.SELECT_FANPAGE),
  name: yup
    .string()
    .typeError(VALIDATION_MESSAGE.REQUIRE_NAME)
    .required(VALIDATION_MESSAGE.REQUIRE_NAME),
  phone: yup
    .string()
    .typeError(VALIDATION_MESSAGE.REQUIRE_PHONE)
    .required(VALIDATION_MESSAGE.REQUIRE_PHONE),
});

export interface LeadForm {
  product: string | number | (string | number)[];
  channel: string | number | (string | number)[];
  fanpage: string | number | (string | number)[];
  name?: string;
  phone?: string;
  note: string;
}

export default function ImportStep({
  handleSubmitLeadExcel,
  isOpenModal,
  activeStep,
  setActiveStep,
}: {
  handleSubmitLeadExcel: (data: Partial<PhoneLeadResType>[]) => void;
  isOpenModal?: boolean;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    setValue,
    clearErrors,
    reset,
    register,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<LeadForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      product: "",
      channel: "",
      fanpage: "",
      note: "",
    },
  });
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Partial<PhoneLeadResType>[]>([]);
  const [validationStatus, setValidationStatus] = useState({});
  const leadSlice = useAppSelector(leadStore);
  const [headerOptions, setHeaderOptions] = useState<SelectOptionType[]>([]);
  const [dataExcel, setDataExcel] = useState<[string][]>([]);
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(IMPORT_COLUMNS_WIDTH);
  const { channel, fanpage, note, product, name, phone } = watch();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmitForm = React.useCallback(() => {
    setData([]);
    setDataExcel([]);
    reset();
    clearErrors();
  }, [clearErrors, reset]);

  const checkColumns = () => {
    const options = map(dataExcel[0], (item, idx) => ({ label: item, value: idx?.toString() }));
    // set options cho tên và sdt
    setHeaderOptions(options);
    // tìm vị trí cột
    const nameIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_EXCEL_FORM_COLUMN_ASSETS.NAME
    );
    const phoneIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_EXCEL_FORM_COLUMN_ASSETS.PHONE
    );
    if (nameIdx >= 0) {
      setValue("name", nameIdx?.toString());
      clearErrors("name");
    }
    if (phoneIdx >= 0) {
      setValue("phone", phoneIdx?.toString());
      clearErrors("phone");
    }
  };

  const handleFinishStep = () => {
    handleSubmitLeadExcel(data);
    handleNext();
  };
  const productCellValue = (column: [string]) => {
    const productFormValue = leadSlice.attributes.product.find(
      (pd) => pd.id?.toString() === product?.toString()
    );
    const productIdx = dataExcel[0]?.findIndex((item) => item === vi.product.product);

    const result = productFormValue
      ? productFormValue
      : productIdx >= 0
      ? leadSlice.attributes.product.find(
          (item) => item?.name?.toString() === column[productIdx]?.toString()
        )
      : undefined;
    return result;
  };

  const channelCellValue = (column: [string]) => {
    const channelFormValue = leadSlice.attributes.channel.find(
      (pd) => pd?.id?.toString() === channel?.toString()
    );
    const channelIdx = dataExcel[0]?.findIndex((item) => item === vi.channel);
    const result = channelFormValue
      ? channelFormValue
      : channelIdx >= 0
      ? leadSlice.attributes.channel.find(
          (item) => item?.name?.toString() === column[channelIdx]?.toString()
        )
      : undefined;
    return result;
  };
  const fanpageCellValue = (column: [string]) => {
    const fanpageFormValue = leadSlice.attributes.fanpage.find(
      (pd) => pd?.id?.toString() === fanpage?.toString()
    );
    const fanpageIdx = dataExcel[0]?.findIndex((item) => item === vi.fanpage);
    const result = fanpageFormValue
      ? fanpageFormValue
      : fanpageIdx >= 0
      ? leadSlice.attributes.fanpage.find(
          (item) => item?.name?.toString() === column[fanpageIdx]?.toString()
        )
      : undefined;
    return result;
  };

  const refactorDataFromFile = () => {
    handleNext();
    let validateValue: { [key: string]: any } = {};
    const nameIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_EXCEL_FORM_COLUMN_ASSETS.NAME
    );
    const phoneIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_EXCEL_FORM_COLUMN_ASSETS.PHONE
    );
    const noteIdx = dataExcel[0]?.findIndex(
      (item) => item === IMPORT_EXCEL_FORM_COLUMN_ASSETS.NOTE
    );

    const resultDataFromFile: Partial<PhoneLeadResType>[] = map(
      dataExcel.slice(1),
      (column, idx) => {
        const idxNameColumn = name ? (parseInt(name) >= 0 ? parseInt(name) : nameIdx) : nameIdx;
        const idxPhoneColumn = phone
          ? parseInt(phone) >= 0
            ? parseInt(phone)
            : phoneIdx
          : phoneIdx;
        if (idxNameColumn >= 0 || idxPhoneColumn >= 0) {
          validateValue = {
            ...validateValue,
            ...validate(
              { [idx]: { phone: column[idxPhoneColumn], name: column[idxNameColumn] } },
              validateValue,
              VALIDATION_IMPORT_LEAD_RULES
            ),
          };
        }
        return {
          name: column[idxNameColumn],
          phone: column[idxPhoneColumn],
          note: note || column[noteIdx] || undefined,
          product: productCellValue(column),
          channel: channelCellValue(column),
          fanpage: fanpageCellValue(column),
        };
      }
    );
    setData(resultDataFromFile);
    setValidationStatus(validateValue);
  };

  const productError = errors?.product as { message: string };
  const channelError = errors?.channel as { message: string };
  const fanpageError = errors?.fanpage as { message: string };
  const phoneError = errors?.phone as { message: string };
  const nameError = errors?.name as { message: string };

  const handleSelectProduct = (value: string | number | (string | number)[]) => {
    setValue("product", value);
    clearErrors("product");
  };

  const handleSelectFanpage = (value: string | number | (string | number)[]) => {
    setValue("fanpage", value);
    clearErrors("fanpage");
  };
  const handleSelectChannel = (value: string | number | (string | number)[]) => {
    setValue("channel", value);
    clearErrors("channel");
  };

  const handleSelectFieldName = (value: string | number | (string | number)[]) => {
    setValue("name", value.toString());
    clearErrors("name");
  };

  const handleSelectFieldPhone = (value: string | number | (string | number)[]) => {
    setValue("phone", value.toString());
    clearErrors("phone");
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
      const newData = commitChangesRow(
        {
          added,
          changed,
          deleted,
        },
        data
      );

      setValidationStatus(validate(changed, validationStatus, VALIDATION_IMPORT_LEAD_RULES));
      setData(newData as any);
    }
  };

  const submitDataExcel = () => {
    checkColumns();
    handleNext();
  };

  const notificationError = React.useCallback(() => {
    const formatError = Object.keys(validationStatus);
    map(formatError, (rowError) => {
      const errorMessage = errorLabel(validationStatus);
      dispatch(toastWarning({ message: errorMessage }));
      return;
    });
  }, [validationStatus, dispatch]);

  const getBackFromTable = () => {
    setData([]);
    handleBack();
  };

  const getBackFromForm = () => {
    reset();
    clearErrors();
    handleBack();
    setDataExcel([]);
  };

  useEffect(() => {
    notificationError();
  }, [notificationError]);

  useEffect(() => {
    if (!isOpenModal) {
      handleSubmitForm();
    }
  }, [isOpenModal, handleSubmitForm]);

  return (
    <MImportStep
      getTemplate={() => writeFile(IMPORT_EXCEL_TEMPLATE)}
      isDisabledSubmitColumn={!phone || !name || !product || !fanpage || !channel}
      getBackControlColumn={getBackFromForm}
      handleFinishStep={handleFinishStep}
      isSubmitted={isSubmitted}
      refactorDataFromFile={refactorDataFromFile}
      reset={reset}
      setData={setData}
      setDataExcel={setDataExcel}
      submitDataExcel={submitDataExcel}
      validationStatus={validationStatus}
      isOpenModal={isOpenModal}
      activeStep={activeStep}
      clearErrors={clearErrors}
      dataExcel={dataExcel}
      getBackFromTable={getBackFromTable}
      steps={[0, 1, 2]}
      table={
        <LeadTable
          data={{ data: data, loading: false, count: data.length }}
          columns={IMPORT_COLUMNS}
          defaultColumnOrders={IMPORT_COLUMNS.map((item) => item.name)}
          heightTable={HEIGHT_DEVICE - 320}
          defaultColumnWidths={columnWidths}
          hiddenPagination
          editRowChangeForInline={commitChanges}
          validationCellStatus={validationStatus}
          editInline
          cellStyle={{ height: 80 }}
        />
      }
      gridBodyComponent={
        <>
          <GridFieldWrap item xs={12} container spacing={2}>
            <GridFieldWrap item xs={12} md={6}>
              <MultiSelect
                options={headerOptions}
                label="Tên khách hàng"
                error={Boolean(nameError?.message)}
                title={IMPORT_EXCEL_FORM_COLUMN_ASSETS.NAME}
                {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
                selectorId="customer-field-input"
                defaultValue={name}
                onChange={handleSelectFieldName}
                helperText={nameError?.message}
              />
            </GridFieldWrap>
            <GridFieldWrap item xs={12} md={6}>
              <MultiSelect
                options={headerOptions}
                label="Số điện thoại"
                error={Boolean(phoneError?.message)}
                title={IMPORT_EXCEL_FORM_COLUMN_ASSETS.PHONE}
                {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
                selectorId="phone-field-input"
                defaultValue={phone}
                onChange={handleSelectFieldPhone}
                helperText={phoneError?.message}
              />
            </GridFieldWrap>
          </GridFieldWrap>
          <GridFieldWrap item xs={12} md={6} xl={3}>
            <MultiSelect
              options={filterIsShowOptions(leadSlice.attributes.product)}
              label="Sản phẩm"
              error={Boolean(productError?.message)}
              title={IMPORT_EXCEL_FORM_COLUMN_ASSETS.PRODUCT}
              {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
              selectorId="phone-lead-product"
              defaultValue={product}
              onChange={handleSelectProduct}
              helperText={productError?.message}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12} md={6} xl={3}>
            <MultiSelect
              options={filterIsShowOptions(leadSlice.attributes.channel)}
              error={Boolean(channelError?.message)}
              label="Kênh bán hàng"
              helperText={channelError?.message}
              {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
              title={IMPORT_EXCEL_FORM_COLUMN_ASSETS.CHANNEL}
              selectorId="phone-lead-channel"
              defaultValue={channel}
              onChange={handleSelectChannel}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12} md={6} xl={3}>
            <MultiSelect
              options={filterIsShowOptions(leadSlice.attributes.fanpage)}
              label="Fanpage"
              error={Boolean(fanpageError?.message)}
              helperText={fanpageError?.message}
              title={IMPORT_EXCEL_FORM_COLUMN_ASSETS.FANPAGE}
              {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
              selectorId="phone-lead-fanpage"
              defaultValue={fanpage}
              onChange={handleSelectFanpage}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12} md={6} xl={3}>
            <TextField {...register("note")} fullWidth title="note" label={vi.note} name="note" />
          </GridFieldWrap>
        </>
      }
    />
  );
}

const GridFieldWrap = styled(Grid)`
  padding: 10px 0px;
  div {
    margin: 0px;
  }
`;
