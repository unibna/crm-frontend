import Grid from "@mui/material/Grid";
import vi from "locales/vi.json";
import { AttributeCollapseIncludeFormModal } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_ATTRIBUTE } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import {
  createPhoneLeadAttribute,
  deletePhoneLeadAttribute,
  updatePhoneLeadAttribute,
} from "store/redux/leads/attributes/actions";
import { leadStore } from "store/redux/leads/slice";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import AttributeItem from "./AttributeItem";
import DomainProductMapping from "./DomainProductCollapse/DomainProductMapping";
import VoipAttribute from "./VoipAttribute";
import { PhoneLeadAttributeType } from "_types_/PhoneLeadType";
import SpamListLandiMapping from "./SpamListLandi/SpamListLandiMapping";

const ATT_CARDS: string[] = [
  "bad_data_reason",
  "channel",
  "data_status",
  "fail_reason",
  "fanpage",
  "handle_reason",
  "product",
  "tag",
];
const AttributeTab = () => {
  const leadSlice = useAppSelector(leadStore);
  const { user } = useAuth();

  const handleCreateAction = async ({ name, type }: { type: string; name: string }) => {
    await createPhoneLeadAttribute({ type, name });
  };

  const handleDeleteAction = async (att: { id: number | string; name: string; type: string }) => {
    const { id, name, type } = att;

    await deletePhoneLeadAttribute({ type, name, id });
  };

  const handleEditAction = async (att: { type: string; name: string; id: number | string }) => {
    const { id, name, type } = att;
    await updatePhoneLeadAttribute({ type, name, id });
  };

  const handleActiveSwitch = async (att: {
    type: string;
    is_shown: boolean;
    id: number | string;
  }) => {
    const { id, is_shown, type } = att;

    await updatePhoneLeadAttribute({ type, id, is_shown });
  };

  const handleToogleEcommerceSwitch = async (att: {
    type: string;
    is_e_commerce: boolean;
    id: number | string;
  }) => {
    const { id, is_e_commerce, type } = att;

    await updatePhoneLeadAttribute({ type, id, is_e_commerce });
  };

  const attributeRole =
    user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS];

  return (
    <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      <Grid item xs={12} md={6}>
        <DomainProductMapping isShowModified />
        <VoipAttribute />
        <SpamListLandiMapping isShowModified />
      </Grid>
      <Grid xs={12} md={6} item>
        <Grid container>
          {map(ATT_CARDS, (att: keyof PhoneLeadAttributeType, idx) => {
            return (
              <Grid item xs={12} key={idx}>
                <AttributeCollapseIncludeFormModal
                  attributeItem={({ row }) => (
                    <AttributeItem
                      handleActiveSwitch={att !== "tag" ? handleActiveSwitch : undefined}
                      handleToogleEcommerceSwitch={
                        att === "channel" ? handleToogleEcommerceSwitch : undefined
                      }
                      row={row}
                      type={att}
                    />
                  )}
                  funcContentRender={() => [
                    {
                      type: TYPE_FORM_FIELD.TEXTFIELD,
                      name: att,
                      label: vi.attribute,
                      placeholder: vi.attribute,
                    },
                  ]}
                  isAdd={isMatchRoles(user?.is_superuser, attributeRole)}
                  isEdit={isReadAndWriteRole(user?.is_superuser, attributeRole)}
                  state={leadSlice}
                  formDefaultData={(row) => ({ [att]: row?.name || "" })}
                  key={idx}
                  handleCreateAction={handleCreateAction}
                  handleDeleteAction={handleDeleteAction}
                  handleEditAction={handleEditAction}
                  data={leadSlice.attributes[att]}
                  title={vi.lead_attributes[att]}
                  type={att}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AttributeTab;
