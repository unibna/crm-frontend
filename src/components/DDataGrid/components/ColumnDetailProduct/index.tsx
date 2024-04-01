import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import MImage from "components/Images/MImage";
import Image from "components/Images/Image";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import imageSkylink from "assets/images/icon-logo.png";
import { ROLE_TAB } from "constants/rolesTab";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ColumnDetailProduct = (props: Props) => {
  const Formatter = ({
    value,
  }: {
    value: { value: string; valueItem: any; content: JSX.Element };
  }) => {
    const { valueItem } = value;

    return (
      <Grid container wrap="nowrap" direction="row" alignItems="center">
        {getObjectPropSafely(() => valueItem?.image[0]?.url) ? (
          <MImage src={valueItem?.image?.url || imageSkylink} preview />
        ) : null}

        <Link
          underline="hover"
          variant="subtitle2"
          color="primary.main"
          sx={{ cursor: "pointer", ml: 9 }}
          className="ellipsis-label"
          href={`/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => valueItem.id)}`}
          target="_blank"
          rel="noreferrer"
        >
          {valueItem.name}
        </Link>
      </Grid>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnDetailProduct;
