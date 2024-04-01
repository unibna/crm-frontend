// Material
import { SortingDirection } from "@devexpress/dx-react-grid";
import { Theme } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

interface Props {
  direction?: SortingDirection;
  handleClickUp: () => void;
  handleClickDown: () => void;
}
export default function ArrowVerticalIcon(props: Props) {
  const { direction, handleClickUp, handleClickDown } = props;
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: "32px" }}
    >
      <Path
        d="M9.5 9.745v-1.65l3.25-3.5 3.25 3.5v1.65H9.5z"
        fill={direction === "asc" ? PRIMARY_MAIN : theme.palette.text.primary}
        onClick={handleClickUp}
      ></Path>
      <Path
        d="M16 12.85v1.65L12.75 18 9.5 14.5v-1.65H16z"
        fill={direction === "desc" ? PRIMARY_MAIN : theme.palette.text.primary}
        onClick={handleClickDown}
      ></Path>
    </svg>
  );
}

const Path = styled(`path`)(({ theme }: { theme: Theme }) => ({
  cursor: "pointer",
  "&:hover": {
    fill: theme.palette.primary.main,
  },
}));
