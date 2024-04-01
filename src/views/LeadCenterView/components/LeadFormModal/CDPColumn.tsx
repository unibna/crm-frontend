//component
import { memo } from "react";
import CustomerDetail from "views/CDPView/components/CustomerDetail";

export const CDPColumn = memo(({ phone }: { phone?: string }) => {
  return (
    <CustomerDetail
      customerDefault={{ phone: phone || "", full_name: "" }}
      isMutationNote
      isMutationCustomer
      overviewLayoutColumns={{
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 1,
      }}
    />
  );
});
