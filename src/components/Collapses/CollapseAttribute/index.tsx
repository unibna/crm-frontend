import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SelectOptionType } from "_types_/SelectOptionType";
import { MExpandMoreIconButton } from "components/Buttons";
import ModifiedAttributePopover from "components/Popovers/ModifiedAttributePopover";
import { HEIGHT_DEVICE } from "constants/index";
import map from "lodash/map";
import { useMemo, useState } from "react";
import { stringToSlug } from "utils/helpers";

interface Props {
  title: string;
  labelDialog?: string;
  attributeLabel?: string;
  handleAdd?: () => void;
  handleEdit?: (objValue: SelectOptionType) => void;
  handleDelete?: (objValue: SelectOptionType) => void;
  dataRenderAttribute: SelectOptionType[];
}

const AttributeCollapse = (props: Props) => {
  const {
    title,
    labelDialog,
    attributeLabel = "",
    dataRenderAttribute = [],
    handleAdd,
    handleEdit,
    handleDelete,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const [search, setSearch] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const dataRender = useMemo(() => {
    if (search === "") {
      return dataRenderAttribute;
    }
    return dataRenderAttribute.filter((item) =>
      stringToSlug(item.label).includes(stringToSlug(search))
    );
  }, [search, dataRenderAttribute]);

  return (
    <Grid item xs={12} style={{ padding: 8 }}>
      <Paper elevation={3}>
        <Stack direction="row" alignItems="center" py={2} component={Paper} elevation={2}>
          <div style={{ width: 60, marginLeft: 10 }}>
            <MExpandMoreIconButton
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            />
          </div>
          <Typography gutterBottom component="label" style={{ width: "100%" }}>
            {title}
          </Typography>
          {handleAdd ? (
            <div style={{ width: 120 }}>
              <Button variant="contained" onClick={handleAdd}>
                Thêm
              </Button>
            </div>
          ) : null}
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {dataRenderAttribute.length > 0 && (
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
                variant="standard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          )}

          <TableContainer sx={{ maxHeight: HEIGHT_DEVICE - 220, my: 2 }}>
            {dataRender.length ? (
              map(dataRender, (item: SelectOptionType, index) => (
                <Grid key={index} container direction="row" alignItems="center" sx={{ py: 1 }}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={9.5}>
                    {item.content || (
                      <Typography style={{ width: "100%", fontSize: 14 }}>{item.label}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={1.5}>
                    <ModifiedAttributePopover
                      handleDelete={handleDelete ? () => handleDelete(item) : undefined}
                      handleEdit={handleEdit ? () => handleEdit(item) : undefined}
                      attributeLabel={attributeLabel}
                      status={{ loading: false, error: false, type: null }}
                      labelDialog={labelDialog}
                    />
                  </Grid>
                </Grid>
              ))
            ) : (
              <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 5 }}>
                Không có dữ liệu
              </Stack>
            )}
          </TableContainer>
        </Collapse>
      </Paper>
    </Grid>
  );
};

export default AttributeCollapse;
