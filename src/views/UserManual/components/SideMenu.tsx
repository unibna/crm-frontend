import { useEffect, useMemo, useState } from "react";
import { map } from "lodash";
import { useLocation } from "react-router-dom";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { styled, Theme, SxProps, alpha, useTheme } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import useAuth from "hooks/useAuth";

import sidebarConfig from "layouts/navbar/SidebarConfig";
import { NavListProps } from "_types_/NavSectionType";

interface ItemProps {
  item: NavListProps;
  buttonStyles?: React.CSSProperties & SxProps<Theme>;
  textNumber: string;
  onClick: (newValue: NavListProps) => void;
  isActive: boolean;
  theme: Theme;
  value?: any;
}

const Item = ({ item, buttonStyles, textNumber, onClick, isActive, theme }: ItemProps) => {
  const activeStyles = {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  };
  return (
    <ItemButton
      sx={{ ...buttonStyles, ...(isActive && activeStyles) }}
      onClick={() => onClick(item)}
    >
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <ItemTextNumber>{textNumber}</ItemTextNumber>
        <ItemText primary={item.title} />
      </Stack>
      <ItemIcon>
        <KeyboardArrowRightRoundedIcon />
      </ItemIcon>
    </ItemButton>
  );
};

const CollapseItem = ({
  item,
  buttonStyles,
  textNumber,
  onClick,
  isActive,
  theme,
  value,
}: ItemProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ItemButton onClick={handleClick} sx={buttonStyles}>
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <ItemTextNumber>{textNumber}</ItemTextNumber>
          <ItemText primary={item.title} />
        </Stack>
        <ItemIcon>
          <KeyboardArrowRightRoundedIcon />
        </ItemIcon>
      </ItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ pl: 4 }}>
          {map(item.children, (item, itemChildrenIndex: number) => (
            <Item
              item={item}
              key={item.title}
              textNumber={`${+textNumber}.${itemChildrenIndex + 1}`}
              onClick={() => onClick(item)}
              isActive={item.code === value?.code}
              theme={theme}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

interface Props {
  value: NavListProps | null;
  onChange: (newValue: NavListProps) => void;
}

export default function SideMenu(props: Props) {
  const { value, onChange } = props;
  const { pathname } = useLocation();
  const { user } = useAuth();
  const theme = useTheme();

  const list: NavListProps[] = useMemo(
    () =>
      sidebarConfig({
        pathname,
        handleShowThemeModal: () => {},
        roles: user?.group_permission?.data,
        userGroupId: user?.group_permission?.id || "",
      })
        .flatMap((item) => item.items)
        .filter((item) => item.code !== "support"),
    [sidebarConfig]
  );

  useEffect(() => {
    onChange(list?.[0]);
  }, [list]);

  return (
    <Card sx={{ px: 2, pb: 4, pt: 2 }}>
      <List
        sx={{ width: "100%", height: "100%" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {map(list, (item, index) =>
          !!item.children ? (
            <CollapseItem
              item={item}
              textNumber={`${index < 9 ? "0" : ""}${index + 1}`}
              key={item.path}
              onClick={onChange}
              theme={theme}
              isActive={item.code === value?.code}
              value={value}
            />
          ) : (
            <Item
              item={item}
              textNumber={`${index < 9 ? "0" : ""}${index + 1}`}
              key={item.path}
              onClick={onChange}
              theme={theme}
              isActive={item.code === value?.code}
            />
          )
        )}
      </List>
    </Card>
  );
}

const ItemText = styled(ListItemText)(() => ({
  "& .MuiTypography-root": {
    fontSize: 13,
    fontWeight: 600,
  },
}));

const ItemButton = styled(ListItemButton)(({ theme }: { theme: Theme }) => ({
  borderRadius: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: theme.transitions.create("all", { duration: ".15s", easing: "ease-in-out" }),
}));

const ItemTextNumber = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontSize: 15,
  fontWeight: 600,
  borderRadius: "50%",
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  background: theme.palette.grey[200],
}));

const ItemIcon = styled(Box)(({ theme }: { theme: Theme }) => ({
  borderRadius: "50%",
  border: `1px solid ${theme.palette.primary.main}`,
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  background: theme.palette.grey[200],
}));
