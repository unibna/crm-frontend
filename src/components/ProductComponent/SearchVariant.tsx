// Libraries
import map from "lodash/map";
import { useEffect, useState } from "react";

// Services
import { productApi } from "_apis_/product";

// Context
import useDebounce from "hooks/useDebounce";

// Components
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { ProductItem } from ".";

// @Types
import { AttributeVariant, STATUS_PRODUCT } from "_types_/ProductType";

// ----------------------------------------------------------

export const SearchVariant = ({
  value,
  message,
  isDisabled = false,
  isMultiple = false,
  placeholder = "",
  limitTags = 1,
  params = {},
  endpoint = "variant/search/",
  handleDisableItem = () => false,
  handleSelectVariant = () => {},
  handleDataItem = () => [],
}: {
  value: AttributeVariant[] | any;
  message?: string;
  endpoint?: string;
  placeholder?: string;
  limitTags?: number;
  isDisabled?: boolean;
  isMultiple?: boolean;
  params?: Partial<any>;
  handleDisableItem?: (variant: AttributeVariant) => boolean;
  handleSelectVariant?: (variants: AttributeVariant[]) => void;
  handleDataItem?: (variants: AttributeVariant[]) => {};
}) => {
  const [isLoadingSearch, setLoadingSeach] = useState(false);
  const [search, setSearch] = useState("");
  const [dataVariants, setDataVariants] = useState<AttributeVariant[]>([]);

  const debounceSearch = useDebounce(search, 400);

  useEffect(() => {
    getAllVariant({
      search: debounceSearch,
      ...params,
    });
  }, [debounceSearch]);

  const getAllVariant = async (paramsAgru: any) => {
    setLoadingSeach(true);
    const result: any = await productApi.get(
      { status: STATUS_PRODUCT.ACTIVE, limit: 50, ...paramsAgru },
      endpoint
    );

    if (result && result.data) {
      const { results = [] } = result.data;
      const newResults = map(results, (item) => ({
        ...item,
        value: item.name,
        isDisabled: isDisabled || handleDisableItem(item),
        ...handleDataItem(item),
      }));

      setDataVariants(newResults);
    }
    setLoadingSeach(false);
  };

  return (
    <Autocomplete
      id="controlled-demo"
      value={value}
      fullWidth
      multiple={isMultiple}
      limitTags={limitTags}
      disabled={isDisabled}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => value.value === option.value}
      getOptionLabel={(option) => option.value}
      getOptionDisabled={(option) => !!option.isDisabled}
      options={[...dataVariants]}
      clearOnBlur={false}
      onChange={(event, newValue) => handleSelectVariant(newValue)}
      renderOption={(props, option) => (
        <li {...props}>
          <ProductItem
            product={option}
            index={option}
            isShowStatus
            isShowActualInventory
            hiddenColumns={["quantity", "price", "cross_sale", "total", "listed_price"]}
            disabled={!!option.isDisabled}
            isShowBundle={false}
          />
        </li>
      )}
      sx={{ zIndex: 1303 }}
      loading={isLoadingSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder={placeholder}
          onChange={(event) => setSearch(event.target.value)}
          error={!!message}
          helperText={message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoadingSearch ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
