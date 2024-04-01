import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import { interceptApi } from "_apis_/intercept";
import { DGridDataType, DGridType } from "_types_/DGridType";
import { MButton } from "components/Buttons";
import { GridWrapHeaderProps, HeaderTableWrapper } from "components/Tables/HeaderWrapper";
import TableWrapper from "components/Tables/TableWrapper";
import DateTimeColumn from "components/Tables/columns/DateTimeColumn";
import UserColumn from "components/Tables/columns/UserColumn";
import WrapPage from "layouts/WrapPage";
import vi from "locales/vi.json";
import { useCallback, useEffect, useState } from "react";
import { SPAM_TYPE } from "../constants";
import InterceptFormModal from "./InterceptFormModal";
import SpamActionColumn from "./columns/SpamActionColumn";

export interface InterceptType {
  id: string;
  created: string;
  modified: string;
  is_show: true;
  spam_type: string;
  status: string;
  data: string;
  note: string;
  spam_count: number;
  created_by_id: string;
  modified_by_id: string;
  tenant: string;
}

interface Props extends Partial<GridWrapHeaderProps>, Partial<DGridType> {
  spamType: SPAM_TYPE;
}

const InterceptContainer = (props: Props) => {
  const [params, setParams] = useState<any>({ limit: 100, page: 1, spam_type: props.spamType });

  const [data, setData] = useState<DGridDataType<InterceptType>>({
    count: 0,
    data: [],
    loading: false,
  });

  const [openForm, setOpenForm] = useState(false);

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await interceptApi.get<InterceptType>({ params, endpoint: "data-spam/" });
    if (res.data) {
      const { results, count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <InterceptFormModal
        onClose={() => setOpenForm(false)}
        onRefresh={getData}
        open={openForm}
        label={props.spamType}
        type={props.spamType}
      />
      <HeaderTableWrapper.GridWrapHeaderPage
        {...props}
        onSearch={(value) => setParams({ ...params, search: value })}
        onRefresh={getData}
        rightChildren={
          <Stack direction={"row"} alignItems={"center"} mt={1}>
            <MButton onClick={() => setOpenForm(true)}>
              <AddIcon />
              {vi.button.add}
            </MButton>
          </Stack>
        }
      />
      <TableWrapper {...props} data={data} params={params} setParams={setParams}>
        <DateTimeColumn />
        <UserColumn for={["created_by_id", "modified_by_id"]} />

        <SpamActionColumn onRefresh={getData} />
      </TableWrapper>
    </WrapPage>
  );
};

export default InterceptContainer;
