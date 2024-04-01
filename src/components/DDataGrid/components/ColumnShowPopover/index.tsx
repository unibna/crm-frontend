// Libraries
import { useRef, useState, useMemo } from "react";
import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import filter from "lodash/filter";
import isEqual from "lodash/isEqual";
import { useTheme } from "@mui/material/styles";

// Components
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MenuPopover from "components/Popovers/MenuPopover";
import Divider from "@mui/material/Divider";

// Utils & Constants

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  handleChangeValue?: (column: any, value: any, row: any) => void;
}

const ColumnShowPopover = (props: Props) => {
  const { handleChangeValue = () => {} } = props;
  const Formatter = ({ value, column, row }: { value: any; column: Column; row?: any }) => {
    const theme = useTheme();
    const { list, options = [], isSimpleSelect = false } = value;
    const anchorRef = useRef(null);
    const [isShowPopover, setShowPopover] = useState(false);
    const [arrValue, setArrValue] = useState(list);

    const handleClose = () => {
      setShowPopover(false);

      if (!isEqual(list, arrValue)) {
        handleChangeValue(column, isSimpleSelect ? arrValue[0] || "" : arrValue, row);
      }
    };

    const handleSelectValue = (isActive: boolean, option: { label: string; value: string }) => {
      let newArrValue: any = [...arrValue];

      if (isSimpleSelect) {
        newArrValue = isActive ? [] : [option];
      } else {
        newArrValue = isActive
          ? filter(arrValue, (item) => item.value !== option.value)
          : [...arrValue, option];
      }

      setArrValue(newArrValue);
    };

    const arrValueSelected = useMemo(() => {
      return map(arrValue, (item) => item.value);
    }, [arrValue]);

    return (
      <>
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={1}
          ref={anchorRef}
          onClick={() => setShowPopover(true)}
          sx={{ cursor: "pointer" }}
        >
          {list.length ? (
            map(list, (item, index) => {
              return (
                <Grid item key={item.id || index}>
                  <Chip
                    label={item.label}
                    sx={{
                      color: "#fff",
                      backgroundColor: item.color || "#384550",
                    }}
                    size="small"
                  />
                </Grid>
              );
            })
          ) : (
            <Grid item></Grid>
          )}
        </Grid>
        <MenuPopover
          open={isShowPopover}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          sx={{ p: 3, width: "auto" }}
        >
          <Grid container direction="row" alignItems="center" spacing={1}>
            {options.length
              ? map(options, (option, index) => {
                  const isActive = arrValueSelected.includes(option.value);

                  return (
                    <Grid item key={index}>
                      <Chip
                        label={option.label}
                        size="small"
                        sx={{
                          color: "#fff",
                          ...(!isActive && {
                            opacity: 0.2,
                          }),
                          ...(isActive && {
                            boxShadow: theme.shadows[18],
                          }),
                          backgroundColor: option.color || "#384550",
                          "&: hover": {
                            backgroundColor: option.color || "#384550",
                          },
                        }}
                        onClick={() => handleSelectValue(isActive, option)}
                      />
                      {!isActive && (
                        <Divider
                          sx={{
                            pt: 0.5,
                            borderStyle: "dotted",
                            borderColor: theme.palette.grey[500],
                          }}
                        />
                      )}
                    </Grid>
                  );
                })
              : null}
          </Grid>
        </MenuPopover>
      </>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnShowPopover;
