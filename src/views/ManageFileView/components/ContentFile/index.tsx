// Libraries
import { useMemo, useState } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import findIndex from "lodash/findIndex";
import unionBy from "lodash/unionBy";
import intersectionBy from "lodash/intersectionBy";
import differenceBy from "lodash/differenceBy";
import { useTheme } from "@mui/material/styles";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemIcon from "@mui/material/ListItemIcon";
import MImage from "components/Images/MImage";
import { MultiSelect } from "components/Selectors";
import { MButton } from "components/Buttons";
import { Span } from "components/Labels";
import arrowIosBackFill from "@iconify/icons-eva/arrow-ios-back-fill";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { UserType } from "_types_/UserType";
import { Icon } from "@iconify/react";

// -------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  optionManager: {
    value: string;
    label: string;
  }[];
  optionType: {
    value: string;
    label: string;
  }[];
  optionViewer: UserType[];
  optionGroup: {
    value: string;
    label: string;
  }[];
}

const TransferList = (props: {
  data: UserType[];
  dataSelected: UserType[];
  search: string;
  handleChangeData: (data: UserType[]) => void;
  handleChangeDataSelected: (dataSelected: UserType[]) => void;
}) => {
  const { data, dataSelected, search, handleChangeData, handleChangeDataSelected } = props;
  const theme = useTheme();
  const [checked, setChecked] = useState<UserType[]>([]);
  const leftChecked = intersectionBy(checked, data, "id");
  const rightChecked = intersectionBy(checked, dataSelected, "id");

  const handleToggle = (value: UserType) => () => {
    const currentIndex = checked.findIndex((item) => item.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: UserType[]) => intersectionBy(checked, items, "id").length;

  const handleToggleAll = (items: UserType[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(differenceBy(checked, items, "id"));
    } else {
      setChecked(unionBy(checked, items, "id"));
    }
  };

  const handleCheckedRight = () => {
    handleChangeDataSelected(dataSelected.concat(leftChecked));
    handleChangeData(differenceBy(data, leftChecked, "id"));
    setChecked(differenceBy(checked, leftChecked, "id"));
  };

  const handleCheckedLeft = () => {
    handleChangeData(data.concat(rightChecked));
    handleChangeDataSelected(differenceBy(dataSelected, rightChecked, "id"));
    setChecked(differenceBy(checked, rightChecked, "id"));
  };

  const customList = (title: React.ReactNode, items: UserType[]) => (
    <Card sx={{ borderRadius: 1.5 }}>
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
        sx={{ p: 2 }}
      />

      <Divider />

      <List
        dense
        component="div"
        role="list"
        sx={{
          height: 350,
          overflow: "auto",
        }}
      >
        {items.map((item: UserType | any) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;
          const isChecked = findIndex(checked, (option) => option.id === item.id) !== -1;

          return (
            <ListItemButton key={item.id} role="listitem" onClick={handleToggle(item)}>
              <ListItemIcon>
                <Checkbox
                  checked={isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <MImage
                  src={getObjectPropSafely(() => item.image.url)}
                  preview
                  style={{ borderRadius: "50%" }}
                  contentImage={<Avatar alt={""} src={getObjectPropSafely(() => item.image.url)} />}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    {getObjectPropSafely(() => item?.group_permission?.name) ? (
                      <Span
                        variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                        color="primary"
                      >
                        {getObjectPropSafely(() => item?.group_permission?.name)}
                      </Span>
                    ) : null}
                  </>
                }
                sx={{ ml: 3 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  const newData = useMemo(() => {
    return search
      ? data.filter((item: any) => {
          const isCheckRole =
            getObjectPropSafely(() =>
              (item.group_permission.name || "").toLowerCase().indexOf(search.toLowerCase())
            ) !== -1;

          const isCheckName =
            getObjectPropSafely(() =>
              (item.name || "").toLowerCase().indexOf(search.toLowerCase())
            ) !== -1;

          return isCheckRole || isCheckName;
        })
      : data;
  }, [data, search]);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={5.3}>
        {customList("Chọn", newData)}
      </Grid>
      <Grid item xs={1.4}>
        <Grid container direction="column" alignItems="center" sx={{ p: 3 }}>
          <MButton
            color="inherit"
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
            sx={{ my: 1 }}
          >
            <Icon icon={arrowIosForwardFill} width={18} height={18} />
          </MButton>
          <MButton
            color="inherit"
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
            sx={{ my: 1 }}
          >
            <Icon icon={arrowIosBackFill} width={18} height={18} />
          </MButton>
        </Grid>
      </Grid>
      <Grid item xs={5.3}>
        {customList("Đã chọn", dataSelected)}
      </Grid>
    </Grid>
  );
};

const ContentFile = (props: Props) => {
  const {
    control,
    optionManager = [],
    optionType = [],
    optionViewer = [],
    optionGroup = [],
    watch,
  } = props;
  const { viewer = [] }: any = watch();
  const [dataSelected, setDataSelected] = useState<UserType[]>(viewer);
  const [data, setData] = useState<UserType[]>(differenceBy(optionViewer, viewer, "id"));
  const [searchRole, setSearchRole] = useState("");

  const renderOptionTitleFunc = ({ option }: any) => {
    return (
      <Chip
        label={option.label}
        sx={{
          color: "#fff",
          backgroundColor: option.color || "#384550",
        }}
        className="ellipsis-label"
        size="small"
      />
    );
  };

  const handleDataSelected = (
    values: UserType[],
    field: ControllerRenderProps<FormValuesProps, "viewer">
  ) => {
    setDataSelected(values);
    field.onChange(values);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Tên file"
              required
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="link"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Link"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Ghi chú"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="manager"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              title="Chọn người quản lý"
              size="medium"
              error={!!error}
              outlined
              fullWidth
              selectorId="manager"
              helperText={error?.message}
              options={optionManager}
              onChange={field.onChange}
              defaultValue={field.value || ""}
              placeholder="Nhập để tìm kiếm"
              simpleSelect
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              title="Phân loại"
              size="medium"
              outlined
              fullWidth
              selectorId="type"
              error={!!error}
              helperText={error?.message}
              options={optionType}
              onChange={field.onChange}
              defaultValue={field.value || ""}
              placeholder="Nhập để tìm kiếm"
              simpleSelect
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="group"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              title="Chọn nhóm"
              size="medium"
              error={!!error}
              outlined
              fullWidth
              helperText={error?.message}
              selectorId="group"
              options={[
                {
                  label: "Tất cả",
                  value: "all",
                },
                ...optionGroup,
              ]}
              onChange={field.onChange}
              renderOptionTitleFunc={renderOptionTitleFunc}
              defaultValue={field.value || ""}
              placeholder="Nhập để tìm kiếm"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Tìm kiếm tài khoản"
          variant="standard"
          onChange={(event) => setSearchRole(event.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="viewer"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TransferList
              data={data}
              search={searchRole}
              dataSelected={dataSelected}
              handleChangeData={setData}
              handleChangeDataSelected={(values) => handleDataSelected(values, field)}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default ContentFile;
