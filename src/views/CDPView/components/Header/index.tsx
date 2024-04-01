import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { CustomerType } from "_types_/CustomerType";
import { HeaderType } from "_types_/HeaderType";
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { HeaderTableWrapper } from "components/Tables/HeaderWrapper";
import WrapFilterPopup from "components/Popups/WrapFilterPopup";
import React, { useContext, useEffect, useState } from "react";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import { CDPContext } from "views/CDPView";
import TagsAutocomplete from "../TagsAutocomplete";
import CustomerModal from "./CustomerModal";
import FilterChips from "./FilterChips";
import FilterPopup from "./FilterPopup";
import { isMatchRoles } from "utils/roleUtils";
import useAuth from "hooks/useAuth";
import { ROLE_TAB, STATUS_ROLE_CDP } from "constants/rolesTab";

interface Props extends Partial<HeaderType> {
  filterCount?: number;
  goToDetail: (value: Partial<CustomerType>) => void;
  customer?: Partial<CustomerType>;
  selection: (string | number)[];
  handleRefresh?: () => void;
  setFilterCount: React.Dispatch<React.SetStateAction<number>>;
  onClearAll: (keys: string[]) => void;
  handleUpdateTagsForCustomer: (
    tags: {
      id: number;
      name: string;
    }[]
  ) => Promise<void>;
  tags?: {
    id: number;
    name: string;
  }[];
  setTags?: React.Dispatch<
    React.SetStateAction<
      | {
          id: number;
          name: string;
        }[]
      | undefined
    >
  >;
}

const Header = ({
  goToDetail,
  customer,
  selection,
  params,
  setParams,
  columns,
  handleRefresh,
  handleUpdateTagsForCustomer,
  setTags,
  tags,
  filterCount,
  onClearAll,
  setFilterCount,
  hiddenColumnNames,
  setHiddenColumnNames,
  isFullRow,
  setFullRow,
  ...props
}: Props) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const cdpContext = useContext(CDPContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (tags?.length) {
      setError("");
    }
  }, [tags]);

  const handleUpdateTags = () => {
    if (tags?.length) {
      handleUpdateTagsForCustomer(tags);
      return;
    } else {
      setError(VALIDATION_MESSAGE.REQUIRE_TAG);
      return;
    }
  };

  const isMatchAddRole = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.ADD]
  );

  return (
    <HeaderTableWrapper.GridWrapHeaderPage
      params={params}
      onRefresh={handleRefresh}
      columns={columns}
      hiddenColumnNames={hiddenColumnNames}
      setHiddenColumnNames={setHiddenColumnNames}
      isFullRow={isFullRow}
      setFullRow={setFullRow}
      filterChipCount={filterCount}
      setFilterCount={setFilterCount}
      onClearFilter={(keys) => {
        const newParams = clearParamsVar(keys, params);
        setParams && setParams(newParams);
      }}
      onDeleteFilter={(type: string, value: string | number) => {
        handleDeleteParam(params || {}, { type, value }, setParams);
      }}
      setParams={setParams}
      rightChildren={
        <>
          <Grid item>
            {isMatchAddRole ? (
              <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                <AddIcon />
                {vi.button.add}
              </Button>
            ) : null}
            <CustomerModal
              onReloadCustomer={handleRefresh}
              setOpen={setOpen}
              customer={customer}
              open={open}
            />
          </Grid>
          <Grid item>
            <WrapFilterPopup filterCount={filterCount}>
              <FilterPopup
                listTag={cdpContext?.tags.tags || []}
                params={params}
                setParams={setParams}
              />
            </WrapFilterPopup>
          </Grid>
          {selection.length > 0 && (
            <Grid item xs={12}>
              <Stack direction="column" alignItems="flex-end">
                <TagsAutocomplete
                  sx={{ maxWidth: 400 }}
                  tags={tags}
                  setTags={setTags}
                  submit={handleUpdateTags}
                  submitLabel="Thêm"
                  error={error}
                  options={cdpContext?.tags.tags || []}
                />
              </Stack>
            </Grid>
          )}
        </>
      }
      {...props}
    >
      <Grid container alignItems="center" pl={1}>
        <FilterChips
          params={params}
          setParams={setParams}
          setFilterCount={setFilterCount}
          onClearAll={onClearAll}
        />
      </Grid>
    </HeaderTableWrapper.GridWrapHeaderPage>
  );
};

export default Header;
