import { useCallback, useState } from "react";

import { TableInlineCellEditing as TableInlineCellEditingGrid } from "@devexpress/dx-react-grid";

import { TableInlineCellEditing } from "@devexpress/dx-react-grid-material-ui";

import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { debounce } from "lodash";
import { facebookApi } from "_apis_/facebook.api";
import { useCancelToken } from "hooks/useCancelToken";

interface Props {
  onCommitChanges: (value: any) => any;
}

type Combined = TableInlineCellEditingGrid.CellProps & Props;

const TableCellEditAddId = (props: Combined) => {
  const { value, onCommitChanges } = props;
  const { newCancelToken } = useCancelToken();
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [adInfo, setAdInfo] = useState<any>(null);

  const debounceSearch = useCallback(
    debounce((nextValue) => fetchApi(nextValue), 500),
    []
  );

  const fetchApi = async (value: string) => {
    setLoading(true);

    const result = await facebookApi.get(
      {
        search: value,
        cancelToken: newCancelToken(),
      },
      "ads/"
    );
    if (result && result.data) {
      const { results = [] } = result.data;

      setAdInfo(results.length > 0 && value ? results[0] : null);
    }
    setLoading(false);
  };

  const handleChangeValue = (newValue: string) => {
    setInputValue(newValue);
    debounceSearch(newValue);
  };

  return (
    <>
      <Stack direction="column" spacing={1} {...props}>
        <TableInlineCellEditing.Cell
          {...props}
          value={inputValue}
          onValueChange={handleChangeValue}
          onBlur={() => {
            inputValue !== value && onCommitChanges(inputValue);
          }}
        />
        {adInfo && (
          <Stack direction="column" sx={{ p: 1, pt: 0 }}>
            {loading && <CircularProgress />}
            <Typography sx={{ fontSize: "0.8125rem" }}>
              Chiến dịch: <b>{adInfo.campaign_name}</b>
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem" }}>
              Content ID: <b>{adInfo.ad_name}</b>
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default TableCellEditAddId;
