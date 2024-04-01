import { useAppSelector } from "hooks/reduxHook";
import { useCallback, useEffect, useState } from "react";
import { userStore } from "store/redux/users/slice";
import filter from "lodash/filter";
import { toSimplest } from "utils/stringsUtil";
import Paper from "@mui/material/Paper";
import LeadTable from "views/LeadCenterView/components/tables/LeadTable";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import { USER_COLUMNS, USER_COLUMNS_WIDTH } from "views/LeadCenterView/constants/columns";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";
import UserTabDetail from "views/LeadCenterView/components/UserTabDetail";
import { UserType } from "_types_/UserType";

const UserTab = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<Partial<UserType>[]>([]);
  const [columnsWidth, setColumnsWidth] = useState<TableColumnWidthInfo[]>(USER_COLUMNS_WIDTH);
  const [params, setParams] = useState<any>({ limit: 500, page: 1 });
  const [columnsOrder, setColumnsOrder] = useState<string[]>(
    map(USER_COLUMNS_WIDTH, (item) => item.columnName)
  );
  const userSlice = useAppSelector(userStore);
  const [isFullRow, setIsFullRow] = useState(false);
  const [hiddenColumnNames, setHiddenColumnNames] = useState([]);

  const onSearch = useCallback(() => {
    const result = filter(userSlice.telesaleUsers, (item) => {
      return (
        toSimplest(item.email + item?.name + item.username + item.phone).includes(
          toSimplest(searchText)
        ) ||
        (item?.name ? toSimplest(searchText).includes(toSimplest(item?.name)) : false) ||
        (item?.name ? toSimplest(searchText).includes(toSimplest(item?.name)) : false) ||
        (item?.phone ? toSimplest(searchText).includes(toSimplest(item?.phone)) : false)
      );
    });
    setData(result);
  }, [searchText, userSlice.telesaleUsers]);

  useEffect(() => {
    onSearch();
  }, [onSearch]);

  return (
    <Paper variant="outlined" style={{ marginBottom: 16 }}>
      <PhoneLeadHeader
        hiddenColumnNames={hiddenColumnNames}
        setHiddenColumnNames={setHiddenColumnNames}
        columns={USER_COLUMNS}
        setFullRow={() => setIsFullRow((prev) => !prev)}
        isFullRow={isFullRow}
        setParams={(values) => {
          setSearchText(values.search || "");
          setParams(values);
        }}
        tabName="user"
        onSearch={(value) => setSearchText(value)}
      />

      <LeadTable
        columns={USER_COLUMNS}
        columnWidths={columnsWidth}
        setColumnWidths={setColumnsWidth}
        data={{
          data: map(data, (item) => ({ ...item, staff_phone: item.phone })),
          count: data.length,
          loading: false,
        }}
        detailComponent={({ row }) => <UserTabDetail row={row} />}
        params={params}
        setParams={setParams}
        columnOrders={columnsOrder}
        setColumnOrders={setColumnsOrder}
        hiddenColumnNames={hiddenColumnNames}
        isFullRow={isFullRow}
      />
    </Paper>
  );
};

export default UserTab;
