// Libraries
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import usePopup from "hooks/usePopup";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ColumnCellShowPopup = (props: Props) => {
  const Formatter = ({ value }: { value: { content: JSX.Element } }) => {
    const { dataPopup, setDataPopup } = usePopup();

    const handleOpenPopup = () => {
      let typeProduct = "";
      let funcContentSchema: any;
      let buttonTextPopup = "Tạo";
      let newContentRender = () => value.content;
      let defaultData = {};
      defaultData = {
        name: "",
      };

      setDataPopup({
        ...dataPopup,
        buttonText: buttonTextPopup,
        isOpenPopup: true,
        title: "Chi tiết",
        defaultData,
        type: typeProduct,
        funcContentRender: newContentRender,
        funcContentSchema,
        isShowFooter: false,
      });
    };

    return (
      <>
        {value.content ? (
          <Box sx={{ cursor: "pointer" }} onClick={handleOpenPopup}>
            <InfoIcon color="info" fontSize="medium" />
          </Box>
        ) : null}
      </>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnCellShowPopup;
