// Libraries
import { find, reduce } from "lodash";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";

// Services
import { windflowApi } from "_apis_/windflow.api";

// Context
import { dispatch as dispatchStore } from "store";
import { toastError, toastSuccess } from "store/redux/toast/slice";

// Components
import {
  Box,
  Card,
  Grid,
  Stack,
  SxProps,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
  styled,
} from "@mui/material";
import { MButton } from "components/Buttons";
import { MultiSelect } from "components/Selectors";
import { ExpressionField } from "./ExpressionField";
import LoadingModal from "components/Loadings/LoadingModal";
import DataPreview from "views/DataFlow/components/NodeOperation/DataPreview";
import DatetimeCalculate from "views/DataFlow/components/NodeOperation/DatetimeCalculate";
import DatetimeRange from "views/DataFlow/components/NodeOperation/DatetimeRange";
import Merge from "views/DataFlow/components/NodeOperation/Merge";
import ShortCircuit from "views/DataFlow/components/NodeOperation/ShortCircuit";
import SkyFeature from "views/DataFlow/components/NodeOperation/SkyFeature";
import Transform from "views/DataFlow/components/NodeOperation/Transform";
import WorkplaceChatbot from "views/DataFlow/components/NodeOperation/WorkplaceChatbot";

// Types
import { FlowType } from "_types_/DataFlowType";
import { FormValuesProps } from "components/Popups/FormPopup";

// Contants & Utils
import { handleParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  FORMAT_DISPLAY,
  NODE_TYPE,
  OPTION_FORMAT_FILTER,
  OPTION_FORMAT_TYPE,
  OPTION_TIME,
  convertParamsApiNode,
  initNodeDefault,
} from "views/DataFlow/constants";

// ---------------------------------------------------
export interface OperationProps extends UseFormReturn<FormValuesProps, object> {
  flowSelected: FlowType;
  inputFilter?: string;
  index?: number;
  children?: JSX.Element;
  fieldKeyChild?: string[];
}

export interface ProviderProps extends OperationProps {
  field: ControllerRenderProps<FormValuesProps, any>;
}

const OperationFilter = forwardRef(
  (
    {
      containerStyles,
      fieldValue,
      changeFormat,
    }: {
      changeFormat?: (value: FORMAT_DISPLAY) => void;
      containerStyles?: SxProps<Theme>;
      fieldValue?: FORMAT_DISPLAY;
    },
    ref
  ) => {
    return (
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          position: "absolute",
          right: 0,
          top: -25,
          zIndex: 100,
          ...containerStyles,
        }}
        ref={ref}
      >
        <TabsStyled
          value={fieldValue}
          onChange={(e, value: FORMAT_DISPLAY) => {
            changeFormat && changeFormat(value);
          }}
          aria-label="input_format_type"
        >
          {OPTION_FORMAT_FILTER.map((item) => (
            <TabStyled label={item.label} value={item.value} key={item.value} />
          ))}
        </TabsStyled>
      </Stack>
    );
  }
);

export const ProviderFilter = (props: ProviderProps) => {
  const { children, setValue, watch, fieldKeyChild = [], field, flowSelected } = props;
  const valueNode = watch();

  // State
  const [hover, setHover] = useState<HTMLElement | null>(null);
  const [format, setFormat] = useState(FORMAT_DISPLAY.FIXED);

  useEffect(() => {
    setFormat(
      getObjectPropSafely(
        () =>
          valueNode.static_data.formatFilter[fieldKeyChild.length ? fieldKeyChild[0] : field.name]
      ) || FORMAT_DISPLAY.FIXED
    );
  }, []);

  const handleHoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setHover(event.currentTarget);
  };

  const handleHoverClose = () => {
    setHover(null);
  };

  const handleChangeFormat = (value: FORMAT_DISPLAY) => {
    setValue("static_data", {
      ...valueNode.static_data,
      formatFilter: {
        ...(getObjectPropSafely(() => valueNode.static_data.formatFilter) || {}),
        ...(fieldKeyChild.length
          ? reduce(
              fieldKeyChild,
              (prevObj, current) => {
                return { ...prevObj, [current]: value };
              },
              {}
            )
          : {
              [field.name]: value,
            }),
      },
    });

    setFormat(value);
    handleInputExpression("");
  };

  const handleInputExpression = (value: string) => {
    field.onChange(
      fieldKeyChild.length
        ? {
            ...field.value,
            ...reduce(
              fieldKeyChild,
              (prevObj, current) => {
                return { ...prevObj, [current]: value };
              },
              {}
            ),
          }
        : value
    );
  };

  const nodes = useMemo(() => {
    return reduce(
      flowSelected?.nodes,
      (prevArr, current) => {
        return valueNode.id !== current.id
          ? [
              ...prevArr,
              {
                ...current,
                label: getObjectPropSafely(() => current.data.name),
                value: current.id,
              },
            ]
          : prevArr;
      },
      []
    );
  }, []);

  return (
    <Grid
      onMouseEnter={handleHoverOpen}
      onMouseLeave={handleHoverClose}
      spacing={0.2}
      item
      sx={{ position: "relative" }}
    >
      <OperationFilter
        fieldValue={format}
        containerStyles={{ visibility: hover ? "visible" : "hidden" }}
        changeFormat={(value: FORMAT_DISPLAY) => handleChangeFormat(value)}
      />
      {}
      {format === FORMAT_DISPLAY.FIXED && children}
      {format === FORMAT_DISPLAY.INPUT && (
        <ExpressionField
          options={[...nodes, ...OPTION_TIME]}
          onChange={handleInputExpression}
          value={
            fieldKeyChild.length
              ? getObjectPropSafely(() => valueNode[field.name][fieldKeyChild[0]])
              : getObjectPropSafely(() => valueNode[field.name])
          }
        />
      )}
    </Grid>
  );
};

const NodeOperation = (props: OperationProps) => {
  const { watch, control, flowSelected, setValue } = props;
  const valueNode: any = watch();
  const nodes = useMemo(() => {
    return reduce(
      flowSelected?.nodes,
      (prevArr, current) => {
        return valueNode.id !== current.id
          ? [
              ...prevArr,
              {
                ...current,
                label: getObjectPropSafely(() => current.data.name),
                value: current.id,
              },
            ]
          : prevArr;
      },
      []
    );
  }, []);

  const nodesConnection = useMemo(() => {
    return reduce(
      flowSelected.edges,
      (prevArr, current) => {
        if (current.target === valueNode.id) {
          const node =
            find(flowSelected.nodes, (item) => item.id === current.source) || initNodeDefault;

          return [
            ...prevArr,
            {
              ...node,
              label: getObjectPropSafely(() => node.data.name),
              value: node.id,
            },
          ];
        }

        return prevArr;
      },
      []
    );
  }, []);

  // State
  const [inputFormatType, setInputFormatType] = useState(FORMAT_DISPLAY.JSON);
  const [outputFormatType, setOutputFormatType] = useState(FORMAT_DISPLAY.JSON);
  const [isLoadingInputData, setLoadingInputData] = useState(false);
  const [isLoadingOutputData, setLoadingOutputData] = useState(false);
  const [inputFilter, setInputFilter] = useState(
    getObjectPropSafely(() => valueNode.static_data.input) ||
      getObjectPropSafely(() => nodesConnection[0].id) ||
      getObjectPropSafely(() => nodes[0].id)
  );
  const [inputData, setInputData] = useState(undefined);
  const [outputData, setOutputData] = useState(undefined);

  useEffect(() => {
    if (inputFilter) {
      getDataInput({
        id: inputFilter,
      });

      setValue("static_data", {
        ...valueNode.static_data,
        input: inputFilter,
      });
    }
  }, [inputFilter]);

  const getDataInput = async (params: Partial<any>) => {
    setLoadingInputData(true);
    const result: any = await windflowApi.getId(
      {
        ...params,
      },
      `workflows/${flowSelected.id}/executor/`
    );

    if (result && result.data) {
      const { data } = result.data;
      setInputData(data);
    }

    setLoadingInputData(false);
  };

  const handleFetchDataInput = async () => {
    const node = find(nodes, (item) => item.id === inputFilter);

    if (node) {
      setLoadingInputData(true);
      const result: any = await windflowApi.create(
        {
          id: node.id,
          type: node.type,
          parameters: handleParams(convertParamsApiNode(node.type, node.data)),
        },
        `workflows/${flowSelected.id}/executor`
      );

      if (result && result.data) {
        setInputData(result.data.data);
        dispatchStore(toastSuccess({ message: "Thực thi thành công" }));
      }

      setLoadingInputData(false);
    }
  };

  const handleFetchDataOutput = async () => {
    setLoadingOutputData(true);
    const result: any = await windflowApi.create(
      {
        id: valueNode.id,
        type: valueNode.type,
        parameters: handleParams(convertParamsApiNode(valueNode.type, valueNode)),
      },
      `workflows/${flowSelected.id}/executor`
    );

    if (result && result.data) {
      setOutputData(result.data.data);
      dispatchStore(toastSuccess({ message: "Thực thi thành công" }));
    }

    setLoadingOutputData(false);
  };

  const renderContent = () => {
    switch (valueNode.type) {
      case NODE_TYPE.WORKPLACE_CHATBOT: {
        return <WorkplaceChatbot {...props} inputFilter={inputFilter} />;
      }
      case NODE_TYPE.SKY_FEATURE: {
        return <SkyFeature {...props} inputFilter={inputFilter} />;
      }
      case NODE_TYPE.TRANSFORM: {
        return <Transform {...props} inputFilter={inputFilter} />;
      }
      case NODE_TYPE.DATETIME_RANGE: {
        return <DatetimeRange {...props} inputFilter={inputFilter} />;
      }
      case NODE_TYPE.SHORT_CIRCUIT: {
        return <ShortCircuit {...props} inputFilter={inputFilter} />;
      }
      case NODE_TYPE.DATETIME_CALCULATE: {
        return <DatetimeCalculate {...props} inputFilter={inputFilter} />;
      }
      case NODE_TYPE.MERGE_PARAMETER: {
        return <Merge {...props} inputFilter={inputFilter} />;
      }

      default:
        return;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4.5}>
        <Grid item container>
          <Stack direction="row" alignItems="center" columnGap={2} width="100%">
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Input
            </Typography>
            <MultiSelect
              title="Dữ liệu"
              size="medium"
              outlined
              selectorId="node_type"
              fullWidth
              options={nodes}
              onChange={setInputFilter}
              defaultValue={inputFilter}
              simpleSelect
              style={{ maxWidth: 220 }}
            />

            <TabsStyled
              value={inputFormatType}
              onChange={(e, value: FORMAT_DISPLAY) => setInputFormatType(value)}
              aria-label="input_format_type"
            >
              {OPTION_FORMAT_TYPE.map((item) => (
                <TabStyled label={item.label} value={item.value} key={item.value} />
              ))}
            </TabsStyled>
          </Stack>
        </Grid>
        <Grid item container sx={{ position: "relative" }}>
          {isLoadingInputData && <LoadingModal />}
          <DataPreview
            payload={inputData}
            formatDisplay={inputFormatType}
            emptyDataProps={{
              description: !inputFilter
                ? "Node nhận được Input Data khi được kết nối với một node khác"
                : "Không có dữ liệu",
              ...(inputFilter && { buttonLabel: "Fetch Data" }),
              buttonProps: {
                onClick: handleFetchDataInput,
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid item container xs={3}>
        <Card sx={{ width: "100%", p: 3, py: 4 }}>
          <Box display="flex" justifyContent="end">
            <MButton
              size="small"
              sx={{ mb: 2 }}
              onClick={handleFetchDataOutput}
              disabled={isLoadingOutputData}
              isLoading={isLoadingOutputData}
            >
              Execute code
            </MButton>
          </Box>

          <Stack rowGap={3}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  value={field.value}
                  error={!!error?.message}
                  helperText={error?.message}
                  label="Name"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  value={field.value}
                  error={!!error?.message}
                  helperText={error?.message}
                  label="Description"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />

            {renderContent()}
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={4.5}>
        <Grid item container>
          <Stack direction="row" alignItems="center" columnGap={2} width="100%">
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Ouput
            </Typography>

            <TabsStyled
              value={outputFormatType}
              onChange={(e, value: FORMAT_DISPLAY) => setOutputFormatType(value)}
              aria-label="output_format_type"
            >
              {OPTION_FORMAT_TYPE.map((item) => (
                <TabStyled label={item.label} value={item.value} key={item.value} />
              ))}
            </TabsStyled>
          </Stack>
        </Grid>
        <Grid item container sx={{ position: "relative" }}>
          {isLoadingOutputData && <LoadingModal />}
          <DataPreview
            payload={outputData}
            formatDisplay={outputFormatType}
            emptyDataProps={{ description: "Không có dữ liệu" }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NodeOperation;

const TabStyled = styled(Tab)(({ theme }) => ({
  "&.MuiTab-root": {
    borderRadius: "8px",
    minHeight: 30,
  },
  "&.Mui-selected": {
    border: "none",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  "&.MuiTab-root:not(:last-of-type)": {
    marginRight: "4px",
  },
  fontSize: 10,
}));

const TabsStyled = styled(Tabs)(({ theme }) => ({
  marginLeft: "auto",
  ".MuiTabs-flexContainer": {
    backgroundColor: theme.palette.grey[400],
    padding: 0,
    borderRadius: "8px",
  },

  "& .MuiTabs-indicator": {
    display: "none",
  },
}));
