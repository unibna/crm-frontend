// Libraries
import { useState, useEffect, memo, useContext } from "react";
import { styled } from "@mui/material";
import produce from "immer";
import isEqual from "lodash/isEqual";

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import FormDialog from "components/Dialogs/FormDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { MultiSelect } from "components/Selectors";

// Constants
import { random } from "utils/randomUtil";
import { SelectOptionType } from "_types_/SelectOptionType";
interface Props {
  isOpen: boolean;
  isLoadingButton?: boolean;
  contentButtonCustom: any;
  title?: string;
  buttonText?: string;
  attributes?: { attribute: number | string; attributeValue: number | string }[];
  handleClose: () => void;
  handleSubmit: (data: any) => void;
}

interface ItemData {
  id: string | undefined;
  attribute: number | string;
  attributeValue: number | string;
}

const SelectDiv = styled("div")({
  display: "flex",
  marginLeft: "2em",
  alignItems: "center",
  marginBottom: "10px",
});

const AttachAttributesPopup = (props: Props) => {
  const {
    title,
    isOpen,
    isLoadingButton = false,
    contentButtonCustom,
    attributes = [],
    buttonText,
    handleClose,
    handleSubmit,
  } = props;
  const type = {
    CHANGE_ATTRIBUTES: "CHANGE_ATTRIBUTES",
    CHANGE_ATTRIBUTES_VALUE: "CHANGE_ATTRIBUTES_VALUE",
  };
  const defaultOption: ItemData = {
    id: random(8),
    attribute: "none",
    attributeValue: "none",
  };
  const { state: store } = useContext(StoreReportFacebook);
  const [data, setData] = useState<ItemData[]>([defaultOption]);
  const [dataRenderAttributes, setDataRenderAttributes] = useState<SelectOptionType[]>([]);
  const [dataRenderAttributesValue, setDataRenderAttributesValue] = useState<any>([]);
  const { listAttributes: attributesStore = [] } = store;
  const initOption = [
    {
      label: "Chưa có",
      value: "none",
    },
  ];

  useEffect(() => {
    const arrAttributes = attributesStore.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    const arrAttributesValue = attributesStore.map((item: any) => {
      const newValues = item.data.map((value: any) => {
        return {
          value: value.id,
          label: value.name,
        };
      });

      return {
        label: item.name,
        value: item.id,
        data: newValues,
      };
    });

    if (attributes.length) {
      const newData = attributes.map((item: any) => {
        return {
          ...item,
          id: random(8),
        };
      });
      setData(newData);
    }

    setDataRenderAttributes([...initOption, ...arrAttributes]);

    setDataRenderAttributesValue(arrAttributesValue);
  }, [attributesStore]);

  const onSubmitAttribute = () => {
    handleSubmit(data);
  };

  const changeData = (idRow: string, data: ItemData[], value: number | string, key: string) => {
    const index = data.findIndex((item) => item.id === idRow);
    const newData = produce(data, (draft: any) => {
      draft[index][key] = value;
    });

    return newData;
  };

  const handleChange = (idRow: string, status: string, value: number | string) => {
    switch (status) {
      case type.CHANGE_ATTRIBUTES: {
        const newData = changeData(idRow, data, value, "attribute");
        setData(newData);
        break;
      }
      case type.CHANGE_ATTRIBUTES_VALUE: {
        const newData = changeData(idRow, data, value, "attributeValue");
        setData(newData);
      }
    }
  };

  const handleAddRow = () => {
    setData([...data, defaultOption]);
  };

  const handleRemoveRow = (idRow: string) => {
    const newData = data.filter((item) => item.id !== idRow);

    setData(newData);
  };

  const renderBody = () => {
    return data.map((item: any) => {
      let dataAttributesValue = [...initOption];
      if (item.attribute !== "none") {
        const dataRender = dataRenderAttributesValue.find(
          (attribute: any) => attribute.value === item.attribute
        );
        if (dataRender) {
          dataAttributesValue = [...initOption, ...dataRender.data];
        }
      }

      const objAttribute =
        dataRenderAttributes.find((option: any) => option.value === item?.attribute) ||
        dataRenderAttributes[0];

      const objAttributeValue =
        dataAttributesValue.find((option: any) => option.value === item.attributeValue) ||
        dataAttributesValue[0];

      return (
        <SelectDiv key={item.id} style={{ marginTop: 30, marginLeft: 0 }}>
          <Stack direction="row" spacing={1}>
            <MultiSelect
              outlined
              fullWidth
              title="Thuộc tính"
              options={dataRenderAttributes}
              onChange={(value: any) => handleChange(item.id, type.CHANGE_ATTRIBUTES, value)}
              label=""
              size="medium"
              defaultValue={objAttribute?.value}
              simpleSelect
              selectorId="attributes"
            />
            <MultiSelect
              outlined
              fullWidth
              title="Giá trị thuộc tính"
              options={dataAttributesValue}
              onChange={(value: any) => handleChange(item.id, type.CHANGE_ATTRIBUTES_VALUE, value)}
              label=""
              size="medium"
              defaultValue={objAttributeValue.value}
              simpleSelect
              selectorId="attribute-value"
            />
          </Stack>
          {data.length > 1 && (
            <div style={{ marginLeft: 40 }}>
              <IconButton
                color="secondary"
                aria-label="upload picture"
                component="span"
                onClick={() => handleRemoveRow(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </SelectDiv>
      );
    });
  };

  return (
    <FormDialog
      title={title}
      sizeTitle="h5"
      buttonText={buttonText}
      maxWidth="sm"
      onClose={handleClose}
      onSubmit={onSubmitAttribute}
      isLoadingButton={isLoadingButton}
      open={isOpen}
    >
      {renderBody()}
      <Button type="submit" variant="contained" size="small" sx={{ mt: 2 }} onClick={handleAddRow}>
        {contentButtonCustom}
      </Button>
    </FormDialog>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (
    !isEqual(prevProps.title, nextProps.title) ||
    !isEqual(prevProps.isOpen, nextProps.isOpen) ||
    !isEqual(prevProps.handleClose, nextProps.handleClose) ||
    !isEqual(prevProps.handleSubmit, nextProps.handleSubmit)
  ) {
    return false;
  }
  return true;
};

export default memo(AttachAttributesPopup, areEqual);
