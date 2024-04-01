// Libraries
import { useState, useMemo } from "react";
import { styled } from "@mui/material";
import map from "lodash/map";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

// Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

const TextSpan = styled("span")({
  textOverflow: "ellipsis",
  overflow: "hidden",
  color: "#3f51b5",
  "&:hover": {
    cursor: "pointer",
  },
});

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ColumnHandleList = (props: Props) => {
  const Formatter = ({ value }: { value: any }) => {
    const [isShowMore, setShowMore] = useState(false);

    const data = useMemo(() => {
      return value && value.length > 2 ? value.slice(1, value.length) : [];
    }, [value]);

    const style = isShowMore
      ? {
          display: "block",
        }
      : {
          display: "none",
        };

    const renderHtml = () => {
      return data.length
        ? map(data, (item: string, index: number) => {
            return (
              <div key={index} style={style}>
                {item}
              </div>
            );
          })
        : null;
    };

    return (
      <div>
        {getObjectPropSafely(() => value[0])}
        <div style={contentStyle}>{renderHtml()}</div>
        {data.length ? (
          <div onClick={() => setShowMore(!isShowMore)}>
            <TextSpan>{isShowMore ? "Ẩn bớt" : "Xem thêm"}</TextSpan>
          </div>
        ) : null}
      </div>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandleList;

const contentStyle: React.CSSProperties = { maxHeight: 100, overflowX: "auto" };
