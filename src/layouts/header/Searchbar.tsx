import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";
import searchFill from "@iconify/icons-eva/search-fill";
// material
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Input,
  Slide,
  InputAdornment,
  ClickAwayListener,
  IconButton,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { SidebarItemType } from "layouts/navbar/SidebarConfig";
import { standardString } from "utils/helpers";
import { NavListProps } from "_types_/NavSectionType";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 64;

const SearchbarStyle = styled("div")(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 1103,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  height: APPBAR_MOBILE,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up("md")]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar({ configs }: { configs: SidebarItemType[] }) {
  const [isOpen, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dataSearch = useMemo(() => {
    let newConfigs = configs;
    if (!searchText) return newConfigs;
    const standardSeachText = standardString(searchText);
    newConfigs = newConfigs.reduce((prev: SidebarItemType[], current) => {
      if (
        current.items.some(
          (item) =>
            standardString(item.title).includes(standardSeachText) ||
            item.path?.includes(standardSeachText) ||
            item.children?.some(
              (itemChildren) =>
                standardString(itemChildren.title).includes(standardSeachText) ||
                itemChildren.path?.includes(standardSeachText)
            )
        )
      )
        prev = [
          ...prev,
          {
            ...current,
            items: current.items.reduce((list: NavListProps[], item) => {
              if (
                standardString(item.title).includes(standardSeachText) ||
                item.path?.includes(standardSeachText)
              )
                list = [...list, { ...item, children: [] }];

              if (item.children) {
                item.children.map((itemChildren) => {
                  if (
                    standardString(itemChildren.title).includes(standardSeachText) ||
                    itemChildren.path?.includes(standardSeachText)
                  ) {
                    list = [
                      ...list,
                      { ...itemChildren, title: `${item.title} - ${itemChildren.title}` },
                    ];
                  }
                });
              }
              return list;
            }, []),
          },
        ];
      return prev;
    }, []);
    return newConfigs;
  }, [configs, searchText]);

  const handleClick = (route: string) => {
    navigate(route);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <IconButton
            onClick={handleOpen}
            sx={{ backgroundColor: `${alpha(theme.palette.grey[300], 0.35)}` }}
          >
            <Icon icon={searchFill} width={20} height={20} />
          </IconButton>
        )}

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchbarStyle>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Tìm kiếm ..."
              startAdornment={
                <InputAdornment position="start">
                  <Box
                    component={Icon}
                    icon={searchFill}
                    sx={{ color: "text.disabled", width: 24, height: 24 }}
                  />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: "fontWeightBold" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Box
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "absolute",
                top: APPBAR_MOBILE + 10,
                left: 0,
                background: "transparent",
                [theme.breakpoints.up("md")]: {
                  top: APPBAR_DESKTOP + 10,
                },
                padding: 2,
              }}
            >
              <List
                sx={{
                  width: "100%",
                  overflow: "auto",
                  maxHeight: 380,
                  background: theme.palette.background.default,
                  boxShadow: theme.customShadows.z24,
                  borderRadius: 1,
                  "& ul": { padding: 1 },
                }}
                subheader={<li />}
              >
                {dataSearch.map((group) => group.items.length > 0 && (
                  <li key={`section-${group.subheader}`}>
                    <ul>
                      <ListSubheaderStyled>{group.subheader}</ListSubheaderStyled>
                      {group.items.map((item, itemIndex) => (
                        <React.Fragment key={`item-${itemIndex}`}>
                          <ListItemStyled onClick={() => handleClick(item?.path)}>
                            <ListItemTextStyled
                              primary={highlightedText(item?.title || "", searchText)}
                              secondary={highlightedText(item?.path || "", searchText)}
                            />
                          </ListItemStyled>
                          {item?.children?.map((itemChildren, itemChildrenIndex) => (
                            <ListItemStyled
                              key={`item-${itemChildrenIndex}`}
                              onClick={() => handleClick(itemChildren?.path)}
                            >
                              <ListItemTextStyled
                                primary={highlightedText(
                                  `${item.title} - ${itemChildren.title}`,
                                  searchText
                                )}
                                secondary={highlightedText(itemChildren.path, searchText)}
                              />
                            </ListItemStyled>
                          ))}
                        </React.Fragment>
                      ))}
                    </ul>
                  </li>
                ))}
              </List>
            </Box>
          </SearchbarStyle>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}

const ListSubheaderStyled = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.grey[700],
  textTransform: "uppercase",
  fontWeight: 700,
  fontSize: "12px",
  top: "8px",
  borderRadius: 8,
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  ".MuiListItemText-primary": {
    fontSize: "14px",
    fontWeight: 600,
  },
  ".MuiListItemText-secondary": {
    fontSize: "14px",
  },
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.background.default}`,
  borderRadius: 4,
  cursor: "pointer",
  transition: theme.transitions.create("all", { duration: 0.2 }),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderStyle: "dashed",
  },
}));

function highlightedText(text: string, highlight: string) {
  let parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, index) => {
    return (
      <React.Fragment key={index}>
        {standardString(part) === standardString(highlight) ? (
          <HightLightText>{part}</HightLightText>
        ) : (
          part
        )}
      </React.Fragment>
    );
  });
}

const HightLightText = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
}));
