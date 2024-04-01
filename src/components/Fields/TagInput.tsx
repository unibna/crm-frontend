import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import { AttributeType } from "_types_/AttributeType";
import map from "lodash/map";
import React, { useEffect, useState } from "react";

const filter = createFilterOptions();

/**
 * @param returnType - Kiểu dữ liệu muốn trả về
 * @type {"id" | "name" | "origin"}
 * @returns
 */
export const TagInput = React.memo(
  ({
    value,
    disabled,
    loading,
    onSubmit,
    label,
    options,
    placeholder,
    returnType = "origin",
    helperText,
    size,
    inputStyle,
    onCreateTag,
    isCreate,
    inputProps,
  }: {
    value?: (string | number | { id?: string | number; name: string })[];
    disabled?: boolean;
    loading?: boolean;
    onSubmit: (tags: (string | number | { id?: number | string; name: string })[]) => void;
    label?: string;
    placeholder?: string;
    options: AttributeType[];
    returnType?: "id" | "name" | "origin";
    helperText?: string;
    inputStyle?: React.CSSProperties;
    size?: "small" | "medium";
    onCreateTag?: (tag: { name: string }) => Promise<{ id: number; name: string } | null>;
    isCreate?: boolean;
    inputProps?: BaseTextFieldProps;
  }) => {
    const [tags, setTags] = useState<
      { id?: string | number; name: string; inputValue?: string }[] | undefined
    >([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (typeof value?.[0] === "object" || returnType === "origin") {
        setTags(value as AttributeType[]);
      } else {
        const valueClone = value as (string | number)[] | undefined;
        const convertDefaultOptions = valueClone
          ? options.filter((item) => valueClone?.includes(item[returnType || "name"] || ""))
          : [];

        setTags(convertDefaultOptions);
      }
    }, [options, value, returnType]);

    const handleChangeTags = async (
      event: any,
      tagsParams: { id: string; name: string; inputValue?: string }[]
    ) => {
      const [lastTag, ...selectedTags] = tagsParams.reverse();

      //is new tag
      if (lastTag?.inputValue) {
        if (onCreateTag) {
          const resNewTag = await onCreateTag(lastTag);
          if (resNewTag) {
            const newTags = [...selectedTags.reverse(), resNewTag];
            setTags(newTags);
            returnType === "name" && onSubmit(map(newTags, (item) => item.name.toString()));
            returnType === "id" && onSubmit(map(newTags, (item) => item.id));
            returnType === "origin" && onSubmit(newTags);
          }
        }
      } else {
        setTags(tagsParams);
        returnType === "name" && onSubmit(map(tagsParams, (item) => item.name.toString()));
        returnType === "id" && onSubmit(map(tagsParams, (item) => item.id));
        returnType === "origin" && onSubmit(tagsParams);
      }
    };

    const filterTags = ({ id }: { id: string | number; inputValue?: string }) => {
      const result = tags?.filter((tag) => tag?.id !== id);
      setTags(result);
      returnType === "id" && onSubmit(map(result, (item) => item?.id || "") || []);
      returnType === "name" && onSubmit(map(result, (item) => item.name.toString()) || []);
      returnType === "origin" && onSubmit(result || []);
    };

    return (
      <>
        <Grid item xs={12} className="grid-layout-tag-input" style={inputStyle}>
          <Autocomplete
            id="asynchronous-demo"
            disabled={disabled}
            open={open}
            value={tags}
            size={size}
            fullWidth
            filterOptions={(options, params) => {
              const filtered = filter(options, params) as {
                id?: number;
                name: string;
                inputValue?: string;
              }[];

              const { inputValue } = params;

              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option.name);
              if (inputValue !== "" && !isExisting && isCreate) {
                filtered.push({
                  name: params.inputValue,
                  inputValue: `Thêm "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            isOptionEqualToValue={(option, value) =>
              option?.name?.toString() === value?.name?.toString()
            }
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue || "";
              }
              return option.name || "";
            }}
            options={map(options, (tag) => ({
              id: tag.id,
              name: tag.name,
              inputValue: undefined,
            }))}
            loading={loading}
            multiple
            sx={{
              ".MuiOutlinedInput-root": {
                div: { display: "none" },
              },
              ".MuiChip-root": { height: 24, label: { pr: 1, pl: 1 }, m: 0.25 },
            }}
            onChange={handleChangeTags}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!helperText}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                {...inputProps}
              />
            )}
          />
          <FormHelperText style={{ margin: 0 }} error>
            {helperText}
          </FormHelperText>
          <Stack direction="row" spacing={1} style={{ display: "block" }}>
            {map(tags, (tag, index: number) => (
              <Chip
                key={index}
                disabled={disabled}
                label={tag.name}
                onDelete={() => tag.id && filterTags({ id: tag.id })}
                size="small"
                style={{ marginTop: 8, marginRight: 8, marginLeft: 0 }}
              />
            ))}
          </Stack>
        </Grid>
      </>
    );
  }
);
