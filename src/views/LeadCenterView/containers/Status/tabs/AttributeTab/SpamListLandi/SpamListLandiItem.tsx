import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "hooks/reduxHook";
import { toastSuccess } from "store/redux/toast/slice";
import { useContext } from "react";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";
import { fDateTime } from "utils/dateUtil";
import useAuth from "hooks/useAuth";
import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_ATTRIBUTE, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { phoneLeadApi } from "_apis_/lead.api";
import { MappingType } from "./SpamListLandiMapping";
import vi from "locales/vi.json";
import ModifiedAttributePopover from "components/Popovers/ModifiedAttributePopover";
import { isReadAndWriteRole } from "utils/roleUtils";
import SpamListLandiModal from "./SpamListLandiModal";

const SpamListItem = ({
  row,
  isShowModified,
  getData,
}: {
  row: MappingType;
  isShowModified?: boolean;
  getData: () => void
}) => {
  const dispatch = useAppDispatch();
  const context = useContext(PhoneLeadContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();

  const copyBoard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (row?.landingpage_url && e.detail === 3) {
      navigator.clipboard.writeText(row?.landingpage_url);
      dispatch(toastSuccess({ message: vi.copied }));
    }
  };
  const handleToggleModal = () => {
    setShowEditModal((prev) => !prev);
  };
  
  const updatelinkLandipage = async (itemData?: MappingType) => {
    setShowEditModal(false);
    if (itemData?.id) {
      const data = await phoneLeadApi.updatelinklandipage<{
        landingpage_url: string;
        product_name: string;
        tenant_id: string
      }>({
        id: itemData.id,
        form: {
          landingpage_url: itemData?.landingpage_url,
          product_name: itemData?.product_name?.toString(),
          tenant_id: itemData.tenant.id
        }
      });

      if (data.data) {
        getData();
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
          {showEditModal &&
            <SpamListLandiModal
              onSubmit={updatelinkLandipage}
              item={row}
              isShowModal={showEditModal}
              setShowModal={(open) => setShowEditModal(open)}
            />  
          }
          <Typography
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={copyBoard}
          >
            {row?.product_name}
          </Typography>
          <Typography
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row?.landingpage_url && (
              <a href={row?.landingpage_url} target="_blank" rel="noreferrer">
                {row?.landingpage_url}
              </a>
            )}
          </Typography>
          <Typography
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
              {row?.tenant.name}
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
              status={{ loading: false, error: false, type: null }}
              style={{ display: "flex", flexDirection: "row" }}
            />
          </div>
        )}
      </Stack>
    </>
  );
};

export default SpamListItem;
