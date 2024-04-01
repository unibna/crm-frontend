import map from "lodash/map";

import { AddRounded } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DensityLargeIcon from "@mui/icons-material/DensityLarge";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import DensitySmallIcon from "@mui/icons-material/DensitySmall";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FunctionsIcon from "@mui/icons-material/Functions";
import GroupIcon from "@mui/icons-material/Group";
import KeyIcon from "@mui/icons-material/Key";
import LinkIcon from "@mui/icons-material/Link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import NotesIcon from "@mui/icons-material/Notes";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";
import PinIcon from "@mui/icons-material/Pin";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { Checkbox, IconButton, Stack } from "@mui/material";

import ErrorImage from "assets/images/error-load-image.jpeg";
import { EditDateCell } from "./components/Cells/EditDateCell";
import { EditDateTimeCell } from "./components/Cells/EditDateTimeCell";
import { EditTextCell } from "./components/Cells/EditTextCell";
import ComplexSelect from "./components/ComplexSelect";
import { Conjunction, Mode, Operator } from "./components/Filter/AbstractFilterItem";
import Tag from "./components/Tag";
import TextLink from "./components/TextLink";
import GridView from "./components/views/Grid";
import { Image } from "./components/views/Grid/CommonComponents";
import KanbanView from "./components/views/Kanban";

import {
  AirTableColumnLabels,
  AirTableColumnTypes,
  AirTableOption,
  AirTableViewTypes,
  HISTORY_ACTION_TYPE,
  MATH_FUNCTIONS,
  ROW_HEIGHT_TYPES,
} from "_types_/SkyTableType";
import { dd_MM_yyyy_HH_mm } from "constants/time";
import { fDate, fDateTime } from "utils/dateUtil";
import { fValueVnd } from "utils/formatNumber";
import { dateIsValid, isValidImageURL, isValidPdfURL } from "utils/helpers";

export const AirtableViewLabels = {
  [AirTableViewTypes.GRID]: "Grid",
  [AirTableViewTypes.KANBAN]: "Kanban",
};

export const AirTableViewComponents = {
  [AirTableViewTypes.GRID]: GridView,
  [AirTableViewTypes.KANBAN]: KanbanView,
};

export const AirtableViewIcons = {
  [AirTableViewTypes.GRID]: <ViewListIcon />,
  [AirTableViewTypes.KANBAN]: <ViewKanbanIcon />,
};

export const AIRTABLE_VIEW_TYPE_CONFIG = map(AirTableViewTypes, (type) => ({
  label: AirtableViewLabels[type],
  value: type,
  icon: AirtableViewIcons[type],
}));

export const AIRTABLE_VIEW_TYPE_CONFIG_OBJECT = AIRTABLE_VIEW_TYPE_CONFIG.reduce(
  (prev, current) => ({
    ...prev,
    [current.value]: current,
  }),
  {}
);

// Những type có dạng select - option
export const OPTIONS_TYPES = [
  AirTableColumnTypes.MULTIPLE_SELECT,
  AirTableColumnTypes.SINGLE_SELECT,
  AirTableColumnTypes.SINGLE_USER,
  AirTableColumnTypes.MULTIPLE_USER,
];

// Map column type ở FE với column type ở BE
export const BEFieldType = {
  [AirTableColumnTypes.LINK_TO_RECORD]: "link_to_record",
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: "text",
  [AirTableColumnTypes.LONG_TEXT]: "text",
  [AirTableColumnTypes.ATTACHMENT]: "attachment",
  [AirTableColumnTypes.CHECKBOX]: "text",
  [AirTableColumnTypes.MULTIPLE_SELECT]: "multiple_select",
  [AirTableColumnTypes.SINGLE_SELECT]: "single_select",
  [AirTableColumnTypes.SINGLE_USER]: "single_user",
  [AirTableColumnTypes.MULTIPLE_USER]: "multiple_user",
  [AirTableColumnTypes.DATE]: "date",
  [AirTableColumnTypes.DATETIME]: "datetime",
  [AirTableColumnTypes.DURATION]: "duration",
  [AirTableColumnTypes.PHONE_NUMBER]: "text",
  [AirTableColumnTypes.EMAIL]: "text",
  [AirTableColumnTypes.URL]: "url",
  [AirTableColumnTypes.NUMBER]: "number",
  [AirTableColumnTypes.CURRENCY]: "currency",
  [AirTableColumnTypes.PERCENT]: "percent",
  [AirTableColumnTypes.AUTO_NUMBER]: "auto_number",
};

export const AirTableColumnIcons = {
  [AirTableColumnTypes.LINK_TO_RECORD]: <ReadMoreIcon />,
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: <TextFormatIcon />,
  [AirTableColumnTypes.LONG_TEXT]: <NotesIcon />,
  [AirTableColumnTypes.ATTACHMENT]: <AttachmentIcon />,
  [AirTableColumnTypes.CHECKBOX]: <CheckBoxIcon />,
  [AirTableColumnTypes.MULTIPLE_SELECT]: <RuleOutlinedIcon />,
  [AirTableColumnTypes.SINGLE_SELECT]: <ExpandCircleDownOutlinedIcon />,
  [AirTableColumnTypes.MULTIPLE_USER]: <GroupIcon />,
  [AirTableColumnTypes.SINGLE_USER]: <PersonIcon />,
  [AirTableColumnTypes.DATE]: <EventIcon />,
  [AirTableColumnTypes.DATETIME]: <WorkHistoryIcon />,
  [AirTableColumnTypes.DURATION]: <AccessTimeIcon />,
  [AirTableColumnTypes.PHONE_NUMBER]: <LocalPhoneIcon />,
  [AirTableColumnTypes.EMAIL]: <EmailIcon />,
  [AirTableColumnTypes.URL]: <LinkIcon />,
  [AirTableColumnTypes.NUMBER]: <PinIcon />,
  [AirTableColumnTypes.CURRENCY]: <AttachMoneyIcon />,
  [AirTableColumnTypes.PERCENT]: <PercentIcon />,
  [AirTableColumnTypes.AUTO_NUMBER]: <KeyIcon />,
};

/**
 * Object chứa hàm render cell component ở view mode theo mỗi column type
 * @param isOriginal biến boolean thường để điều chỉnh style trong form hoặc trong grid. Ví dụ trong grid các input thường ẩn các border đi, còn trong form thì cần hiện (isOrignal = true tức là trả component về nguyên bản là show border của input ra)
 * @param value tuỳ lại type column thì value có type khác nhau
 * @param values cũng tương tự như value nhưng dành cho các type multiple - hay một mảng giá trị tuỳ lại type column thì value có type khác nhau
 * @param options các options cho các cell thuộc các column có type dạng select
 * @param styles là 1 object CSS styles tuỳ biến cho các component render ở mỗi cell
 * @param onOpenLinkRecordFormPopup hàm với tham số đầu vào là 1 recordId của 1 bảng liên kết trong 1 cell LINK_TO_RECORD dùng để mở form chi tiết của record có id là recordId trong bảng liên kết khi nhấn vào 1 tag hay 1 giá trị trong cell Link_TO_RECORD
 * @param onChangeFileReviewConfig hàm với tham số đầu vào là 1 mảng file của 1 cell ATTACHMENT (files: any[]) và vị trí của 1 tệp trong mảng file (currentIndex: number) dùng để mở file đó trong popup review file
 * @returns JSX.Element
 * */

export const AirTableColumnRenderViewFuncs: any = {
  [AirTableColumnTypes.LINK_TO_RECORD]: (
    options: AirTableOption[],
    values: {
      record_id: string;
      record_display: string;
    }[],
    onOpenLinkRecordFormPopup: (recordId: string) => void,
    styles?: any
  ) => {
    if (!values || !Array.isArray(values)) return null;

    const tags = options.filter((item) =>
      values.some((itemValue) => itemValue.record_id === item.id)
    );

    return (
      <Stack direction="row" spacing={0.5} sx={styles?.stack} alignItems={"center"}>
        {tags.map((item) => (
          <Tag
            key={item.id}
            label={item.name}
            color={item.color}
            sx={styles?.tag}
            onClick={() => onOpenLinkRecordFormPopup(item.id)}
          />
        ))}
      </Stack>
    );
  },
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: (value: string, styles?: any) => (
    <TextLink content={value} sx={styles?.textlink} />
  ),
  [AirTableColumnTypes.LONG_TEXT]: (value: string, styles?: any) => (
    <TextLink content={value} sx={styles?.textlink} isFullContentPopup />
  ),
  [AirTableColumnTypes.ATTACHMENT]: (
    values: {
      url: string;
      id: string;
      file: string;
    }[],
    onChangeFileReviewConfig: React.Dispatch<
      React.SetStateAction<{
        files: any[];
        currentIndex?: number | undefined;
      }>
    >,
    isOriginal?: boolean,
    styles?: any
  ) => {
    return (
      <Stack direction="row" spacing={1} sx={styles?.stack}>
        {Array.isArray(values) &&
          values?.map((item, index) =>
            isValidImageURL(item.url) ? (
              <Image
                key={index}
                // alt={item.id}
                src={item.url}
                sx={{
                  width: "auto",
                  height: isOriginal ? 100 : 30,
                  objectFit: "contain",
                  "&:hover": {
                    border: "1px solid #fff",
                  },
                  ...styles?.image,
                }}
                onMouseDown={() => {
                  onChangeFileReviewConfig &&
                    onChangeFileReviewConfig({
                      currentIndex: index,
                      files: values,
                    });
                }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = ErrorImage;
                }}
              />
            ) : (
              <DescriptionIcon
                key={index}
                sx={{
                  width: "auto",
                  height: isOriginal ? 100 : 30,
                  color: "primary.main",
                  "&:hover": {
                    color: "primary.dark",
                  },
                  ...styles?.image,
                }}
                onMouseDown={() => {
                  isValidPdfURL(item.url)
                    ? onChangeFileReviewConfig({
                        currentIndex: index,
                        files: values,
                      })
                    : window.open(item.url, "_blank");
                }}
              />
            )
          )}
      </Stack>
    );
  },
  [AirTableColumnTypes.CHECKBOX]: (value: boolean | string, styles?: any) => {
    const defaultValue =
      typeof value === "boolean"
        ? value
        : typeof value === "string" && ["true", "True"].includes(value)
        ? true
        : false;

    return (
      (defaultValue && (
        <CheckRoundedIcon style={{ fontSize: 24, color: "green", ...styles?.icon }} />
      )) ||
      ""
    );
  },
  [AirTableColumnTypes.MULTIPLE_SELECT]: (
    options: AirTableOption[],
    values: AirTableOption["id"][],
    styles?: any
  ) => {
    if (!values || !Array.isArray(values)) return null;
    const tags = options.filter((item) => values.includes(item.id));
    return (
      <Stack direction="row" spacing={0.5} sx={styles?.stack}>
        {tags.map((item) => (
          <Tag key={item.id} label={item.name} color={item.color} sx={styles?.tag} />
        ))}
      </Stack>
    );
  },
  [AirTableColumnTypes.SINGLE_SELECT]: (
    options: AirTableOption[],
    value: AirTableOption["id"],
    styles?: any
  ) => {
    if (!value) return null;
    const tag = options.find((item) => item.id === value);
    return (tag && <Tag label={tag?.name} color={tag?.color} sx={styles?.tag} />) || <></>;
  },
  [AirTableColumnTypes.MULTIPLE_USER]: (
    options: AirTableOption[],
    values: AirTableOption["id"][],
    styles?: any
  ) => {
    if (!values || !Array.isArray(values)) return null;
    const users = options.filter((item) => values.includes(item.id));
    return (
      <Stack direction="row" spacing={0.5} sx={styles?.stack}>
        {users.map((item: any) => (
          <Tag
            key={item.id}
            label={item.name}
            color={"#eee"}
            image={item?.image || item?.image?.url}
            isShowImage
            sx={styles?.tag}
          />
        ))}
      </Stack>
    );
  },
  [AirTableColumnTypes.SINGLE_USER]: (options: AirTableOption[], value: any, styles?: any) => {
    if (!value) return null;
    const user: any = options.find((item) => item.id === value);
    if (!user) return null;
    return (
      <Tag
        key={user.id}
        label={user.name}
        color={"#eee"}
        image={user?.image || user?.image?.url}
        isShowImage
        sx={styles?.tag}
      />
    );
  },
  [AirTableColumnTypes.DATE]: (value: string, styles?: any) => {
    return (dateIsValid(value) && <TextLink content={fDate(value)} sx={styles?.textlink} />) || "";
  },
  [AirTableColumnTypes.DATETIME]: (value: string, styles?: any) => {
    return (
      (dateIsValid(value) && (
        <TextLink content={fDateTime(value, dd_MM_yyyy_HH_mm)} sx={styles?.textlink} />
      )) ||
      ""
    );
  },
  [AirTableColumnTypes.DURATION]: (value: string, styles?: any) => {
    return (value && <TextLink content={value} sx={styles?.textlink} />) || "";
  },
  [AirTableColumnTypes.PHONE_NUMBER]: (value: string, styles?: any) => {
    return (
      <TextLink
        content={value}
        component="a"
        href={`tel:${value}`}
        onMouseDown={() => {
          value && window.open(`tel:${value}`);
        }}
        sx={styles?.textlink}
      />
    );
  },
  [AirTableColumnTypes.EMAIL]: (value: string, styles?: any) => {
    return (
      <TextLink
        content={value}
        component="a"
        href={`mailto:${value}`}
        onMouseDown={() => {
          value && window.open(`mailto:${value}`);
        }}
        sx={styles?.textlink}
      />
    );
  },
  [AirTableColumnTypes.URL]: (value: string, styles?: any) => {
    return (
      <TextLink
        content={value}
        component="a"
        target={"_blank"}
        href={value}
        onMouseDown={() => {
          const url = value.match(/^https?:/) ? value : "//" + value;
          value && window.open(url, "_blank");
        }}
        sx={styles?.textlink}
      />
    );
  },
  [AirTableColumnTypes.NUMBER]: (value: number, styles?: any) => {
    return value ? <TextLink content={value.toLocaleString("en-US")} sx={styles?.textlink} /> : "";
  },
  [AirTableColumnTypes.CURRENCY]: (value: number, styles?: any) => {
    return value ? <TextLink content={fValueVnd(value)} sx={styles?.textlink} /> : "";
  },
  [AirTableColumnTypes.PERCENT]: (value: number, styles?: any) => {
    return value ? <TextLink content={`${value}%`} sx={styles?.textlink} /> : "";
  },
  [AirTableColumnTypes.AUTO_NUMBER]: (value: number, styles?: any) => {
    return <TextLink content={value} sx={styles?.textlink} />;
  },
};

/**
 * Object chứa hàm render cell ở edit mode theo mỗi column type
 * @param isOriginal biến boolean thường để điều chỉnh style trong form hoặc trong grid. Ví dụ trong grid các input thường ẩn các border đi, còn trong form thì cần hiện (isOrignal = true tức là trả component về nguyên bản là show border của input ra)
 * @param value tuỳ lại type column thì value có type khác nhau
 * @param values cũng tương tự như value nhưng dành cho các type multiple - hay một mảng giá trị tuỳ lại type column thì value có type khác nhau
 * @param options các options cho các cell thuộc các column có type dạng select
 * @param styles là 1 object CSS styles tuỳ biến cho các component render ở mỗi cell
 * @param onOpenLinkRecordPopup hàm dùng để mở form menu record của bảng liên kết khi nhấn vào 1 tag hay 1 giá trị trong cell Link_TO_RECORD
 * @param onOpenLinkRecordFormPopup hàm với tham số đầu vào là 1 recordId của 1 bảng liên kết trong 1 cell LINK_TO_RECORD dùng để mở form chi tiết của record có id là recordId trong bảng liên kết khi nhấn vào 1 tag hay 1 giá trị trong cell Link_TO_RECORD
 * @param onChangeFileReviewConfig hàm với tham số đầu vào là 1 mảng file của 1 cell ATTACHMENT (files: any[]) và vị trí của 1 tệp trong mảng file (currentIndex: number) dùng để mở file đó trong popup review file
 * @param onChange hàm submit sự thay đổi value của cell, khi gọi hàm sẽ gọi api để submit data trong cell
 * @param onChangeOptions hàm submit sự thay đổi options của column mà cell thuộc column đó
 * */

export const AirTableColumnRenderEditFuncs: any = {
  [AirTableColumnTypes.LINK_TO_RECORD]: (
    options: AirTableOption[],
    values: {
      record_id: string;
      record_display: string;
    }[],
    onChange: (
      newValue: {
        record_id: string;
        record_display: string;
      }[]
    ) => void,
    onOpenLinkRecordPopup: () => void,
    onOpenLinkRecordFormPopup: (recordId: string) => void,
    isOriginal?: boolean,
    styles?: any
  ) => {
    if (!values || !Array.isArray(values)) return null;
    const tags = options.filter((item) =>
      values.some((itemValue) => itemValue.record_id === item.id)
    );

    const handleDelete = (id: string) => {
      const newValues = values.filter((item) => item.record_id !== id);
      onChange(newValues);
    };
    return (
      <Stack direction="row" spacing={0.5} sx={styles?.stack}>
        {tags.map((item) => (
          <Tag
            key={item.id}
            label={item.name}
            color={item.color}
            isShowEdit
            onDelete={() => handleDelete(item.id)}
            onClick={() => onOpenLinkRecordFormPopup(item.id)}
          />
        ))}
        <IconButton
          sx={{
            width: isOriginal ? 50 : 30,
            height: isOriginal ? 50 : 30,
            borderRadius: "50%",
            backgroundColor: "#eee",
          }}
          onClick={() => onOpenLinkRecordPopup()}
        >
          <AddRounded style={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    );
  },
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.SINGLE_LINE_TEXT}
      />
    );
  },
  [AirTableColumnTypes.LONG_TEXT]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.LONG_TEXT}
      />
    );
  },
  [AirTableColumnTypes.ATTACHMENT]: (
    values: any[] = [],
    onChange: (newValue: any[]) => void,
    onToggleUpload: (open?: boolean) => void,
    onChangeFileReviewConfig: React.Dispatch<
      React.SetStateAction<{
        files: any[];
        currentIndex?: number | undefined;
      }>
    >,
    isOriginal?: boolean,
    styles?: any
  ) => {
    return (
      <Stack direction="row" spacing={1} sx={styles?.stack}>
        {Array.isArray(values) &&
          values?.map((item, index) =>
            isValidImageURL(item.url) ? (
              <Image
                key={index}
                // alt={item.id}
                src={item.url}
                sx={{
                  width: "auto",
                  height: isOriginal ? 100 : 30,
                  objectFit: "contain",
                  "&:hover": {
                    border: "1px solid #fff",
                  },
                  ...styles?.image,
                }}
                onMouseDown={() => {
                  onChangeFileReviewConfig &&
                    onChangeFileReviewConfig({
                      currentIndex: index,
                      files: values,
                    });
                }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = ErrorImage;
                }}
              />
            ) : (
              <DescriptionIcon
                key={index}
                sx={{
                  width: "auto",
                  height: isOriginal ? 100 : 30,
                  objectFit: "contain",
                  color: "primary.main",
                  "&:hover": {
                    color: "primary.dark",
                  },
                  ...styles?.image,
                }}
                onMouseDown={() => {
                  isValidPdfURL(item.url)
                    ? onChangeFileReviewConfig({
                        currentIndex: index,
                        files: values,
                      })
                    : window.open(item.url, "_blank");
                }}
              />
            )
          )}
        <IconButton
          sx={{
            width: isOriginal ? 50 : 30,
            height: isOriginal ? 50 : 30,
            borderRadius: "50%",
            backgroundColor: "#eee",
          }}
          onClick={() => onToggleUpload()}
        >
          <AddRounded style={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    );
  },
  [AirTableColumnTypes.CHECKBOX]: (
    value: boolean | string,
    onChange: (newValue: boolean | string) => void,
    isOriginal?: boolean
  ) => {
    const defaultValue =
      typeof value === "boolean"
        ? value
        : typeof value === "string" && ["true", "True"].includes(value)
        ? true
        : false;
    return (
      <Checkbox
        defaultValue={`${defaultValue}`}
        checked={defaultValue}
        style={{ padding: 0, marginLeft: !isOriginal ? "calc(50% - 6px)" : 0 }}
        onMouseDown={() => {
          onChange(!defaultValue);
        }}
      />
    );
  },
  [AirTableColumnTypes.MULTIPLE_SELECT]: (
    options: AirTableOption[],
    values: AirTableOption["id"][],
    onChange: (newValue: AirTableOption["id"][]) => void,
    onChangeOptions: (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => void,
    id: string,
    isOriginal?: boolean
  ) => {
    return (
      <ComplexSelect
        multiple
        isOriginal={isOriginal}
        id={id}
        options={options}
        defaultValue={values || []}
        onChange={onChange}
        onChangeOptions={onChangeOptions}
      />
    );
  },
  [AirTableColumnTypes.SINGLE_SELECT]: (
    options: AirTableOption[],
    value: AirTableOption["id"],
    onChange: (newValue: string) => void,
    onChangeOptions: (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => void,
    id: string,
    isOriginal?: boolean
  ) => {
    return (
      <ComplexSelect
        isOriginal={isOriginal}
        id={id}
        options={options}
        defaultValue={value}
        onChange={onChange}
        onChangeOptions={onChangeOptions}
      />
    );
  },
  [AirTableColumnTypes.MULTIPLE_USER]: (
    options: AirTableOption[],
    values: AirTableOption["id"][],
    onChange: (newValue: AirTableOption["id"][]) => void,
    onChangeOptions: (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => void,
    id: string,
    isOriginal?: boolean
  ) => {
    return (
      <ComplexSelect
        multiple
        isShowImage
        id={id}
        options={options}
        isOriginal={isOriginal}
        defaultValue={values || []}
        onChange={onChange}
      />
    );
  },
  [AirTableColumnTypes.SINGLE_USER]: (
    options: { id: string; name: string; image?: any }[],
    value: any,
    onChange: (newValue: string) => void,
    onChangeOptions: (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => void,
    id: string,
    isOriginal?: boolean
  ) => {
    return (
      <ComplexSelect
        isShowImage
        id={id}
        options={options}
        isOriginal={isOriginal}
        defaultValue={value || []}
        onChange={onChange}
      />
    );
  },
  [AirTableColumnTypes.DATE]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return <EditDateCell value={value} onChange={onChange} isOriginal={isOriginal} />;
  },
  [AirTableColumnTypes.DATETIME]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return <EditDateTimeCell value={value} onChange={onChange} isOriginal={isOriginal} />;
  },
  [AirTableColumnTypes.DURATION]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.DURATION}
      />
    );
  },
  [AirTableColumnTypes.PHONE_NUMBER]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.PHONE_NUMBER}
      />
    );
  },
  [AirTableColumnTypes.EMAIL]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.EMAIL}
      />
    );
  },
  [AirTableColumnTypes.URL]: (
    value: string,
    onChange: (newValue: string) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.URL}
      />
    );
  },
  [AirTableColumnTypes.NUMBER]: (
    value: number,
    onChange: (newValue: number) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.NUMBER}
      />
    );
  },
  [AirTableColumnTypes.CURRENCY]: (
    value: number,
    onChange: (newValue: number) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.CURRENCY}
      />
    );
  },
  [AirTableColumnTypes.PERCENT]: (
    value: number,
    onChange: (newValue: number) => void,
    isOriginal?: boolean
  ) => {
    return (
      <EditTextCell
        value={value}
        onChange={onChange}
        isOriginal={isOriginal}
        type={AirTableColumnTypes.PERCENT}
      />
    );
  },
  [AirTableColumnTypes.AUTO_NUMBER]: (value: any, isOriginal?: boolean) => {
    return (
      <TextLink content={value} sx={{ ...(isOriginal && { fontSize: "20px", fontWeight: 600 }) }} />
    );
  },
};

export const DefaultData = {
  [AirTableColumnTypes.LINK_TO_RECORD]: [],
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: "",
  [AirTableColumnTypes.LONG_TEXT]: "",
  [AirTableColumnTypes.ATTACHMENT]: [],
  [AirTableColumnTypes.CHECKBOX]: false,
  [AirTableColumnTypes.MULTIPLE_SELECT]: [],
  [AirTableColumnTypes.SINGLE_SELECT]: "",
  [AirTableColumnTypes.SINGLE_USER]: "",
  [AirTableColumnTypes.MULTIPLE_USER]: [],
  [AirTableColumnTypes.DATE]: null,
  [AirTableColumnTypes.DATETIME]: null,
  [AirTableColumnTypes.DURATION]: "",
  [AirTableColumnTypes.PHONE_NUMBER]: "",
  [AirTableColumnTypes.EMAIL]: "",
  [AirTableColumnTypes.URL]: "",
  [AirTableColumnTypes.NUMBER]: "",
  [AirTableColumnTypes.CURRENCY]: "",
  [AirTableColumnTypes.PERCENT]: 0,
  [AirTableColumnTypes.AUTO_NUMBER]: 0,
};

export const AIRTABLE_COLUMN_TYPE_CONFIG = map(AirTableColumnTypes, (type) => ({
  label: AirTableColumnLabels[type],
  value: type,
  icon: AirTableColumnIcons[type],
  renderFunc: AirTableColumnRenderViewFuncs[type],
  editFunc: AirTableColumnRenderEditFuncs[type],
}));

export const AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT: {
  [key: string]: {
    label: AirTableColumnLabels;
    value: AirTableColumnTypes;
    icon: JSX.Element;
    renderFunc: any;
    editFunc: any;
  };
} = AIRTABLE_COLUMN_TYPE_CONFIG.reduce(
  (prev, current) => ({
    ...prev,
    [current.value]: current,
  }),
  {}
);

// Các loại cập nhật trong lịch sử
export const HISTORY_ACTION_TYPE_CONFIGS = {
  [HISTORY_ACTION_TYPE.PUT_TABLE]: {
    name: "Cập nhật Table",
  },
  [HISTORY_ACTION_TYPE.PUT_VIEW]: { name: "Cập nhật View" },
  [HISTORY_ACTION_TYPE.PUT_FIELD]: { name: "Cập nhật Field" },
  [HISTORY_ACTION_TYPE.PUT_RECORD]: { name: "Cập nhật Record" },
  [HISTORY_ACTION_TYPE.PUT_CELL]: { name: "Cập nhật Cell" },
};

export const MATH_FUNCTIONS_LABELS = {
  [MATH_FUNCTIONS.SUM]: "Sum",
  [MATH_FUNCTIONS.AVERAGE]: "Avg",
  [MATH_FUNCTIONS.MIN]: "Min",
  [MATH_FUNCTIONS.MAX]: "Max",
  [MATH_FUNCTIONS.EMPTY]: "Empty",
  [MATH_FUNCTIONS.FILLED]: "Filled",
};

// Config của các hàm là option của select trong 1 cell footer của 1 column
export const MathFunctions = [
  {
    type: MATH_FUNCTIONS.SUM,
    icon: <FunctionsIcon />,
    label: MATH_FUNCTIONS_LABELS[MATH_FUNCTIONS.SUM],
    calc: (data: any[]) => data.reduce((sum, row) => sum + +row?.value, 0),
  },
  {
    type: MATH_FUNCTIONS.AVERAGE,
    icon: <FunctionsIcon />,
    label: MATH_FUNCTIONS_LABELS[MATH_FUNCTIONS.AVERAGE],
    calc: (data: any[]) => {
      const sum = data.reduce((sum, row) => sum + +row?.value, 0);
      const length = data.length;
      return (length && sum / length) || 0;
    },
  },
  {
    type: MATH_FUNCTIONS.MIN,
    icon: <FunctionsIcon />,
    label: MATH_FUNCTIONS_LABELS[MATH_FUNCTIONS.MIN],
    calc: (data: any[]) =>
      Math.min(...data.filter((item) => !!item.value).map((item) => item.value)),
  },
  {
    type: MATH_FUNCTIONS.MAX,
    icon: <FunctionsIcon />,
    label: MATH_FUNCTIONS_LABELS[MATH_FUNCTIONS.MAX],
    calc: (data: any[]) =>
      Math.max(...data.filter((item) => !!item.value).map((item) => item.value)),
  },
  {
    type: MATH_FUNCTIONS.EMPTY,
    icon: <FunctionsIcon />,
    label: MATH_FUNCTIONS_LABELS[MATH_FUNCTIONS.EMPTY],
    calc: (data: any[]) => data.reduce((sum, row) => (!row?.value ? (sum += 1) : sum), 0),
  },
  {
    type: MATH_FUNCTIONS.FILLED,
    icon: <FunctionsIcon />,
    label: MATH_FUNCTIONS_LABELS[MATH_FUNCTIONS.FILLED],
    calc: (data: any[]) => data.reduce((sum, row) => (row?.value ? (sum += 1) : sum), 0),
  },
];

export const MathFunctionsObject: {
  [key: string]: {
    type: MATH_FUNCTIONS;
    icon: JSX.Element;
    label: string;
    calc: (data: any[]) => any;
  };
} = MathFunctions.reduce(
  (prev, current) => ({
    ...prev,
    [current.type]: current,
  }),
  {}
);

export const AirTableConjunctionLabel = {
  [Conjunction.AND]: "And",
  [Conjunction.OR]: "Or",
};

export const AirTableOperatorLabels = {
  [Operator.EQUAL]: "=",
  [Operator.NOT_EQUAL]: "!=",
  [Operator.GREATER]: ">",
  [Operator.SMALLER]: "<",
  [Operator.GREATER_OR_EQUAL]: ">=",
  [Operator.SMALLER_OR_EQUAL]: "<=",
  [Operator.IS_EMPTY]: "is empty",
  [Operator.IS_NOT_EMPTY]: "is not empty",
  [Operator.CONTAINS]: "contains",
  [Operator.DOES_NOT_CONSTAINS]: "does not contains",
  [Operator.IS]: "is",
  [Operator.IS_NOT]: "is not",
  [Operator.IS_ANY_OF]: "is any of",
  [Operator.IS_NONE_OF]: "is none of",
  [Operator.IS_EXACTLY]: "is exactly",
  [Operator.HAS_ANY_OF]: "has any of",
  [Operator.HAS_ALL_OF]: "has all of",
  [Operator.HAS_NONE_OF]: "has none of",
  [Operator.IS_BEFORE]: "is before",
  [Operator.IS_AFTER]: "is after",
  [Operator.IS_ON_OR_BEFORE]: "is on or before",
  [Operator.IS_ON_OR_AFTER]: "is on or after",
  [Operator.IS_WITHIN]: "is within",
};

export const AirTableModeLabels = {
  [Mode.TODAY]: "Today",
  [Mode.TOMORROW]: "Tomorrow",
  [Mode.YESTERDAY]: "Yesterday",
  [Mode.ONE_WEEK_AGO]: "One week ago",
  [Mode.ONE_WEEK_FROM_NOW]: "One week from now",
  [Mode.ONE_MONTH_AGO]: "One month ago",
  [Mode.ONE_MONTH_FROM_NOW]: "One month from now",
  [Mode.NUMBER_OF_DAYS_AGO]: "Number of days ago",
  [Mode.NUMBER_OF_DAYS_FROM_NOW]: "Number of days from now",
  [Mode.EXACT_DATE]: "Exact date",
  [Mode.THE_PAST_WEEK]: "The Past Week",
  [Mode.THE_PAST_MONTH]: "The Past Month",
  [Mode.THE_PAST_YEAR]: "The Past Year",
  [Mode.THE_NEXT_WEEK]: "The Next Week",
  [Mode.THE_NEXT_MONTH]: "The Next Month",
  [Mode.THE_NEXT_YEAR]: "The Next Year",
  [Mode.THE_NEXT_NUMBER_OF_DAYS]: "The Next Number Of Days",
  [Mode.THE_PAST_NUMBER_OF_DAYS]: "The Past Number Of Days",
};

export const MAP_OPERATOR_WITH_COLUMN_TYPE = {
  [Operator.EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.NOT_EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.GREATER]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.SMALLER]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.GREATER_OR_EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.SMALLER_OR_EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],

  [Operator.CONTAINS]: [
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.ATTACHMENT,
  ],
  [Operator.DOES_NOT_CONSTAINS]: [
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.PHONE_NUMBER,
  ],
  [Operator.IS]: [
    AirTableColumnTypes.CHECKBOX,
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.DATE,
    AirTableColumnTypes.DATETIME,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
  ],
  [Operator.IS_NOT]: [
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
  ],
  [Operator.IS_ANY_OF]: [AirTableColumnTypes.SINGLE_SELECT, AirTableColumnTypes.SINGLE_USER],
  [Operator.IS_NONE_OF]: [AirTableColumnTypes.SINGLE_SELECT, AirTableColumnTypes.SINGLE_USER],
  [Operator.IS_EXACTLY]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.HAS_ANY_OF]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.HAS_ALL_OF]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.HAS_NONE_OF]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.IS_WITHIN]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_BEFORE]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_AFTER]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_ON_OR_BEFORE]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_ON_OR_AFTER]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_EMPTY]: [
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.ATTACHMENT,
    AirTableColumnTypes.CHECKBOX,
    AirTableColumnTypes.MULTIPLE_SELECT,
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.MULTIPLE_USER,
    AirTableColumnTypes.DATE,
    AirTableColumnTypes.DATETIME,
    AirTableColumnTypes.DURATION,
    AirTableColumnTypes.PHONE_NUMBER,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.AUTO_NUMBER,
  ],
  [Operator.IS_NOT_EMPTY]: [
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.ATTACHMENT,
    AirTableColumnTypes.CHECKBOX,
    AirTableColumnTypes.MULTIPLE_SELECT,
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.MULTIPLE_USER,
    AirTableColumnTypes.DATE,
    AirTableColumnTypes.DATETIME,
    AirTableColumnTypes.DURATION,
    AirTableColumnTypes.PHONE_NUMBER,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.AUTO_NUMBER,
  ],
};

export const AirTableRowHeightLabels = {
  [ROW_HEIGHT_TYPES.SHORT]: "Short",
  [ROW_HEIGHT_TYPES.MEDIUM]: "Medium",
  [ROW_HEIGHT_TYPES.TALL]: "Tall",
  [ROW_HEIGHT_TYPES.EXTRA_TALL]: "Extra Tall",
};

export const AirTableRowHeightSizes = {
  [ROW_HEIGHT_TYPES.SHORT]: 50,
  [ROW_HEIGHT_TYPES.MEDIUM]: 100,
  [ROW_HEIGHT_TYPES.TALL]: 150,
  [ROW_HEIGHT_TYPES.EXTRA_TALL]: 300,
};

export const AirTableRowHeightIcons = {
  [ROW_HEIGHT_TYPES.SHORT]: <FormatAlignJustifyIcon />,
  [ROW_HEIGHT_TYPES.MEDIUM]: <DensitySmallIcon />,
  [ROW_HEIGHT_TYPES.TALL]: <DensityMediumIcon />,
  [ROW_HEIGHT_TYPES.EXTRA_TALL]: <DensityLargeIcon />,
};
