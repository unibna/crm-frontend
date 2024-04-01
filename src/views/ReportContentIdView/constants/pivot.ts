import { IDataOptions } from "@syncfusion/ej2-react-pivotview";

// Pivot
export const dataSourceSettings: IDataOptions = {
  enableSorting: true,
  rows: [{ name: "ad_name", caption: "ad_name", expandAll: true, allowDragAndDrop: false }],
  // formatSettings: [
  //   { name: "international_students", format: "N0" },
  //   { name: "faculty_count", format: "N0" },
  // ],
  dataSource: [],
  expandAll: false,
  // values: [{ name: "views", caption: "Views" }],
  // filters: [{ name: "type", caption: "University Type" }],
  // filterSettings: [{ name: "region", type: "Exclude", items: ["Africa", "Latin America"] }],
  // fieldMapping: [
  //   { name: "rank_display", dataType: "number" },
  //   { name: "country", caption: "Country" },
  //   { name: "city", caption: "City" },
  //   { name: "region", caption: "Region" },
  //   { name: "research_output", caption: "Research Output" },
  //   { name: "student_faculty_ratio", caption: "Student faculty ratio" },
  // ],
  // groupSettings: [{ name: "rank_display", type: "Number", rangeInterval: 100 }],
  // conditionalFormatSettings: [
  //   {
  //     measure: "international_students",
  //     value1: 1,
  //     value2: 5000,
  //     conditions: "Between",
  //     style: {
  //       backgroundColor: "#E10000",
  //       color: "white",
  //       fontFamily: "Tahoma",
  //       fontSize: "12px",
  //     },
  //     applyGrandTotals: false,
  //   },
  //   {
  //     measure: "international_students",
  //     value1: 50000,
  //     conditions: "GreaterThan",
  //     style: {
  //       backgroundColor: "#0C860C",
  //       color: "white",
  //       fontFamily: "Tahoma",
  //       fontSize: "12px",
  //     },
  //     applyGrandTotals: false,
  //   },
  //   {
  //     measure: "faculty_count",
  //     value1: 1,
  //     value2: 1000,
  //     conditions: "Between",
  //     style: {
  //       backgroundColor: "#E10000",
  //       color: "white",
  //       fontFamily: "Tahoma",
  //       fontSize: "12px",
  //     },
  //     applyGrandTotals: false,
  //   },
  //   {
  //     measure: "faculty_count",
  //     value1: 10000,
  //     conditions: "GreaterThan",
  //     style: {
  //       backgroundColor: "#0C860C",
  //       color: "white",
  //       fontFamily: "Tahoma",
  //       fontSize: "12px",
  //     },
  //     applyGrandTotals: false,
  //   },
  // ],
  showHeaderWhenEmpty: true,
  emptyCellsTextContent: "-",
  // excludeFields: ["link", "logo"],
};

export const toolbarOptions: any = [
  // "New",
  // "Save",
  // "SaveAs",
  // "Rename",
  // "Remove",
  // "Load",
  "Grid",
  "Chart",
  // "Export",
  "SubTotal",
  "GrandTotal",
  "Formatting",
  "FieldList",
];
