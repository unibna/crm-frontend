// Libraries
import { useReducer, useEffect, useMemo } from "react";
import find from "lodash/find";
import map from "lodash/map";
import omit from "lodash/omit";
import isArray from "lodash/isArray";

// Services
import { skytableApi } from "_apis_/skytable.api";

// Store & Hooks
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { userStore } from "store/redux/users/slice";
import { getAllAttributesCskh } from "selectors/attributes";
import { getAirtable } from "selectors/cskh";
import {
  updateCskhColumn,
  resizeColumnCskh,
  updateColumnOrderCskh,
  updateParams,
} from "store/redux/airtable/action";
import usePopup from "hooks/usePopup";

// Components
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";
import PopupOperation from "views/CskhView/components/PopupOperation";

// @Types
import { FacebookType, InitialState } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { Attributes } from "_types_/AirTableType";
import { ColorSchema } from "_types_/ThemeColorType";

// Contants & Utils
import {
  actionType,
  typeHandleAirtable,
  titlePopupHandleAirtable,
  message,
  optionStatus,
  dataRenderHeaderShare,
  keyFilter,
  arrNoneRenderSliderFilter,
  columnShowHistoryCskh,
  STATUS_CUSTOMER_CARE_VALUES,
} from "views/CskhView/constants";
import { handleParamsApi, handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { TYPE_FORM_FIELD, PHONE_REGEX, statusNotification } from "constants/index";
import { yyyy_MM_dd } from "constants/time";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { STATUS_ROLE_AIRTABLE } from "constants/rolesTab";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { Box } from "@mui/material";

interface Props {
  paramsProps?: Partial<any>;
  isShowHeaderFiler?: boolean;
  isShowOperation?: boolean;
  status?: Partial<STATUS_ROLE_AIRTABLE>;
  titleHeaderTable?: string;
}

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-created",
  },
  dataTotal: 0,
  isShowFullTable: false,
};

const storeCskh = (state: InitialState, action: any) => {
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

const CustomerCareContainer = (props: Props) => {
  const {
    paramsProps,
    isShowHeaderFiler = true,
    isShowOperation = true,
    status,
    titleHeaderTable,
  } = props;
  const userSlice = useAppSelector(userStore);
  const dispatchStore = useAppDispatch();
  const objAirtable = useAppSelector((state) => getAirtable(state.airtable));
  const attributesCskh = useAppSelector((state) => getAllAttributesCskh(state.attributes));
  const { user: userLogin } = useAuth();
  const [state, dispatch] = useReducer(storeCskh, initState);
  const { data, loading, params, dataTotal, isShowFullTable } = state;
  const { cskh, params: paramsStore } = objAirtable;
  const { setDataPopup, dataForm, dataPopup, setLoadingSubmit, setNotifications } = usePopup();
  const { title: titlePopup, type: typeRender, defaultData } = dataPopup;
  const { attributes: dataAttributes } = attributesCskh;

  useEffect(() => {
    loadDataTable();
  }, [paramsProps, paramsStore, params, dataAttributes]);

  useEffect(() => {
    status &&
      dispatchStore(
        updateParams({
          ...paramsStore,
          status: STATUS_CUSTOMER_CARE_VALUES[status || STATUS_ROLE_AIRTABLE.ALL],
        })
      );
  }, [status]);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const optionHandleBy = useMemo(() => {
    return map(userSlice.telesaleUsers, formatOptionSelect);
  }, [userSlice.telesaleUsers]);

  const loadDataTable = () => {
    let objParams = handleParamsApi(
      {
        ...params,
        ...paramsProps,
        ...paramsStore,
        created__date__gte: paramsStore.created_from,
        created__date__lte: paramsStore.created_to,
        modified__date__gte: paramsStore.modified_from,
        modified__date__lte: paramsStore.modified_to,
      },
      [
        "search",
        "status",
        "handle_by",
        "channel",
        "product",
        "handle_reason",
        "solution",
        "solution_description",
        "comment",
        "created__date__gte",
        "created__date__lte",
        "modified__date__gte",
        "modified__date__lte",
      ]
    );

    if (paramsProps) {
      objParams = handleParamsApi(
        {
          ...params,
          ...paramsProps,
          ...paramsStore,
        },
        Object.keys(paramsProps)
      );
    }
    getListCskh(objParams);
  };

  const callbackOptionAttributes = (name: string) => {
    const newAttributeValue =
      dataAttributes.find((option: Attributes) => option.label === name)?.attributeValue || [];

    return map(newAttributeValue, (option) => {
      return {
        value: option.value,
        label: option.label,
        color: getObjectPropSafely(() => option.extra.color),
      };
    });
  };

  const getListCskh = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result: any = await skytableApi.get(params, "customer-care/");

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          const {
            status,
            channel,
            product,
            order_number,
            handle_by,
            created,
            handle_reason = [],
            solution = [],
            comment = [],
            solution_description = [],
          } = item;
          const objStatus: any = find(optionStatus, (option) => option.value === status);

          return {
            ...item,
            operation: {
              isShowEdit: isShowOperation,
              // isShowDelete: true,
              // labelDialog: "Bạn có chắc chắn xóa ?"
            },
            date_created: created,
            link_jira: {
              domain: "",
              endpoint: item.link_jira,
              value: item.link_jira,
            },
            channel: {
              list: Object.values(channel).length
                ? [
                    {
                      value: getObjectPropSafely(() => channel.id),
                      label: getObjectPropSafely(() => channel.value),
                      color: getObjectPropSafely(() => channel.extra.color),
                    },
                  ]
                : [],
              value: channel.value,
              options: callbackOptionAttributes("channel"),
              isSimpleSelect: true,
            },
            product: {
              list: Object.values(product).length
                ? [
                    {
                      value: getObjectPropSafely(() => product.id),
                      label: getObjectPropSafely(() => product.value),
                      color: getObjectPropSafely(() => product.extra.color),
                    },
                  ]
                : [],
              value: product.value,
              options: callbackOptionAttributes("product"),
              isSimpleSelect: true,
            },
            status: {
              list: [
                {
                  value: status,
                  label: objStatus?.label,
                  color: objStatus.color,
                },
              ],
              value: objStatus?.label,
              options: optionStatus,
              isSimpleSelect: true,
            },
            handle_by: {
              label: getObjectPropSafely(() => handle_by.name),
              id: getObjectPropSafely(() => handle_by.id),
              value: getObjectPropSafely(() => handle_by.name),
              content: <Typography>{handle_by.name}</Typography>,
            },
            handle_reason: {
              list: map(handle_reason, (option) => {
                return {
                  label: getObjectPropSafely(() => option.value),
                  value: getObjectPropSafely(() => option.id),
                  color: getObjectPropSafely(() => option.extra.color),
                };
              }),
              options: callbackOptionAttributes("handle_reason"),
              value: getObjectPropSafely(() => handle_reason.length)
                ? map(handle_reason, (item) => item.value).join(",")
                : "",
            },
            solution: {
              list: map(solution, (option) => {
                return {
                  label: getObjectPropSafely(() => option.value),
                  value: getObjectPropSafely(() => option.id),
                  color: getObjectPropSafely(() => option.extra.color),
                };
              }),
              options: callbackOptionAttributes("solution"),
              value: getObjectPropSafely(() => solution.length)
                ? map(solution, (item) => item.value).join(",")
                : "",
            },
            comment: {
              list: map(comment, (option) => {
                return {
                  label: getObjectPropSafely(() => option.value),
                  value: getObjectPropSafely(() => option.id),
                  color: getObjectPropSafely(() => option.extra.color),
                };
              }),
              options: callbackOptionAttributes("comment"),
              value: getObjectPropSafely(() => comment.length)
                ? map(comment, (item) => item.value).join(",")
                : "",
            },
            solution_description: {
              list: map(solution_description, (option) => {
                return {
                  label: getObjectPropSafely(() => option.value),
                  value: getObjectPropSafely(() => option.id),
                  color: getObjectPropSafely(() => option.extra.color),
                };
              }),
              options: callbackOptionAttributes("solution_description"),
              value: getObjectPropSafely(() => solution_description.length)
                ? map(solution_description, (item) => item.value).join(",")
                : "",
            },
            order_number: {
              endpoint: order_number,
              value: order_number,
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
    dispatchStore(updateCskhColumn(column));
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
    dispatchStore(
      resizeColumnCskh({
        columnsWidthResize: value,
      })
    );
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore(
      updateColumnOrderCskh({
        columnsOrder: columns,
      })
    );
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
      },
    });

    dispatchStore(updateParams(params));
  };

  const handleClosePopup = () => {
    setLoadingSubmit(false);

    setDataPopup({
      ...dataPopup,
      isOpenPopup: false,
    });
  };

  const handleOpenPopup = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let buttonTextPopup = "Tạo";
    let defaultData = defaultValue;

    const newContentRender = (methods: any) => (
      <PopupOperation
        {...methods}
        optionHandleBy={optionHandleBy}
        optionChannel={callbackOptionAttributes("channel")}
        optionProduct={callbackOptionAttributes("product")}
        optionHandleReason={[
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("handle_reason"),
        ]}
        optionSolution={[
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("solution"),
        ]}
        optionSolutionDescription={[
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("solution_description"),
        ]}
        optionComment={[
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("comment"),
        ]}
      />
    );

    const funcContentSchema = (yup: any) => {
      return {
        phone: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim().matches(PHONE_REGEX, {
          message: VALIDATION_MESSAGE.FORMAT_PHONE,
        }),
        description: yup.string(),
        note: yup.string(),
        order_number: yup.string(),
        status: yup.string(),
        channel: yup.string().required(VALIDATION_MESSAGE.SELECT_CHANNEL),
        product: yup.string().required(VALIDATION_MESSAGE.SELECT_PRODUCT),
        handle_by: yup.string(),
        link_jira: yup.string(),
        comment: yup.array() | yup.string(),
        solution: yup.array() | yup.string(),
        solution_description: yup.array() | yup.string(),
        handle_reason: yup.array() | yup.string(),
      };
    };

    switch (type) {
      case titlePopupHandleAirtable.ADD_ROW: {
        typeProduct = typeHandleAirtable.ADD_ROW;
        defaultData = {
          phone: "",
          description: "",
          note: "",
          order_number: "",
          status: "",
          channel: "",
          link_jira: "",
          product: "",
          handle_by: "",
          comment: [],
          solution: [],
          solution_description: [],
          handle_reason: [],
        };
        break;
      }
      case titlePopupHandleAirtable.EDIT_ROW: {
        defaultData = {
          id: defaultValue.id || "",
          phone: defaultValue?.phone || "",
          description: defaultValue?.description || "",
          note: defaultValue?.note || "",
          order_number: getObjectPropSafely(() => defaultValue?.order_number.value) || "",
          status: getObjectPropSafely(() => defaultValue?.status.list[0].value) || "",
          channel: getObjectPropSafely(() => defaultValue?.channel.list[0].value) || "",
          link_jira: getObjectPropSafely(() => defaultValue?.link_jira?.endpoint) || "",
          product: getObjectPropSafely(() => defaultValue?.product.list[0].value) || "",
          handle_by: getObjectPropSafely(() => defaultValue?.handle_by.id) || "",
          comment: getObjectPropSafely(() => defaultValue?.comment.list.length)
            ? map(defaultValue?.comment?.list, (option) => option.value)
            : [],
          solution: getObjectPropSafely(() => defaultValue?.solution.list.length)
            ? map(defaultValue?.solution?.list, (option) => option.value)
            : [],
          solution_description: getObjectPropSafely(
            () => defaultValue?.solution_description.list.length
          )
            ? map(defaultValue?.solution_description?.list, (option) => option.value)
            : [],
          handle_reason: getObjectPropSafely(() => defaultValue?.handle_reason.list.length)
            ? map(defaultValue?.handle_reason?.list, (option) => option.value)
            : [],
        };
        typeProduct = typeHandleAirtable.EDIT_ROW;
        buttonTextPopup = "Cập nhật";
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm: "md",
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: type,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    let result = null;

    const params = {
      phone: form.phone || "",
      description: form.description || "",
      note: form.note || "",
      order_number: form.order_number || "",
      status: form.status || "",
      link_jira: form.link_jira || "",
      modified_by: userLogin?.id,
      created_by: userLogin?.id,
      handle_by: form.handle_by || "",
      channel: +form.channel || "",
      product: +form.product || "",
      handle_reason:
        form.handle_reason === "all"
          ? map(callbackOptionAttributes("handle_reason"), (option) => option.value)
          : form.handle_reason || [],
      solution:
        form.solution === "all"
          ? map(callbackOptionAttributes("solution"), (option) => option.value)
          : form.solution || [],
      solution_description:
        form.solution_description === "all"
          ? map(callbackOptionAttributes("solution_description"), (option) => option.value)
          : form.solution_description || [],
      comment:
        form.comment === "all"
          ? map(callbackOptionAttributes("comment"), (option) => option.value)
          : form.comment || [],
    };

    const newParams = handleParams(params);
    setLoadingSubmit(true);

    if (typeRender === typeHandleAirtable.ADD_ROW) {
      result = await skytableApi.create(omit(newParams, "modified_by"), "customer-care/");
    } else {
      result = await skytableApi.update(
        omit({ ...newParams, id: defaultData.id }, "created_by"),
        "customer-care/"
      );
    }

    if (result && result.data) {
      loadDataTable();

      setNotifications({
        message: message[titlePopup].OPERATION_SUCCESS,
        variant: statusNotification.SUCCESS,
      });
    }

    handleClosePopup();
  };

  const handleChangeValuePopover = async (column: any, valueParams: any, row: any) => {
    const params = {
      [column.name]: isArray(valueParams)
        ? map(valueParams, (item) => item.value)
        : valueParams.value || "",
      modified_by: userLogin?.id,
      id: row.id,
    };

    const result = await skytableApi.update(params, "customer-care/");

    if (result && result.data) {
      loadDataTable();

      setNotifications({
        message: "Cập nhật thành công",
        variant: statusNotification.SUCCESS,
      });
    } else {
      setNotifications({
        message: "Cập nhật thất bại",
        variant: statusNotification.SUCCESS,
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

  const columnShowExport = useMemo(() => {
    return getObjectPropSafely(() => cskh?.resultColumnsShow?.length)
      ? (cskh?.resultColumnsShow || []).reduce((prevArr: any, current: any) => {
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
  }, [cskh.resultColumnsShow]);

  const renderHeader = () => {
    const dataRenderHeader = [
      ...dataRenderHeaderShare,
      {
        style: {
          width: 200,
        },
        status: keyFilter.HANDLE_BY,
        title: "Nhân viên xử lý",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...optionHandleBy,
        ],
        label: "handle_by",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.CHANNEL,
        title: "Kênh",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("channel"),
        ],
        label: "channel",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.PRODUCT,
        title: "Sản phẩm",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("product"),
        ],
        label: "product",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.HANDLE_REASON,
        title: "Phân loại",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("handle_reason"),
        ],
        label: "handle_reason",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.SOLUTION,
        title: "Hướng giải quyết",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("solution"),
        ],
        label: "solution",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.SOLUTION_DESCRIPTION,
        title: "Sản phẩm bù/tặng/đổi trả/mua thêm",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("solution_description"),
        ],
        label: "solution_description",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.COMMENT,
        title: "Cảm nhận KH",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...callbackOptionAttributes("comment"),
        ],
        label: "comment",
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
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Tạo mới
          </>
        ),
        handleClick: () => handleOpenPopup(titlePopupHandleAirtable.ADD_ROW),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập số điện thoại, mã đơn hàng",
          },
        ]}
        paramsDefault={handleParams({
          created_dateValue: 31,
          created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
          created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
          status: STATUS_CUSTOMER_CARE_VALUES[status || STATUS_ROLE_AIRTABLE.ALL],
        })}
        dataExport={data}
        columnShowExport={columnShowExport}
        params={paramsStore}
        dataRenderHeader={dataRenderHeader}
        arrNoneRenderSliderFilter={arrNoneRenderSliderFilter}
        columnsCount={cskh.countShowColumn}
        originColumns={cskh.columnsShow}
        arrDate={["date_created"]}
        contentArrButtonOptional={contentArrButtonOptional}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
        handleFilter={handleFilter}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApi = (item: any) => {
      const objStatus: any = find(optionStatus, (option) => option.value === item.status);

      return {
        ...item,
        status: {
          value: item.status,
          label: objStatus?.label,
          color: objStatus.color,
        },
        channel: {
          value: getObjectPropSafely(() => item.channel.id),
          label: getObjectPropSafely(() => item.channel.value),
          color: getObjectPropSafely(() => item.channel.extra.color) || "",
        },
        product: {
          value: getObjectPropSafely(() => item.product.id),
          label: getObjectPropSafely(() => item.product.value),
          color: getObjectPropSafely(() => item.product.extra.color) || "",
        },
        handle_by: {
          label: getObjectPropSafely(() => item.handle_by.name),
          value: getObjectPropSafely(() => item.handle_by.id),
          content: <Typography>{getObjectPropSafely(() => item.handle_by.name) || ""}</Typography>,
        },
        modified_by: {
          label: getObjectPropSafely(() => item.modified_by.name),
          value: getObjectPropSafely(() => item.modified_by.id),
          content: (
            <Typography>{getObjectPropSafely(() => item.modified_by.name) || ""}</Typography>
          ),
        },
        link_jira: {
          domain: "",
          endpoint: item?.link_jira || "",
        },
        order_number: {
          endpoint: item.order_number,
        },
      };
    };

    const newParams = handleParamsApi(
      {
        ...paramsProps,
        ...paramsStore,
        created__date__gte: paramsStore.created_from,
        created__date__lte: paramsStore.created_to,
        modified__date__gte: paramsStore.modified_from,
        modified__date__lte: paramsStore.modified_to,
      },
      [
        "search",
        "status",
        "handle_by",
        "channel",
        "product",
        "handle_reason",
        "solution",
        "solution_description",
        "comment",
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
          columnShowDetail={columnShowHistoryCskh}
          arrColumnEditLabel={["channel", "product", "status"]}
          isCallApiColumnHandleLink
          arrColumnHandleLink={["order_number", "link_jira"]}
          arrColumnHistory={["history_type"]}
          arrDateTime={["history_date"]}
          contentOptional={{
            arrColumnOptional: ["handle_by", "modified_by"],
          }}
          endpoint={`customer-care/${row.id}/history/`}
          handleDataApi={handleDataApi}
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return (cskh?.resultColumnsShow || []).map((item) => item.name);
  }, [cskh.resultColumnsShow]);

  return (
    <Box mb={3}>
      <DDataGrid
        titleHeaderTable={titleHeaderTable}
        isFullTable={isShowFullTable}
        data={data}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        columns={cskh.resultColumnsShow}
        columnWidths={cskh.columnsWidthResize}
        columnOrders={columnOrders}
        isLoadingTable={loading}
        isShowListToolbar={isShowHeaderFiler}
        listTabDetail={["history"]}
        contentColumnHandleOperation={{
          arrColumnHandleOperation: ["operation"],
          handleEdit: (row: FacebookType) =>
            handleOpenPopup(titlePopupHandleAirtable.EDIT_ROW, row),
        }}
        arrColumnShowPopover={[
          "status",
          "channel",
          "product",
          "handle_reason",
          "solution",
          "comment",
          "solution_description",
        ]}
        arrDate={["date_created"]}
        contentOptional={{
          arrColumnOptional: ["handle_by"],
        }}
        isCallApiColumnHandleLink
        arrColumnHandleLink={["order_number", "link_jira"]}
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

export default CustomerCareContainer;
