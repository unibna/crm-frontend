import { Column } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { HeaderType } from "_types_/HeaderType";
import { ParamsPhoneLeadType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { VoidType } from "_types_/VoidType";
import { MultiSelect, formatValueChangeMultiSelector } from "components/Selectors";
import { HeaderTableWrapper } from "components/Tables/HeaderWrapper";
import React from "react";
import { fDateTime } from "utils/dateUtil";
import { clearParamsVar, handleDeleteParam } from "utils/formatParamsUtil";
import { REPORT_VOIP_OPTIONS } from "../constants";
import { formatExportVoip } from "features/voip/exportData";
import { voipFilterOptions, voipFilterChipOptions } from "features/voip/handleFilter";

export interface VoipFilterType {
  isFilterVoipStatus?: boolean;
  isFilterVoipProccess?: boolean;
  isFilterCallAttribute?: boolean;
  isFilterTelephonist?: boolean;
  isFilterModifiedByName?: boolean;
  isFilterCallDate?: boolean;
  //
  callAttributeOptions?: SelectOptionType[];
  telephonistOptions?: SelectOptionType[];
}
export interface HeaderVoipType extends Partial<HeaderType>, VoipFilterType {
  columns?: Column[];
  isFilterVoipReport?: boolean;
  data?: { data: VoidType[]; loading: boolean; count: number };
  setParams: React.Dispatch<React.SetStateAction<any>>;
  hiddenColumns?: string[];
  setHiddenColumns?: React.Dispatch<React.SetStateAction<string[]>>;
  isFullRow?: boolean;
  setIsFullRow?: React.Dispatch<React.SetStateAction<boolean>>;
  filterCount?: number;
  setFilterCount?: React.Dispatch<React.SetStateAction<number>>;
}

const TableVoipHeader = ({
  params,
  setParams,
  columns,
  data,
  hiddenColumns,
  setHiddenColumns,
  isFullRow,
  setIsFullRow,
  filterCount,
  setFilterCount,
  isFilterVoipStatus,
  isFilterTelephonist,
  isFilterModifiedByName,
  telephonistOptions,
  isFilterVoipProccess,
  isFilterCallAttribute,
  isFilterCallDate,
  callAttributeOptions = [],
  isFilterVoipReport,
  ...props
}: HeaderVoipType) => {
  const onSetParams = (
    name: keyof ParamsPhoneLeadType,
    value: string | number | "all" | "none" | (string | number)[]
  ) => {
    const formatValue = formatValueChangeMultiSelector(value);
    setParams({ ...params, [name]: formatValue, page: 1 });
  };

  return (
    <Stack width={"100%"}>
      <HeaderTableWrapper.GridWrapHeaderPage
        params={params}
        searchPlacehoder="Nhập line, số nội bộ"
        onRefresh={() => setParams({ ...params })}
        columns={columns}
        exportData={data?.data}
        exportFileName={`Danh_sach_cuoc_goi_${fDateTime(new Date())}`}
        formatExportFunc={formatExportVoip}
        hiddenColumnNames={hiddenColumns}
        setHiddenColumnNames={setHiddenColumns}
        isFullRow={isFullRow}
        setFullRow={setIsFullRow}
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
        filterChipOptions={voipFilterChipOptions({
          callAttributeOptions,
          telephonistOptions,
          isFilterVoipStatus,
          isFilterTelephonist,
          isFilterModifiedByName,
          isFilterVoipProccess,
          isFilterCallAttribute,
          isFilterCallDate,
        })}
        filterOptions={voipFilterOptions({
          onSetParams,
          setParams,
          isFilterVoipStatus,
          isFilterTelephonist,
          isFilterModifiedByName,
          isFilterVoipProccess,
          isFilterCallAttribute,
          isFilterCallDate,
          callAttributeOptions,
          telephonistOptions,
          params,
        })}
        leftChildren={
          <>
            {isFilterVoipReport && (
              <MultiSelect
                title="Báo cáo theo"
                options={REPORT_VOIP_OPTIONS}
                onChange={(value) => onSetParams("dimension", value)}
                label="dimension"
                defaultValue={params?.dimension}
                outlined
                fullWidth
                selectorId="report-voip-type-dimension-selector"
                isAllOption={false}
              />
            )}
          </>
        }
        {...props}
      />
    </Stack>
  );
};

export default TableVoipHeader;
