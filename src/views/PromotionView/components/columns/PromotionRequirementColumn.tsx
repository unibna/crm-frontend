//components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Chip, Stack } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SellIcon from "@mui/icons-material/Sell";
import React from "react";

//types
import { PromotionRequireType } from "_types_/PromotionType";

//utils
import { fCurrency2 } from "utils/formatNumber";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionRequirementColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: PromotionRequireType[] }) => {
    const renderType = (item: any) => {
      if (item.requirement_type) {
        switch (item.requirement_type) {
          case "QUANTITY_MIN": {
            return (
              (item.requirement && (
                <Chip
                  icon={<ShoppingBagIcon />}
                  color="success"
                  label={`SL Sản phẩm ≥ ${item.requirement}`}
                  variant="outlined"
                  sx={styles.chip}
                />
              )) ||
              ""
            );
          }

          case "TOTAL_BILL": {
            return (
              (item.requirement && (
                <Chip
                  icon={<SellIcon />}
                  color="success"
                  label={`GT đơn hàng ≥ ${fCurrency2(item.requirement)} vnđ`}
                  variant="outlined"
                  sx={styles.chip}
                />
              )) ||
              ""
            );
          }

          default:
            return null;
        }
      }

      if (item.limit_type) {
        switch (item.limit_type) {
          case "QUANTITY_MAX": {
            return (
              (item.limit && (
                <Chip
                  icon={<ShoppingBagIcon />}
                  color="error"
                  label={`SL sản phẩm ≤ ${item.limit}`}
                  variant="outlined"
                  sx={styles.chip}
                />
              )) ||
              ""
            );
          }

          case "TOTAL_MAX": {
            return (
              (item.limit && (
                <Chip
                  icon={<SellIcon />}
                  color="error"
                  label={`GT đơn hàng ≤ ${fCurrency2(item.limit)} vnđ`}
                  variant="outlined"
                  sx={styles.chip}
                />
              )) ||
              ""
            );
          }

          default:
            return null;
        }
      }

      return null;
    };
    return (
      <Stack direction="column" spacing={1}>
        {value?.map((item, index) => {
          return <React.Fragment key={index}>{renderType(item)}</React.Fragment>;
        })}
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};

export default PromotionRequirementColumn;

const styles: any = {
  chip: {
    width: "fit-content",
    pl: 0.5,
  },
};
