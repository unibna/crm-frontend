//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { Span } from "components/Labels";

//types
import { PromotionType, PROMOTION_TYPE } from "_types_/PromotionType";

//utils
import { PATH_DASHBOARD, ROOT } from "routes/paths";
import { ROLE_TAB } from "constants/rolesTab";
import { FONT_PRIMARY } from "theme/typography";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionNameColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: PromotionType }) => {
    const isOrderPromotion = row?.type === PROMOTION_TYPE.ORDER;

    return (
      <>
        <Stack>
          <Span
            component={"p"}
            color={isOrderPromotion ? "success" : "secondary"}
            sx={{
              width: "fit-content",
              whiteSpace: "break-spaces",
              lineHeight: "150%",
              height: "auto",
              padding: "4px 8px",
            }}
          >{`${isOrderPromotion ? "Đơn hàng" : "Sản phẩm"}`}</Span>
        </Stack>
        <Tooltip arrow title={<pre style={{ fontFamily: FONT_PRIMARY }}>{row?.note || ""}</pre>}>
          <Link
            target="_blank"
            style={{ fontSize: 13 }}
            href={`${window.location.origin}${PATH_DASHBOARD[ROLE_TAB.PROMOTION][ROOT]}/${row?.id}`}
          >
            {value}
          </Link>
        </Tooltip>
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["name"]} />;
};

export default PromotionNameColumn;
