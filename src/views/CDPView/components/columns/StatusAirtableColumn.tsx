import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Span } from "components/Labels";
import { useTheme } from "@mui/material/styles";
import isArray from "lodash/isArray";
import map from "lodash/map";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const arrColor = [
  "#ffd66e",
  "#9CC7FF",
  "#93E088",
  "#0B76B7",
  "#7DABA3",
  "#FAFAFA",
  "#FFA981",
  "#CDB0FF",
  "#B87503",
  "#FFDAF6",
  "#20D9D2",
];

const STATUS_AIR_COLUMN = [
  "status_airtable",
  "solution",
  "status_other",
  "handling_staff",
  "classify",
  "description",
  "customer_comment",
  "product_airtable",
];

const StatusAirtableColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: any }) => {
    const theme = useTheme();

    const randomColor = () => {
      return arrColor[Math.floor(Math.random() * arrColor.length)];
    };

    const renderHtml = () => {
      switch (true) {
        default: {
          return (
            <div style={{ whiteSpace: "normal" }}>
              {value ? (
                isArray(value) ? (
                  map(value, (item: string, index: number) => (
                    <Span
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      sx={{ backgroundColor: randomColor() }}
                      key={index}
                    >
                      {item || ""}
                    </Span>
                  ))
                ) : (
                  <Span
                    variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                    sx={{ backgroundColor: randomColor() }}
                  >
                    {value || ""}
                  </Span>
                )
              ) : null}
            </div>
          );
        }
      }
    };

    return <>{renderHtml()}</>;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={props.for ? [...props.for, ...STATUS_AIR_COLUMN] : STATUS_AIR_COLUMN}
    />
  );
};

export default StatusAirtableColumn;
