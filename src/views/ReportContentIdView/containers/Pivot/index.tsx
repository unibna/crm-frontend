// Libraries
import { useEffect, useMemo, useRef, useState } from "react";
import { isEqual, map, omit, reduce } from "lodash";
import vi from "locales/vi.json";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";
import { useCancelToken } from "hooks/useCancelToken";
import { registerLicense } from "@syncfusion/ej2-base";

// Components
import {
  PivotViewComponent,
  Inject,
  FieldList,
  CalculatedField,
  Toolbar,
  PDFExport,
  ExcelExport,
  ConditionalFormatting,
  NumberFormatting,
  GroupingBar,
  VirtualScroll,
  DrillThrough,
  Grouping,
} from "@syncfusion/ej2-react-pivotview";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  styled,
  TextField,
} from "@mui/material";
import { ChartTheme } from "@syncfusion/ej2-react-charts";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ContentFilterPivot from "views/ReportContentIdView/components/ContentFilterPivot";
import { MButton } from "components/Buttons";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants & Utils
import { paramsDefault } from "views/ContentDailyView/constants";
import { paramsGetDefault } from "views/ReportContentIdView/constants";
import { handleParamsApi } from "utils/formatParamsUtil";
import { dataSourceSettings, toolbarOptions } from "views/ReportContentIdView/constants/pivot";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXlcd3RXQ2lYWEx/WUE="
);

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  "&.Mui-active, &.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Pivot = () => {
  let pivotObj: any;
  const { newCancelToken } = useCancelToken();

  // State
  const [data, setData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoadingLoadColumn, setLoadingLoadColumn] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<{
    metrics: string[];
    dimensions: string[];
  }>({
    metrics: [],
    dimensions: [],
  });
  const [columns, setColumns] = useState<{
    metrics: string[];
    dimensions: string[];
  }>({
    metrics: [],
    dimensions: [],
  });
  const [isLoadingContinue, setLoadingContinue] = useState(false);
  const [params, setParams] = useState(
    omit(paramsDefault, ["type", "type_phone", "phone_lead_status"])
  );
  const [isErrorSelectColumn, setErrorSelectColumn] = useState(false);

  const prevParams = useRef(null);

  useEffect(() => {
    getListColumn();
  }, []);

  const getListData = async (params: any) => {
    const result: any = await reportMarketing.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "content-ads/pivot/"
    );

    if (result && result.data) {
      const { results = [], count } = result.data;
      return {
        data: results,
        count,
      };
    }

    return {
      count: 0,
      data: [],
    };
  };

  const getListColumn = async () => {
    setLoadingLoadColumn(true);
    const result: any = await reportMarketing.get(
      {
        cancelToken: newCancelToken(),
      },
      "content-ads/pivot/options/"
    );

    if (result && result.data) {
      let dimensionColumns: string[] = [];
      const metricsColumns = reduce(
        result.data.available_columns,
        (prevArr, current) => {
          if (current.toLowerCase() === current) {
            return [...prevArr, current];
          }
          dimensionColumns = [...dimensionColumns, current];
          return prevArr;
        },
        []
      );

      let dimensionColumnsSelected: string[] = [];
      const metricsColumnsSelected = reduce(
        result.data.default_colums,
        (prevArr, current) => {
          if (current.toLowerCase() === current) {
            return [...prevArr, current];
          }
          dimensionColumnsSelected = [...dimensionColumnsSelected, current];
          return prevArr;
        },
        []
      );

      setColumns({
        dimensions: dimensionColumns,
        metrics: metricsColumns,
      });
      setSelectedColumns({
        dimensions: dimensionColumnsSelected,
        metrics: metricsColumnsSelected,
      });
    }

    setLoadingLoadColumn(false);
  };

  const handleContinue = async () => {
    // if (!getObjectPropSafely(() => selectedColumns.length)) {
    //   setErrorSelectColumn(true);

    //   return;
    // }

    const newParams = handleParamsApi(
      {
        ...params,
        limit: 10000,
        selected_columns: [...selectedColumns.dimensions, ...selectedColumns.metrics],
      },
      [...paramsGetDefault, "selected_columns"]
    );

    if (!isEqual(prevParams.current, newParams)) {
      setLoadingContinue(true);
      const result = await getListData(newParams);
      setData(result.data);
      setLoadingContinue(false);
      prevParams.current = newParams;
    }

    setActiveStep(activeStep + 1);
  };

  const cellTemplate = (args: any) => {
    if (
      args.cellInfo &&
      args.cellInfo.axis === "value" &&
      pivotObj.pivotValues[args.cellInfo.rowIndex] &&
      pivotObj.pivotValues[args.cellInfo.rowIndex][0].hasChild
    ) {
      if (args.targetCell.classList.contains(args.cellInfo.cssClass)) {
        args.targetCell.classList.remove(args.cellInfo.cssClass);
        args.cellInfo.style = undefined;
      }
    }
    // if (
    //   args.cellInfo &&
    //   args.cellInfo.axis === "row" &&
    //   args.cellInfo.valueSort.axis === "university"
    // ) {
    //   let imgElement: Element = createElement("img", {
    //     className: "university-logo",
    //     attrs: {
    //       src: UniversityData[args.cellInfo.index[0]].logo as string,
    //       alt: args.cellInfo.formattedText as string,
    //       width: "30",
    //       height: "30",
    //     },
    //   });
    //   let cellValue: Element = select(".e-cellvalue", args.targetCell);
    //   cellValue.classList.add("e-hyperlinkcell");
    //   cellValue.addEventListener("click", hyperlinkCellClick.bind(pivotObj));
    //   args.targetCell.insertBefore(imgElement, cellValue);
    // }
    return "";
  };

  const chartOnLoad = (args: any) => {
    let selectedTheme = location.hash.split("/")[1];
    selectedTheme = selectedTheme ? selectedTheme : "Material";
    args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(
      /-dark/i,
      "Dark"
    ) as ChartTheme;
  };

  const chartSeriesCreated = (args: any) => {
    pivotObj.chartSettings.chartSeries.legendShape =
      pivotObj.chartSettings.chartSeries.type === "Polar" ? "Rectangle" : "SeriesType";
  };

  const dataSetting = useMemo(() => {
    return {
      ...dataSourceSettings,
      values: map(selectedColumns.metrics, (item) => ({
        name: item,
        caption: item,
        // expandAll: true,
        // allowDragAndDrop: true,
      })),

      rows: map(selectedColumns.dimensions, (item) => ({
        name: item,
        caption: item,
        expandAll: false,
        allowDragAndDrop: true,
      })),
      fieldMapping: map(selectedColumns.dimensions, (item) => ({
        name: item,
        caption: item,
      })),
      dataSource: data,
    };
  }, [data, selectedColumns]);

  return (
    <Grid container>
      <Grid item xs={12} sx={{ mb: 5 }}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          <Step>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  typography: "subtitle2",
                  color: "text.disabled",
                },
              }}
            >
              Chọn cột
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  typography: "subtitle2",
                  color: "text.disabled",
                },
              }}
            >
              Giao diện table
            </StepLabel>
          </Step>
        </Stepper>
      </Grid>
      <Grid item xs={12} md={12}>
        {activeStep === 0 && (
          <ContentFilterPivot
            params={params}
            columns={columns}
            columnSelected={selectedColumns}
            handleParams={setParams}
            handleSelect={setSelectedColumns}
          />
        )}
        {activeStep === 1 && (
          <div className="control-section" id="pivot-table-section" style={{ overflow: "initial" }}>
            <Grid sx={{ position: "relative", height: 750 }}>
              <PivotViewComponent
                id="PivotView"
                ref={(scope) => {
                  pivotObj = scope;
                }}
                dataSourceSettings={dataSetting}
                width={"100%"}
                height={"100%"}
                showFieldList={true}
                // exportAllPages={false}
                // maxNodeLimitInMemberEditor={50}
                cellTemplate={cellTemplate.bind(this)}
                // enginePopulated={afterPivotPopulate}
                showGroupingBar={true}
                allowGrouping={true}
                enableVirtualization={true}
                enableValueSorting={true}
                allowDeferLayoutUpdate={true}
                allowDrillThrough={true}
                enableFieldSearching={true} // Search field trong Field List
                gridSettings={{
                  columnWidth: 120,
                  allowSelection: true,
                  rowHeight: 36,
                  selectionSettings: {
                    mode: "Cell",
                    type: "Multiple",
                    cellSelectionMode: "Box",
                  },
                  // excelQueryCellInfo: excelQueryCellInfo.bind(this),
                }}
                // allowExcelExport={true}
                allowNumberFormatting={true}
                allowConditionalFormatting={true}
                // allowPdfExport={true}
                showToolbar={true}
                allowCalculatedField={true}
                displayOption={{ view: "Both" }}
                toolbar={toolbarOptions}
                chartSettings={{
                  title: "Top Universities Analysis",
                  load: chartOnLoad.bind(this),
                }}
                chartSeriesCreated={chartSeriesCreated.bind(this)}
              >
                <Inject
                  services={[
                    FieldList,
                    CalculatedField,
                    Toolbar,
                    PDFExport,
                    ExcelExport,
                    ConditionalFormatting,
                    NumberFormatting,
                    GroupingBar,
                    Grouping,
                    VirtualScroll,
                    DrillThrough,
                  ]}
                />
              </PivotViewComponent>
            </Grid>
          </div>
        )}
      </Grid>
      <Grid item xs={12} md={12} columnGap={2} sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <MButton isLoading={isLoadingContinue} onClick={handleContinue}>
            {vi.continue}
          </MButton>
        )}
        {activeStep === 1 && (
          <MButton variant="outlined" onClick={() => setActiveStep(activeStep - 1)}>
            {vi.back}
          </MButton>
        )}
      </Grid>
    </Grid>
  );
};

export default Pivot;
