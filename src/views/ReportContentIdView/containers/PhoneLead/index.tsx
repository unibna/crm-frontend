// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import reduce from "lodash/reduce";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { ContentIdContext } from "views/ReportContentIdView/context";
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import UploadIcon from "@mui/icons-material/Upload";
import ContentUploadPhone from "views/ReportContentIdView/components/ContentUploadPhone";

// Types
import { SortType } from "_types_/SortType";
import { ColorSchema } from "_types_/ThemeColorType";
import { ContentIdType } from "_types_/ContentIdType";

// Constants
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { FULL_LEAD_STATUS_OPTIONS } from "views/LeadCenterView/constants";
import {
  arrColumnShowInfo,
  propsTableDefault,
  headerFilterObjecttive,
} from "views/ReportContentIdView/constants";
import {
  handleDataPhoneLead,
  headerFilterTypePhoneLead,
  columnEditExtensionsAttachPhone,
} from "views/ReportContentIdView/constants/phoneLead";
import { ROLE_TAB, STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { arrRenderFilterDateDefault } from "constants/index";

const PhoneLead = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const { dataAttributeRule, dataFilterAdAccount, dataFilterFanpage } = useAppSelector((state) =>
    getAllFilterContentId(state.attributes)
  );
  const { [STATUS_ROLE_CONTENT_ID.PHONE_LEAD]: columns, params: paramsStore } = store;
  const { setDataPopup, dataPopup, submitPopup } = usePopup();

  // State
  const [data, setData] = useState<ContentIdType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        type: paramsStore.type_phone || "",
      },
      [
        "date_from",
        "date_to",
        "ad_name",
        "type",
        "phone_lead_status",
        "objective",
        "search",
        "ad_account_id",
      ]
    );

    getListPhoneLead(objParams);
  };

  const getListPhoneLead = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "phonelead/"
      );

      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            phone_order_number: {
              value: getObjectPropSafely(() => item.phone_order_number),
              props: {
                domain: `/${ROLE_TAB.ORDERS}/`,
                variant: "body2",
                color: theme.palette.info.main,
                isCallApi: true,
              },
            },
            phone_reason:
              getObjectPropSafely(() => item.phone_reason.bad_data_reason) ||
              getObjectPropSafely(() => item.phone_reason.fail_reason) ||
              getObjectPropSafely(() => item.phone_reason.handle_reason),
            ...handleDataPhoneLead(item, { dataAttributeRule }),
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

  const handleOpenPopup = () => {
    const listCustomer = reduce(
      dataFilterAdAccount,
      (prevArr: any, item: any) => {
        return item.type === "GOOGLE" ? [...prevArr, item] : prevArr;
      },
      []
    );

    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        type: paramsStore.type_phone || "",
      },
      ["date_from", "date_to", "ad_name", "type", "phone_lead_status", "objective", "search"]
    );

    const funcContentSchema = (yup: any) => {
      return {
        customer: yup.string().required("Vui lòng nhập customer"),
        conversion: yup.string().required("Vui lòng chọn conversion"),
        name: yup.string(),
      };
    };
    const newContentRender = (methods: any) => (
      <ContentUploadPhone
        {...methods}
        listCustomer={listCustomer}
        params={objParams}
        submitPopup={submitPopup}
      />
    );
    const defaultData = {
      customer: getObjectPropSafely(() => listCustomer[0].value) || "",
      conversion: "",
      name: "offline",
    };

    setDataPopup({
      ...dataPopup,
      buttonText: "Tạo",
      isOpenPopup: true,
      title: "Upload",
      defaultData,
      type: "",
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter: false,
    });
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "date_from",
      "date_to",
      "ad_name",
      "type_phone",
      "phone_lead_status",
      "dateValue",
      "objective",
      "search",
      "ad_account_id",
      "dateValue",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 180,
        },
        title: "Mục tiêu",
        options: headerFilterObjecttive,
        label: "objective",
        defaultValue: headerFilterObjecttive[0].value,
      },
      {
        style: {
          width: 200,
        },
        title: "Loại",
        options: headerFilterTypePhoneLead,
        label: "type_phone",
        defaultValue: headerFilterTypePhoneLead[0].value,
      },
      {
        style: {
          width: 200,
        },
        title: "Trạng thái xử lí",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          {
            label: "Chưa có",
            value: "null",
          },
          ...FULL_LEAD_STATUS_OPTIONS,
        ],
        label: "phone_lead_status",
        defaultValue: headerFilterTypePhoneLead[0].value,
      },
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
        title: "Tài khoản quảng cáo",
        options: dataFilterAdAccount,
        label: "ad_account_id",
        defaultValue: dataFilterAdAccount[0].value,
      },
      ...arrRenderFilterDateDefault,
    ];

    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      ...(getObjectPropSafely(() => paramsStore?.type_phone.toString()) === "GGLADI"
        ? [
            {
              content: (
                <>
                  <UploadIcon /> Upload
                </>
              ),
              handleClick: handleOpenPopup,
            },
          ]
        : []),
    ];

    return (
      <HeaderFilter
        {...propsTableDefault}
        contentOptional={null}
        isShowPopupFilter={false}
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "ad_name",
            label: "Nhập content ID",
          },
          {
            keySearch: "search",
            label: "Nhập số điện thoại",
          },
        ]}
        contentArrButtonOptional={contentArrButtonOptional}
        dataExport={data}
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        params={newParamsStore}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        dataRenderHeader={dataRenderHeader}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_CONTENT_ID.PHONE_LEAD, columns)}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <DataGrid
      {...propsTableDefault}
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columns.resultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      columnEditExtensions={columnEditExtensionsAttachPhone}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnsShow,
      }}
      isCallApiColumnHandleLink
      isLoadingTable={isLoadingTable}
      handleSorting={handleChangeSorting}
      renderHeader={renderHeader}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_CONTENT_ID.PHONE_LEAD, columns)}
      handleChangeColumnOrder={(columns) => orderColumn(STATUS_ROLE_CONTENT_ID.PHONE_LEAD, columns)}
    />
  );
};
export default PhoneLead;
