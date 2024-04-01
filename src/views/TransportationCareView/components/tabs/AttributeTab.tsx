// Libraries
import map from "lodash/map";
import { useMemo, useState } from "react";

// MUI
import Grid from "@mui/material/Grid";

// Hooks
import { useAppSelector } from "hooks/reduxHook";

// Utils & Constants
import { titlePopupHandle } from "views/TransportationCareView/constant";

// Components
import AttributeCollapse from "components/Collapses/CollapseAttribute";
import FormPopup from "components/Popups/FormPopup";

// Services
import {
  addNewTransporationCareAction,
  addNewTransporationCareReason,
  removeTransporationCareAction,
  removeTransporationCareReason,
  updateTransporationCareAction,
  updateTransporationCareReason,
} from "store/redux/attributes/slice";

// Selectors
import { getAllAttributesTransporationCare } from "selectors/attributes";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { TransportationCareTaskType } from "_types_/TransportationType";

// Constants
import vi from "locales/vi.json";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { TYPE_FORM_FIELD } from "constants/index";

const ACTION = "ACTION";
const REASON = "REASON";

const AttributeTab = () => {
  const attributesTransporationCare = useAppSelector((state) =>
    getAllAttributesTransporationCare(state.attributes)
  );

  const {
    lateReason,
    lateAction,
    waitReturnReason,
    waitReturnAction,
    returningReason,
    returningAction,
    returnedReason,
    returnedAction,
  } = attributesTransporationCare;

  const [dataPopup, setDataPopup] = useState<any>({
    isOpen: false,
    title: "",
    funcContentSchema: (yup: any) => {
      return {};
    },
    funcContentRender: () => [],
    buttonText: "",
    defaultData: {},
    handleClose: () => {},
    handleSubmitPopup: () => {},
  });

  const [loading, setLoading] = useState(false);

  const onAddAttribute =
    (type: TransportationCareTaskType, typeAttribute: string) =>
    async (form: { label: string }) => {
      const isAction = typeAttribute === ACTION;
      const payload = { label: form.label, type };
      const attKey: keyof typeof attributesTransporationCare = isAction
        ? `${type === TransportationCareTaskType.WAIT_RETURN ? "waitReturn" : type}Action`
        : `${type === TransportationCareTaskType.WAIT_RETURN ? "waitReturn" : type}Reason`;
      const actions = attributesTransporationCare[attKey];
      let funcAdd = isAction ? addNewTransporationCareAction : addNewTransporationCareReason;
      funcAdd(payload, actions, {
        setLoading,
        onClosePopup: handleClosePopup,
      });
    };

  const onEditAttribute =
    (type: TransportationCareTaskType, typeAttribute: string) =>
    async (form: { label: string; id: number }) => {
      const isAction = typeAttribute === ACTION;
      const payload = { label: form.label, type, id: form.id };
      const attKey: keyof typeof attributesTransporationCare = isAction
        ? `${type === TransportationCareTaskType.WAIT_RETURN ? "waitReturn" : type}Action`
        : `${type === TransportationCareTaskType.WAIT_RETURN ? "waitReturn" : type}Reason`;
      const actions = attributesTransporationCare[attKey];
      let funcEdit = isAction ? updateTransporationCareAction : updateTransporationCareReason;
      funcEdit(payload, actions, {
        setLoading,
        onClosePopup: handleClosePopup,
      });
    };

  const handleClosePopup = () => {
    setDataPopup({ ...dataPopup, isOpen: false });
  };

  const handleUpdateAttribute = (
    titlePopup: string,
    type: TransportationCareTaskType,
    defaultValue?: any
  ) => {
    let newDataPopup = {};
    switch (titlePopup) {
      case titlePopupHandle.ADD_LATE_REASON:
      case titlePopupHandle.ADD_WAIT_RETURN_REASON:
      case titlePopupHandle.ADD_RETURNING_REASON:
      case titlePopupHandle.ADD_RETURNED_REASON:
        {
          newDataPopup = {
            isOpen: true,
            title: titlePopup,
            funcContentSchema: (yup: any) => {
              return {
                label: yup.string().required(VALIDATION_MESSAGE.REQUIRE_REASON),
              };
            },
            funcContentRender: () => [
              {
                type: TYPE_FORM_FIELD.TEXTFIELD,
                name: "label",
                label: vi.reason,
                placeholder: vi.reason,
              },
            ],
            buttonText: "Thêm",
            defaultData: {
              label: "",
            },
            handleClose: handleClosePopup,
            handleSubmitPopup: onAddAttribute(type, REASON),
          };
        }
        break;
      case titlePopupHandle.ADD_LATE_ACTION:
      case titlePopupHandle.ADD_WAIT_RETURN_ACTION:
      case titlePopupHandle.ADD_RETURNING_ACTION:
      case titlePopupHandle.ADD_RETURNED_ACTION:
        {
          newDataPopup = {
            isOpen: true,
            title: titlePopup,
            funcContentSchema: (yup: any) => {
              return {
                label: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ACTION),
              };
            },
            funcContentRender: () => [
              {
                type: TYPE_FORM_FIELD.TEXTFIELD,
                name: "label",
                label: vi.action,
                placeholder: vi.action,
              },
            ],
            buttonText: "Thêm",
            defaultData: {
              label: "",
            },
            handleClose: handleClosePopup,
            handleSubmitPopup: onAddAttribute(type, ACTION),
          };
        }
        break;
      case titlePopupHandle.EDIT_LATE_REASON:
      case titlePopupHandle.EDIT_WAIT_RETURN_REASON:
      case titlePopupHandle.EDIT_RETURNING_REASON:
      case titlePopupHandle.EDIT_RETURNED_REASON:
        {
          newDataPopup = {
            isOpen: true,
            title: titlePopup,
            funcContentSchema: (yup: any) => {
              return {
                label: yup.string().required(VALIDATION_MESSAGE.REQUIRE_REASON),
              };
            },
            funcContentRender: () => [
              {
                type: TYPE_FORM_FIELD.TEXTFIELD,
                name: "label",
                label: vi.reason,
                placeholder: vi.reason,
              },
            ],
            buttonText: "OK",
            defaultData: {
              label: defaultValue.label,
              id: defaultValue.id,
            },
            handleClose: handleClosePopup,
            handleSubmitPopup: onEditAttribute(type, REASON),
          };
        }
        break;
      case titlePopupHandle.EDIT_LATE_ACTION:
      case titlePopupHandle.EDIT_WAIT_RETURN_ACTION:
      case titlePopupHandle.EDIT_RETURNING_ACTION:
      case titlePopupHandle.EDIT_RETURNED_ACTION:
        {
          newDataPopup = {
            isOpen: true,
            title: titlePopup,
            funcContentSchema: (yup: any) => {
              return {
                label: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ACTION),
              };
            },
            funcContentRender: () => [
              {
                type: TYPE_FORM_FIELD.TEXTFIELD,
                name: "label",
                label: vi.action,
                placeholder: vi.action,
              },
            ],
            buttonText: "OK",
            defaultData: {
              label: defaultValue.label,
              id: defaultValue.id,
            },
            handleClose: handleClosePopup,
            handleSubmitPopup: onEditAttribute(type, ACTION),
          };
        }
        break;
      default:
        break;
    }
    setDataPopup(newDataPopup);
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: vi.late_reason,
        dataItem: lateReason,
        type: TransportationCareTaskType.LATE,
        typeHandle: REASON,
        titlePopupAdd: titlePopupHandle.ADD_LATE_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_LATE_REASON,
      },
      {
        title: vi.late_action,
        dataItem: lateAction,
        typeHandle: ACTION,
        type: TransportationCareTaskType.LATE,
        titlePopupAdd: titlePopupHandle.ADD_LATE_ACTION,
        titlePopupEdit: titlePopupHandle.EDIT_LATE_ACTION,
      },
      {
        title: vi.wait_return_reason,
        dataItem: waitReturnReason,
        typeHandle: REASON,
        type: TransportationCareTaskType.WAIT_RETURN,
        titlePopupAdd: titlePopupHandle.ADD_WAIT_RETURN_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_WAIT_RETURN_REASON,
      },
      {
        title: vi.wait_return_action,
        dataItem: waitReturnAction,
        typeHandle: ACTION,
        type: TransportationCareTaskType.WAIT_RETURN,
        titlePopupAdd: titlePopupHandle.ADD_WAIT_RETURN_ACTION,
        titlePopupEdit: titlePopupHandle.EDIT_WAIT_RETURN_ACTION,
      },
      {
        title: vi.returning_reason,
        dataItem: returningReason,
        typeHandle: REASON,
        type: TransportationCareTaskType.RETURNING,
        titlePopupAdd: titlePopupHandle.ADD_RETURNING_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_RETURNING_REASON,
      },
      {
        title: vi.returning_action,
        dataItem: returningAction,
        typeHandle: ACTION,
        type: TransportationCareTaskType.RETURNING,
        titlePopupAdd: titlePopupHandle.ADD_RETURNING_ACTION,
        titlePopupEdit: titlePopupHandle.EDIT_RETURNING_ACTION,
      },
      {
        title: vi.returned_reason,
        dataItem: returnedReason,
        typeHandle: REASON,
        type: TransportationCareTaskType.RETURNED,
        titlePopupAdd: titlePopupHandle.ADD_RETURNING_REASON,
        titlePopupEdit: titlePopupHandle.EDIT_RETURNING_REASON,
      },
      {
        title: vi.returned_action,
        dataItem: returnedAction,
        typeHandle: ACTION,
        type: TransportationCareTaskType.RETURNED,
        titlePopupAdd: titlePopupHandle.ADD_RETURNED_ACTION,
        titlePopupEdit: titlePopupHandle.EDIT_RETURNED_ACTION,
      },
    ];
  }, [attributesTransporationCare]);

  return (
    <>
      <FormPopup {...dataPopup} isLoadingButton={loading} />
      <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
        {map(dataRender, (item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <AttributeCollapse
              title={item.title}
              dataRenderAttribute={item.dataItem}
              handleAdd={() => handleUpdateAttribute(item.titlePopupAdd, item.type)}
              handleEdit={(objValue: SelectOptionType) =>
                handleUpdateAttribute(item.titlePopupEdit, item.type, objValue)
              }
              handleDelete={(objValue: SelectOptionType) =>
                item.typeHandle === ACTION
                  ? removeTransporationCareAction(
                      { type: item.type, id: objValue.id },
                      item.dataItem,
                      { setLoading }
                    )
                  : removeTransporationCareReason(
                      { type: item.type, id: objValue.id },
                      item.dataItem,
                      { setLoading }
                    )
              }
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AttributeTab;
