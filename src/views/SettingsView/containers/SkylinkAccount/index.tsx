// Libraries
import omit from "lodash/omit";
import pick from "lodash/pick";
import { useContext, useEffect, useMemo, useState } from "react";

// Context
import { getAllAttributesSetting } from "selectors/attributes";
import { getListDepartment, updateAttributesSetting } from "store/redux/attributes/slice";
import { rolesStore } from "store/redux/roles/slice";
import { createUserAction, updateUserAction } from "store/redux/users/action";
import { userStore } from "store/redux/users/slice";
import { SettingContext } from "views/SettingsView/context";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import usePopup from "hooks/usePopup";

// Services
import { userApi } from "_apis_/user.api";

// Components
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import TableDetail from "components/DataGrid/components/TableDetail";
import PopupSkylinkAccount from "views/SettingsView/components/PopupSkylinkAccount";

// Types
import { SkylinkAccountType } from "_types_/AccountType";
import { FacebookType } from "_types_/FacebookType";
import { GridSizeType } from "_types_/GridLayoutType";
import { SortType } from "_types_/SortType";
import { UserType } from "_types_/UserType";

// Constants
import vi from "locales/vi.json";
import { PHONE_REGEX } from "constants/index";
import { STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { handleParams, handleParamsApi } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { compareStringSearch } from "utils/helpers";
import {
  TitlePopupHandle,
  TypeHandle,
  arrColumnShowInfo,
  columnShowUserHistory,
  contentRenderDefault,
  mapLabels,
  optionActive,
  propsTableDefault,
} from "views/SettingsView/constants";

interface DataFormType extends UserType {
  imageApi: string;
  isChangePassword?: boolean;
}

const Account = () => {
  const theme = useTheme();
  const dispatchStoreRedux = useAppDispatch();
  const userSlice = useAppSelector(userStore);
  const { optionRole } = useAppSelector(rolesStore);
  const { departments, fetched } = useAppSelector((state) =>
    getAllAttributesSetting(state.attributes)
  );
  const { setDataPopup, closePopup, dataPopup, dataForm } = usePopup<DataFormType>();
  const { state: store, updateCell, resizeColumn, orderColumn } = useContext(SettingContext);

  // State
  const [data, setData] = useState<SkylinkAccountType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 500, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [name, setName] = useState("");

  const { [STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]: columns } = store;

  useEffect(() => {
    if (!fetched) {
      getListDepartment();
      dispatchStoreRedux(
        updateAttributesSetting({
          fetched: true,
        })
      );
    }
  }, [fetched]);

  useEffect(() => {
    loadDataTable();
  }, [params, userSlice.users]);

  useEffect(() => {
    if (Object.keys(dataForm).length) {
      submitForm();
    }
  }, [dataForm]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
      },
      ["group_permission", "is_active", "department"]
    );

    getListSkylinkAccount(objParams);
  };

  const getListSkylinkAccount = async (params: any) => {
    if (params) {
      setLoading(true);
      const result: any = await userApi.getAllUser({ params });

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            operation: {
              isShowEdit: true,
            },
            role: getObjectPropSafely(() => item.group_permission?.name),
            thumb_img_avatar_account: getObjectPropSafely(() => item.image.url),
            // department: departments.find((department) => department.value === item.department)
            //   ?.label,
          };
        });

        setData(newData);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };

  const onToggleSwitch = async (isActive: boolean, id: string, columnName: string) => {
    const objData = data.find((item: SkylinkAccountType) => item.id === id);

    dispatchStoreRedux(
      updateUserAction({
        id,
        [columnName]: isActive,
        group_permission: {
          id: objData?.group_permission?.id,
        },
      })
    );
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleFilter = (paramsProps: any) => {
    if (Object.keys(paramsProps)[0] === "name") {
      setName(paramsProps.name);
    } else {
      setParams({
        ...params,
        ...paramsProps,
      });
    }
  };

  const submitForm = async () => {
    setDataPopup({
      ...dataPopup,
      isLoadingButton: true,
    });

    switch (dataPopup.type) {
      case TypeHandle.CREATE_ACCOUNT_SKYLINK: {
        const objData: any = {
          ...dataForm,
          image: dataForm.imageApi,
          group_permission: {
            id: dataForm.role,
          },
          department: dataForm.department,
        };

        const newObjData = handleParams(objData);

        delete newObjData?.role;
        delete newObjData?.imageApi;

        dispatchStoreRedux(createUserAction(newObjData));
        closePopup();

        break;
      }
      case TypeHandle.EDIT_ACCOUNT_SKYLINK: {
        const objData: any = {
          ...dataForm,
          password: dataForm.isChangePassword ? dataForm.password : "",
          image:
            dataForm.imageApi !== getObjectPropSafely(() => dataPopup.defaultData?.imageApi)
              ? dataForm.imageApi
              : "",
          group_permission: {
            id: dataForm.role,
          },
          id: dataForm.id,
          department: dataForm.department,
        };

        const newObjData = handleParams(objData);

        delete newObjData.role;
        delete newObjData?.imageApi;

        dispatchStoreRedux(updateUserAction(newObjData));
        closePopup();
      }
    }
  };

  const openPopup = (type: string, optional?: any) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Thêm";
    let newContentRender: any = () => contentRenderDefault[type];
    let defaultData = {};
    let title = type;
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "md";

    switch (type) {
      case TitlePopupHandle.CREATE_ACCOUNT_SKYLINK: {
        typeProduct = TypeHandle.CREATE_ACCOUNT_SKYLINK;
        defaultData = {
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "",
          image: "",
          imageApi: "",
          department: "",
        };

        newContentRender = (methods: any) => {
          return <PopupSkylinkAccount {...methods} />;
        };

        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên").trim(),
            email: yup
              .string()
              .trim()
              .email("Vui lòng nhập đúng định dạng email")
              .required("Vui lòng nhập email"),
            phone: yup
              .string()
              .trim()
              //eslint-disable-next-line
              .matches(PHONE_REGEX, {
                message: "Vui lòng nhập đúng số điện thoại",
                excludeEmptyString: true,
              }),
            password: yup
              .string()
              .trim()
              .required("Vui lòng nhập mật khẩu")
              .min(6, "Vui lòng nhập nhập nhiều hơn 6 ký tự")
              .max(32, "Vui lòng nhập ít hơn 32 ký tự"),
            role: yup.string().required("Vui lòng chọn quyền"),
            image: yup.mixed(),
            // .mixed()
            // .test(
            //   "required",
            //   "Vui lòng chọn ảnh đại diện",
            //   (value: any) => value !== ""
            // ),
            imageApi: yup.mixed(),
            department: yup.string().required("Vui lòng chọn phòng ban"),
          };
        };

        break;
      }
      case TitlePopupHandle.EDIT_ACCOUNT_SKYLINK: {
        typeProduct = TypeHandle.EDIT_ACCOUNT_SKYLINK;
        defaultData = {
          name: optional.name,
          phone: optional.phone || "",
          password: "",
          id: optional.id,
          role: getObjectPropSafely(() => optional.group_permission?.id) || "",
          image: {
            id: getObjectPropSafely(() => optional.image.id),
            url: getObjectPropSafely(() => optional.image.url),
          },
          imageApi: getObjectPropSafely(() => optional.image.id),
          isChangePassword: false,
          department: getObjectPropSafely(() => optional.department?.value),
        };
        newContentRender = (methods: any) => {
          return <PopupSkylinkAccount {...methods} isEdit />;
        };

        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên").trim(),
            phone: yup
              .string()
              .trim()
              //eslint-disable-next-line
              .matches(PHONE_REGEX, {
                message: "Vui lòng nhập đúng số điện thoại",
                excludeEmptyString: true,
              }),
            role: yup.string(),
            image: yup.mixed(),
            // .mixed()
            // .test(
            //   "required",
            //   "Vui lòng chọn ảnh đại diện",
            //   (value: any) => value !== ""
            // ),
            imageApi: yup.mixed(),
            isChangePassword: yup.bool(),
            department: yup.string().required("Vui lòng chọn phòng ban"),
          };
        };

        buttonTextPopup = "Cập nhật";
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isDisabledSubmit,
      isOpenPopup: true,
      title,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const newData = useMemo(() => {
    let temp = data.map((item) => ({
      ...item,
      department: departments.find((department) => department.value === item.department)?.label,
    }));

    return name
      ? temp.filter((item: any) => {
          return compareStringSearch(item.name, name);
        })
      : temp;
  }, [name, data, departments]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 180,
        },
        title: "Quyền",
        options: [
          {
            value: "all",
            label: "Tất cả",
          },
          ...optionRole,
        ],
        label: "group_permission",
        defaultValue: "all",
      },
      {
        style: {
          width: 180,
        },
        title: "Kích hoạt",
        options: optionActive,
        label: "is_active",
        defaultValue: "all",
      },
      {
        style: {
          width: 180,
        },
        title: "Phòng ban",
        options: [
          {
            value: "all",
            label: "Tất cả",
          },
          ...departments,
        ],
        label: "department",
        defaultValue: "all",
      },
    ];

    const contentArrButtonOptional: {
      content: JSX.Element;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Thêm
          </>
        ),
        handleClick: () => openPopup(TitlePopupHandle.CREATE_ACCOUNT_SKYLINK),
      },
    ];

    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "name",
            label: "Nhập tên",
          },
        ]}
        params={omit(params, ["page", "limit"])}
        paramsDefault={{}}
        columns={columns}
        dataRenderHeader={dataRenderHeader}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT, columns)}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={handleFilter}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const newParams = handleParamsApi(
      {
        page: 1,
        limit: 200,
        id: row.id,
      },
      ["id"]
    );

    const handleDataApi = (item: any) => {
      return {
        group_permission: optionRole.find((role) => +role.value === item.group_permission)?.label,
        history_user: userSlice.users.find((user) => user.id === item.history_user)?.name,
        status: {
          value: item.is_active ? "Active" : "Non-Active",
          color: item.is_active ? "success" : "error",
        },
        department: departments.find((department) => department.value === item.department)?.label,
        history_type: {
          value:
            item.history_type === "+"
              ? vi.button.create
              : item.history_type === "-"
              ? vi.button.delete
              : vi.button.update,
          color:
            item.history_type === "+" ? "success" : item.history_type === "-" ? "error" : "info",
        },
      };
    };

    const handleFilterDataApi = (list: any[]) => {
      const fields = [
        "image",
        "name",
        "phone",
        "group_permission",
        "is_staff",
        "is_superuser",
        "is_active",
        "is_export_data",
        "department",
        "password",
      ];

      const newList = list.reduce((prevList, listItem, listItemIndex) => {
        if (listItemIndex === list.length - 1) {
          prevList = [...prevList, listItem];
        } else {
          const currentObj: any = pick(listItem, fields);
          const nextObj = pick(list[listItemIndex + 1], fields);
          const differences = Object.keys(currentObj).find(
            (objName) => currentObj[objName] !== nextObj[objName]
          );
          if (differences) {
            const temp = {
              ...listItem,
              history_change_reason: `Cập nhật ${
                mapLabels.find((column) => column.name === differences)?.title
              }`,
            };
            prevList = [...prevList, temp];
          }
        }

        return prevList;
      }, []);
      return newList;
    };

    return (
      <TableDetail
        {...propsTableDefault}
        isHeightCustom={false}
        heightProps={"300px"}
        host={userApi}
        params={{ ...newParams }}
        columnShowDetail={columnShowUserHistory}
        endpoint={`${row.id}/history/`}
        contentColumnShowInfo={{
          arrColumnShowInfo: arrColumnShowInfo,
          infoCell: columnShowUserHistory.columnShowTable,
        }}
        handleDataApi={handleDataApi}
        handleFilterDataApi={handleFilterDataApi}
      />
    );
  };

  return (
    <DataGrid
      {...propsTableDefault}
      data={newData}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columns.resultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      isLoadingTable={isLoading}
      renderHeader={renderHeader}
      contentColumnSwitch={{
        arrColumnSwitch: ["is_active", "is_export_data"],
        keySwitchToggle: "id",
        onToggleSwitch: onToggleSwitch,
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: (row: FacebookType) =>
          openPopup(TitlePopupHandle.EDIT_ACCOUNT_SKYLINK, {
            ...row,
            department: { value: data.find((item) => item.id === row.id)?.department },
          }),
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      handleSorting={handleChangeSorting}
      renderTableDetail={renderTableDetail}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT, columns)
      }
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
    />
  );
};

export default Account;
