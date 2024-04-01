import Box from "@mui/material/Box";
import { RowDrop } from "_types_/DragDropTypes";
import MDragDrop from "components/DragAndDrop/MDragDrop";
interface Props {
  watch: any;
  setValue: any;
}

const SortAttribute = (props: Props) => {
  const { watch, setValue } = props;
  const { attributes } = watch();

  return (
    <Box sx={{ height: 200 }}>
      <MDragDrop
        data={attributes}
        handleDragData={(data: RowDrop[]) => setValue("attributes", data)}
      />
    </Box>
  );
};

export default SortAttribute;
