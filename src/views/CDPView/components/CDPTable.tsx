import { ChangeSet } from "@devexpress/dx-react-grid";
import { styled } from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CustomerType } from "_types_/CustomerType";
import { DGridType } from "_types_/DGridType";
import AttributeColumn from "components/Tables/columns/AttributeColumn";
import BooleanColumn from "components/Tables/columns/BooleanColumn";
import DPhoneColumn from "components/Tables/columns/DPhoneColumn";
import DateColumn from "components/Tables/columns/DateColumn";
import DownloadColumn from "components/Tables/columns/DownloadColumn";
import GenderColumn from "components/Tables/columns/GenderColumn";
import HistoryTypeColumn from "components/Tables/columns/HistoryTypeColumn";
import ListChipColumn from "components/Tables/columns/ListChipColumn";
import ListImageColumn from "components/Tables/columns/ListImageColumn";
import NumberColumn from "components/Tables/columns/NumberColumn";
import PlayMediaColumn from "components/Tables/columns/PlayMediaColumn";
import UserColumn from "components/Tables/columns/UserColumn";
import VariantColumn from "components/Tables/columns/VariantColumn";
import VoipStatusColum from "components/Tables/columns/VoipStatusColum";
import VoipTypeColumn from "components/Tables/columns/VoipTypeColum";
import TableWrapper from "components/Tables/TableWrapper";
import CallDateColumn from "views/LeadCenterView/components/columns/CallDateColumn";
import HandleStatusColumn from "views/LeadCenterView/components/columns/HandleStatusColumn";
import LeadStatusColumn from "views/LeadCenterView/components/columns/LeadStatusColumn";
import AddressColumn from "./columns/AddressColumn";
import BillSecColumn from "./columns/BillSecColumn";
import CustomerTypeColumn from "./columns/CustomerTypeColumn";
import DetailCDPColumn from "./columns/DetailCDPColumn";
import GiftColumn from "./columns/GiftColumn";
import ImageProductColumn from "./columns/ImageProductColumn";
import LastOrderColumn from "./columns/LastOrderColumn";
import LinkAirtableColumn from "./columns/LinkAirtableColumn";
import OrderColumn from "./columns/OrderColumn";
import OrderStatusColumn from "./columns/OrderStatusColumn";
import PageColumn from "./columns/PageColumn";
import PostColumn from "./columns/PostColumn";
import ProductNameColumn from "./columns/ProductNameColumn";
import RankColumn from "./columns/RankColumn";
import RankStatusColumn from "./columns/RankStatusColumn";
import SrcDstColumn from "./columns/SrcDstColumn";
import StatusAirtableColumn from "./columns/StatusAirtableColumn";

interface Props extends Partial<DGridType> {
  label?: string;
  arrLinkAirtableColumn?: string[];
  pickCustomer?: (customer: CustomerType) => void;
  customerType?: string[];
  containerStyle?: React.CSSProperties;
  elevation?: boolean /* bằng phẳng */;
  headerPanel?: JSX.Element;
  showAddCommand?: boolean;
  showEditCommand?: boolean;
  showDeleteCommand?: boolean;
  onRefresh?: () => void;
  onRefreshCDPRow?: (customer: CustomerType) => void;
  gifts?: { id: number; name: string }[];
  onCommitChange?: (changes: ChangeSet) => void;
  setParams: (prams: any) => void;
}

const CDPTable = ({ arrLinkAirtableColumn = [], ...props }: Props) => {
  return (
    <StyleCard>
      <Stack direction="row" alignItems="center">
        {props.label && (
          <Typography
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingTop: 24,
              paddingLeft: 24,
              paddingBottom: 16,
            }}
          >
            {props.label}
          </Typography>
        )}
        {props.headerPanel}
      </Stack>
      <TableWrapper {...props}>
        <DetailCDPColumn for={["detail"]} pickCustomer={props.pickCustomer} />
        <PostColumn for={["fb_post"]} />
        <DPhoneColumn onRefresh={props.onRefresh} onRefreshCDPRow={props.onRefreshCDPRow} />
        <GenderColumn for={["gender"]} />
        <GiftColumn
          for={["gifts"]}
          onCommitChange={props.onCommitChange}
          giftOptions={props.gifts}
        />
        <ListImageColumn for={["images"]} />
        <RankStatusColumn for={["modified_status"]} />
        <RankColumn for={["ranking", "new_rank", "old_rank"]} />
        <CustomerTypeColumn for={props.customerType || []} />
        <PageColumn for={["page"]} />
        <BillSecColumn for={["duration"]} />
        <DateColumn
          for={[
            "birthday",
            "new_birthday",
            "old_birthday",
            "change_date_time",
            "latest_up_rank_date",
            "datetime_modified_care_staff",
          ]}
          arrTimeColumn={[
            "change_date_time",
            "modified",
            "datetime_modified_care_staff",
            "created",
          ]}
        />
        <CallDateColumn for={["calldate"]} />
        <SrcDstColumn for={["hotline_number", "customer_number"]} />
        <HandleStatusColumn />
        <ProductNameColumn for={["product_name"]} />
        <ImageProductColumn for={["thumbnail_url"]} />
        <AddressColumn for={["shipping_addresses"]} />
        <VoipStatusColum for={["call_status"]} />
        <VoipTypeColumn for={props.customerType ? [] : ["call_type"]} />
        <DownloadColumn for={["record_url"]} />
        <PlayMediaColumn for={["play_url"]} />
        <UserColumn />
        <ListChipColumn for={["old_values", "new_values", "tags"]} />
        <HistoryTypeColumn />
        <NumberColumn for={["total_spent", "total_price"]} />
        <LeadStatusColumn for={["lead_status"]} />
        <LinkAirtableColumn for={arrLinkAirtableColumn} />
        <StatusAirtableColumn />
        <AttributeColumn />
        <VariantColumn for={["variant"]} hiddenFields={["quantity"]} />
        <OrderColumn for={["order_spent"]} />
        <LastOrderColumn for={["last_order"]} />
        <OrderStatusColumn for={["order_status"]} />
        <BooleanColumn for={["data_status"]} />
      </TableWrapper>
    </StyleCard>
  );
};

export default CDPTable;

const StyleCard = styled(Card)(({ theme }) => ({
  padding: "8px",
  "& .Pagination-text*": {
    color: `${theme.palette.text.primary} !important`,
    minWidth: "16px !important",
  },
}));
