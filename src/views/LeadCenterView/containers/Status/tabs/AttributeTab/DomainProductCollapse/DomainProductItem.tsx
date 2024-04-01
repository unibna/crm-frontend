import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess } from "store/redux/toast/slice";
import { useContext } from "react";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";
import DomainProductModal from "./DomainProductModal";
import { fDateTime } from "utils/dateUtil";
import useAuth from "hooks/useAuth";
import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_ATTRIBUTE, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { phoneLeadApi } from "_apis_/lead.api";
import { MappingType } from "./DomainProductMapping";
import vi from "locales/vi.json";
import ModifiedAttributePopover from "components/Popovers/ModifiedAttributePopover";
import { isReadAndWriteRole } from "utils/roleUtils";

const DomainProductItem = ({
  row,
  isShowModified,
}: {
  row: MappingType;
  isShowModified?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const context = useContext(PhoneLeadContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();

  const copyBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (row?.landing_page_url && e.detail === 3) {
      navigator.clipboard.writeText(row?.landing_page_url);
      dispatch(toastSuccess({ message: vi.copied }));
    }
  };

  const handleToggleModal = () => {
    setShowEditModal((prev) => !prev);
  };

  const updateDomainProduct = async (itemData?: MappingType) => {
    setShowEditModal(false);
    if (itemData?.id) {
      const data = await phoneLeadApi.updatePhoneLead<{
        landing_page_url: string;
        product: string;
      }>({
        id: itemData.id,
        form: {
          landing_page_url: itemData?.landing_page_url,
          product: itemData?.product?.toString(),
        },
        endpoint: "product-mapping/",
      });
      if (data.data) {
        context?.getDomainProduct();
      }
    }
  };

  const deleteDomainProduct = async (itemData?: MappingType) => {
    if (itemData?.id) {
      const data = await phoneLeadApi.deletePhoneLead({
        endpoint: `product-mapping/${itemData.id}/`,
      });
      if (data.data) {
        context?.getDomainProduct();
      }
    }
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        key={row?.toString()}
        style={{ paddingBottom: 0, marginTop: 8 }}
      >
        <div style={{ marginLeft: 20, width: "100%" }}>
          <DomainProductModal
            onSubmit={updateDomainProduct}
            item={row}
            isShowModal={showEditModal}
            setShowModal={(open) => setShowEditModal(open)}
          />
          <Typography
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={copyBoard}
          >
            {row?.product?.name}
          </Typography>
          <Typography
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row?.landing_page_url && (
              <a href={row?.landing_page_url} target="_blank" rel="noreferrer">
                {row?.landing_page_url}
              </a>
            )}
          </Typography>
          {isShowModified && (
            <Typography sx={{ color: "grey.500", fontSize: 13, mb: 1 }}>
              {fDateTime(row.modified)}
            </Typography>
          )}
        </div>
        {isReadAndWriteRole(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS]
        ) && (
          <div style={{ width: 80 }}>
            <ModifiedAttributePopover
              handleEdit={handleToggleModal}
              handleDelete={() => deleteDomainProduct(row)}
              status={{ loading: false, error: false, type: null }}
              style={{ display: "flex", flexDirection: "row" }}
            />
          </div>
        )}
      </Stack>
    </>
  );
};

export default DomainProductItem;
