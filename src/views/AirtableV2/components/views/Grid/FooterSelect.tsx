import { alpha, MenuItem, OutlinedInput, Select, Stack, useTheme } from "@mui/material";
import { MATH_FUNCTIONS } from "_types_/SkyTableType";
import { useState } from "react";
import { MathFunctions, MathFunctionsObject } from "views/AirtableV2/constants";
import TextLink from "../../TextLink";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

interface Props {
  data: any[];
  formatFunc: any;
}

function FooterSelect(props: Props) {
  const theme = useTheme();
  const { data, formatFunc } = props;
  const [value, setValue] = useState<MATH_FUNCTIONS>(MATH_FUNCTIONS.SUM);

  return (
    <Select
      sx={{
        width: "100%",
        p: 0,
        ".MuiSelect-select": {
          p: 0,
        },
        fieldset: {
          border: "none",
        },
      }}
      value={value}
      onChange={(e) => setValue(e.target.value as MATH_FUNCTIONS)}
      input={<OutlinedInput />}
      renderValue={(selected) => {
        const obj = MathFunctionsObject[selected];
        const content =
          formatFunc && ![MATH_FUNCTIONS.EMPTY, MATH_FUNCTIONS.FILLED].includes(selected)
            ? formatFunc(obj.calc(data))
            : obj.calc(data);
        return (
          <Stack direction="row" spacing={1} display="flex" alignItems="center">
            <Stack direction="row" spacing={0.5} display="flex" alignItems="center">
              {/* {obj.icon} */}
              <TextLink content={obj.label} />
            </Stack>

            <TextLink
              content={content}
              component="div"
              sx={{
                fontWeight: 700,
                ".MuiTypography-root": {
                  fontWeight: 700,
                },
              }}
            />
          </Stack>
        );
      }}
      MenuProps={MenuProps}
    >
      {MathFunctions.map((item) => (
        <MenuItem
          key={item.type}
          value={item.type}
          sx={{
            ...(item.type === value && {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            }),
          }}
        >
          <TextLink content={item.label} />
        </MenuItem>
      ))}
    </Select>
  );
}

export default FooterSelect;
