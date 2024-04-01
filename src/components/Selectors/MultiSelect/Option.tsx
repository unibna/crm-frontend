import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";

import { SelectOptionType } from "_types_/SelectOptionType";

interface Props {
  option: SelectOptionType;
  handleSimpleChange: (option: SelectOptionType) => void;
  handleMultiChange: (option: SelectOptionType) => void;
  preSelect: SelectOptionType[];
  simpleSelect?: boolean;
  fullWidth?: boolean;
  renderOptionTitle?: ({ onClick }: { onClick?: () => void }) => React.ReactNode;
}

const Option = ({
  handleMultiChange,
  handleSimpleChange,
  option,
  preSelect,
  simpleSelect,
  fullWidth,
  renderOptionTitle,
}: Props) => {
  return (
    <ListItemButton
      key={option.value}
      dense
      selected={preSelect.find((item) => item.value === option.value) ? true : false}
      onClick={() => (simpleSelect ? handleSimpleChange(option) : handleMultiChange(option))}
      style={{
        backgroundColor:
          preSelect.find((item) => item.value === option.value) && simpleSelect
            ? "rgb(25, 60, 234,0.1)"
            : undefined,
        marginBottom: 2,
        padding: simpleSelect ? 3 : 0,
        paddingLeft: 10,
        paddingRight: 10,
      }}
      disabled={option.disabled}
    >
      {!simpleSelect && (
        <ListItemIcon style={{ margin: 0 }}>
          <Checkbox
            edge="start"
            checked={preSelect.find((item) => item.value === option.value) ? true : false}
          />
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          (renderOptionTitle &&
            renderOptionTitle({
              onClick: option.disabled
                ? simpleSelect
                  ? () => handleSimpleChange(option)
                  : () => handleMultiChange(option)
                : undefined,
            })) ||
          option.label
        }
        style={{
          whiteSpace: fullWidth ? "normal" : option.label.length < 40 ? "nowrap" : "break-spaces",
          paddingLeft: 4,
        }}
      />
    </ListItemButton>
  );
};

export default Option;
