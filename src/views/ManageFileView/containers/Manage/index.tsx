// Libraries
import { useReducer, useEffect, useMemo, useContext } from "react";
import map from "lodash/map";
import omit from "lodash/omit";
import intersectionBy from "lodash/intersectionBy";
import isArray from "lodash/isArray";
import filter from "lodash/filter";

// Services
import { skytableApi } from "_apis_/skytable.api";

// Store & Hooks
import useAuth from "hooks/useAuth";
import usePopup from "hooks/usePopup";
import { StoreManageFile } from "views/ManageFileView/contextStore";
import { getAllUsers, getAllUsersGroup } from "selectors/users";
import { useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";
import MImage from "components/Images/MImage";
import ColumnViewer from "views/ManageFileView/components/ColumnViewer";
import ContentFile from "views/ManageFileView/components/ContentFile";

// @Types
import { FacebookType, InitialState } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { Attributes } from "_types_/AirTableType";

// Contants & Utils
import {
  actionType,
  typeHandleAirtable,
  titlePopupHandleAirtable,
  message,
  keyFilter,
  arrNoneRenderSliderFilter,
  columnShowHistoryManage,
} from "views/ManageFileView/constants";
import { handleParamsApi, handleParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { statusNotification, TYPE_FORM_FIELD } from "constants/index";
import { yyyy_MM_dd } from "constants/time";
import { UserType } from "_types_/UserType";
import { getAllAttributesManageFile } from "selectors/attributes";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-created",
    created_dateValue: 31,
    created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
    created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  },
  dataTotal: 0,
  isShowFullTable: false,
};

const storeManage = (state: InitialState, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_DATA_TOTAL: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_LOADING: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_PARAMS: {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }
      case actionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

const Manage = () => {
  const { newCancelToken } = useCancelToken();
  const users = useAppSelector((state) => getAllUsers(state.users));
  const usersGroup = useAppSelector((state) => getAllUsersGroup(state.users));
  const attributesManageFile = useAppSelector((state) =>
    getAllAttributesManageFile(state.attributes)
  );
  const { user: userLogin } = useAuth();
  const [state, dispatch] = useReducer(storeManage, initState);
  const { data, loading, params, dataTotal, isShowFullTable } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreManageFile);
  const { setDataPopup, dataPopup, dataForm, setNotifications, setDataForm } = usePopup();

  const { manage } = store;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  useEffect(() => {
    loadDataTable();
  }, [params, attributesManageFile.attributes]);

  const convertOptionViewer = (
    optionUserGroup: { id: string; name: string; extra?: Partial<any> }[],
    optionUser: UserType[]
  ) => {
    const newUsersGroup = map(optionUserGroup, (item: any) => {
      return {
        ...item,
        value: item.id,
        label: item.name,
        isGroup: true,
      };
    });

    return [
      ...newUsersGroup,
      ...map(optionUser, (user) => {
        return {
          ...user,
          value: user.id,
          label: user.name,
          isGroup: false,
        };
      }),
    ];
  };

  const newUsers = useMemo(() => {
    return filter(users, (item) => item.is_active);
  }, [users]);

  const optionManager = useMemo(() => {
    return map(newUsers, (item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [newUsers]);

  const loadDataTable = () => {
    let objParams = handleParamsApi(
      {
        ...params,
        created__date__gte: params.created_from,
        created__date__lte: params.created_to,
        modified__date__gte: params.modified_from,
        modified__date__lte: params.modified_to,
        view_group: params.viewer,
        current_user: userLogin?.id,
      },
      [
        "search",
        "manager",
        "type",
        "view_group",
        "current_user",
        "created__date__gte",
        "created__date__lte",
        "modified__date__gte",
        "modified__date__lte",
      ]
    );

    getListManageFile(objParams);
  };

  const callbackOptionAttributes = (name: string) => {
    const newAttributeValue =
      attributesManageFile.attributes.find((option: Attributes) => option.label === name)
        ?.attributeValue || [];

    return map(newAttributeValue, (option) => {
      return {
        value: option.value,
        label: option.label,
        color: getObjectPropSafely(() => option.extra.color),
      };
    });
  };

  const getListManageFile = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result: any = await skytableApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "manage-file/"
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          const { type, viewer_group_user, viewer_user } = item;

          return {
            ...item,
            operation: {
              isShowEdit: true,
            },
            link: {
              domain: "",
              endpoint: item.link,
            },
            viewer: {
              value: {
                viewer_group_user,
                viewer_user,
              },
              content: (
                <ColumnViewer options={convertOptionViewer(viewer_group_user, viewer_user)} />
              ),
            },
            manager: {
              value: item.manager,
              content: (
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={2.7}>
                    <MImage
                      src={getObjectPropSafely(() => item.manager.image.url)}
                      preview
                      style={{ borderRadius: "50%" }}
                      contentImage={
                        <Avatar alt={""} src={getObjectPropSafely(() => item.manager.image.url)} />
                      }
                    />
                  </Grid>
                  <Grid item xs={9.3}>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ fontSize: 13, ml: 1 }}
                      className="ellipsis-label"
                    >
                      {getObjectPropSafely(() => item.manager.name)}
                    </Typography>
                  </Grid>
                </Grid>
              ),
            },
            type: {
              value: item.type,
              list: Object.values(type).length
                ? [
                    {
                      value: getObjectPropSafely(() => type.id),
                      label: getObjectPropSafely(() => type.value),
                      color: getObjectPropSafely(() => type.extra.color),
                    },
                  ]
                : [],
              options: callbackOptionAttributes("type"),
              isSimpleSelect: true,
            },
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_MANAGE,
      payload: column,
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        limit: rowPage,
        page: 1,
      },
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_MANAGE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_MANAGE,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const newColumnName = value[0].columnName === "date_created" ? "created" : value[0].columnName;
    const ordering = value[0].direction === "asc" ? newColumnName : "-" + newColumnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page: 1,
        ...params,
      },
    });
  };

  const handleClosePopup = () => {
    setDataPopup({
      ...dataPopup,
      isOpenPopup: false,
    });

    setDataForm({});
  };

  const renderOptionTitleFunc = ({ option }: any) => {
    return (
      <>
        {option.isGroup ? (
          <Chip
            label={option.label}
            sx={{
              color: "#fff",
              backgroundColor: option.color || "#384550",
            }}
            className="ellipsis-label"
            size="small"
          />
        ) : (
          <Typography variant="body2">{option.label}</Typography>
        )}
      </>
    );
  };

  const handleOpenPopup = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let buttonTextPopup = "Tạo";
    let defaultData = defaultValue;

    const newContentRender = (methods: any) => {
      return (
        <ContentFile
          {...methods}
          optionManager={optionManager}
          optionType={callbackOptionAttributes("type")}
          optionViewer={newUsers}
          optionGroup={usersGroup}
        />
      );
    };

    const funcContentSchema = (yup: any) => {
      return {
        name: yup.string().required("Vui lòng nhập tên"),
        link: yup
          .string()
          .required("Vui lòng nhập link")
          .url("Vui lòng nhập đúng link")
          .max(200, "Độ dài link phải nhỏ hơn 200 kí tự"),
        note: yup.string().required("Vui lòng nhập ghi chú"),
        viewer: yup.array(),
        group: yup.mixed(),
        manager: yup.string().required("Vui lòng chọn người quản lý"),
        type: yup.string().required("Vui lòng chọn loại"),
      };
    };

    switch (type) {
      case titlePopupHandleAirtable.ADD_FILE: {
        typeProduct = typeHandleAirtable.ADD_ROW;
        defaultData = {
          name: "",
          link: "",
          note: "",
          viewer: [],
          group: "all",
          type: "",
          manager: "",
        };
        break;
      }
      case titlePopupHandleAirtable.EDIT_FILE: {
        const { viewer_group_user, viewer_user } = getObjectPropSafely(
          () => defaultValue.viewer.value
        );

        const optionUsersGroup = map(viewer_group_user, (item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));

        defaultData = {
          id: defaultValue.id || "",
          name: defaultValue.name || "",
          link: getObjectPropSafely(() => defaultValue.link.endpoint),
          note: defaultValue.note || "",
          viewer: intersectionBy(newUsers, viewer_user, "id"),
          group:
            optionUsersGroup.length === usersGroup.length
              ? "all"
              : map(optionUsersGroup, (item) => item.value),
          type: getObjectPropSafely(() => defaultValue.type.value.id),
          manager: getObjectPropSafely(() => defaultValue.manager.value.id),
        };
        typeProduct = typeHandleAirtable.EDIT_ROW;
        buttonTextPopup = "Cập nhật";
      }
    }

    setDataPopup({
      ...dataPopup,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: type,
      maxWidthForm: "md",
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    let result = null;

    const params = {
      modified_by: userLogin?.id,
      created_by: userLogin?.id,
      name: form.name,
      link: form.link,
      note: form.note,
      type: +form.type,
      manager: form.manager,
    };

    const viewerGroup = form.group === "all" ? map(usersGroup, (item) => item.id) : form.group;

    const newParams = {
      ...handleParams(params),
      viewer_group_user: viewerGroup,
      viewer_user: map(form.viewer, (item) => item.id),
    };

    if (dataPopup.type === typeHandleAirtable.ADD_ROW) {
      result = await skytableApi.create(omit(newParams, "modified_by"), "manage-file/");
    } else {
      result = await skytableApi.update(
        omit(
          {
            ...newParams,
            id: getObjectPropSafely(() => dataPopup.defaultData.id),
          },
          "created_by"
        ),
        "manage-file/"
      );
    }

    if (result && result.data) {
      loadDataTable();

      setNotifications({
        message: message[dataPopup.title].OPERATION_SUCCESS,
        variant: statusNotification.SUCCESS,
      });

      handleClosePopup();
    } else {
      setNotifications({
        message: message[dataPopup.title].OPERATION_FAILED,
        variant: statusNotification.ERROR,
      });
    }
  };

  const handleChangeValuePopover = async (column: any, valueParams: any, row: any) => {
    const params = {
      [column.name]: isArray(valueParams)
        ? map(valueParams, (item) => item.value)
        : valueParams.value || "",
      modified_by: userLogin?.id,
      id: row.id,
    };

    const result = await skytableApi.update(params, "manage-file/");

    if (result && result.data) {
      loadDataTable();

      setNotifications({
        message: "Cập nhật thành công",
        variant: statusNotification.SUCCESS,
      });
    } else {
      setNotifications({
        message: "Cập nhật thất bại",
        variant: statusNotification.ERROR,
      });
    }
  };

  const handleShowFullTable = () => {
    dispatch({
      type: actionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
      },
    });
  };

  const converValueExport = (columnName: string, value: any) => {
    switch (true) {
      case ["link"].includes(columnName): {
        return value.endpoint;
      }
      case ["type"].includes(columnName): {
        return getObjectPropSafely(() => value.list.length)
          ? map(value.list, (item) => item.label).join(",")
          : "";
      }
      case ["modified_by", "created_by"].includes(columnName): {
        return value.name;
      }
      case ["manager"].includes(columnName): {
        return getObjectPropSafely(() => value.value.name);
      }
      case ["viewer"].includes(columnName): {
        const { viewer_group_user, viewer_user } = value.value;
        const arrValue = convertOptionViewer(viewer_group_user, viewer_user);

        return getObjectPropSafely(() => arrValue.length)
          ? map(arrValue, (item) => item.label).join(",")
          : "";
      }
    }
  };

  const columnShowExport = useMemo(() => {
    return manage.resultColumnsShow.length
      ? manage.resultColumnsShow.reduce((prevArr: any, current: any) => {
          return !["operation"].includes(current.name)
            ? [
                ...prevArr,
                {
                  name: current.name,
                  title: current.title,
                },
              ]
            : prevArr;
        }, [])
      : [];
  }, [manage.resultColumnsShow]);

  const newParams = useMemo(() => {
    return handleParamsHeaderFilter(params, [
      "created_from",
      "created_to",
      "created_dateValue",
      "modified_from",
      "modified_to",
      "modified_dateValue",
      "manager",
      "viewer",
      "type",
    ]);
  }, [params]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.MANAGER,
        title: "Người quản lý",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...optionManager,
        ],
        label: "manager",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.VIEWER,
        title: "Người xem",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...convertOptionViewer(usersGroup, newUsers),
        ],
        label: "viewer",
        defaultValue: "all",
        renderOptionTitleFunc,
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.TYPE,
        title: "Phân loại",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("type"),
        ],
        label: "type",
        defaultValue: "all",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian tạo",
        keyDateFrom: "created_from",
        keyDateTo: "created_to",
        keyDateValue: "created_dateValue",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian chỉnh sửa",
        keyDateFrom: "modified_from",
        keyDateTo: "modified_to",
        keyDateValue: "modified_dateValue",
      },
    ];

    const contentArrButtonOptional: {
      content: JSX.Element;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Tạo mới
          </>
        ),
        handleClick: () => handleOpenPopup(titlePopupHandleAirtable.ADD_FILE),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập tên file",
          },
        ]}
        paramsDefault={{
          created_dateValue: 31,
          created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
          created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
        }}
        dataExport={data}
        columnShowExport={columnShowExport}
        params={newParams}
        dataRenderHeader={dataRenderHeader}
        arrNoneRenderSliderFilter={arrNoneRenderSliderFilter}
        columnsCount={manage.countShowColumn}
        originColumns={manage.columnsShow}
        contentGetValue={{
          arrContentGetValue: ["link", "viewer", "type", "modified_by", "manager", "created_by"],
          getValue: converValueExport,
        }}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={handleFilter}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApi = (item: any) => {
      const { viewer_group_user, viewer_user } = item;
      return {
        ...item,
        link: {
          domain: "",
          endpoint: item.link,
        },
        type: {
          value: getObjectPropSafely(() => item.type.id),
          label: getObjectPropSafely(() => item.type.value),
          color: getObjectPropSafely(() => item.type.extra.color) || "",
        },
        viewer: {
          value: {
            viewer_group_user,
            viewer_user,
          },
          content: <ColumnViewer options={convertOptionViewer(viewer_group_user, viewer_user)} />,
        },
        manager: {
          content: (
            <Grid container direction="row" alignItems="center">
              <Grid item xs={2.7}>
                <MImage
                  src={getObjectPropSafely(() => item.manager.image.url)}
                  preview
                  style={{ borderRadius: "50%" }}
                  contentImage={
                    <Avatar alt={""} src={getObjectPropSafely(() => item.manager.image.url)} />
                  }
                />
              </Grid>
              <Grid item xs={9.3}>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontSize: 13, ml: 1 }}
                  className="ellipsis-label"
                >
                  {getObjectPropSafely(() => item.manager.name)}
                </Typography>
              </Grid>
            </Grid>
          ),
        },
      };
    };

    const newParams = handleParamsApi(
      {
        ...params,
        created__date__gte: params.created_from,
        created__date__lte: params.created_to,
        modified__date__gte: params.modified_from,
        modified__date__lte: params.modified_to,
      },
      [
        "search",
        "manager",
        "type",
        "viewer",
        "created__date__gte",
        "created__date__lte",
        "modified__date__gte",
        "modified__date__lte",
      ]
    );

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          isFullTable={isShowFullTable}
          host={skytableApi}
          params={{ ...newParams, ordering: "-created" }}
          columnShowDetail={columnShowHistoryManage}
          arrColumnEditLabel={["type"]}
          arrColumnHandleLink={["link"]}
          arrColumnHistory={["history_type"]}
          arrDateTime={["history_date"]}
          contentOptional={{
            arrColumnOptional: ["manager", "viewer"],
          }}
          endpoint={`manage-file/${row.id}/history/`}
          handleDataApi={handleDataApi}
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return manage.resultColumnsShow.map((item) => item.name);
  }, [manage.resultColumnsShow]);

  return (
    <Box mb={3}>
      <DDataGrid
        isFullTable={isShowFullTable}
        data={data}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        columns={manage.resultColumnsShow}
        columnWidths={manage.columnsWidthResize}
        columnOrders={columnOrders}
        isLoadingTable={loading}
        listTabDetail={["history"]}
        contentColumnHandleOperation={{
          arrColumnHandleOperation: ["operation"],
          handleEdit: (row: FacebookType) =>
            handleOpenPopup(titlePopupHandleAirtable.EDIT_FILE, row),
        }}
        arrColumnShowPopover={["type"]}
        contentOptional={{
          arrColumnOptional: ["manager", "viewer"],
        }}
        arrColumnHandleLink={["link"]}
        renderHeader={renderHeader}
        renderTableDetail={renderTableDetail}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        handleSorting={handleChangeSorting}
        setColumnWidths={handleResizeColumns}
        handleChangeColumnOrder={handleChangeColumnOrder}
        handleChangeValuePopover={handleChangeValuePopover}
      />
    </Box>
  );
};

export default Manage;
