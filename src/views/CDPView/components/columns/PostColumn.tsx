import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { TypeInPost } from "_types_/FanpageType";
import Tooltip from "@mui/material/Tooltip";
import MImage from "components/Images/MImage";
import { headerFilterPostType } from "views/ReportFanpageView/constants";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PostColumn = (props: Props) => {
  const Formatter = ({
    value,
  }: {
    value?: { post_id: string; message: string; picture: string; type: TypeInPost };
  }) => {
    const type = headerFilterPostType.find((item) => item.value === value?.type)?.label;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={value?.message || ""}>
          <MImage width={36} height={36} src={value?.picture} />
        </Tooltip>
        {type ? ` - ${type}` : ""}
      </div>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default PostColumn;
