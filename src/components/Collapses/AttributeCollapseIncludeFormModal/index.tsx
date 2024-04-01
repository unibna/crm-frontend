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
import { MExpandMoreIconButton } from "components/Buttons";
import { NoDataPanel } from "components/DDataGrid/components";
import FormPopup from "components/Popups/FormPopup";
import { HEIGHT_DEVICE } from "constants/index";
import map from "lodash/map";
import { useMemo, useState } from "react";
import { toSimplest } from "utils/stringsUtil";
import { AttributeItem, AttributeProps } from "./AttributeItem";
import { compareStringSearch } from "utils/helpers";

interface Props extends Omit<AttributeProps, "row"> {
  title: string;
  data: { id: number | string; name: string; is_show?: boolean }[];
  handleCreateAction: (row: { type: string; name: string }) => Promise<void>;
  expandedDefault?: boolean;
  type: string;
  isAdd?: boolean;
}

export const AttributeCollapseIncludeFormModal = ({
  data = [],
  expandedDefault,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [expanded, setExpanded] = useState(expandedDefault || false);

  const [search, setSearch] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmitAttribute = async (form: { [key: string]: string }) => {
    await props.handleCreateAction({ name: form[props.type], type: props.type });
    if (!props.state.error) {
      setIsOpen(false);
    }
  };

  const dataRender = useMemo(() => {
    if (search.trim() === "") {
      return data;
    }
    return data.filter((item) => compareStringSearch(item.name, search));
  }, [data, search]);

  return (
    <Grid item xs={12} style={containerStyle}>
      <FormPopup
        transition
        isOpen={isOpen}
        isLoadingButton={props.state.loading}
        title={props.title}
        funcContentSchema={props.formSchema}
        funcContentRender={props.funcContentRender}
        buttonText={"Thêm"}
        defaultData={props.formDefaultData ? props.formDefaultData() : undefined}
        handleClose={() => setIsOpen(false)}
        handleSubmitPopup={onSubmitAttribute}
      />
      <Paper elevation={3}>
        <Stack direction="row" alignItems="center" p={2} component={Paper} elevation={2}>
          <div style={expandIconStyle}>
            <MExpandMoreIconButton
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            />
          </div>
          <Typography component="label" style={titleStyle}>
            {props.title}
          </Typography>
          <div style={buttonStyle}>
            {props.isAdd && (
              <Button variant="contained" onClick={() => setIsOpen(true)}>
                {"Thêm"}
              </Button>
            )}
          </div>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
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

          {data.length ? (
            <TableContainer style={tableStyle}>
              {map(dataRender, (row, index) => {
                return row?.id ? (
                  <AttributeItem key={row.id} index={index} {...props} row={row} />
                ) : null;
              })}
            </TableContainer>
          ) : (
            <NoDataPanel containerSx={{ my: 1, borderRadius: 1 }} />
          )}
        </Collapse>
      </Paper>
    </Grid>
  );
};

const containerStyle = { padding: 8 };
const expandIconStyle = { width: 60, marginRight: 8 };
const titleStyle = { width: "100%", fontWeight: 500, mb: 0 };
const buttonStyle = { width: 120 };
const tableStyle = { maxHeight: HEIGHT_DEVICE - 220, marginBottom: 5 };
