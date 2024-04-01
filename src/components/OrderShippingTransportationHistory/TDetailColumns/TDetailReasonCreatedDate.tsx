//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { MTextLine, Span } from "components/Labels";
import { fDateTime } from "utils/dateUtil";
import { OPTIONS_REASON_CREATED } from "views/TransportationCareView/constant";
import map from "lodash/map";
import vi from "locales/vi.json";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ReasonCreatedDateColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    return (
      <Stack direction="column" spacing={1.2}>
        {map(OPTIONS_REASON_CREATED, (item) => {
          return (
            <>
              {fDateTime(row?.[`${item.value}_created`]) === fDateTime(row?.modified) && (
                <MTextLine
                  key={item.value}
                  label={
                    <Span color={item.color} sx={{ width: "fit-content" }}>
                      {vi[item.value.toUpperCase()] || ""}
                    </Span>
                  }
                  value={
                    row?.[`${item.value}_created`]
                      ? fDateTime(row?.[`${item.value}_created`])
                      : "---"
                  }
                />
              )}
            </>
          );
        })}
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["reasons_created"]} />;
};

export default ReasonCreatedDateColumn;
