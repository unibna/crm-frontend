import { useState } from "react";
import Stack from "@mui/material/Stack";
import FormPopup, { FormValuesProps, PropsContentRender } from "components/Popups/FormPopup";
import ModifiedAttributePopover from "components/Popovers/ModifiedAttributePopover";
import { UseFormReturn } from "react-hook-form";
import * as Yup from "yup";

export interface AttributeProps {
  isEdit: boolean;
  row: { id: number | string; name: string; is_show?: boolean; is_e_commerce?: boolean };
  title: string;
  index?: number;
  handleDeleteAction: (row: {
    id: number | string;
    name: string;
    type: string;
    index?: number;
  }) => Promise<void>;
  handleEditAction: (row: {
    type: string;
    name: string;
    id: number | string;
    index: number;
  }) => Promise<void>;
  type: string;
  state: { loading: boolean; error: boolean; type: string | null };
  isDelete?: boolean;
  funcContentRender: (
    methods: UseFormReturn<FormValuesProps, object>,
    optional: any
  ) => JSX.Element | PropsContentRender[];
  formSchema?: (yup: typeof Yup) => any;
  formDefaultData?: (row?: any) => any;
  attributeItem: (row: { row: any }) => JSX.Element;
}

export const AttributeItem = ({
  isEdit,
  formDefaultData,
  row,
  handleDeleteAction,
  title,
  handleEditAction,
  state,
  index = -1,
  type,
  isDelete = true,
  formSchema,
  funcContentRender = () => [],
  attributeItem,
}: AttributeProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmitAttribute = async (form: { [key: string]: string }) => {
    await handleEditAction({ type, name: form[type], id: row.id, index });
    if (!state.error) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <FormPopup
        transition
        isOpen={isOpen}
        isLoadingButton={state.loading}
        title={title}
        funcContentSchema={formSchema}
        funcContentRender={funcContentRender}
        buttonText={"Cập nhật"}
        defaultData={formDefaultData ? formDefaultData(row) : undefined}
        handleClose={() => setIsOpen(false)}
        handleSubmitPopup={onSubmitAttribute}
      />

      <Stack direction="row" alignItems="center" display="flex" flex={1} p={1} pl={1}>
        <Stack display="flex" flex={1}>
          {attributeItem({ row: { index, ...row } })}
        </Stack>
        {isEdit && (
          <Stack style={iconColumnStyle} direction="row" alignItems={"center"}>
            <ModifiedAttributePopover
              handleDelete={
                isDelete
                  ? async () =>
                      await handleDeleteAction({ id: row.id, name: row.name, type, index })
                  : undefined
              }
              handleEdit={() => setIsOpen(true)}
              attributeLabel={row.name}
              status={state}
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

const iconColumnStyle = { minWidth: 80 };
