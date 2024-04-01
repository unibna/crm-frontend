// Libraries
import { useEffect, useRef, useState } from "react";

// Components
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PaletteIcon from "@mui/icons-material/Palette";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuPopover from "components/Popovers/MenuPopover";

// Assets
import { COLORS } from "assets/color";

interface Props {
  color?: string;
  onChangeColor: (color: string) => void;
}

export const MSelectColor = (props: Props) => {
  const { onChangeColor, color: colorProps = "" } = props;
  const anchorRef = useRef(null);
  const [isShowPopover, setShowPopover] = useState(false);
  const [color, setColor] = useState("transparent");

  useEffect(() => {
    if (colorProps) {
      setColor(colorProps);
    }
  }, [colorProps]);

  const handleSelectColor = (colorSelected: string) => {
    setShowPopover(false);
    setColor(colorSelected);
    onChangeColor(colorSelected);
  };

  return (
    <>
      <MenuPopover
        open={isShowPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={anchorRef.current}
        sx={{ p: 3, width: "20%" }}
      >
        <Grid container direction="row" spacing={1}>
          {COLORS.map((color: string, index: number) => {
            return (
              <Grid item key={index}>
                <Box
                  sx={{
                    height: 20,
                    width: 20,
                    backgroundColor: color,
                    "&:hover": { opacity: 0.72, cursor: "pointer" },
                  }}
                  onClick={() => handleSelectColor(color)}
                />
              </Grid>
            );
          })}
        </Grid>
      </MenuPopover>
      <Stack
        ref={anchorRef}
        onClick={() => setShowPopover(true)}
        direction="row"
        alignItems="center"
        sx={{ width: "100%", cursor: "pointer" }}
      >
        <Box>
          <PaletteIcon />
          <Box
            sx={{
              height: 5,
              backgroundColor: color,
            }}
          />
        </Box>
        <ArrowDropDownIcon />
      </Stack>
    </>
  );
};
