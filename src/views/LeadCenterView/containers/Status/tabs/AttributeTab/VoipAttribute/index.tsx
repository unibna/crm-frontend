//hooks
import useAuth from "hooks/useAuth";
import useIsMountedRef from "hooks/useIsMountedRef";
import { useCallback, useEffect, useState } from "react";

//components
import LoadingButton from "@mui/lab/LoadingButton";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { MExpandMoreIconButton } from "components/Buttons";
import ModifiedAttributePopover from "components/Popovers/ModifiedAttributePopover";
import VoipAttributeFormModal from "./VoipAttributeFormModal";

//utils
import { HEIGHT_DEVICE } from "constants/index";
import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_ATTRIBUTE } from "constants/rolesTab";
import map from "lodash/map";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";

//apis
import { skycallApi } from "_apis_/skycall.api";

export interface CallAttribute {
  id?: number;
  value: string;
}

const Item = ({ row, getData }: { row: CallAttribute; getData: () => void }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();

  const handleToggleModal = () => {
    setShowEditModal((prev) => !prev);
  };

  const handleUpdate = async (itemData?: CallAttribute) => {
    if (itemData?.id) {
      const data = await skycallApi.update<CallAttribute>({
        params: itemData,
        endpoint: `call-attribute/${itemData.id}/`,
      });
      if (data.data) {
        getData();
      }
    }
  };

  const handleDelete = async (itemData?: CallAttribute) => {
    if (itemData?.id) {
      const data = await skycallApi.remove(`call-attribute/${itemData.id}/`);
      if (data.data) {
        getData();
      }
    }
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        py={1}
        key={row?.toString()}
        style={{ paddingBottom: 0 }}
      >
        <VoipAttributeFormModal
          onSubmit={handleUpdate}
          item={row}
          isShowModal={showEditModal}
          setShowModal={(open) => setShowEditModal(open)}
        />
        <div style={{ marginLeft: 20, display: "flex", flex: 1 }}>
          <Typography
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              flex: 1,
            }}
          >
            {row.value}
          </Typography>
        </div>
        {isReadAndWriteRole(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS]
        ) && (
          <div style={{ width: 80 }}>
            <ModifiedAttributePopover
              handleEdit={handleToggleModal}
              handleDelete={() => handleDelete(row)}
              status={{ loading: false, error: false, type: null }}
            />
          </div>
        )}
      </Stack>
    </>
  );
};

const VoipAttribute = () => {
  const [data, setData] = useState<{ data: CallAttribute[]; loading: boolean }>({
    data: [],
    loading: false,
  });
  const [expanded, setExpanded] = useState(false);
  const isMounted = useIsMountedRef();

  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await skycallApi.get<CallAttribute>({
      params: { limit: 200, page: 1 },
      endpoint: "call-attribute/",
    });
    if (result.data) {
      const { data = [], total = 0 } = result.data;
      setData((prev) => ({ ...prev, data, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCreate = async (itemData?: CallAttribute) => {
    const data = await skycallApi.create<{
      landing_page_url: string;
      product: number;
    }>({ params: itemData, endpoint: "call-attribute/" });
    if (data.data) {
      getData();
      setShowEditModal(false);
      return;
    }
  };

  useEffect(() => {
    if (expanded && isMounted.current) {
      getData();
    }
  }, [isMounted, expanded, getData]);

  return (
    <Grid item xs={12} style={{ padding: 8 }}>
      <VoipAttributeFormModal
        onSubmit={handleCreate}
        isShowModal={showEditModal}
        setShowModal={(open) => setShowEditModal(open)}
      />
      <Paper elevation={3}>
        <Stack direction="row" alignItems="center" py={2} pr={3} component={Paper} elevation={2}>
          <div style={{ width: 60, marginLeft: 10 }}>
            <MExpandMoreIconButton
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            />
          </div>
          <Typography gutterBottom component="label" style={{ width: "100%", marginLeft: 8 }}>
            Loại cuộc gọi
          </Typography>
          {isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS]
          ) && (
            <LoadingButton
              onClick={() => setShowEditModal(true)}
              variant="contained"
              loading={data.loading}
            >
              Thêm
            </LoadingButton>
            // <Button onClick={() => setShowEditModal(true)} variant="contained">
            // </Button>
          )}
        </Stack>
        <TableContainer style={{ maxHeight: HEIGHT_DEVICE - 220, marginBottom: 5 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {data.data.length > 0 ? (
              map(
                data.data.sort((a: any, b: any) => a?.label?.localeCompare(b?.label)),
                (row, idx) => {
                  return <Item row={row} key={idx} getData={getData} />;
                }
              )
            ) : (
              <Stack direction="column" justifyContent="center" alignItems="center" py={3}>
                Không có dữ liệu
              </Stack>
            )}
          </Collapse>
        </TableContainer>
      </Paper>
    </Grid>
  );
};

export default VoipAttribute;
