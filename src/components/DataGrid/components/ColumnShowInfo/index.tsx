// Libraries
import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";
import tail from "lodash/tail";
import { useMemo, useState } from "react";

// Components
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ColumnHandleLink from "components/DataGrid/components/ColumnHandleLink";
import ColumnHandlePhone from "components/DataGrid/components/ColumnHandlePhone";
import Iconify from "components/Icons/Iconify";
import MImage from "components/Images/MImage";
import { Span } from "components/Labels";

// Utils
import imageSkylink from "assets/images/icon-logo.png";
import { fDate, fDateTime } from "utils/dateUtil";
import { fPercentOmitDecimal, fValueVnd } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
interface Props {
  for: Array<string>;
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  availableFilterOperations?: Array<FilterOperation>;
  infoCell: Partial<any>;
  arrAttachUnitVnd?: string[];
  arrAttachUnitPercent?: string[];
  arrDate?: string[];
  arrDateTime?: string[];
  arrColumnHandleLink?: string[];
  arrColumnPhone?: string[];
  arrColumnEditLabel?: string[];
  arrValueTitle?: string[];
  arrColumnThumbImg?: string[];
  arrColumnAvatar?: string[];
  arrColumnOptional?: string[];
  arrHandleList?: string[];
  arrColumnBool?: string[];
  isShowCalltime?: boolean;
}

const ColumnShowInfo = (props: Props) => {
  const {
    infoCell,
    arrAttachUnitVnd = [],
    arrAttachUnitPercent = [],
    arrDate = [],
    arrDateTime = [],
    arrColumnHandleLink = [],
    arrColumnPhone = [],
    arrColumnEditLabel = [],
    arrValueTitle = [],
    arrColumnThumbImg = [],
    arrColumnAvatar = [],
    arrColumnOptional = [],
    arrHandleList = [],
    arrColumnBool = [],
    isShowCalltime,
  } = props;
  const Formatter = ({
    value: valueRow,
    row,
    column,
  }: {
    value: any;
    column: Column;
    row: any;
  }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    const convertRenderValue = ({
      name,
      title,
      valueCell,
      row,
    }: {
      name: string;
      title: string;
      valueCell: any;
      row: any;
    }) => {
      switch (true) {
        case arrColumnOptional.includes(name): {
          return <>{getObjectPropSafely(() => valueCell.content)}</>;
        }
        case arrColumnEditLabel.includes(name): {
          return getObjectPropSafely(() => valueCell.value) ? (
            <Span
              variant={theme.palette.mode === "light" ? "ghost" : "filled"}
              color={getObjectPropSafely(() => valueCell.color)}
            >
              {getObjectPropSafely(() => valueCell.value)}
            </Span>
          ) : null;
        }
        case arrColumnBool.includes(name): {
          return (
            <Iconify
              icon={valueCell ? "eva:checkmark-circle-fill" : "eva:close-circle-fill"}
              sx={{
                width: 20,
                height: 20,
                color: "success.main",
                ...(!valueCell && { color: "error.main" }),
              }}
            />
          );
        }
        case arrValueTitle.includes(name): {
          return (
            <Typography variant="subtitle1" noWrap className="ellipsis-label">
              {getObjectPropSafely(() => valueCell)}
            </Typography>
          );
        }
        case arrDateTime.includes(name): {
          return (
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontSize: 13 }}
              className="ellipsis-label"
            >
              {fDateTime(valueCell)}
            </Typography>
          );
        }
        case arrAttachUnitPercent.includes(name): {
          return (
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontSize: 13 }}
              className="ellipsis-label"
            >
              {fPercentOmitDecimal(valueCell)}
            </Typography>
          );
        }
        case arrDate.includes(name): {
          return (
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontSize: 13 }}
              className="ellipsis-label"
            >
              {fDate(valueCell)}
            </Typography>
          );
        }
        case arrAttachUnitVnd.includes(name): {
          return (
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontSize: 13 }}
              className="ellipsis-label"
            >
              {fValueVnd(valueCell)}
            </Typography>
          );
        }
        case arrColumnHandleLink.includes(name): {
          return <ColumnHandleLink columnTitle={title} valueColumn={valueCell} />;
        }
        case arrColumnPhone.includes(name): {
          return <ColumnHandlePhone value={valueCell} isShowCalltime={isShowCalltime} row={row} />;
        }
        default:
          return (
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontSize: 13 }}
              className="ellipsis-label"
            >
              {valueCell}
            </Typography>
          );
      }
    };

    const convertThumbImg = (value: string) => {
      // return value ? getObjectPropSafely(() => value.split("?")[0]) : "";
      return value;
    };

    const renderItem = (valueItem: Partial<any>) => {
      return (
        <Grid item container>
          <Stack direction="row" alignItems="center">
            {arrColumnThumbImg.includes(column.name) ? (
              <Stack sx={{ mr: 1 }}>
                <MImage
                  src={
                    convertThumbImg(
                      getObjectPropSafely(() => valueItem[`thumb_img_${column.name}`])
                    ) || imageSkylink
                  }
                  preview
                  width={55}
                  height={55}
                  wrapImageSX={{ width: 55 }}
                />
              </Stack>
            ) : null}
            {arrColumnAvatar.includes(column.name) ? (
              <Stack sx={{ mr: 6 }}>
                <MImage
                  src={
                    getObjectPropSafely(() => valueItem[`thumb_img_avatar_${column.name}`]) ||
                    imageSkylink
                  }
                  preview
                  style={{ borderRadius: "50%" }}
                  contentImage={
                    <Avatar
                      alt={""}
                      src={
                        getObjectPropSafely(() => valueItem[`thumb_img_avatar_${column.name}`]) ||
                        imageSkylink
                      }
                    />
                  }
                />
              </Stack>
            ) : null}
            <Stack spacing={1}>
              {getObjectPropSafely(() => infoCell[column.name].length) ? (
                <>
                  {map(infoCell[column.name], (item, index) => {
                    const { isShowTitle = true, title } = item;

                    return (
                      <Stack
                        key={index}
                        direction="row"
                        className="ellipsis-label"
                        sx={{
                          whiteSpace: "nowrap",
                          ...(arrColumnHandleLink.includes(item.name) && { overflow: "visible" }),
                        }}
                      >
                        {isShowTitle && (
                          <Typography sx={{ fontSize: 13, mr: 1 }}>{title}:</Typography>
                        )}
                        {convertRenderValue({
                          ...item,
                          valueCell: getObjectPropSafely(() => valueItem[item.name]),
                          row: valueItem,
                        })}
                      </Stack>
                    );
                  })}
                </>
              ) : null}
            </Stack>
          </Stack>
        </Grid>
      );
    };

    const dataCollapse = useMemo(() => {
      return arrHandleList.includes(column.name) ? tail(valueRow) : [];
    }, []);

    return (
      <Grid container spacing={1.5}>
        {renderItem(
          arrHandleList.includes(column.name) ? getObjectPropSafely(() => valueRow[0]) : row
        )}
        {dataCollapse.length ? (
          <>
            <Grid item container xs={12}>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Grid item container spacing={1}>
                  {map(dataCollapse, (option: Partial<any>) => {
                    return renderItem(option);
                  })}
                </Grid>
              </Collapse>
            </Grid>
            <Grid item container xs={12}>
              {expanded ? (
                <Typography
                  variant="caption"
                  color={theme.palette.secondary.main}
                  onClick={() => setExpanded(!expanded)}
                  sx={{ cursor: "pointer" }}
                >
                  {"Thu gọn"}
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  color={theme.palette.secondary.main}
                  onClick={() => setExpanded(!expanded)}
                  sx={{ cursor: "pointer" }}
                >
                  {"Xem thêm"}
                </Typography>
              )}
            </Grid>
          </>
        ) : null}
      </Grid>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnShowInfo;
