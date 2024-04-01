import { styled } from "@mui/material";
import { PhoneLeadReportType } from "_types_/PhoneLeadType";
import { fNumber } from "utils/formatNumber";

const BILLSEC_COLUMN_NAMES = ["total_billsec", "total_inbound_billsec", "total_outbound_billsec"];

const SummaryColumns = ({
  value,
  row,
  column,
}: {
  column?: { name: string; title: string };
  row?: Partial<PhoneLeadReportType>;
  value: string;
}) => {
  let result = fNumber(value);
  const columnName = column?.name as keyof typeof row;
  if (columnName && row?.[columnName]) {
    result = BILLSEC_COLUMN_NAMES.includes(columnName)
      ? `${fNumber(parseFloat(`${parseInt(value) / 60}`).toFixed(2))} phút (${fNumber(value)}s)`
      : fNumber(row?.[columnName]);
  }
  return <SummaryLabel>{result}</SummaryLabel>;
};

export default SummaryColumns;

const SummaryLabel = styled("p")(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.primary.main,
  fontWeight: "bold",
  margin: 0,
}));
