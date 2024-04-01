import { useState } from "react";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import LoadingModal from "components/Loadings/LoadingModal";
import { orderApi } from "_apis_/order.api";
import { OrderType } from "_types_/OrderType";
import { useCancelToken } from "hooks/useCancelToken";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  isCallApi?: boolean;
}

const ColumnHandleLink = (props: Props) => {
  const { isCallApi = false } = props;
  const Formatter = ({
    value,
  }: {
    value: { domain: string; endpoint: string; href: string; color: string };
  }) => {
    const [isLoading, setLoading] = useState(false);
    const {
      domain = `${window.location.origin}/orders/`,
      endpoint = "",
      href,
      color = "text.info",
    } = value;
    const { newCancelToken } = useCancelToken();

    const handleClickLink = async () => {
      const params = {
        search: endpoint,
      };
      setLoading(true);

      const result = await orderApi.get<OrderType>({
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: "get/all/",
      });

      if (result.data) {
        const { results } = result?.data;
        window.open(`${domain}${results[0]?.id}`, "_blank", "noopener,noreferrer");
      }

      setLoading(false);
    };

    return (
      <>
        {isCallApi ? (
          <div style={containerStyle}>
            <Link onClick={handleClickLink} style={linkStyle} component="button">
              {endpoint}
            </Link>
            {isLoading && <LoadingModal size={13} />}
          </div>
        ) : (
          <Link
            href={href || domain + endpoint}
            style={linkStyle}
            target="_blank"
            rel="noreferrer"
            color={color}
          >
            {endpoint}
          </Link>
        )}
      </>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandleLink;

const linkStyle = { display: "flex", alignItems: "center" };
const containerStyle: React.CSSProperties = { position: "relative" };
