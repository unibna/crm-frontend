// Libraries
import { useMemo, useEffect } from "react";
import min from "lodash/min";
import max from "lodash/max";
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";
import reduce from "lodash/reduce";
import { useTheme } from "@mui/material/styles";
import { store } from "store";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Store Context
import usePopup from "hooks/usePopup";
import { useAppSelector } from "hooks/reduxHook";
import { leadStore } from "store/redux/leads/slice";
import { getAllFilterContentId } from "selectors/attributes";
import { updateFilterContentId } from "store/redux/attributes/slice";

// Components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AttributeCollapse from "components/Collapses/CollapseAttribute";
import CpaSetup from "views/ReportContentIdView/components/CpaSetup";
import ContentRule from "views/ReportContentIdView/components/ContentRule";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Span } from "components/Labels";
import UpdateLogs from "views/ReportContentIdView/components/UploadLogs";
import HistoryIcon from "@mui/icons-material/History";

// @Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { GridSizeType } from "_types_/GridLayoutType";

// Constants
import { optionRanking, titlePopupHandle, TYPE_RANKING } from "views/ReportContentIdView/constants";
import { statusNotification } from "constants/index";
import { fNumber, fShortenNumber, fValueVnd } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { FULL_LEAD_STATUS_OPTIONS } from "views/LeadCenterView/constants";
import { AttributeType } from "_types_/AttributeType";

const STATUS = [
  {
    label: "Trạng thái đơn",
    value: "lead_status",
    isDivider: true,
    keyOption: "optionLeadStatus",
  },
  {
    label: "Trạng thái dữ liệu",
    value: "data_status",
    isDivider: true,
    keyOption: "optionDataStatus",
  },
  {
    label: "Lý do dữ liệu KCL",
    value: "bad_data_reason",
    isDivider: true,
    keyOption: "optionBadDataStatus",
  },
  {
    label: "Lý do xử lý",
    value: "handle_reason",
    isDivider: true,
    keyOption: "optionHandleReason",
  },
  {
    label: "Tài khoản Upload Conversion",
    value: "customer_ids",
    isDivider: false,
    keyOption: "optionCustomer",
  },
];

const Attributes = () => {
  const theme = useTheme();
  const leadSlice = useAppSelector(leadStore);
  const { dataAttributeRule, dataAttributeProduct, dataFilterAdAccount } = useAppSelector((state) =>
    getAllFilterContentId(state.attributes)
  );
  const { setNotifications, setDataPopup, dataPopup, dataForm, closePopup, setLoadingSubmit } =
    usePopup();
  const { title: titlePopup } = dataPopup;

  useEffect(() => {
    if (Object.values(dataForm).length) {
      handleSubmitPopup(dataForm);
    }
  }, [dataForm]);

  const filterIsShowOptions = (arrValue: AttributeType[]) => {
    return reduce(
      arrValue,
      (prevArr, current) => {
        return current.is_shown
          ? [
              ...prevArr,
              {
                label: current.name,
                value: current.name,
              },
            ]
          : prevArr;
      },
      []
    );
  };

  const handleUpdateAttribute = (type: string, defaultValue: Partial<SelectOptionType> = {}) => {
    let typeProduct = "";
    let buttonTextPopup = "Tạo";
    let defaultData = defaultValue;
    let funcContentSchema: any;
    let newContentRender: any = () => [];
    let maxWidthForm: GridSizeType = "md";
    let isShowFooter = true;

    const objType = find(optionRanking, (item) => item.value === defaultValue.type);

    switch (type) {
      case titlePopupHandle.EDIT_PRODUCT:
      case titlePopupHandle.ADD_PRODUCT: {
        defaultData = {
          id: defaultValue.value,
          type: objType || optionRanking[0],
          name: defaultValue.label || "",
          levelOne: defaultValue.levelOne || "",
          levelTwo: defaultValue.levelTwo || "",
        };

        funcContentSchema = (yup: any) => {
          return {
            type: yup.object().shape({
              label: yup.string(),
              value: yup.string(),
            }),
            name: yup.string().required("Vui lòng nhập sản phẩm"),
            levelOne: yup.number().required("Vui lòng nhập level 1"),
            levelTwo: yup.number().required("Vui lòng nhập lebel 2"),
          };
        };

        newContentRender = (methods: any) => <CpaSetup {...methods} />;

        buttonTextPopup = "Cập nhật";

        break;
      }
      case titlePopupHandle.ADD_RULE:
      case titlePopupHandle.EDIT_RULE: {
        const {
          optionDataStatus,
          optionBadDataStatus,
          optionHandleReason,
          optionCustomer,
          optionLeadStatus,
        }: any = option;
        const valueLeadStatus = getObjectPropSafely(() => defaultValue.lead_status.length)
          ? filter(optionLeadStatus, (item) => defaultValue.lead_status.includes(item.value))
          : [];

        const valueDataStatus = getObjectPropSafely(() => defaultValue.data_status.length)
          ? filter(optionDataStatus, (item) => defaultValue.data_status.includes(item.value))
          : [];

        const valueBadDataReason = getObjectPropSafely(() => defaultValue.bad_data_reason.length)
          ? filter(optionBadDataStatus, (item) => defaultValue.bad_data_reason.includes(item.value))
          : [];

        const valueHandleReason = getObjectPropSafely(() => defaultValue.handle_reason.length)
          ? filter(optionHandleReason, (item) => defaultValue.handle_reason.includes(item.value))
          : [];

        const valueCustomer = getObjectPropSafely(() => defaultValue.customer_ids.length)
          ? filter(optionCustomer, (item) => defaultValue.customer_ids.includes(item.value))
          : [];

        defaultData = {
          id: defaultValue.value,
          name: defaultValue.name,
          lead_status: valueLeadStatus,
          data_status: valueDataStatus,
          bad_data_reason: valueBadDataReason,
          handle_reason: valueHandleReason,
          customer_ids: valueCustomer,
          color: defaultValue.colorcode || "",
        };

        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên rule"),
            color: yup.string().required("Vui lòng chọn màu cho rule"),
            lead_status: yup.mixed(),
            data_status: yup.mixed(),
            bad_data_reason: yup.mixed(),
            handle_reason: yup.mixed(),
            customer_ids: yup.mixed(),
          };
        };

        newContentRender = (methods: any) => (
          <ContentRule
            {...methods}
            optionLeadStatus={FULL_LEAD_STATUS_OPTIONS}
            optionDataStatus={optionDataStatus}
            optionBadDataStatus={optionBadDataStatus}
            optionHandleReason={optionHandleReason}
            optionCustomer={optionCustomer}
          />
        );

        maxWidthForm = "sm";
        buttonTextPopup = "Cập nhật";
        break;
      }
      case titlePopupHandle.SHOW_UPLOAD_LOGS: {
        newContentRender = (methods: any) => (
          <UpdateLogs
            {...methods}
            ruleName={defaultValue.name}
            optionCustomer={option.optionCustomer}
          />
        );

        isShowFooter = false;
        maxWidthForm = "lg";
      }
    }

    setDataPopup({
      ...dataPopup,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: type,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const handleSubmitPopup = async (form: any) => {
    const { name, levelOne, levelTwo, type } = form;

    const valueMin = min([+levelOne, +levelTwo]) || 0;
    const valueMax = max([+levelOne, +levelTwo]) || 0;
    const levelMin =
      getObjectPropSafely(() => type.value) === TYPE_RANKING.CPA
        ? valueMin
        : fShortenNumber(valueMin / 100);
    const levelMax =
      getObjectPropSafely(() => type.value) === TYPE_RANKING.CPA
        ? valueMax
        : fShortenNumber(valueMax / 100);

    const convertArr = (arrValue: { label: string; value: string }[]) => {
      return map(arrValue, (item) => item.value);
    };

    switch (titlePopup) {
      case titlePopupHandle.ADD_PRODUCT: {
        const params = {
          type: getObjectPropSafely(() => type.value),
          product_name: name,
          level_1: levelMin,
          level_2: levelMax,
        };

        setLoadingSubmit(true);

        const result: any = await reportMarketing.create(params, "content-id-cpa-setups/");

        if (result && result.data) {
          const { id = "", product_name = "", level_1, level_2, type } = result.data;

          store.dispatch(
            updateFilterContentId({
              dataAttributeProduct: [
                ...dataAttributeProduct,
                {
                  type,
                  levelOne: type === TYPE_RANKING.CPA ? level_1 : fNumber(level_1 * 100),
                  levelTwo: type === TYPE_RANKING.CPA ? level_2 : fNumber(level_2 * 100),
                  label: product_name,
                  value: id,
                },
              ],
            })
          );

          setNotifications({
            message: "Thêm thành công",
            variant: statusNotification.SUCCESS,
          });
        }

        setLoadingSubmit(false);

        break;
      }
      case titlePopupHandle.EDIT_PRODUCT: {
        const params = {
          id: form.id,
          type: getObjectPropSafely(() => type.value),
          product_name: name,
          level_1: levelMin,
          level_2: levelMax,
        };

        setLoadingSubmit(true);

        const result: any = await reportMarketing.update(params, "content-id-cpa-setups/");

        if (result && result.data) {
          const { id = "", product_name = "", level_1, level_2, type } = result.data;

          const newArrData = [...dataAttributeProduct].reduce(
            (prevArr: any[], current: SelectOptionType) => {
              return id === current.value
                ? [
                    ...prevArr,
                    {
                      type,
                      levelOne: type === TYPE_RANKING.CPA ? level_1 : fNumber(level_1 * 100),
                      levelTwo: type === TYPE_RANKING.CPA ? level_2 : fNumber(level_2 * 100),
                      label: product_name,
                      value: id,
                    },
                  ]
                : [...prevArr, current];
            },
            []
          );

          store.dispatch(
            updateFilterContentId({
              dataAttributeProduct: [
                ...dataAttributeProduct,
                {
                  type,
                  levelOne: type === TYPE_RANKING.CPA ? level_1 : fNumber(level_1 * 100),
                  levelTwo: type === TYPE_RANKING.CPA ? level_2 : fNumber(level_2 * 100),
                  label: product_name,
                  value: id,
                },
              ],
            })
          );

          setNotifications({
            message: "Cập nhật thành công",
            variant: statusNotification.SUCCESS,
          });
        }

        setLoadingSubmit(false);

        break;
      }
      case titlePopupHandle.ADD_RULE: {
        const params = {
          name: form.name,
          lead_status: convertArr(form.lead_status),
          data_status: convertArr(form.data_status),
          bad_data_reason: convertArr(form.bad_data_reason),
          handle_reason: convertArr(form.handle_reason),
          customer_ids: convertArr(form.customer_ids),
          colorcode: form.color,
        };

        setLoadingSubmit(true);

        const result: any = await reportMarketing.create(params, "lead-classification/");

        if (result && result.data) {
          store.dispatch(
            updateFilterContentId({
              dataAttributeRule: [
                ...dataAttributeRule,
                {
                  ...result.data,
                  label: getObjectPropSafely(() => result.data.name),
                  value: getObjectPropSafely(() => result.data.id),
                },
              ],
            })
          );

          setNotifications({
            message: "Thêm thành công",
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandle.EDIT_RULE: {
        const params = {
          id: form.id,
          name: form.name,
          lead_status: convertArr(form.lead_status),
          data_status: convertArr(form.data_status),
          bad_data_reason: convertArr(form.bad_data_reason),
          handle_reason: convertArr(form.handle_reason),
          customer_ids: convertArr(form.customer_ids),
          colorcode: form.color,
        };

        setLoadingSubmit(true);

        const result: any = await reportMarketing.update(params, "lead-classification/");

        if (result && result.data) {
          const { id } = result.data;
          const newArrData = [...dataAttributeRule].reduce(
            (prevArr: any[], current: SelectOptionType) => {
              return id === current.value
                ? [
                    ...prevArr,
                    {
                      ...result.data,
                      label: getObjectPropSafely(() => result.data.name),
                      value: getObjectPropSafely(() => result.data.id),
                    },
                  ]
                : [...prevArr, current];
            },
            []
          );

          store.dispatch(
            updateFilterContentId({
              dataAttributeRule: newArrData,
            })
          );

          setNotifications({
            message: "Cập nhật thành công",
            variant: statusNotification.SUCCESS,
          });
        }
      }
    }

    closePopup();
  };

  const handleDelete = async (type: string, objValue: SelectOptionType) => {
    switch (type) {
      case titlePopupHandle.DELETE_PRODUCT: {
        const params = {
          id: objValue.value,
        };

        const result: any = await reportMarketing.remove(params, "content-id-cpa-setups/");

        if (result) {
          store.dispatch(
            updateFilterContentId({
              dataAttributeProduct: filter(
                dataAttributeProduct,
                (item) => item.value !== objValue.value
              ),
            })
          );

          setNotifications({
            message: "Xóa thành công",
            variant: statusNotification.SUCCESS,
          });
        }

        break;
      }
      case titlePopupHandle.DELETE_RULE: {
        const params = {
          id: objValue.value,
        };

        const result: any = await reportMarketing.remove(params, "lead-classification/");

        if (result) {
          store.dispatch(
            updateFilterContentId({
              dataAttributeRule: filter(dataAttributeRule, (item) => item.value !== objValue.value),
            })
          );

          setNotifications({
            message: "Xóa thành công",
            variant: statusNotification.SUCCESS,
          });
        }
      }
    }
  };

  const handleRenderDataItem = () => {
    return map(dataAttributeProduct, (item) => ({
      ...item,
      content: (
        <>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography style={{ fontSize: 14 }}>{item.label}</Typography>
            <Span
              variant={theme.palette.mode === "light" ? "ghost" : "filled"}
              color={item.type === TYPE_RANKING.CPA ? "warning" : "info"}
            >
              {find(optionRanking, (current) => current.value === item.type)?.label}
            </Span>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
            <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"}>
              {TYPE_RANKING.CPA === item.type ? fValueVnd(item.levelOne) : `${item.levelOne}%`}
            </Span>
            <ArrowRightAltIcon />
            <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"}>
              {TYPE_RANKING.CPA === item.type ? fValueVnd(item.levelTwo) : `${item.levelTwo}%`}
            </Span>
          </Stack>
        </>
      ),
    }));
  };

  const option = useMemo(() => {
    return {
      optionLeadStatus: FULL_LEAD_STATUS_OPTIONS,
      optionDataStatus: filterIsShowOptions(leadSlice.attributes.data_status),
      optionBadDataStatus: filterIsShowOptions(leadSlice.attributes.bad_data_reason),
      optionHandleReason: filterIsShowOptions(leadSlice.attributes.handle_reason),
      optionCustomer: filter(
        dataFilterAdAccount,
        (item: { type: string }) => item.type === "GOOGLE"
      ),
    };
  }, [
    leadSlice.attributes.data_status,
    leadSlice.attributes.bad_data_reason,
    leadSlice.attributes.handle_reason,
    dataFilterAdAccount,
  ]);

  const handleRenderDataItemRule = () => {
    return map(dataAttributeRule, (item) => ({
      ...item,
      content: (
        <Stack spacing={0.3}>
          <Stack direction="row" alignItems="center" justifyContent="start" spacing={1}>
            <Chip
              size="small"
              label={item.label}
              sx={{
                backgroundColor: item.colorcode,
                color: "#fff",
              }}
            />
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => handleUpdateAttribute(titlePopupHandle.SHOW_UPLOAD_LOGS, item)}
            >
              <HistoryIcon />
            </Box>
          </Stack>
          <Grid container sx={{ mt: 1 }} spacing={2}>
            {map(STATUS, (current, index) => {
              const dataStatus = reduce(
                option[current.keyOption as keyof typeof option],
                (prevArr, status: SelectOptionType) => {
                  return (item[current.value] || []).includes(status.value)
                    ? [...prevArr, status.label]
                    : prevArr;
                },
                []
              );

              return dataStatus.length ? (
                <Grid
                  key={index}
                  item
                  container
                  xs={12}
                  direction="row"
                  alignItems="center"
                  columnGap={1}
                >
                  <Typography variant="body2" component="span">
                    {current.label}:
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    divider={
                      current.isDivider ? (
                        <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"}>
                          or
                        </Span>
                      ) : null
                    }
                  >
                    {map(dataStatus, (status) => (
                      <Span
                        key={status}
                        color="warning"
                        variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      >
                        {status}
                      </Span>
                    ))}
                  </Stack>
                </Grid>
              ) : null;
            })}
          </Grid>
        </Stack>
      ),
    }));
  };

  const dataRender = useMemo(() => {
    return [
      {
        title: "Xếp hạng theo sản phẩm",
        dataItem: handleRenderDataItem(),
        titlePopupAdd: titlePopupHandle.ADD_PRODUCT,
        titlePopupEdit: titlePopupHandle.EDIT_PRODUCT,
        titlePopupDelete: titlePopupHandle.DELETE_PRODUCT,
      },
      {
        title: "Rule phân loại",
        dataItem: handleRenderDataItemRule(),
        titlePopupAdd: titlePopupHandle.ADD_RULE,
        titlePopupEdit: titlePopupHandle.EDIT_RULE,
        titlePopupDelete: titlePopupHandle.DELETE_RULE,
      },
    ];
  }, [dataAttributeProduct, dataAttributeRule, option]);

  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      {dataRender.map((item: any, index: number) => {
        return (
          <Grid key={index} xs={12} md={6} item>
            <AttributeCollapse
              title={item.title}
              dataRenderAttribute={item.dataItem}
              labelDialog="Bạn chắc chắn muốn xóa?"
              handleAdd={() => handleUpdateAttribute(item.titlePopupAdd)}
              handleEdit={(objValue: SelectOptionType) =>
                handleUpdateAttribute(item.titlePopupEdit, objValue)
              }
              handleDelete={(objValue: SelectOptionType) =>
                handleDelete(item.titlePopupDelete, objValue)
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Attributes;
