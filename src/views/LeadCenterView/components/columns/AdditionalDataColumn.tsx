import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Span, MTextLine } from "components/Labels";
import isArray from "lodash/isArray";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import join from "lodash/join";
import FormDialog from "components/Dialogs/FormDialog";
import { useState } from "react";

const COLUMN_NAMES = ["additional_data"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PrimitiveComponent = ({ fieldName, value = "---" }: { fieldName: string; value: string }) => {
  return <MTextLine label={`${fieldName}:`} value={value} />;
};

const ArrayComponent = ({ fieldName, values }: { fieldName: string; values: Array<any> }) => {
  return (
    <MTextLine
      label={`${fieldName}:`}
      value={
        <Typography fontSize={13} fontWeight={600}>
          {join(values, ". ")}
        </Typography>
      }
    />
  );
};

const ObjectComponent = ({ value }: { value: Object }) => {
  const [open, setOpen] = useState(false);

  const children = (
    <>
      {Object.keys(value).map((item: keyof typeof value) => {
        if (value[item]) {
          return isString(value[item]) || isNumber(value[item]) || isBoolean(value[item]) ? (
            <PrimitiveComponent key={item} fieldName={item} value={value[item].toString()} />
          ) : isArray(value[item]) ? (
            <ArrayComponent key={item} fieldName={item} values={value[item] as any} />
          ) : (
            <ObjectComponent key={item} value={value[item]} />
          );
        }
        return "";
      })}
    </>
  );

  return (
    <div>
      <FormDialog maxWidth="md" title="Dữ liệu khác" open={open} onClose={() => setOpen(false)}>
        <Stack spacing={0.5}>{children}</Stack>
      </FormDialog>
      {children}
      <Link onClick={() => setOpen(true)} style={{ cursor: "pointer", fontSize: 13 }}>
        Xem thêm
      </Link>
    </div>
  );
};

const AdditionalDataColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: Object }) => {
    return value ? <ObjectComponent value={value} /> : <Span>Không có dữ liệu</Span>;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default AdditionalDataColumn;
