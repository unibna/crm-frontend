import BirthdayTable from "./BirthdayTable";
import CustomerNoteTable from "./CustomerNoteTable";
import TagTable from "./TagTable";
import RankHistoryTable from "./RankHistoryTable";
import CustomerCareStaffTable from "./CustomerCareStaffTable";

interface Props {
  customerID?: string;
}

const HistoryCDPTable = ({ customerID }: Props) => {
  return (
    <>
      <RankHistoryTable customerID={customerID} />
      <TagTable customerID={customerID} />
      <CustomerNoteTable customerID={customerID} />
      <BirthdayTable customerID={customerID} />
      <CustomerCareStaffTable customerID={customerID} />
    </>
  );
};

export default HistoryCDPTable;
