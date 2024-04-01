// Libraries
import { useEffect, useMemo } from "react";
import filter from "lodash/filter";

// Hooks
import usePopup from "hooks/usePopup";

// Context & Store
import { getAllAttributesSetting } from "selectors/attributes";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import {
  addNewDepartment,
  getListDepartment,
  removeDepartment,
  updateAttributesSetting,
  updateDepartment,
} from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import AttributeCollapse from "components/Collapses/CollapseAttribute";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants
import { titlePopupHandle } from "views/SettingsView/constants";
import { handleParams } from "utils/formatParamsUtil";
import { TYPE_FORM_FIELD } from "constants/index";

const Attributes = () => {
  const attributesSetting = useAppSelector((state) => getAllAttributesSetting(state.attributes));
  const dispatchStore = useAppDispatch();

  const { departments, fetched } = attributesSetting;
  const { setDataPopup, dataPopup, dataForm, setLoadingSubmit } = usePopup<{
    id?: string;
    name: string;
  }>();

  useEffect(() => {
    if (!fetched) {
      getListDepartment();
      dispatchStore(
        updateAttributesSetting({
          fetched: true,
        })
      );
    }
  }, [fetched]);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      submitPopup();
    }
  }, [dataForm]);

  const handleUpdateAttribute = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let title = type;
    let newContentRender = () => [
      {
        type: TYPE_FORM_FIELD.TEXTFIELD,
        name: "name",
        label: "Tên phòng ban",
        placeholder: "Nhập tên phòng ban",
      },
    ];
    let defaultData = defaultValue;
    let maxWidthForm: GridSizeType = "sm";
    let isDisabledSubmit = true;
    let isShowFooter = true;

    switch (type) {
      case titlePopupHandle.ADD_DEPARTMENT: {
        defaultData = {
          name: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên phòng ban").trim(),
          };
        };
        break;
      }
      case titlePopupHandle.EDIT_DEPARTMENT: {
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên phòng ban").trim(),
          };
        };
        defaultData = {
          name: defaultValue.label,
          id: defaultValue.value,
        };
        buttonTextPopup = "Cập nhật";
        break;
      }
    }
    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      isDisabledSubmit,
      defaultData,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const handleRemoveValueAll = (data: SelectOptionType[]) => {
    return filter(data, (item) => item.value !== "all");
  };

  const submitPopup: any = async () => {
    const params = handleParams({
      name: dataForm.name,
      id: dataForm.id,
    });

    const optional = {
      setLoading: setLoadingSubmit,
      onClosePopup: () =>
        setDataPopup({
          ...dataPopup,
          isOpenPopup: false,
        }),
    };

    if (params.id) {
      await updateDepartment(params, departments, optional);
    } else {
      await addNewDepartment(params, departments, optional);
    }
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: "Phòng ban",
        dataItem: handleRemoveValueAll(departments),
        titlePopupAdd: titlePopupHandle.ADD_DEPARTMENT,
        titlePopupEdit: titlePopupHandle.EDIT_DEPARTMENT,
      },
    ];
  }, [departments]);

  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      {dataRender.map((item: any, index: number) => {
        return (
          <Grid key={index} xs={12} md={6} item>
            <AttributeCollapse
              title={item.title}
              dataRenderAttribute={item.dataItem}
              handleAdd={
                item.titlePopupAdd ? () => handleUpdateAttribute(item.titlePopupAdd) : undefined
              }
              handleEdit={
                item.titlePopupEdit
                  ? (objValue: SelectOptionType) =>
                      handleUpdateAttribute(item.titlePopupEdit, objValue)
                  : undefined
              }
              handleDelete={(item) => removeDepartment({ id: `${item.value}` }, departments)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Attributes;
