import { Fragment, useEffect, useState } from "react";
import { customerApi } from "_apis_/customer.api";
import { CustomerType } from "_types_/CustomerType";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import useDebounce from "hooks/useDebounce";
import CircularProgress from "@mui/material/CircularProgress";

const SearchCustomerModal = ({
  onSelect,
  defaultValue,
  inputProps,
}: {
  onSelect: (customer: Partial<CustomerType>) => void;
  defaultValue?: Partial<CustomerType>;
  inputProps?: TextFieldProps;
}) => {
  const [data, setData] = useState<Partial<CustomerType>[]>([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState<Partial<CustomerType>>();

  const debounceValue = useDebounce(phone, 500);

  const getData = async (textInput: string) => {
    setLoading(true);
    const result = await customerApi.get({
      endpoint: "search-es/",
      params: {
        limit: 200,
        page: 1,
        search: textInput,
      },
    });
    if (result.data) {
      setData(result.data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(phone);
  }, [debounceValue, phone]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-async"
      options={data}
      value={value}
      fullWidth
      loading={loading}
      size="small"
      defaultValue={defaultValue}
      isOptionEqualToValue={(option: CustomerType) => !!option.phone}
      onChange={(e, value) => value && onSelect(value)}
      getOptionLabel={(option: CustomerType) => `${option.full_name} - ${option.phone}`}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => setPhone(e.target.value)}
          label="Nhập số điện thoại"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          {...inputProps}
        />
      )}
      renderOption={(props, option, { inputValue, selected }) => (
        <MenuItem {...props} selected={selected}>
          <Typography
            style={{ fontSize: 14 }}
            className="ellipsis-label"
          >{`${option.full_name} - ${option.phone}`}</Typography>
        </MenuItem>
      )}
    />
  );
};

export default SearchCustomerModal;
