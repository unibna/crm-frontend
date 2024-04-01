// Libraries
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import map from "lodash/map";
import { useContext, useEffect, useMemo, useState } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";
import { getAllFilterContentId } from "selectors/attributes";
import { ContentIdContext } from "views/ReportContentIdView/context";

// Components
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import UpdateCell from "views/ReportContentIdView/components/UpdateCell";

// Types
import { ContentIdAttachPhoneType } from "_types_/ContentIdType";
import { SortType } from "_types_/SortType";

// Constants
import { arrRenderFilterDateDefault, statusNotification } from "constants/index";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import {
  arrColumnShowInfo,
  headerFilterContentId,
  headerFilterType,
  message,
} from "views/ReportContentIdView/constants";

const AttachPhoneTab = () => {
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const { dataFilterFanpage } = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const { [STATUS_ROLE_CONTENT_ID.ATTACH_PHONE]: columns, params: paramsStore } = store;
  const {
    setDataPopup,
    dataPopup,
    setNotifications,
    closePopup,
    submitPopup,
    setLoadingSubmit,
    dataForm,
  } = usePopup<{
    type: string;
    id: string;
    is_conversion_obj: boolean;
    content_id: string;
    ad_id: string;
  }>();

  // State
  const [data, setData] = useState<ContentIdAttachPhoneType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup();
    }
  }, [dataForm]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsStore,
    };

    const newParams = chooseParams(objParams, [
      "date_from",
      "date_to",
      "page_id",
      "type",
      "has_content_id_final",
      "phone",
    ]);

    getListFacebookAttachPhone(newParams);
  };

  const getListFacebookAttachPhone = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await facebookApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "phone/comment-message/"
      );

      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            id: item.id,
            searchName: item.content_id,
            content_id: item.content_id || "",
            phones: map(item.phones, (current) => ({
              phone: current,
            })),
            phone: map(item.phones, (current) => current).toString(),
            operation: {
              content: (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => handleOpenPopup(item)}
                >
                  <EditIcon />
                </IconButton>
              ),
            },
          };
        });

        setData(newData || []);
        setDataTotal(count);
      }

      setLoadingTable(false);
    }
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleFilter = (paramsProps: any) => {
    setParams({
      ...params,
      page: 1,
    });

    updateParams(paramsProps);
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleOpenPopup = (defaultValue: any) => {
    const funcContentSchema = (yup: any) => {
      return {
        content_id: yup.string(),
        ad_id: yup.string(),
        is_conversion_obj: yup.bool(),
      };
    };
    const newContentRender = (methods: any) => <UpdateCell {...methods} />;
    const defaultData = {
      id: defaultValue.id,
      type: defaultValue.type,
      content_id: defaultValue.content_id || "",
      // ad_id: defaultValue.ad_id || "",
      is_conversion_obj: defaultValue.is_conversion_obj,
    };

    setDataPopup({
      ...dataPopup,
      buttonText: "Cập nhật",
      isOpenPopup: true,
      title: "Cập nhật",
      defaultData,
      type: "",
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const handleSubmitPopup = async () => {
    setLoadingSubmit(true);

    const params = {
      type: dataForm.type,
      id: dataForm.id,
      content_id: dataForm.content_id,
      // ad_id: dataForm.ad_id,
      is_conversion_obj: dataForm.is_conversion_obj,
    };

    const result = await facebookApi.update(params, "phone/comment-message/");

    if (result && result.data) {
      loadDataTable();
      closePopup();

      setNotifications({
        message: message.ATTACH_CONTENT_ID_SUCCESS,
        variant: statusNotification.SUCCESS,
      });
    }
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "date_from",
      "date_to",
      "page_id",
      "type",
      "has_content_id_final",
      "phone",
      "dateValue",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        title: "Trang",
        options: dataFilterFanpage,
        label: "page_id",
        defaultValue: dataFilterFanpage[0].value,
      },
      {
        style: {
          width: 200,
        },
        title: "Loại",
        options: headerFilterType,
        label: "type",
        defaultValue: headerFilterType[2].value,
      },
      {
        style: {
          width: 200,
        },
        title: "Content ID",
        options: headerFilterContentId,
        label: "has_content_id_final",
        defaultValue: headerFilterContentId[0].value,
      },
      ...arrRenderFilterDateDefault,
    ];

    return (
      <HeaderFilter
        // {...propsTableDefault}
        // contentOptional={null}
        isShowPopupFilter={false}
        searchInput={[
          {
            keySearch: "phone",
            label: "Nhập số điện thoại",
          },
        ]}
        paramsDefault={{
          dateValue: 0,
          date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
          date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
          type: "Message",
        }}
        dataExport={data}
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        params={newParamsStore}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        dataRenderHeader={dataRenderHeader}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_CONTENT_ID.ATTACH_PHONE, columns)}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <DataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columns.resultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      isLoadingTable={isLoadingTable}
      renderHeader={renderHeader}
      arrColumnBool={["is_conversion_obj"]}
      arrHandleList={["phones"]}
      arrColumnOptional={["operation"]}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      handleSorting={handleChangeSorting}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_CONTENT_ID.ATTACH_PHONE, columns)}
      handleChangeColumnOrder={(columns) =>
        orderColumn(STATUS_ROLE_CONTENT_ID.ATTACH_PHONE, columns)
      }
    />
  );
};

export default AttachPhoneTab;
