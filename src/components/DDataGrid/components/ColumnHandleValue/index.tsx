// Libraries
import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

// Components
import Typography from "@mui/material/Typography";

// Utils & Constants
import { fDateTime, fDate, fMinutesToTimeString, fSecondsToTimeString } from "utils/dateUtil";
import { useAppSelector } from "hooks/reduxHook";
import { rolesStore } from "store/redux/roles/slice";
import { STATUS_SYNC } from "constants/index";
import { COMMAS_REGEX } from "constants/index";
import { fValueVnd } from "utils/formatNumber";
import { dd_MM_yyyy } from "constants/time";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  arrAttachUnitVnd: string[];
  arrAttachUnitPercent: string[];
  arrDate: string[];
  arrStatus: string[];
  arrDateTime: string[];
  arrRoleOption: string[];
  arrFormatMinutesToTimeString: string[];
  arrFormatSecondsToTimeString: string[];
}

const ColumnHandleValue = (props: Props) => {
  const {
    arrAttachUnitVnd = [],
    arrAttachUnitPercent = [],
    arrDate = [],
    arrStatus = [],
    arrDateTime = [],
    arrRoleOption = [],
    arrFormatMinutesToTimeString = [],
    arrFormatSecondsToTimeString = [],
  } = props;

  const Formatter = ({ value, column }: { value: any; column: Column }) => {
    const rolesSlice = useAppSelector(rolesStore);

    const formatValue = () => {
      switch (true) {
        case arrAttachUnitVnd.includes(column.name): {
          return fValueVnd(value);
        }
        case arrAttachUnitPercent.includes(column.name): {
          return `${
            Math.trunc(value * 100)
              ?.toString()
              .replace(COMMAS_REGEX, ",") || 0
          } %`;
        }
        case arrDate.includes(column.name): {
          return value && fDate(value, dd_MM_yyyy);
        }
        case arrDateTime.includes(column.name): {
          return value && fDateTime(value);
        }
        case arrStatus.includes(column.name): {
          return value && STATUS_SYNC[value];
        }
        case arrFormatMinutesToTimeString.includes(column.name): {
          return value && fMinutesToTimeString(value, "%h %m");
        }
        case arrFormatSecondsToTimeString.includes(column.name): {
          return value && fSecondsToTimeString(value, "%h %m");
        }
        case arrRoleOption.includes(column.name): {
          return value && rolesSlice.optionRole?.[parseInt(value) - 1]?.label;
        }
        default: {
          return value;
        }
      }
    };

    return (
      <Typography variant="body2" noWrap>
        {formatValue()}
      </Typography>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandleValue;
