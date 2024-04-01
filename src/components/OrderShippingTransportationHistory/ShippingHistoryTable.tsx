import { deliveryApi } from "_apis_/delivery.api";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { Span } from "components/Labels";
import find from "lodash/find";
import { useState } from "react";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { columnShowHistory, optionStatusShipping } from "views/ShippingView/constants";

interface Props {
  isFullTable?: boolean;
  row: any;
}

const ShippingHistoryTable = ({ isFullTable, row }: Props) => {
  const [params, setParams] = useState<any>({ ordering: "-history_date", page: 1, limit: 200 });

  const getOptionShipping = (value: string) => {
    return find(optionStatusShipping, (current) => current.value === value);
  };

  const handleDataApi = (item: any) => {
    return {
      is_cod_transferred: {
        content: (
          <Span color={item.is_cod_transferred ? "success" : "error"} sx={{ ml: 1 }}>
            {item.is_cod_transferred ? "Đã chuyển COD" : "Chờ chuyển COD"}
          </Span>
        ),
      },
      carrier_status: {
        content: (
          <>
            {item.carrier_status ? (
              <Span color={getOptionShipping(item.carrier_status)?.color}>
                {getOptionShipping(item.carrier_status)?.label}
              </Span>
            ) : null}
          </>
        ),
      },
      carrier_status_manual: {
        content: (
          <>
            {item.carrier_status_manual ? (
              <Span color={getOptionShipping(item.carrier_status_manual)?.color}>
                {getOptionShipping(item.carrier_status_manual)?.label}
              </Span>
            ) : null}
          </>
        ),
      },
      carrier_status_system: {
        content: (
          <>
            {item.carrier_status_system ? (
              <Span color={getOptionShipping(item.carrier_status_system)?.color}>
                {getOptionShipping(item.carrier_status_system)?.label}
              </Span>
            ) : null}
          </>
        ),
      },
      modified_by: getObjectPropSafely(() => item.modified_by.name),
      created_by: getObjectPropSafely(() => item.created_by.name),
    };
  };

  return (
    <TableDetail
      dataRow={row}
      heightProps={500}
      isFullTable={isFullTable}
      host={deliveryApi}
      params={params}
      columnShowDetail={columnShowHistory}
      endpoint={`shipment/${row?.id}/history/`}
      contentOptional={{
        arrColumnOptional: [
          "is_cod_transferred",
          "carrier_status",
          "carrier_status_manual",
          "carrier_status_system",
        ],
      }}
      arrDateTime={["history_date", "cod_transfer_date"]}
      arrDate={["finish_date"]}
      arrColumnHistory={["history_type"]}
      handleDataApi={handleDataApi}
      hidePaging
    />
  );
};

export default ShippingHistoryTable;
