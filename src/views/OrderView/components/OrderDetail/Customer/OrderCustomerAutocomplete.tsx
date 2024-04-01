//components
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { SearchField } from "components/Fields";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useTheme } from "@mui/material/styles";

//hooks
import useIsMountedRef from "hooks/useIsMountedRef";

//utils
import vi from "locales/vi.json";
import map from "lodash/map";
import slice from "lodash/slice";

//apis
import { customerApi } from "_apis_/customer.api";

//types
import { CustomerType } from "_types_/CustomerType";

const OrderCustomerAutocomplete = ({
  onChange,
  defaultValue,
  error,
  helperText,
  size,
  label,
  required,
  disabled,
  autoFocus,
  onSearch,
  containerStyle,
  onSelected,
}: {
  onChange: ({ phone, name }: { phone: string; name?: string }) => void;
  onSelected?: (customer: CustomerType) => void;
  onSearch?: () => void;
  defaultValue: Partial<CustomerType>;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  size?: "small" | "medium";
  label?: string;
  containerStyle?: React.CSSProperties;
}) => {
  const theme = useTheme();
  const isMounted = useIsMountedRef();
  const [data, setData] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [params] = useState({ limit: 200, page: 1 });
  const [showModal, setShowModal] = useState(false);
  const [itemFocusIndex, setItemFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    setItemFocusIndex(null);
  }, [showModal]);

  const getData = async (value: string) => {
    if (value) {
      setLoading(true);
      const result = await customerApi.get({
        endpoint: "",
        params: { ...params, search: value },
      });
      if (result?.data) {
        isMounted.current && setData(result.data?.results);
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (data.length) {
      if (e.key === "ArrowDown") {
        if (itemFocusIndex === null || itemFocusIndex === data.length - 1) {
          setItemFocusIndex(0);
        } else {
          setItemFocusIndex((prev: number) => prev + 1);
        }
      } else if (e.key === "ArrowUp") {
        if (itemFocusIndex === null || itemFocusIndex === 0) {
          setItemFocusIndex(data.length - 1);
        } else {
          setItemFocusIndex((prev: number) => prev - 1);
        }
      }
    }
  };

  const handleSearchCustomer = (value: string) => {
    if (value === "") {
      setShowModal(false);
      setData([]);
    } else {
      setShowModal(true);
      getData(value);
    }
  };

  const backgroundFocusItem = (index: number) =>
    index === itemFocusIndex ? (isDarkMode ? "grey.700" : "rgba(0, 0, 0, 0.12)") : "unset";

  const isEmptyData = data.length === 0;
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <ClickAwayListener onClickAway={() => setShowModal(false)}>
      <div
        style={{ position: "relative", display: "flex", flex: 1, ...containerStyle }}
        onKeyDown={handleKeyDown}
      >
        <SearchField
          isDebounce
          loading={loading}
          onSearch={handleSearchCustomer}
          style={{ width: "100%", margin: 0 }}
          placeholder="Nhập tên hoặc số điện thoại"
          disabled={disabled}
          error={error}
          helperText={helperText}
          required={required}
          autoFocus={autoFocus}
          defaultValue={defaultValue?.phone}
          size={size}
          label={label}
        />
        {showModal && (
          <Paper
            elevation={3}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              marginTop: size === "small" ? 40 : 60,
              padding: 10,
              zIndex: 9999,
            }}
          >
            {isEmptyData ? (
              vi.no_data
            ) : (
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  maxHeight: 250,
                  overflow: "auto",
                }}
                aria-label="customers"
              >
                {map(
                  slice(data, (params.page - 1) * params.limit, params.limit * params.page),
                  (item, index) => (
                    <ListItem
                      disablePadding
                      key={index}
                      onClick={() => {
                        setShowModal(false);
                        onChange({
                          phone: item?.phone || "",
                          name: !item.full_name || item.full_name === "null" ? "" : item.full_name,
                        });
                        onSearch && onSearch();
                        onSelected && onSelected(item);
                      }}
                    >
                      <ListItemButton
                        style={{
                          fontSize: 13,
                          padding: 6,
                        }}
                        onMouseOver={() => setItemFocusIndex(index)}
                        sx={{
                          backgroundColor: backgroundFocusItem(index),
                          ":hover": {
                            backgroundColor: backgroundFocusItem(index),
                          },
                        }}
                      >{`${item.full_name} - ${item?.phone}`}</ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
            )}
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default OrderCustomerAutocomplete;
