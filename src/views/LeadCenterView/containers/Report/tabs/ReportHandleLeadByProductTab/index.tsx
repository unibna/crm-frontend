import AssignLeadItemForSaleTable from "./tables/AssignLeadItemForSaleTable";
import CRMDailyTable from "./tables/CRMDailyTable";
import ReportHandleLeadByProductTable from "./tables/ReportHandleByProductTable";

const ReportTab = () => {
  return (
    <>
      <AssignLeadItemForSaleTable />
      <CRMDailyTable />
      <ReportHandleLeadByProductTable />
    </>
  );
};

export default ReportTab;
