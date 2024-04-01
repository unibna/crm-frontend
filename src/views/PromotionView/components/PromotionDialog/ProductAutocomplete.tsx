import { SearchSharp } from "@mui/icons-material";
import { SxProps, Theme, styled } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { productApi } from "_apis_/product";
import { AttributeVariant } from "_types_/ProductType";
import { NoDataPanel } from "components/DDataGrid/components";
import { ProductItem } from "components/ProductComponent";
import { SearchField, SearchFieldProps } from "components/Fields";
import React, { useEffect, useState } from "react";

interface ProductAutocompleteProps extends SearchFieldProps {
  onSelected?: (product: Partial<AttributeVariant>) => void;
  containerStyle?: React.CSSProperties;
  params?: any;
}

const ProductAutocomplete = (props: ProductAutocompleteProps) => {
  const { defaultValue, size, containerStyle, onSelected, params } = props;

  const [name, setName] = useState<string>();
  const [data, setData] = useState<AttributeVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemFocusIndex, setItemFocusIndex] = useState<number | null>(null);

  const getData = async (value: string) => {
    if (value) {
      setLoading(true);
      const result = await productApi.get<AttributeVariant>(
        { ...params, search: value, status: "ACTIVE" },
        "variant/search/"
      );
      if (result.data) {
        setData(result.data.results);
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
          setItemFocusIndex((prev: any) => prev + 1);
        }
      } else if (e.key === "ArrowUp") {
        if (itemFocusIndex === null || itemFocusIndex === 0) {
          setItemFocusIndex(data.length - 1);
        } else {
          setItemFocusIndex((prev: any) => prev - 1);
        }
      }
    }
  };

  const handleSearchProduct = (value: string) => {
    if (itemFocusIndex === null) {
      setName(value.trim());
      if (value === "") {
        setShowModal(false);
        setData([]);
      } else {
        setShowModal(true);
        getData(value);
      }
    }
  };

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setShowModal(false);
      if (itemFocusIndex !== null && data.length) {
        setName(data[itemFocusIndex]?.name || "");
        onSelected && onSelected(data[itemFocusIndex]);
        setShowModal(false);
        setData([]);
        // setCount(0);
      }
      event.stopPropagation();
    }
  };

  useEffect(() => {
    setItemFocusIndex(null);
  }, [showModal]);

  useEffect(() => {
    setName(defaultValue);
  }, [defaultValue]);

  const isEmptyData = data.length === 0;

  return (
    <ClickAwayListener onClickAway={() => setShowModal(false)}>
      <div
        style={{ position: "relative", display: "flex", flex: 1, ...containerStyle }}
        onKeyDown={handleKeyDown}
        onKeyPress={itemFocusIndex !== null ? (e) => onKeyPress(e) : undefined}
      >
        <SearchField
          fullWidth
          isDebounce
          loading={loading}
          defaultValue={name}
          onSearch={handleSearchProduct}
          renderIcon={<SearchSharp />}
          handleFocus={() => setShowModal(false)}
          style={{ width: "100%" }}
          {...props}
        />
        {showModal && (
          <Paper
            elevation={3}
            style={{ ...headerListProductStyle, marginTop: size === "small" ? 50 : 60 }}
          >
            <Paper elevation={2}>
              <Grid
                container
                p={2}
                justifyContent="flex-start"
                alignItems="center"
                sx={{ color: "#637381", mb: 0.5 }}
              >
                <Grid item xs={7}>
                  <TitleHeaderProductList>Sản phẩm</TitleHeaderProductList>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={1.5}>
                  <TitleHeaderProductList>Giá niêm yết</TitleHeaderProductList>
                </Grid>
                <Grid item xs={1.5}>
                  <TitleHeaderProductList>Giá bán</TitleHeaderProductList>
                </Grid>
              </Grid>
            </Paper>
            {isEmptyData ? (
              <NoDataPanel showImage />
            ) : (
              <List sx={listProductSx} aria-label="customers">
                {data.map((item, index) => {
                  return (
                    <ProductItem
                      index={index}
                      product={item}
                      key={item.id}
                      onCheckedProduct={() => {
                        setName(item?.name || "");
                        setShowModal(false);
                        onSelected && onSelected(item);
                      }}
                      hiddenColumns={["quantity", "cross_sale", "total"]}
                      // prettier-ignore
                      bundleHiddenColumns={["quantity", "price", "total", "listed_price", "cross_sale"]}
                      isShowActualInventory
                    />
                  );
                })}
              </List>
            )}
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ProductAutocomplete;

const TitleHeaderProductList = styled(Typography)(() => ({
  lineHeight: "1.5rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  paddingLeft: "2px",
}));

const headerListProductStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: 10,
  zIndex: 9999,
};

const listProductSx: SxProps<Theme> = {
  width: "100%",
  bgcolor: "background.paper",
  maxHeight: 300,
  overflow: "auto",
};
