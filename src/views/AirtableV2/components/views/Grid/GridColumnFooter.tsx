import { AirTableColumn, AirTableColumnTypes } from "_types_/SkyTableType";
import { AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT } from "views/AirtableV2/constants";
import FooterSelect from "./FooterSelect";

function GridColumnFooter({ column, dataFooter }: { column: AirTableColumn; dataFooter: any }) {
  const arr = [
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.PERCENT,
  ];
  if (arr.includes(column.type)) {
    return (
      <FooterSelect
        data={dataFooter}
        formatFunc={AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.renderFunc}
      />
    );
  }
  return null;
}

export default GridColumnFooter;
