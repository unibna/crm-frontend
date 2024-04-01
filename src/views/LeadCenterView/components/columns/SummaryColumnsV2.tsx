import { styled } from "@mui/material";
import { ReportSaleType } from "_types_/PhoneLeadType";
import { formatReportPhoneLeadValueV2 } from "features/lead/formatData";
import { fNumber } from "utils/formatNumber";

const SummaryColumnsV2 = ({
  column,
  row,
  value,
}: {
  column?: { name: keyof ReportSaleType; title: string };
  row?: Partial<ReportSaleType>;
  value: string;
}) => {
  const result =
    column && row
      ? formatReportPhoneLeadValueV2(column?.name, row, row[column?.name])
      : fNumber(value);

  return <SummaryLabel>{result}</SummaryLabel>;
};

export default SummaryColumnsV2;

const SummaryLabel = styled("p")(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.primary.main,
  fontWeight: "bold",
  margin: 0,
}));
