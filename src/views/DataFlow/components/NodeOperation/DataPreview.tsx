import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { FORMAT_DISPLAY } from "views/DataFlow/constants";
import EmptyContent, { EmptyContentProps } from "../EmptyContent";

function DataPreview({
  payload,
  formatDisplay,
  emptyDataProps,
}: {
  payload?: any;
  formatDisplay: FORMAT_DISPLAY;
  emptyDataProps?: EmptyContentProps;
}) {
  const theme = useTheme();
  const renderTable = (data: object[]) => {
    if (data.length === 0) return null;
    if (data?.some((item) => typeof item !== "object" || Array.isArray(item))) {
      return <pre>{JSON.stringify(data, replacerFunc, 2)}</pre>;
    }
    let keys: string[] = [];
    data.map((item) => {
      item &&
        Object.keys(item).map((k) => {
          if (!keys.includes(k)) keys = keys.concat(k);
        });
    });

    return (
      <TableContainer sx={{ maxHeight: window.innerHeight - 250 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {keys.map((key) => (
                <TableCell key={key}>
                  <Typography variant="h6">{key}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {keys.map((key) => (
                  <TableCell key={key}>
                    <Typography
                      variant="body2"
                      component={"pre"}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {JSON.stringify(item[key], replacerFunc, 2)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getLevelColor = (level: number) => {
    if (level % 3 === 1) {
      return theme.palette.warning.main;
    }
    if (level % 3 === 2) {
      return theme.palette.success.dark;
    }

    return theme.palette.info.dark;
  };

  function createFormattedJSON(data: string, margin: number, level: number) {
    const tempData = JSON.parse(data);
    let formattedJson = "";

    if (Array.isArray(tempData)) {
      formattedJson += `<span style='margin-left:${margin}px; color:${getLevelColor(
        level - 1
      )}'>[</span>`;
      if (tempData.length > 0) {
        const temp = [...tempData]
          .map((item, index) => {
            return item && typeof item === "object"
              ? `<div style='margin-left:${margin}px;color:${getLevelColor(level)}'>{</div>` +
                  `<div style='margin-left:${margin}px'>${createFormattedJSON(
                    JSON.stringify(item, null, 2),
                    margin,
                    level + 1
                  )}</div>` +
                  `<div style='margin-left:${margin}px;color:${getLevelColor(level)}'>}${
                    index !== tempData.length - 1 ? "," : ""
                  }</div>`
              : `<span style='color:${
                  typeof item === "string"
                    ? `${theme.palette.warning.darker}`
                    : `${theme.palette.success.darker}`
                }'>${JSON.stringify(item)}${[...tempData].reverse()[0] !== item ? "," : ""}</span>`;
          })
          .join(" ");

        if (tempData.some((item) => item && typeof item === "object")) {
          formattedJson += `<div style='margin-left:${margin}px'>${temp}</div>`;
        } else {
          formattedJson += `<span style='margin-left:${margin}px;color:${theme.palette.warning.darker};white-space: nowrap;'>${temp}</span>`;
        }
      }
    } else {
      if (tempData) {
        Object.entries(tempData).forEach(([key, value]) => {
          formattedJson += `<div>`;
          if (key !== "root" && level)
            formattedJson += `<span style='margin-left:${margin}px; color: ${theme.palette.info.main}' class='json-key'>"${key}"</span><span class="syntax">:</span>`;
          if (typeof value == "object" && value) {
            if (Array.isArray(value)) {
              formattedJson += createFormattedJSON(
                JSON.stringify(value, null, 2),
                margin,
                level + 1
              );
              formattedJson += `<span style='margin-left:${margin}px;color:${getLevelColor(
                level
              )}'>]${Object.keys(tempData).reverse()[0] !== key ? "," : ""}</span>`;
            } else {
              formattedJson += `<span class='syntax' style='margin-left: ${margin}px;color:${getLevelColor(
                level
              )}'>{</span>`;
              if (Object.keys(value).length > 0)
                formattedJson += `<div class='syntax' style='margin-left: ${margin}px;'>${createFormattedJSON(
                  JSON.stringify(value, replacerFunc, 2),
                  margin,
                  level + 1
                )}</div>`;
              formattedJson += `<span style='margin-left:${margin}px;color:${getLevelColor(
                level
              )}' class='syntax'>}${Object.keys(tempData).reverse()[0] !== key ? "," : ""}</span>`;
            }
          } else {
            formattedJson += `<span class='value' style='margin-left:${margin}px; color: ${
              Object.keys(tempData)[0] === key
                ? "#009688"
                : typeof value === "string"
                ? `${theme.palette.warning.darker}`
                : `${theme.palette.success.darker}`
            }; white-space: nowrap;'>${
              typeof value === "string" ? JSON.stringify(value) : value
            },</span>`;
          }
          formattedJson += `</div>`;
        });
      }
    }

    return formattedJson;
  }

  const replacerFunc = (key: string, value: any) => {
    let retValue = value;
    // if (typeof value === "string" && dateIsValid(value) && !isNumeric(value))
    //   retValue = fDateTime(value, dd_MM_yyyy_HH_mm);
    return retValue;
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        overflow: "auto",
        height: window.innerHeight - 250,
        background: theme.palette.mode === "light" ? "#eee" : "transparent",
        color: "#333",
        mt: 2,
      }}
    >
      {payload === undefined ? (
        <EmptyContent imgStyles={{ height: "140px" }} {...emptyDataProps} />
      ) : (
        <>
          {formatDisplay === FORMAT_DISPLAY.JSON && (
            <>
              {typeof payload === "object" ? (
                <code
                  dangerouslySetInnerHTML={{
                    __html: createFormattedJSON(
                      JSON.stringify({ root: payload }, replacerFunc, 4),
                      12,
                      0
                    ),
                  }}
                  style={{ color: theme.palette.text.primary }}
                />
              ) : (
                JSON.stringify(payload)
              )}
            </>
          )}
          {formatDisplay === FORMAT_DISPLAY.TABLE &&
            renderTable(!Array.isArray(payload) ? [payload] : payload)}
        </>
      )}
    </Grid>
  );
}

export default DataPreview;
