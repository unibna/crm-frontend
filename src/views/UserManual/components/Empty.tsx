import { styled } from "@mui/material";
import Card from "@mui/material/Card";
import { NoDataPanel } from "components/DDataGrid/components";

function Empty({ title, onClick }: { title?: string; onClick: VoidFunction }) {
  return (
    <Wrapper>
      <NoDataPanel />
    </Wrapper>
  );
}

export default Empty;

const Wrapper = styled(Card)(({ theme }) => ({
  padding: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  boxShadow: "none",
}));
