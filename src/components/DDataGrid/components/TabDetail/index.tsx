// Libraries
import { FunctionComponent, memo, useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import isEqual from "lodash/isEqual";

// Components
import Tab from "@mui/material/Tab";
import map from "lodash/map";
import Tabs from "@mui/material/Tabs";
import vi from "locales/vi.json";

interface Props {
  row: any;
  listTabDetail?: any;
  renderTableDetail?: any;
}

const StyleRoot = styled("div")(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  minHeight: 200,
  maxWidth: 700,
}));

const StyleTabs = styled(Tabs)(({ theme }) => ({
  marginRight: 5,
  overflow: "inherit",
}));

const TabDetail: FunctionComponent<Props> = (props) => {
  const { row = {}, renderTableDetail, listTabDetail = [] } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const renderTable = useCallback(() => renderTableDetail(row, value), [value]);
  return !listTabDetail.length ? (
    renderTable()
  ) : (
    <StyleRoot>
      <StyleTabs
        indicatorColor="primary"
        textColor="primary"
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
      >
        {listTabDetail.length
          ? map(listTabDetail, (tab: keyof typeof vi, index: number) => {
              return <Tab label={vi[tab]} key={index} style={tabStyle} />;
            })
          : null}
      </StyleTabs>

      {renderTable()}
    </StyleRoot>
  );
};

//return false -> update , return true => not update
const areEqual = (prevProps: Props, nextProps: Props) => {
  if (
    !isEqual(prevProps.row, nextProps.row) ||
    !isEqual(prevProps.listTabDetail, nextProps.listTabDetail) ||
    !isEqual(prevProps.renderTableDetail, nextProps.renderTableDetail)
  ) {
    return false;
  }
  return true;
};

export default memo(TabDetail, areEqual);

const tabStyle = { minWidth: 130, marginRight: 0 };
