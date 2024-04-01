import GroupIcon from "@mui/icons-material/Group";
import SummarizeIcon from "@mui/icons-material/Summarize";

import { RankStatus } from "_types_/RankType";

import AirTable from "../components/CustomerDetail/tables/AirTable";
import CallTable from "../components/CustomerDetail/tables/CallTable";
import CommentTable from "../components/CustomerDetail/tables/CommentTable";
import HistoryCDPTable from "../components/CustomerDetail/tables/HistoryCDPTable";
import InboxTable from "../components/CustomerDetail/tables/InboxTable";
import LeadTable from "../components/CustomerDetail/tables/LeadTable";
import NoteTable from "../components/CustomerDetail/tables/NoteTable";
import OrderSkylinkTable from "../components/CustomerDetail/tables/OrderSkylinkTable";
import ProductTable from "../components/CustomerDetail/tables/ProductTable";
import ZaloTable from "../components/CustomerDetail/tables/ZaloTable";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { ROLE_TAB, STATUS_ROLE_CDP } from "constants/rolesTab";
import { PATH_DASHBOARD } from "routes/paths";
import { fShortenNumber } from "utils/formatNumber";
import { isMatchRoles } from "utils/roleUtils";

import Stack from "@mui/material/Stack";
import { RouteType } from "components/Tabs";
import { UserType } from "_types_/UserType";
import { TITLE_PAGE } from "constants/index";

export const CDP_TABLE_TABS = ({
  id = "",
  phone = "",
  isMutationNote,
  analystOrderStatus,
}: {
  id?: string;
  phone?: string;
  isMutationNote?: boolean;
  analystOrderStatus?: ({ orders, total }: { orders: number[]; total: number }) => void;
}) => [
  {
    name: "Đơn hàng & Sản phẩm",
    component: (
      <Stack spacing={2}>
        <OrderSkylinkTable id={id} analystOrderStatus={analystOrderStatus} />
        <ProductTable phone={phone} />
      </Stack>
    ),
  },
  {
    name: "Ghi chú",
    component: <NoteTable customerID={id} isMutationNote={isMutationNote} />,
  },
  {
    name: "Lịch sử tạo SĐT",
    component: <LeadTable phone={phone} />,
  },
  { name: "Lịch sử cuộc gọi", component: <CallTable phone={phone} /> },
  { name: "Lịch sử Comment", component: <CommentTable phone={phone} /> },
  { name: "Lịch sử Inbox", component: <InboxTable phone={phone} /> },
  { name: "Lịch sử CDP", component: <HistoryCDPTable customerID={id} /> },
  { name: "CSKH Airtable", component: <AirTable phone={phone} /> },
  { name: "Zalo", component: <ZaloTable phone={phone} /> },
  {
    name: "Tất cả",
    component: (
      <Stack spacing={3}>
        <NoteTable customerID={id} isMutationNote={isMutationNote} />
        <LeadTable phone={phone} />
        <CallTable phone={phone} />
        <ProductTable phone={phone} />
        <CommentTable phone={phone} />
        <InboxTable phone={phone} />
        <HistoryCDPTable customerID={id} />
        <AirTable phone={phone} />
        <ZaloTable phone={phone} />
      </Stack>
    ),
  },
];

export const CDP_TABS_ONE_COLUMN = [
  "Ghi chú",
  "Đơn hàng",
  "Lịch sử tạo SĐT",
  "Lịch sử cuộc gọi",
  "Sản phẩm đã mua",
  "Lịch sử Comment",
  "Lịch sử Inbox",
  "Lịch sử CDP",
  "CSKH Airtable",
  "Tất cả",
];

export const TOTAL_ORDER_MARKS = [
  { value: 1, label: "1" },
  { value: 20, label: "20" },
  { value: 40, label: "40" },
  { value: 60, label: "60" },
  { value: 80, label: "80" },
  { value: 100, label: "100" },
  { value: 120, label: "120" },
  { value: 200, label: "200" },
  { value: 300, label: "300" },
  { value: 400, label: "400" },
  { value: 500, label: "500" },
];

export const TOTAL_SPENT_MARKS = [
  { value: 1000, label: fShortenNumber(1000) },
  { value: 8000000, label: fShortenNumber(8000000) },
  { value: 15000000, label: fShortenNumber(15000000) },
  { value: 25000000, label: fShortenNumber(25000000) },
  { value: 40000000, label: fShortenNumber(40000000) },
  { value: 60000000, label: fShortenNumber(60000000) },
  { value: 80000000, label: fShortenNumber(80000000) },
  { value: 100000000, label: fShortenNumber(100000000) },
];

export const KEY_FILTER_DATE = [
  {
    title: "Đặt đơn",
    keyFilters: [
      { label: "last_order_date_after", color: "#91f7d3", title: "Đặt đơn từ" },
      { label: "last_order_date_before", color: "#91f7d3", title: "Đặt đơn đến" },
    ],
  },
  {
    title: "Ngày sinh",
    keyFilters: [
      { label: "birthday_after", color: "#f7b891", title: "Ngày sinh từ" },
      { label: "birthday_before", color: "#f7b891", title: "Ngày sinh đến" },
    ],
  },
];

export const KEY_FILTER_TAGS = { label: "tags", color: "#91f7d3", title: "Thẻ" };
export const KEY_FILTER_RANKS = { label: "ranking", color: "#91f7d3", title: "Hạng thành viên" };

export const RANK_STATUS: {
  value: RankStatus | string;
  label: string;
  color: string;
}[] = [
  { value: RankStatus.PENDING, label: "Chưa xử lý", color: "#e67e22" },
  { value: RankStatus.INPROCESS, label: "Đang xử lý", color: "#3498db" },
  { value: RankStatus.COMPLETE, label: "Hoàn thành", color: "#2ecc71" },
];

export const KEY_FILTER_RANK = [{ label: "new_value", title: "Hạng", color: "" }];
export const KEY_FILTER_RANK_STATUS = [
  { label: "modified_status", title: "Trạng thái xử lý hạng", color: "" },
];

export const CDP_TABS_ROUTE = (user: Partial<UserType> | null, roles: any): RouteType[] => [
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][STATUS_ROLE_CDP.LIST]}`,
    label: TITLE_PAGE.CDP_USER,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.USERS]),
    icon: <GroupIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][STATUS_ROLE_CDP.EXTERNAL_USERS]}`,
    label: TITLE_PAGE.EXTERNAL_USERS,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.USERS]),
    icon: <GroupAddIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][STATUS_ROLE_CDP.REPORTS]}`,
    label: TITLE_PAGE.CDP_REPORT,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.REPORTS]),
    icon: <SummarizeIcon />,
  },
];
