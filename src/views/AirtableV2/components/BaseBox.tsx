import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { BaseBoxProps } from "_types_/SkyTableType";
import { useMemo } from "react";
import { standardString } from "utils/helpers";

function BaseBox(props: BaseBoxProps) {
  const { name, icon, color, onClick, MenuComponent } = props;
  const theme = useTheme();

  const shortName = useMemo(() => {
    const arrStr = name.split(" ");
    return standardString(
      arrStr.length > 1
        ? arrStr[0].charAt(0) + arrStr[1].charAt(0)
        : name.substring(0, name.length > 1 ? 2 : name.length)
    ).toUpperCase();
  }, [name]);

  return (
    <Stack
      direction="column"
      spacing={1}
      display="flex"
      justifyContent={"center"}
      alignItems="center"
      sx={{ position: "relative" }}
    >
      <Avatar
        sx={{
          backgroundColor: color || theme.palette.divider,
          borderRadius: 1,
          width: 70,
          height: 70,
          transition: theme.transitions.create("all", {
            duration: ".15s",
          }),
          "&:hover": {
            filter: "brightness(0.5)",
          },
          cursor: "pointer",
          fontSize: 32,
          fontFamily: "monospace",
        }}
        onClick={onClick}
      >
        {icon || shortName}
      </Avatar>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "break-spaces",
          textAlign: "center",
          width: 70,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {name}
      </Typography>
      {MenuComponent && <Box sx={{ position: "absolute", right: 4, top: -8 }}>{MenuComponent}</Box>}
    </Stack>
  );
}

export default BaseBox;
