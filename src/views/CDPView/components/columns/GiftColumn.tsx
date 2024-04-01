import { ChangeSet, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import MenuPopover from "components/Popovers/MenuPopover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import isEqual from "lodash/isEqual";
import map from "lodash/map";
import { Tooltip } from "@mui/material";
import vi from "locales/vi.json";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onCommitChange?: (changes: ChangeSet) => void;
  giftOptions?: { id: number; name: string }[];
}

const GiftColumn = ({ giftOptions = [], ...props }: Props) => {
  const Formatter = ({ value, row }: { value?: (string | number)[]; row?: any }) => {
    const anchorRef = useRef<HTMLButtonElement>(null);

    const values = useMemo(() => {
      return giftOptions.filter((item) => value?.includes(item.id));
    }, [value]);

    const [gifts, setGifts] = useState(values);
    const [open, setOpen] = useState(false);

    const handleClose = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }

      // khi đóng modal thì check new value
      !isEqual(values, gifts) &&
        props.onCommitChange &&
        props.onCommitChange({
          changed: { order_id: row.order_id, gifts: map(gifts, (item) => item.id) },
        });
      setOpen(false);
    };

    const handleToggle = (value: { id: number; name: string }) => () => {
      const currentIndex = gifts.indexOf(value);
      const newChecked = [...gifts];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setGifts(newChecked);
    };

    const handleDeleteGift = (e: any, gift: { id: number; name: string }) => {
      props.onCommitChange &&
        props.onCommitChange({
          changed: {
            order_id: row.order_id,
            gifts: value?.filter((id) => id !== gift.id),
          },
        });
    };

    useEffect(() => {
      setGifts(giftOptions.filter((item) => value?.includes(item.id)));
    }, [value]);

    const prevOpen = useRef(open);
    useEffect(() => {
      prevOpen.current = open;
    }, [open]);

    return (
      <Stack direction="row" spacing={1} style={{ flexWrap: "wrap" }}>
        {props.onCommitChange && (
          <Tooltip title={vi.update_gift}>
            <IconButton
              style={{ padding: 4 }}
              color="primary"
              onClick={() => setOpen((prev) => !prev)}
              ref={anchorRef}
            >
              <RssFeedIcon style={{ fontSize: 16, transform: "rotate(90deg)" }} />
            </IconButton>
          </Tooltip>
        )}
        <MenuPopover anchorEl={anchorRef.current} open={open} onClose={handleClose}>
          <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            {map(giftOptions, (value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value.id} disablePadding>
                  <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={gifts.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </MenuPopover>
        {map(values, (tag, index: number) => (
          <Chip
            key={index}
            label={tag.name}
            onDelete={props.onCommitChange ? (e) => handleDeleteGift(e, tag) : undefined}
            size="small"
            style={{ marginTop: 8, marginRight: 8, marginLeft: 0 }}
          />
        ))}
      </Stack>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default GiftColumn;
