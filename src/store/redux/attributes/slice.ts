import { ALL_OPTION } from "constants/index";
import { createSlice } from "@reduxjs/toolkit";
import { store } from "store";
import map from "lodash/map";
import forEach from "lodash/forEach";
import reduce from "lodash/reduce";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

// Services
import { deliveryApi } from "_apis_/delivery.api";
import { productApi } from "_apis_/product";
import { skytableApi } from "_apis_/skytable.api";
import { orderApi } from "_apis_/order.api";
import { userApi } from "_apis_/user.api";
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";
import { windflowApi } from "_apis_/windflow.api";

// Types
import { CREDENTIAL_TYPE, DATA_CREDENTIAL_TYPE } from "_types_/DataFlowType";
import {
  TransportationAttributeGroupType,
  TransportationCareTaskType,
} from "_types_/TransportationType";
import { TypeWarehouseSheet, WarehouseType } from "_types_/WarehouseType";
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants & Utils
import { typeHandleProduct } from "views/ProductView/constants";
import { airtableMarketingApi } from "_apis_/marketing/airtable.api";
import { facebookApi } from "_apis_/facebook.api";
import { googleInfo } from "_apis_/google.api";
import { reportMarketing } from "_apis_/marketing/report_marketing.api";
import { TYPE_RANKING } from "views/ReportContentIdView/constants";
import { fNumber } from "utils/formatNumber";
import { yyyy_MM_dd } from "constants/time";
import { dashboard } from "_apis_/dashboard.api";

export interface AttributesState {
  shipping: {
    deliveryCompany: SelectOptionType[];
  };
  warehouse: {
    importReason: SelectOptionType[];
    exportReason: SelectOptionType[];
    transferReason: SelectOptionType[];
    stocktakingReason: SelectOptionType[];
    listWarehouse: SelectOptionType[];
  };
  product: {
    dataCategory: SelectOptionType[];
    dataType: SelectOptionType[];
    dataBrand: SelectOptionType[];
    dataSupplier: SelectOptionType[];
    dataTags: SelectOptionType[];
    variantAttributes: SelectOptionType[];
  };
  manageFile: {
    attributes: SelectOptionType[];
  };
  cskh: {
    attributes: SelectOptionType[];
  };
  transportationCare: {
    lateReason: SelectOptionType[];
    lateAction: SelectOptionType[];
    waitReturnReason: SelectOptionType[];
    waitReturnAction: SelectOptionType[];
    returningReason: SelectOptionType[];
    returningAction: SelectOptionType[];
    returnedReason: SelectOptionType[];
    returnedAction: SelectOptionType[];
    fetched: boolean;
  };
  setting: {
    departments: SelectOptionType[];
    fetched: boolean;
  };
  keyMapReport: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  dataFlow: {
    [CREDENTIAL_TYPE.GOOGLE]: SelectOptionType[];
    [CREDENTIAL_TYPE.SKY_FEATURE]: SelectOptionType[];
    [CREDENTIAL_TYPE.WORKPLACE_CHATBOT]: SelectOptionType[];
  };
  content_id: {
    dataFilterCreator: SelectOptionType[];
    dataFilterDesign: SelectOptionType[];
    dataFilterFanpage: SelectOptionType[];
    dataFilterDigitalFb: SelectOptionType[];
    dataFilterDigitalGg: SelectOptionType[];
    dataFilterProduct: SelectOptionType[];
    dataFilterAdAccount: SelectOptionType[];
    dataFilterCustomer: SelectOptionType[];
    dataFilterTeam: SelectOptionType[];
    dataAttributeProduct: SelectOptionType[];
    dataAttributeRule: SelectOptionType[];
  };
}

const initialState: AttributesState = {
  shipping: {
    deliveryCompany: [],
  },
  warehouse: {
    importReason: [],
    exportReason: [],
    transferReason: [],
    stocktakingReason: [],
    listWarehouse: [],
  },
  product: {
    dataCategory: [],
    dataType: [],
    dataBrand: [],
    dataSupplier: [],
    dataTags: [],
    variantAttributes: [],
  },
  manageFile: {
    attributes: [],
  },
  cskh: {
    attributes: [],
  },
  transportationCare: {
    lateReason: [],
    lateAction: [],
    waitReturnReason: [],
    waitReturnAction: [],
    returningReason: [],
    returningAction: [],
    returnedReason: [],
    returnedAction: [],
    fetched: false,
  },
  setting: {
    departments: [],
    fetched: false,
  },
  keyMapReport: {},
  dataFlow: {
    [CREDENTIAL_TYPE.GOOGLE]: [],
    [CREDENTIAL_TYPE.SKY_FEATURE]: [],
    [CREDENTIAL_TYPE.WORKPLACE_CHATBOT]: [],
  },
  content_id: {
    dataFilterCreator: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterDesign: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterFanpage: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterDigitalFb: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterDigitalGg: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterProduct: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterAdAccount: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterCustomer: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterTeam: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataAttributeProduct: [],
    dataAttributeRule: [],
  },
};

export const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    updateAttributesShipping: (state, action) => {
      const { payload } = action;

      state.shipping = {
        ...state.shipping,
        ...payload,
      };
    },
    updateAttributesWarehouse: (state, action) => {
      const { payload } = action;

      state.warehouse = {
        ...state.warehouse,
        ...payload,
      };
    },
    updateAttributesProduct: (state, action) => {
      const { payload } = action;

      state.product = {
        ...state.product,
        ...payload,
      };
    },
    updateAttributesManageFile: (state, action) => {
      const { payload } = action;

      state.manageFile = {
        ...state.manageFile,
        ...payload,
      };
    },
    updateAttributesCskh: (state, action) => {
      const { payload } = action;

      state.cskh = {
        ...state.cskh,
        ...payload,
      };
    },
    updateAttributesTransportationCare: (state, action) => {
      const { payload } = action;

      state.transportationCare = {
        ...state.transportationCare,
        ...payload,
      };
    },
    updateAttributesSetting: (state, action) => {
      const { payload } = action;

      state.setting = {
        ...state.setting,
        ...payload,
      };
    },
    updateKeyMapReport: (state, action) => {
      const { payload } = action;

      state.keyMapReport = {
        ...state.keyMapReport,
        ...payload,
      };
    },
    updateAttributesDataFlow: (state, action) => {
      const { payload } = action;

      state.dataFlow = {
        ...state.dataFlow,
        ...payload,
      };
    },
    updateFilterContentId: (state, action) => {
      const { payload } = action;

      state.content_id = {
        ...state.content_id,
        ...payload,
      };
    },
  },
});

export default attributesSlice.reducer;

export const {
  updateAttributesShipping,
  updateAttributesWarehouse,
  updateAttributesProduct,
  updateAttributesManageFile,
  updateAttributesCskh,
  updateAttributesTransportationCare,
  updateAttributesSetting,
  updateKeyMapReport,
  updateAttributesDataFlow,
  updateFilterContentId,
} = attributesSlice.actions;

export const getListAttributesShipping = async () => {
  const result = await deliveryApi.get({}, "delivery-company/");

  if (result && result.data) {
    const { results = [] } = result.data;

    const newData = map(results, (item: WarehouseType) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));

    store.dispatch(
      updateAttributesShipping({
        deliveryCompany: newData,
      })
    );
  }
};

export const getListAttributesWarehouse = async () => {
  const result = await productApi.get({ limit: 50 }, "warehouse-sheet/reason/");

  if (result && result.data) {
    const { results = [] } = result.data;

    let dataImportsReason: SelectOptionType[] = [];
    let dataExportsReason: SelectOptionType[] = [];
    let dataTransferReason: SelectOptionType[] = [];
    let dataStocktakingReason: SelectOptionType[] = [];

    forEach(results, (option: { id: number; name: string; type: string }) => {
      switch (option.type) {
        case TypeWarehouseSheet.IMPORTS: {
          dataImportsReason.push({
            label: option.name,
            value: option.id,
          });

          break;
        }
        case TypeWarehouseSheet.EXPORTS: {
          dataExportsReason.push({
            label: option.name,
            value: option.id,
          });

          break;
        }
        case TypeWarehouseSheet.TRANSFER: {
          dataTransferReason.push({
            label: option.name,
            value: option.id,
          });

          break;
        }
        case TypeWarehouseSheet.STOCKTAKING: {
          dataStocktakingReason.push({
            label: option.name,
            value: option.id,
          });

          break;
        }
      }
    });

    store.dispatch(
      updateAttributesWarehouse({
        importReason: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...dataImportsReason,
        ],
        exportReason: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...dataExportsReason,
        ],
        transferReason: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...dataTransferReason,
        ],
        stocktakingReason: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...dataStocktakingReason,
        ],
      })
    );
  }
};

export const getListWarehouse = async () => {
  const result = await productApi.get({}, "warehouse/");

  if (result && result.data) {
    const { results = [] } = result.data;

    const newData = map(results, (item: WarehouseType) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));

    store.dispatch(
      updateAttributesWarehouse({
        listWarehouse: newData,
      })
    );
  }
};

export const getListOption = async () => {
  const result: any = await productApi.get(
    {
      limit: 100,
    },
    "option/"
  );
  if (result.data) {
    const { results = [] } = result.data;
    let newDataCategory: SelectOptionType[] = [];
    let newDataType: SelectOptionType[] = [];
    let newDataBrand: SelectOptionType[] = [];
    let newDataUnit: SelectOptionType[] = [];

    forEach(results, (item: any) => {
      const { type, name, id, code } = item;
      switch (type) {
        case typeHandleProduct.CATEGORY: {
          newDataCategory = [
            ...newDataCategory,
            {
              label: name,
              value: id,
              code,
            },
          ];
          break;
        }
        case typeHandleProduct.TYPE: {
          newDataType = [
            ...newDataType,
            {
              label: name,
              value: id,
              code,
            },
          ];
          break;
        }
        case typeHandleProduct.UNIT: {
          newDataUnit = [
            ...newDataUnit,
            {
              label: name,
              value: id,
              code,
            },
          ];
          break;
        }
        case typeHandleProduct.BRAND: {
          newDataBrand = [
            ...newDataBrand,
            {
              label: name,
              value: id,
              code,
            },
          ];
          break;
        }
      }
    });

    store.dispatch(
      updateAttributesProduct({
        dataCategory:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataCategory,
          ] || [],
        dataType:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataType,
          ] || [],
        dataBrand:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataBrand,
          ] || [],
      })
    );
  }
};

export const getListTags = async () => {
  const result: any = await productApi.get(
    {
      limit: 200,
    },
    "tag/"
  );
  if (result.data) {
    const { results = [] } = result.data;
    const newDataTags = results.reduce((prevArr: any[], current: { id: number; tag: string }) => {
      return [
        ...prevArr,
        {
          label: current.tag,
          value: current.id,
        },
      ];
    }, []);

    store.dispatch(
      updateAttributesProduct({
        dataTags: newDataTags,
      })
    );
  }
};

export const getListSupplier = async () => {
  const result: any = await productApi.get(
    {
      limit: 50,
    },
    "supplier/"
  );
  if (result.data) {
    const { results = [] } = result.data;
    const newDataSupplier = results.reduce(
      (prevArr: any[], current: { id: number; name: string }) => {
        return [
          ...prevArr,
          {
            label: current.name,
            value: current.id,
            ...current,
          },
        ];
      },
      []
    );

    store.dispatch(
      updateAttributesProduct({
        dataSupplier:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataSupplier,
          ] || [],
      })
    );
  }
};

export const getListVariantAttributes = async () => {
  const result: any = await productApi.get({}, "attribute/");
  if (result.data) {
    const { results = [] } = result.data;
    const newDataAttribute = results.reduce(
      (prevArr: any[], current: { id: number; name: string }) => {
        return [
          ...prevArr,
          {
            label: current.name,
            value: current.id,
          },
        ];
      },
      []
    );

    store.dispatch(
      updateAttributesProduct({
        variantAttributes: newDataAttribute,
      })
    );
  }
};

export const getListAttributesSkytable = async () => {
  const result: any = await skytableApi.get({}, "attributes/");

  if (result.data) {
    const { results = [] } = result.data;
    let attributesCskh: SelectOptionType[] = [];
    let attributesManageFile: SelectOptionType[] = [];
    forEach(results, (item) => {
      if (item.type === 2) {
        attributesManageFile = [
          ...attributesManageFile,
          {
            value: item.id,
            label: item.name,
            attributeValue: map(item.value, (itemValue) => ({
              value: itemValue.id,
              label: itemValue.value,
              extra: itemValue.extra,
            })),
          },
        ];
      }

      if (item.type === 1) {
        attributesCskh = [
          ...attributesCskh,
          {
            value: item.id,
            label: item.name,
            attributeValue: map(item.value, (itemValue) => ({
              value: itemValue.id,
              label: itemValue.value,
              extra: itemValue.extra,
            })),
          },
        ];
      }
    });

    store.dispatch(
      updateAttributesManageFile({
        attributes: attributesManageFile,
      })
    );

    store.dispatch(
      updateAttributesCskh({
        attributes: attributesCskh,
      })
    );
  }
};

export const getListTransporationCareReason = async (type: TransportationCareTaskType) => {
  const result = await orderApi.get<TransportationAttributeGroupType>({
    endpoint: "transportation-care-reason/",
    params: {
      limit: 500,
      page: 1,
      type,
    },
  });

  if (result.data) {
    const { results = [] } = result.data;

    const newData = results.map((item) => ({
      ...item,
      value: item.label,
    }));

    switch (type) {
      case TransportationCareTaskType.LATE: {
        store.dispatch(
          updateAttributesTransportationCare({
            lateReason: newData,
          })
        );
        break;
      }
      case TransportationCareTaskType.RETURNING: {
        store.dispatch(
          updateAttributesTransportationCare({
            returningReason: newData,
          })
        );
        break;
      }
      case TransportationCareTaskType.WAIT_RETURN: {
        store.dispatch(
          updateAttributesTransportationCare({
            waitReturnReason: newData,
          })
        );
        break;
      }
      case TransportationCareTaskType.RETURNED: {
        store.dispatch(
          updateAttributesTransportationCare({
            returnedReason: newData,
          })
        );
        break;
      }
      default:
        break;
    }
  }
};

export const getListTransporationCareAction = async (type: TransportationCareTaskType) => {
  const result = await orderApi.get<{ id: number; label: string }>({
    endpoint: "transportation-care-action/",
    params: {
      limit: 500,
      page: 1,
      type,
    },
  });

  if (result.data) {
    const { results = [] } = result.data;

    const newData = results.map((item) => ({
      ...item,
      value: item.label,
    }));

    switch (type) {
      case TransportationCareTaskType.LATE: {
        store.dispatch(
          updateAttributesTransportationCare({
            lateAction: newData,
          })
        );
        break;
      }
      case TransportationCareTaskType.RETURNING: {
        store.dispatch(
          updateAttributesTransportationCare({
            returningAction: newData,
          })
        );
        break;
      }
      case TransportationCareTaskType.WAIT_RETURN: {
        store.dispatch(
          updateAttributesTransportationCare({
            waitReturnAction: newData,
          })
        );
        break;
      }
      case TransportationCareTaskType.RETURNED: {
        store.dispatch(
          updateAttributesTransportationCare({
            returnedAction: newData,
          })
        );
        break;
      }
      default:
        break;
    }
  }
};

export const addNewTransporationCareAction = async (
  payload: { label: string; type: TransportationCareTaskType },
  actions: SelectOptionType[],
  optional: any
) => {
  const { type } = payload;

  optional?.setLoading(true);
  const result = await orderApi.create<{ id: number; label: string }>({
    endpoint: "transportation-care-action/",
    params: {
      ...payload,
    },
  });

  if (result.data) {
    store.dispatch(
      updateAttributesTransportationCare({
        ...(type === TransportationCareTaskType.LATE && {
          lateAction: [...actions, result.data],
        }),
        ...(type === TransportationCareTaskType.RETURNING && {
          returningAction: [...actions, result.data],
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          waitReturnAction: [...actions, result.data],
        }),
        ...(type === TransportationCareTaskType.RETURNED && {
          returnedAction: [...actions, result.data],
        }),
      })
    );
    optional?.onClosePopup();
  }

  optional?.setLoading(false);
};

export const addNewTransporationCareReason = async (
  payload: { label: string; type: TransportationCareTaskType },
  reasons: SelectOptionType[],
  optional: any
) => {
  const { type } = payload;

  optional?.setLoading(true);
  const result = await orderApi.create<{ id: number; label: string }>({
    endpoint: "transportation-care-reason/",
    params: {
      ...payload,
    },
  });

  if (result.data) {
    store.dispatch(
      updateAttributesTransportationCare({
        ...(type === TransportationCareTaskType.LATE && {
          lateReason: [...reasons, result.data],
        }),
        ...(type === TransportationCareTaskType.RETURNING && {
          returningReason: [...reasons, result.data],
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          waitReturnReason: [...reasons, result.data],
        }),
        ...(type === TransportationCareTaskType.RETURNED && {
          returnedReason: [...reasons, result.data],
        }),
      })
    );
    optional?.onClosePopup();
  }

  optional?.setLoading(false);
};

export const updateTransporationCareAction = async (
  payload: { label: string; type: TransportationCareTaskType; id: number },
  actions: SelectOptionType[],
  optional: any
) => {
  const { type, id } = payload;

  optional?.setLoading(true);
  const result = await orderApi.update<{ id: number; label: string }>({
    endpoint: `transportation-care-action/${id}/`,
    params: {
      label: payload.label,
    },
    optional: {
      errorMessage: "Lỗi cập nhật. Vui lòng thử lại",
    },
  });

  if (result.data) {
    const newData = actions.map((item) => (item.id === id ? result.data : item));
    store.dispatch(
      updateAttributesTransportationCare({
        ...(type === TransportationCareTaskType.LATE && {
          lateAction: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNING && {
          returningAction: newData,
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          waitReturnAction: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNED && {
          returnedAction: newData,
        }),
      })
    );
    optional?.onClosePopup();
  }

  optional?.setLoading(false);
};

export const updateTransporationCareReason = async (
  payload: { label: string; type: TransportationCareTaskType; id: number },
  reasons: SelectOptionType[],
  optional: any
) => {
  const { type, id } = payload;

  optional?.setLoading(true);
  const result = await orderApi.update<{ id: number; label: string }>({
    endpoint: `transportation-care-reason/${id}/`,
    params: {
      label: payload.label,
    },
    optional: {
      errorMessage: "Lỗi cập nhật. Vui lòng thử lại",
    },
  });

  if (result.data) {
    const newData = reasons.map((item) => (item.id === id ? result.data : item));
    store.dispatch(
      updateAttributesTransportationCare({
        ...(type === TransportationCareTaskType.LATE && {
          lateReason: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNING && {
          returningReason: newData,
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          waitReturnReason: newData,
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          returnedReason: newData,
        }),
      })
    );
    optional?.onClosePopup();
  }

  optional?.setLoading(false);
};

export const removeTransporationCareAction = async (
  payload: { type: TransportationCareTaskType; id: number },
  actions: SelectOptionType[],
  optional: any
) => {
  const { type, id } = payload;

  optional?.setLoading(true);
  const result = await orderApi.remove<{ id: number; label: string }>({
    endpoint: `transportation-care-action/${id}/`,
  });

  if (result.data) {
    const newData = actions.filter((item: any) => item.id !== id);
    store.dispatch(
      updateAttributesTransportationCare({
        ...(type === TransportationCareTaskType.LATE && {
          lateAction: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNING && {
          returningAction: newData,
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          waitReturnAction: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNED && {
          returnedAction: newData,
        }),
      })
    );
  }

  optional?.setLoading(false);
};

export const removeTransporationCareReason = async (
  payload: { type: TransportationCareTaskType; id: number },
  reasons: SelectOptionType[],
  optional: any
) => {
  const { type, id } = payload;

  optional?.setLoading(true);
  const result = await orderApi.remove<{ id: number; label: string }>({
    endpoint: `transportation-care-reason/${id}/`,
  });

  if (result.data) {
    const newData = reasons.filter((item: any) => item.id !== id);
    store.dispatch(
      updateAttributesTransportationCare({
        ...(type === TransportationCareTaskType.LATE && {
          lateReason: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNING && {
          returningReason: newData,
        }),
        ...(type === TransportationCareTaskType.WAIT_RETURN && {
          waitReturnReason: newData,
        }),
        ...(type === TransportationCareTaskType.RETURNED && {
          returnedReason: newData,
        }),
      })
    );
  }

  optional?.setLoading(false);
};

export const getListDepartment = async () => {
  const result: any = await userApi.get(
    {
      limit: 500,
      page: 1,
    },
    "user-department/"
  );

  if (result.data) {
    const { results = [] } = result.data;

    store.dispatch(
      updateAttributesSetting({
        departments: results.map((item: { id: string; name: string }) => ({
          value: item.id,
          label: item.name,
        })),
      })
    );
  }
};

export const addNewDepartment = async (
  payload: { name: string },
  list: SelectOptionType[],
  optional: any
) => {
  optional?.setLoading(true);
  const result = await userApi.create(payload, "user-department/");

  if (result.data) {
    const { name, id }: any = result.data;
    store.dispatch(
      updateAttributesSetting({
        departments: [...list, { label: name, value: id }],
      })
    );
    optional?.onClosePopup();
  }

  optional?.setLoading(false);
};

export const updateDepartment = async (
  payload: { name: string; id: number },
  list: SelectOptionType[],
  optional: any
) => {
  const { name, id } = payload;

  optional?.setLoading(true);
  const result = await userApi.update(
    {
      name,
    },
    `user-department/${id}/`
  );

  if (result.data) {
    const newData = list.map((item) => (item.value === id ? { label: name, value: id } : item));
    store.dispatch(
      updateAttributesSetting({
        departments: newData,
      })
    );
    optional?.onClosePopup();
  }

  optional?.setLoading(false);
};

export const removeDepartment = async (
  payload: { id: string },
  list: SelectOptionType[],
  optional?: any
) => {
  const { id } = payload;

  optional?.setLoading(true);
  const result = await userApi.remove(`user-department/${id}/`);
  if (result?.status === 204) {
    const newData = list.filter((item: any) => item.value !== id);
    store.dispatch(
      updateAttributesSetting({
        departments: newData,
      })
    );
  }

  optional?.setLoading(false);
};

export const getListKeyMapReport = async () => {
  const result: any = await dashboardMkt.get({}, "report/keymap/");
  if (result.data) {
    store.dispatch(updateKeyMapReport(result.data));
  }
};

export const getListAttributesDataFlow = async () => {
  const result = await windflowApi.get({}, "credentials");

  if (result && result.data) {
    const { data = [] } = result.data;

    const dataGoogle = reduce(
      data,
      (prevArr, current: DATA_CREDENTIAL_TYPE) => {
        return current?.credential?.type === CREDENTIAL_TYPE.GOOGLE
          ? [
              ...prevArr,
              {
                ...current?.credential?.data,
                value: current.id,
                label: current.name,
              },
            ]
          : prevArr;
      },
      []
    );

    const dataSkyFeature = reduce(
      data,
      (prevArr, current: DATA_CREDENTIAL_TYPE) => {
        return current?.credential?.type === CREDENTIAL_TYPE.SKY_FEATURE
          ? [
              ...prevArr,
              {
                ...current?.credential?.data,
                value: current.id,
                label: current.name,
              },
            ]
          : prevArr;
      },
      []
    );

    const dataWorkplaceChatbot = reduce(
      data,
      (prevArr, current: DATA_CREDENTIAL_TYPE) => {
        return current?.credential?.type === CREDENTIAL_TYPE.WORKPLACE_CHATBOT
          ? [
              ...prevArr,
              {
                ...current?.credential?.data,
                value: current.id,
                label: current.name,
              },
            ]
          : prevArr;
      },
      []
    );

    store.dispatch(
      updateAttributesDataFlow({
        [CREDENTIAL_TYPE.GOOGLE]: dataGoogle,
        [CREDENTIAL_TYPE.SKY_FEATURE]: dataSkyFeature,
        [CREDENTIAL_TYPE.WORKPLACE_CHATBOT]: dataWorkplaceChatbot,
      })
    );
  }
};

export const getListFilterOption = async () => {
  const result: any = await airtableMarketingApi.get({}, "options/");
  if (result.data) {
    const { content_creators, content_designers, digital_fb, digital_gg, product, team } =
      result.data;
    const newDataCreator = content_creators.map((item: any) => {
      return {
        label: item,
        value: item,
      };
    });

    const newDataDesign = content_designers.map((item: any) => {
      return {
        label: item,
        value: item,
      };
    });

    const newDigitalFb = digital_fb.map((item: any) => {
      return {
        label: item,
        value: item,
      };
    });

    const newDigitalGg = digital_gg.map((item: any) => {
      return {
        label: item,
        value: item,
      };
    });

    const products = product.map((item: any) => {
      return {
        label: item,
        value: item,
      };
    });

    const newTeam = team.map((item: any) => {
      return {
        label: item,
        value: item,
      };
    });

    store.dispatch(
      updateFilterContentId({
        dataFilterCreator:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataCreator,
          ] || [],
        dataFilterDesign:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataDesign,
          ] || [],
        dataFilterDigitalFb:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDigitalFb,
          ] || [],
        dataFilterDigitalGg:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDigitalGg,
          ] || [],
        dataFilterProduct:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...products,
          ] || [],
        dataFilterTeam:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newTeam,
          ] || [],
      })
    );
  }
};

export const getListFacebookFanpage = async () => {
  const result = await facebookApi.get(
    {
      page: 1,
      limit: 200,
      date_from: format(subDays(new Date(), 30), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 1), yyyy_MM_dd),
    },
    "fanpages/"
  );

  if (result && result.data) {
    const { results = [] } = result.data;
    const newData = results.map((item: any) => {
      const { page_id, name } = item;

      return {
        value: page_id,
        label: name,
      };
    });

    store.dispatch(
      updateFilterContentId({
        dataFilterFanpage:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newData,
          ] || [],
      })
    );
  }
};

export const getListCustomer = async () => {
  const result: any = await googleInfo.get(
    {
      page: 1,
      limit: 100,
    },
    "report/customer/"
  );

  if (result && result.data) {
    const { results = [] } = result.data;
    const newData = results.map((item: any) => {
      const { customer_id, customer_name } = item;

      return {
        value: customer_id,
        label: customer_name,
      };
    });

    store.dispatch(
      updateFilterContentId({
        dataFilterCustomer:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newData,
          ] || [],
      })
    );
  }
};

export const getListAttribute = async () => {
  const result: any = await reportMarketing.get({}, "content-id-cpa-setups/");

  if (result && result.data) {
    const { results = [] } = result.data;

    const newData = results.map(
      (item: {
        id: number;
        level_1: number;
        level_2: number;
        product_name: string;
        type: TYPE_RANKING;
      }) => {
        return {
          type: item.type,
          levelOne: item.type === TYPE_RANKING.CPA ? item.level_1 : fNumber(item.level_1 * 100),
          levelTwo: item.type === TYPE_RANKING.CPA ? item.level_2 : fNumber(item.level_2 * 100),
          label: item.product_name,
          value: item.id,
        };
      }
    );

    store.dispatch(
      updateFilterContentId({
        dataAttributeProduct: newData || [],
      })
    );
  }
};

export const getListAdAccount = async () => {
  const result: any = await dashboard.get({ limit: 100 }, "marketing-ad-accounts/");

  if (result && result.data) {
    const { facebook_account = [], google_account } = result.data;

    const newData = [
      ...(map(facebook_account, (item: any) => {
        const { ad_account_id, ad_account_name } = item;
        return {
          value: ad_account_id,
          label: ad_account_name,
          type: "FACEBOOK",
        };
      }) || []),
      ...(map(google_account, (item: any) => {
        const { customer_id, name } = item;
        return {
          value: customer_id,
          label: name,
          type: "GOOGLE",
        };
      }) || []),
    ];

    store.dispatch(
      updateFilterContentId({
        dataFilterAdAccount: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...(newData || []),
        ],
      })
    );
  }
};

export const getListRule = async () => {
  const result: any = await reportMarketing.get({}, "lead-classification/");

  if (result && result.data) {
    const { results = [] } = result.data;

    const newData = results.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.id,
      };
    });

    store.dispatch(
      updateFilterContentId({
        dataAttributeRule: newData || [],
      })
    );
  }
};
