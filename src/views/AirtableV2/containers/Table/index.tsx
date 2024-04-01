import omit from "lodash/omit";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { LinearProgress, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { skycomtableApi } from "_apis_/skycomtable.api";

import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";
import { AirtableContext, AirtableProvider } from "../../context";

import { GridSizeType } from "_types_/GridLayoutType";
import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableData,
  AirTableField,
  AirTableFieldConfig,
  AirTableRow,
  AirTableView,
  AirTableViewTypes,
  InsertColumnProps,
  InsertRowProps,
  LinkRecordProps,
} from "_types_/SkyTableType";
import { ROLE_OPTION, STATUS_ROLE_SKYCOM_TABLE } from "constants/rolesTab";
import { a11yPropsUtil } from "utils/a11yPropsUtil";
import { convertColumnToField, standardView } from "utils/skyTableUtil";
import {
  convertArrayFieldToObject,
  convertFieldsToColumns,
  convertRecordsToData,
  handleDeleteCell,
  handleDeleteField,
  handleMultiDeleteCell,
  handleMultiNewCell,
  handleNewCell,
  handleNewField,
  handleNewRecord,
  handleNewView,
} from "views/AirtableV2/utils/tableUtils";
import { AirtableViewIcons } from "../../constants";

import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

import { MTabPanel } from "components/Tabs";
import Header from "views/AirtableV2/components/Header";
import MenuConfigView from "../../components/MenuConfigView";
import MenuRecord from "../../components/MenuRecord";
import GridView from "../../components/views/Grid";
import KanbanView from "../../components/views/Kanban";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";

function Table() {
  const [viewIndex, setViewIndex] = useState(0);
  const [viewWaitIndex, setViewWaitIndex] = useState(-1);
  const linkTables = useRef<{ [key: string]: AirTableBase }>({});

  const theme = useTheme();
  const { user } = useAuth();
  const { id } = useParams();
  const { newCancelToken } = useCancelToken();
  const navigate = useNavigate();

  const { dataPopupChild, setDataPopupChild, closePopupChild } = usePopup();

  const {
    state: {
      data: { detailTable, listRecords, tableLogs, listTable },
      loading,
    },
    permission,
    updateLoading,
    updateData,
  } = useContext(AirtableContext);

  const userGroupId = user?.group_permission?.id;

  const isCanEditTable = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE]
  );

  const isEdit =
    userGroupId &&
    isReadAndWriteRole(user?.is_superuser, detailTable?.options?.permission?.[userGroupId]);
  const isRead =
    userGroupId &&
    isMatchRoles(user?.is_superuser, detailTable?.options?.permission?.[userGroupId]);

  useEffect(() => {
    userGroupId && id && getTable(id);
  }, [id, userGroupId]);

  useEffect(() => {
    // viewWaitIndex !== -1 => vừa thêm view mới, navigate qua view mới thêm
    if (viewWaitIndex !== -1) {
      setViewIndex(viewWaitIndex);
      setViewWaitIndex(-1);
    }
  }, [detailTable?.views]);

  const getLinkTable = async (id: string) => {
    const result = await skycomtableApi.getId(
      {
        id,
        cancelToken: newCancelToken(),
      },
      `table/`
    );

    if (result && result.data) {
      linkTables.current[result.data.id] = result.data;
    }
  };

  const fieldConfigsObject: { [key: string]: AirTableFieldConfig } = useMemo(
    () =>
      convertArrayFieldToObject({
        fieldConfigs: detailTable?.views[viewIndex]?.visible_fields,
        fields: detailTable?.fields,
      }),
    [detailTable?.views[viewIndex]?.visible_fields, detailTable?.fields]
  );

  const columns: AirTableColumn[] = useMemo(
    () =>
      convertFieldsToColumns({
        fieldConfigsObject,
        fields: detailTable?.fields,
        linkTables,
        getLinkTable,
      }),
    [detailTable?.fields, fieldConfigsObject]
  );

  const data: AirTableData[] = useMemo(
    () =>
      convertRecordsToData({
        listRecords,
        columns,
      }),
    [columns, listRecords]
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    if (detailTable?.views?.[newValue]?.id) {
      getView(detailTable.views[newValue].id || "");
      setViewIndex(newValue);
    }
  };

  const getTable = async (id: string) => {
    updateLoading(true);

    const result = await skycomtableApi.getId(
      {
        id,
        cancelToken: newCancelToken(),
      },
      `table/`
    );

    if (result && result.data) {
      const isEdit =
        userGroupId &&
        isReadAndWriteRole(user?.is_superuser, result.data?.options?.permission?.[userGroupId]);
      const isRead =
        userGroupId &&
        isMatchRoles(user?.is_superuser, result.data?.options?.permission?.[userGroupId]);

      if (!(isCanEditTable || isEdit || isRead)) {
        navigate("/404");
        return;
      }
      updateData({
        detailTable: result.data,
        listRecords: Object.keys(result.data.records).map((recordId: string) => ({
          id: recordId,
          fields: result.data.records[recordId],
        })),
      });
    } else {
      navigate("/404");
    }
    updateLoading(false);
  };

  const deleteTable = async (id: AirTableBase["id"]) => {
    updateLoading(true);
    const result = await skycomtableApi.remove({}, `table/${id}/`);
    if (result && result.data) {
      navigate("/scheduler");
    } else {
      dispatch(
        toastError({
          message: "Lỗi cập nhật. Vui lòng thử lại",
        })
      );
    }
    updateLoading(false);
  };

  const updateTable = async (
    data: Partial<AirTableBase>,
    action?: (newData: AirTableBase) => void
  ) => {
    updateLoading(true);

    const payload = {
      ...detailTable,
      ...data,
    };

    const result = await skycomtableApi.update(
      {
        ...omit(payload, ["views", "records", "fields"]),
        cancelToken: newCancelToken(),
      },
      `table/${id}/`
    );

    if (result && result.data) {
      updateData({
        detailTable: {
          ...detailTable,
          ...result.data,
        },
      });
      action && action(result.data);
    } else {
      dispatch(
        toastError({
          message: "Lỗi cập nhật. Vui lòng thử lại",
        })
      );
    }
    updateLoading(false);
  };

  const getTableLogs = async () => {
    updateLoading(true);
    const result = await skycomtableApi.get(
      {
        cancelToken: newCancelToken(),
      },
      `table/logs/`
    );

    if (result && result.data) {
      updateData({
        tableLogs: result.data,
      });
    }
    updateLoading(false);
  };

  const getView = async (id: string) => {
    updateLoading(true);

    const result = await skycomtableApi.getId(
      {
        id,
        cancelToken: newCancelToken(),
      },
      `table/views/`
    );

    if (result && result.data && detailTable) {
      const index = detailTable.views?.findIndex((item) => item.id === id);
      if (index !== -1) {
        detailTable.views[index] = result.data;
        updateData({
          detailTable: {
            ...detailTable,
          },
        });
      }
    }
    updateLoading(false);
  };

  const updateRecord = async (data: any, action?: (newData: any) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.update(
      {
        ...data,
        cancelToken: newCancelToken(),
      },
      `table/${id}/records/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const updateCells = async (data: AirTableCell[], action?: (newData: AirTableCell[]) => void) => {
    updateLoading(true);
    const result = await skycomtableApi.update({ cells: data }, `table/cells/`);

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const updateField = async (field: AirTableField, action?: (newData: AirTableField) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.update(
      {
        ...field,
        // cancelToken: newCancelToken(),
      },
      `table/${id}/fields/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const updateView = async (view: AirTableView, action?: (newData: AirTableView) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.update(
      {
        ...view,
        // cancelToken: newCancelToken(),
      },
      `table/${id}/views/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const deleteField = async (
    id: AirTableColumn["id"],
    action?: (newData: AirTableField) => any
  ) => {
    updateLoading(true);
    const result = await skycomtableApi.remove(
      {
        // cancelToken: newCancelToken(),
        id,
      },
      `table/fields/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const deleteView = async (id: AirTableView["id"], action?: (newData: AirTableField) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.remove(
      {
        // cancelToken: newCancelToken(),
        id,
      },
      `table/views/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const deleteRecord = async (id: AirTableRow["id"], action?: (newData: any) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.remove(
      {
        // cancelToken: newCancelToken(),
        id,
      },
      `table/records/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const deleteCell = async (id: AirTableCell["id"], action?: (newData: AirTableCell) => any) => {
    updateLoading(true);
    const result = await skycomtableApi.remove(
      {
        // cancelToken: newCancelToken(),
        id,
      },
      `table/cells/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    updateLoading(false);
  };

  const onChangeColumn = (
    column: AirTableColumn,
    optional?: {
      insertColumn: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => {
    let newField = convertColumnToField(column);

    updateField(
      {
        ...newField,
        id: newField.id,
      },
      handleNewField({
        detailTable,
        viewIndex,
        newField,
        optional,
        listRecords,
        column,
        updateCells,
        getTable,
        onChangeView,
      })
    );
    optional?.action && optional.action();
  };

  const onChangeRow = (
    row: AirTableData,
    records: AirTableRow[],
    optional?: { insertRow: InsertRowProps; action?: (result?: any) => void }
  ) => {
    let newRecord: any = { id: row.id };

    updateRecord(
      {
        ...newRecord,
        id: newRecord.id,
      },
      handleNewRecord({
        records,
        newRecord,
        optional,
        updateData,
      })
    );
  };

  const onChangeView = (
    newView: AirTableView,
    optional?: {
      action?: (result: AirTableView) => void;
      fields?: AirTableField[];
      records?: AirTableRow[];
    }
  ) => {
    updateView(
      {
        ...newView,
        id: newView.id,
      },
      handleNewView({
        detailTable,
        newView,
        optional,
        updateData,
        setViewWaitIndex,
      })
    );
  };

  const onChangeCell = (
    cell: AirTableCell,
    records: AirTableRow[],
    optional?: { action?: (result?: AirTableCell[]) => void }
  ) => {
    cell.cell.value
      ? updateCells(
          [cell],
          handleNewCell({
            records,
            cell,
            optional,
            updateData,
          })
        )
      : deleteCell(
          cell.id,
          handleDeleteCell({
            records,
            cell,
            optional,
            updateData,
          })
        );
  };

  const onChangeMultiCell = async (
    cells: AirTableCell[],
    records: AirTableRow[],
    optional?: {
      action?: (result?: AirTableCell[]) => void;
      message?: {
        loading: string;
        error: string;
        success: string;
      };
    }
  ) => {
    const cellsToDelete = cells.filter((cell) => !cell.cell.value);
    const cellsToUpdate = cells.filter((cell) => cell.cell.value);

    let promises: Promise<any>[] = [];

    if (cellsToDelete.length > 0)
      promises = [
        ...cellsToDelete.map(async (cell) => {
          deleteCell(
            cell.id,
            handleMultiDeleteCell({
              records,
              updateData,
            })
          );
        }),
      ];
    if (cellsToUpdate.length > 0)
      promises = [
        ...promises,
        updateCells(
          cellsToUpdate,
          handleMultiNewCell({
            records,
            optional,
            updateData,
          })
        ),
      ];

    // await Promise.all(promises)

    toast.promise(Promise.all(promises), {
      loading: optional?.message?.loading || "",
      success: optional?.message?.success || "",
      error: optional?.message?.error || "",
    });
  };

  const onDeleteField = (id: AirTableColumn["id"]) => {
    deleteField(
      id,
      handleDeleteField({
        id,
        detailTable,
        viewIndex,
        onChangeView,
      })
    );
  };

  const onDeleteRow = (id: AirTableRow["id"]) => {
    const action = () => {
      const records = listRecords.filter((record: AirTableRow) => record.id !== id);
      updateData({
        listRecords: records,
      });
    };

    deleteRecord(id, action);
  };

  const onDeleteView = (id: AirTableView["id"]) => {
    const action = () => {
      setViewIndex(0);
      const views = detailTable?.views?.filter((view: AirTableView) => view.id !== id);

      updateData({
        detailTable: {
          ...detailTable,
          views,
        },
      });
    };

    deleteView(id, action);
  };

  const onOpenLinkRecordPopup = (props: LinkRecordProps) => {
    const { dataTable, cell, column, row, records, onChange } = props;
    let title = dataTable?.name;
    let isShowFooter = false;
    let maxWidthForm: GridSizeType = "lg";

    let newContentRender = () => {
      return (
        <MenuRecord
          dataTable={dataTable}
          recordIds={cell?.value?.map((item) => item.record_id) || []}
          recordDisplay={column?.options?.recordDisplay || ""}
          onChange={onChange(cell, column, row, records)}
          onClose={closePopupChild}
        />
      );
    };

    setDataPopupChild({
      ...dataPopupChild,
      maxWidthForm,
      isOpenPopup: true,
      title,
      isShowFooter,
      funcContentRender: newContentRender,
    });
  };

  const handleSetLinkTable = (newLinkTables: { [key: string]: AirTableBase }) => {
    linkTables.current = newLinkTables;
  };

  return (
    <Box pt={1}>
      <Header updateTable={updateTable} deleteTable={deleteTable} onChangeView={onChangeView} />
      <Box>
        {loading && <LinearProgress />}
        {detailTable?.views && detailTable?.views?.length > 0 && (
          <Box>
            <Tabs
              value={viewIndex < 0 ? false : viewIndex}
              onChange={handleChange}
              aria-label="views"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 1 }}
            >
              {detailTable?.views?.map((view: AirTableView, tabIndex: number) => {
                const isEditView =
                  isCanEditTable ||
                  isEdit ||
                  (userGroupId &&
                    isReadAndWriteRole(
                      user?.is_superuser,
                      view.options?.permission?.[userGroupId]
                    ));

                const isShowView =
                  (userGroupId && view.options?.permission?.[userGroupId]) ||
                  isCanEditTable ||
                  isEdit ||
                  isRead;

                let standardedView = standardView(view, columns);
                return (
                  isShowView && (
                    <Tab
                      label={
                        <Stack direction={"row"} spacing={1} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: 13,
                              minWidth: 120,
                              maxWidth: 320,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textAlign: "left",
                            }}
                          >
                            {view.name}
                          </Typography>
                          {isEditView && (
                            <MenuConfigView
                              disabled={tabIndex === 0}
                              view={standardedView}
                              onUpdateView={onChangeView}
                              onDeleteView={onDeleteView}
                              buttonStyles={{
                                color: "inherit",
                                ".MuiSvgIcon-root": {
                                  fontSize: "1.2rem",
                                  color: "inherit",
                                },
                              }}
                            />
                          )}
                        </Stack>
                      }
                      value={tabIndex}
                      icon={AirtableViewIcons[view.type]}
                      {...a11yPropsUtil(tabIndex)}
                      key={tabIndex}
                      sx={{
                        mr: "4px!important",
                        pl: "4px!important",
                        border: `1px solid ${theme.palette.divider}`,
                        ".MuiSvgIcon-root": {
                          fontSize: "1.4rem",
                        },
                      }}
                    />
                  )
                );
              })}
            </Tabs>
            {detailTable?.views?.map((view: AirTableView, tabPanelIndex: number) => {
              const isEditView =
                isCanEditTable ||
                isEdit ||
                (userGroupId &&
                  isReadAndWriteRole(user?.is_superuser, view.options?.permission?.[userGroupId]));

              const isShowView =
                (userGroupId && view.options?.permission?.[userGroupId]) ||
                isCanEditTable ||
                isEdit ||
                isRead;
              let standardedView = standardView(view, columns);
              return (
                isShowView && (
                  <MTabPanel key={view.name} index={tabPanelIndex} value={viewIndex}>
                    {view.type === AirTableViewTypes.GRID && (
                      <GridView
                        columns={columns}
                        data={data}
                        view={standardedView}
                        fieldConfigsObject={fieldConfigsObject}
                        linkTables={linkTables.current}
                        setLinkTables={handleSetLinkTable}
                        onChangeColumn={onChangeColumn}
                        onChangeRow={onChangeRow}
                        onChangeView={onChangeView}
                        onChangeCell={onChangeCell}
                        onChangeMultiCell={onChangeMultiCell}
                        onDeleteField={onDeleteField}
                        onDeleteRow={onDeleteRow}
                        onOpenLinkRecordPopup={onOpenLinkRecordPopup}
                        onUpdateTable={updateTable}
                        viewPermission={
                          isEditView
                            ? ROLE_OPTION.READ_AND_WRITE
                            : isRead
                            ? ROLE_OPTION.READ
                            : view.options?.permission?.[user?.group_permission?.id || ""]
                        }
                      />
                    )}
                    {view.type === AirTableViewTypes.KANBAN && (
                      <KanbanView
                        columns={columns}
                        data={data}
                        view={standardedView}
                        fieldConfigsObject={fieldConfigsObject}
                        linkTables={linkTables.current}
                        setLinkTables={handleSetLinkTable}
                        onChangeColumn={onChangeColumn}
                        onChangeRow={onChangeRow}
                        onChangeView={onChangeView}
                        onChangeCell={onChangeCell}
                        onDeleteField={onDeleteField}
                        onDeleteRow={onDeleteRow}
                        onOpenLinkRecordPopup={onOpenLinkRecordPopup}
                        viewPermission={
                          isEditView
                            ? ROLE_OPTION.READ_AND_WRITE
                            : isRead
                            ? ROLE_OPTION.READ
                            : view.options?.permission?.[user?.group_permission?.id || ""]
                        }
                      />
                    )}
                  </MTabPanel>
                )
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function TableContainer() {
  return (
    <AirtableProvider>
      <Table />
    </AirtableProvider>
  );
}
