//component
import {
  Column,
  DataTypeProvider,
  FilterOperation,
  IntegratedFiltering,
  IntegratedSorting,
  SearchState,
  Sorting,
  SortingState,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  SearchPanel,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { Grid as Layout } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import React, { useState } from "react";
import { SaleOnlineDailyType } from "_types_/UserType";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import vi from "locales/vi.json";

const Table = ({
  data,
  columns,
  loading,
}: {
  data: SaleOnlineDailyType[];
  columns: Column[];
  loading: boolean;
}) => {
  const mdDown = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));

  const [tableColumnExtensions] = useState<VirtualTable.ColumnExtension[]>([
    { columnName: "name", width: mdDown ? 170 : 205, align: "left" },
    { columnName: "total", width: 75, align: "center" },
    { columnName: "qualified", width: 75, align: "center" },
  ]);
  const [sorting, setSorting] = useState<Sorting[] | undefined>([
    { columnName: "total", direction: "asc" },
  ]);

  return (
    <Box p={0.5} style={{ width: mdDown ? 355 : 385 }}>
      <Paper variant="outlined" style={{ height: "100%" }}>
        <TableWrap className="wrap-user-online-popper" style={{ width: mdDown ? 335 : 364 }}>
          {loading && <LinearProgress />}
          <Grid rows={data} columns={columns}>
            <SearchState defaultValue="" />
            <IntegratedFiltering />
            <NameEmailColumn for={["name"]} />
            <SortingState
              sorting={sorting}
              onSortingChange={setSorting}
              defaultSorting={[{ columnName: "total", direction: "asc" }]}
            />
            <IntegratedSorting />
            <VirtualTable
              messages={{
                noData: vi.no_data,
              }}
              columnExtensions={tableColumnExtensions}
              height="auto"
            />
            <TableHeaderRow
              showSortingControls
              cellComponent={(restProps) => <TableHeaderRow.Cell {...restProps} />}
            />
            <Toolbar />
            <SearchPanel
              inputComponent={(panelProps) => (
                <SearchPanel.Input {...panelProps} style={{ paddingTop: 8, paddingBottom: 8 }} />
              )}
            />
          </Grid>
        </TableWrap>
      </Paper>
    </Box>
  );
};

export default Table;

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const NameEmailColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: any }) => {
    const mdDown = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));

    return (
      <>
        {value ? (
          <>
            <NameLabel style={{ fontSize: mdDown ? 12 : 14 }}>{value}</NameLabel>
          </>
        ) : (
          ""
        )}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

const TableWrap = styled(Layout)({
  width: 370,
  margin: 5,
  "div > div": {
    minHeight: 40,
    paddingBottom: 5,
  },
  "table:last-child": {
    marginBottom: "0px !important",
  },
});

const NameLabel = styled("p")({
  fontSize: 14,
  padding: 0,
  margin: 0,
});
