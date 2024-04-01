// Libraries
import { DataTypeProvider, FilterOperation, Column } from "@devexpress/dx-react-grid";
import isBoolean from "lodash/isBoolean";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";

// Components
import CancelIcon from "@mui/icons-material/Cancel";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import { Span } from "components/Labels";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

// Constants
import { isObject } from "lodash";
import { STATUS_SYNC } from "constants/index";
import { COMMAS_REGEX } from "constants/index";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ColumnEditLabel = (props: Props) => {
  const Formatter = ({ value, column }: { value: any; column: Column }) => {
    const theme = useTheme();
    const switchColor = () => {
      switch (true) {
        case STATUS_SYNC[value] === STATUS_SYNC.OH: {
          return "primary";
        }
        case STATUS_SYNC[value] === STATUS_SYNC.IP: {
          return "warning";
        }
        case STATUS_SYNC[value] === STATUS_SYNC.RJ: {
          return "error";
        }
        case STATUS_SYNC[value] === STATUS_SYNC.CO: {
          return "success";
        }
        case STATUS_SYNC[value] === STATUS_SYNC.ER: {
          return "default";
        }
        case STATUS_SYNC[value] === STATUS_SYNC.ACTIVE: {
          return "primary";
        }
        case STATUS_SYNC[value] === STATUS_SYNC.INACTIVE: {
          return "error";
        }
        case value === "1": {
          return "success";
        }
        case value === "2": {
          return "error";
        }
      }
      return;
    };

    const convertUnitVnd = (value: number) => {
      return `${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0} đ`;
    };

    const renderHtml = () => {
      switch (true) {
        case isBoolean(value) && value: {
          return <OfflinePinIcon style={{ ...iconStyle, color: "#389b33" }} />;
        }
        case isBoolean(value) && !value: {
          return <CancelIcon style={{ ...iconStyle, color: "#DC3F34" }} />;
        }
        case ["is_new_customer"].includes(column.name): {
          return (
            <>
              {value !== null ? (
                <CancelIcon style={{ ...iconStyle, color: "#DC3F34" }} />
              ) : (
                <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="default">
                  Đang cập nhật
                </Span>
              )}
            </>
          );
        }
        case ["extra_data"].includes(column.name): {
          return value.length
            ? map(value, (item: any, index: number) => {
                const { old_value = "", new_value = "" } = item;
                return (
                  <Grid mb={1} key={index}>
                    {old_value || new_value ? (
                      <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                        Từ
                      </Typography>
                    ) : null}
                    {old_value ? (
                      <Span
                        variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                        color="warning"
                      >
                        {/0{3,}/g.test(old_value.toString())
                          ? convertUnitVnd(old_value)
                          : old_value}
                      </Span>
                    ) : null}
                    <Typography variant="body2" component="span" sx={{ ml: 1, mr: 1 }}>
                      -
                    </Typography>
                    {old_value || new_value ? (
                      <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                        thành
                      </Typography>
                    ) : null}
                    {new_value ? (
                      <Span
                        variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                        color="primary"
                      >
                        {/0{3,}/g.test(new_value.toString())
                          ? convertUnitVnd(new_value)
                          : new_value}
                      </Span>
                    ) : null}
                  </Grid>
                );
              })
            : null;
        }
        case isObject(value): {
          return (
            <>
              {value.label ? (
                <Chip
                  label={value.label}
                  sx={{
                    color: "#fff",
                    backgroundColor: value.color || "primary.main" || "#384550",
                  }}
                  size="small"
                />
              ) : null}
            </>
          );
        }
        default: {
          return (
            <>
              {value ? (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={switchColor()}
                >
                  {STATUS_SYNC[value] || ""}
                </Span>
              ) : null}
            </>
          );
        }
      }
    };

    return <>{renderHtml()}</>;
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnEditLabel;

const iconStyle = { marginLeft: 20, fontSize: 25 };
