// Libraries
import { useState, useMemo, useEffect } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import forEach from "lodash/forEach";
import upperFirst from "lodash/upperFirst";
import produce from "immer";

// @Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";

// Components
import DDataGrid from "components/DDataGrid";

// Constants & Utils
import { UseFormReturn } from "react-hook-form";
import { FormValuesProps } from "components/Popups/FormPopup";
import { columnsShowTableExcel, columnEditExtensionsTableExcel } from "views/ZaloView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -------------------------------------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {}

const TableDataExcel = (props: Props) => {
  const { watch, setValue } = props;
  const { dataExcel, objKeyPhone, templateData, dataTable } = watch();

  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnsShowTableExcel.columnWidths
  );
  const [columnOrders, setColumnOrders] = useState<string[]>([]);

  useEffect(() => {
    setDataTable();
  }, []);

  const setDataTable = () => {
    const newDataTable = map(dataExcel, (item, index) => {
      const newObjValue = Object.keys(templateData).length
        ? Object.keys(templateData).reduce((prevObj, current) => {
            return {
              ...prevObj,
              [current]: item[getObjectPropSafely(() => templateData[current].value)],
            };
          }, {})
        : {};

      return {
        stt: index + 1,
        phone: item[objKeyPhone.value],
        ...newObjValue,
      };
    });

    setValue("dataTable", newDataTable);
  };

  const convertLabel = (value: string) => {
    return upperFirst(value.replace("_", " "));
  };

  const handleData = (objData: FacebookType, data: FacebookType[]) => {
    return produce(data, (draft: any) => {
      const index = Object.keys(objData)[0] as keyof FacebookType;
      if (objData[index]) {
        draft[index] = {
          ...draft[index],
          ...objData[index],
        };
      }
    });
  };

  const handleEditCell = async ({ changed }: any) => {
    const changeRows = handleData(changed, dataTable);
    const index = Object.keys(changed)[0];

    if (changed[index]) {
      setValue("dataTable", changeRows);
    }
  };

  const columnShow = useMemo(() => {
    let newColumnWidths: TableColumnWidthInfo[] = [...columnsShowTableExcel.columnWidths];
    let newColumnShowHeader: ColumnTypeDefault<FacebookType>[] = [
      ...columnsShowTableExcel.columnsShowHeader,
    ];

    forEach(Object.keys(templateData), (item: any) => {
      newColumnWidths = [...newColumnWidths, { width: 150, columnName: item }];
      newColumnShowHeader = [
        ...newColumnShowHeader,
        { title: convertLabel(item), name: item, isShow: true },
      ];
    });

    setColumnWidths(newColumnWidths);

    return {
      columnWidths: newColumnWidths,
      columnsShowHeader: newColumnShowHeader,
    };
  }, []);

  return (
    <DDataGrid
      data={dataTable}
      columns={columnShow.columnsShowHeader}
      columnWidths={columnWidths}
      isShowListToolbar={false}
      columnEditExtensions={columnEditExtensionsTableExcel}
      columnOrders={columnOrders}
      arrDateTime={[]}
      arrColumnPhone={[]}
      arrAttachUnitVnd={[]}
      arrStatus={[]}
      handleEditCell={handleEditCell}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={setColumnOrders}
    />
  );
};

export default TableDataExcel;
