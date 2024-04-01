import { memo } from "react";
// @mui
import Stack from "@mui/material/Stack";
// type
//
import { NavListRoot } from "./NavList";
import { NavSectionProps } from "_types_/NavSectionType";
import IconButton from "theme/overrides/IconButton";

// ----------------------------------------------------------------------

const scrollbarStyles = {
  overflow: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
    width: "6px",
    height: "6px",
  },

  "&:hover": {
    "&::-webkit-scrollbar": {
      display: "block",
    },
  },
} as const;

function NavSectionHorizontal({ navConfig }: NavSectionProps) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ bgcolor: "background.neutral", borderRadius: 1, px: 0.5 }}
    >
      <Stack direction="row" sx={{ ...scrollbarStyles, py: 1 }}>
        {navConfig.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {group.items.map((list) => (
              <NavListRoot key={list.title} list={list} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default memo(NavSectionHorizontal);
