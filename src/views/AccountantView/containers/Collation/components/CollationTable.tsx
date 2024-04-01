import { DGridType } from "_types_/DGridType";
import BooleanColumn from "components/Tables/columns/BooleanColumn";
import DateTimeColumn from "components/Tables/columns/DateTimeColumn";
import ListImageColumn from "components/Tables/columns/ListImageColumn";
import NumberColumn from "components/Tables/columns/NumberColumn";
import UserColumn from "components/Tables/columns/UserColumn";
import TableWrapper from "components/Tables/TableWrapper";

const CollationTable = (props: Partial<DGridType>) => {
  return (
    <TableWrapper {...props}>
      <DateTimeColumn
        for={["ReceivedDate", "upload_at", "receive_time", "3rd_cod_transfer_date"]}
        editColumnNames={["ReceivedDate"]}
      />
      <NumberColumn for={["Amount", "amount", "file_amount", "payment", "3rd_cod_amount"]} />
      <BooleanColumn for={["is_confirm"]} />
      <UserColumn for={["upload_by"]} />
      <ListImageColumn for={["Images", "images"]} />
    </TableWrapper>
  );
};

export default CollationTable;
