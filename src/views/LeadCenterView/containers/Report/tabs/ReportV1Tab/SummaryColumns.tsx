import { styled } from "@mui/material";
import { PhoneLeadReportType } from "_types_/PhoneLeadType";
import { formatReportPhoneLeadValue } from "features/lead/formatData";
import { fNumber } from "utils/formatNumber";

const SummaryColumns = ({
  column,
  row,
  value,
}: {
  column?: { name: string; title: string };
  row?: Partial<PhoneLeadReportType>;
  value: string;
}) => {
  const zero = "0 - 0%";
  const result = column
    ? row && row.total && column?.name
      ? formatReportPhoneLeadValue(column?.name, row, row[column?.name as keyof typeof row])
      : zero
    : fNumber(value);

  return <SummaryLabel>{result}</SummaryLabel>;
};

export default SummaryColumns;

const SummaryLabel = styled("p")(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.primary.main,
  fontWeight: "bold",
  margin: 0,
}));
