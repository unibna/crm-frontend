// Libraries
import { useState } from "react";
import map from "lodash/map";

// Component
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AttributesDialog from "views/ReportFacebookView/components/AttributesDialog";
import ModifiedAttributePopover from "components/Popovers/ModifiedAttributePopover";
interface Props {
  title: string;
  data: { id: number; name: string }[];
  handleDeleteAttributeValue?: any;
  handleDeleteAttribute?: () => void;
  handleAddAttributeValue?: any;
}

const AttributeTable = (props: Props) => {
  const {
    title,
    data = [],
    handleDeleteAttributeValue,
    handleDeleteAttribute,
    handleAddAttributeValue,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAdd = (value: string) => {
    setIsOpen(false);
    handleAddAttributeValue(value);
  };

  return (
    <>
      <AttributesDialog
        isOpen={isOpen}
        buttonText="Cập nhật"
        title={(title)}
        handleClose={() => setIsOpen(false)}
        handleSubmit={handleAdd}
      />
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell
              align="left"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {(title)}
              <ModifiedAttributePopover
                handleDelete={handleDeleteAttribute}
                attributeLabel={(title)}
                status={{ loading: false, error: false, type: null }}
              />
            </TableCell>
            <TableCell align="right">
              <Button
                type="submit"
                variant="contained"
                size="medium"
                onClick={() => setIsOpen(true)}
              >
                Thêm
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(data, (row: { id: number; name: string }) => {
            return (
              <TableRow role="checkbox" tabIndex={-1} key={row.id + row.name}>
                <TableCell align="left" style={{ paddingLeft: 16 }}>
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <ModifiedAttributePopover
                    handleDelete={() => handleDeleteAttributeValue(row.id, row.name)}
                    attributeLabel={row.name}
                    status={{ loading: false, error: false, type: null }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default AttributeTable;
