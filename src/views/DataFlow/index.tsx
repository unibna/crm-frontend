// Libraries
import { FunctionComponent, useContext, useEffect } from "react";
import { findIndex } from "lodash";
import omit from "lodash/omit";
import produce from "immer";
import { Outlet } from "react-router-dom";

// Services
import { windflowApi } from "_apis_/windflow.api";

// Hooks
import usePopup from "hooks/usePopup";
import { DataFlowProvider, DataFlowContext } from "views/DataFlow/context";

// Components
import { Page } from "components/Page";

// Types
import { NodeFlowType, FlowType } from "_types_/DataFlowType";

// Constants & Utils
import { ActionType } from "views/DataFlow/constants";
import { handleParams } from "utils/formatParamsUtil";
import { statusNotification } from "constants/index";

// ----------------------------------------------------------

const DataFlow: FunctionComponent = () => {
  const { dataPopup, dataForm, closePopup, setLoadingSubmit, setNotifications } =
    usePopup<FlowType>();
  const { state: store, updateFlow } = useContext(DataFlowContext);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const handleSubmitPopup = async (form: Partial<any>) => {
    setLoadingSubmit(true);

    switch (dataPopup.type) {
      case ActionType.CREATE_FLOW:
      case ActionType.EDIT_FLOW: {
        const params = handleParams({
          name: form.name,
          description: form.description,
          id: form.id,
          start_date: form.start_date ? new Date(form.start_date).toISOString() : "",
          end_date: form.end_date ? new Date(form.end_date).toISOString() : "",
          schedule: form.schedule,
          static_data: form.static_data,
        });

        let result: any;

        if (params.id) {
          result = await windflowApi.update({ ...params }, "workflows/");
        } else {
          result = await windflowApi.create({ ...params }, "workflows");
        }

        if (result && result.data) {
          setNotifications({
            message: "Cập nhật thành công",
            variant: statusNotification.SUCCESS,
          });

          closePopup();
        }
        break;
      }
      case ActionType.EDIT_NODE: {
        const index = findIndex(store?.flowSelected?.nodes, (item) => item.id === form.id);

        updateFlow({
          ...store.flowSelected,
          nodes: produce(store?.flowSelected?.nodes, (draft: NodeFlowType[]) => {
            draft[index] = {
              ...draft[index],
              data: {
                ...draft[index].data,
                ...omit(form, ["id", "type"]),
              },
            };
          }),
        });

        closePopup();
      }
    }

    setLoadingSubmit(false);
  };

  return (
    <Page title="Data Flow" sx={{ p: 3 }}>
      <Outlet />
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <DataFlowProvider>
      <DataFlow {...props} />
    </DataFlowProvider>
  );
};

export default Components;
