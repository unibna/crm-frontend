import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { AttributeType } from "_types_/AttributeType";
import vi from "locales/vi.json";
import { MultiSelect } from "components/Selectors";
import { NULL_OPTION } from "constants/index";
import { useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { useEffect, useState } from "react";
import { leadStore } from "store/redux/leads/slice";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { PhoneLeadAttributeType } from "_types_/PhoneLeadType";

const COLUMN_NAMES = [
  "channel",
  "handle_reason",
  "fanpage",
  "product",
  "fail_reason",
  "bad_data_reason",
  "group_permission",
  "modified_reason",
  "reason",
  "action",
  "source",
  "customer_group",
];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  isReport?: boolean;
  editColumnNames?: string[];
}
let timeout: NodeJS.Timeout;

const AttributeColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({
    value,
    column,
  }: {
    value?: { id: number; name: string; value?: string };
    column: Column;
  }) => {
    return (
      <>
        {value
          ? props.isReport
            ? value.toString()
            : value.name || value.value
          : column.name === "data_status"
          ? vi.not
          : ""}
      </>
    );
  };

  const Editor = (editProps: React.PropsWithChildren<DataTypeProvider.ValueEditorProps>) => {
    const leadSlice = useAppSelector(leadStore);
    const [inputValue, setInputValue] = useState(editProps.value);

    const keyAttributes: keyof PhoneLeadAttributeType =  editProps.column.name as any;

    useEffect(() => {
      return () => {
        window.clearInterval(timeout);
      };
    }, []);

    const blurInput = () => {
      editProps.onValueChange(inputValue);
      timeout = setTimeout(() => {
        editProps.onBlur();
      }, 0);
    };

    const handleChangeInput = (value: string | number | (string | number)[]) => {
      const findInputValue = leadSlice.attributes[keyAttributes].find(
        (item: AttributeType) => item.id.toString() === value.toString()
      );
      if (findInputValue) {
        setInputValue(findInputValue);
      }
    };

    return (
      <ClickAwayListener onClickAway={blurInput} disableReactTree>
        <div>
          <MultiSelect
            style={attributeSelectorStyle}
            title={editProps.column.title}
            options={[
              ...(editProps.column.name === "fanpage" ? [NULL_OPTION] : []),
              ...map(leadSlice.attributes[keyAttributes], formatOptionSelect),
            ]}
            onChange={handleChangeInput}
            label={editProps.column.title}
            defaultValue={inputValue?.id}
            selectorId="attribute-fanpage"
            simpleSelect
          />
        </div>
      </ClickAwayListener>
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
      editorComponent={(e) =>
        props.editColumnNames?.includes(e.column.name)
          ? Editor(e)
          : Formatter({ value: e.value, column: e.column })
      }
    />
  );
};

export default AttributeColumn;

const attributeSelectorStyle = { width: 180 };
