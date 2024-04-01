import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ROLE_TAB, STATUS_ROLE_ATTRIBUTE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { useContext, useEffect, useMemo, useState } from "react";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import map from "lodash/map";
//hook
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { phoneLeadApi } from "_apis_/lead.api";
import { MExpandMoreIconButton } from "components/Buttons";
import { HEIGHT_DEVICE } from "constants/index";
import useIsMountedRef from "hooks/useIsMountedRef";
import { stringToSlug } from "utils/helpers";
import { isMatchRoles } from "utils/roleUtils";
import SpamListItem from "./SpamListLandiItem";
import SpamListLandiModal from "./SpamListLandiModal";
export interface MappingType {
  id?:string,
  landingpage_url: string;
  product_name?: string,
  product_id?: string,
  modified?: string;
  tenant: {
    name?: string,
    id?: string   
  },
}

const SpamListLandiMapping = ({ isShowModified }: { isShowModified?: boolean }) => {
  const context = useContext(PhoneLeadContext);

  const { user } = useAuth();
  const isMounted = useIsMountedRef();

  const [data, setData] = useState<MappingType[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const createLinkLandipage = async (itemData?: MappingType) => {
    setShowEditModal(false);
    const data = await phoneLeadApi.createLinkLandipage<{
      landingpage_url: string;
      product_name: string;
      tenant: string;
    }>({
      form: {
        landingpage_url: itemData?.landingpage_url,
        product_name: itemData?.product_name?.toString(),
        tenant: itemData?.tenant
      },
    });
    if (data.data) {
      getData();
      //context?.getDomainProduct();
    }
  };
  
  const getData = async () => {
    const data = await phoneLeadApi.getLinkLandiPage<MappingType>({
      params: { limit: 200, page: 1 }
    });
    if (data.data) {
      setData(data.data);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      // if (context?.landingPageDomain) {
      //   setData(context?.landingPageDomain || []);
      // } else {
      // }
      getData();
    }
  }, [isMounted]);

  const dataRender = useMemo(() => {
    if (search === "") {
      return data;
    }
    return data.filter((item) =>
      stringToSlug(item?.product_name || "").includes(stringToSlug(search))
    );
  }, [data, search]);

  return (
    <Grid item xs={12} style={{ padding: 8 }}>
      { showEditModal &&
        <SpamListLandiModal
        onSubmit={createLinkLandipage}
        isShowModal={showEditModal}
        setShowModal={(open) => setShowEditModal(open)}
        />
      }
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
           Danh sách đường dẫn Landipage
          </Typography>
          {isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS]
          ) && (
            <Button onClick={() => setShowEditModal(true)} variant="contained">
              Thêm
            </Button>
          )}
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {data.length > 0 && (
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
                variant="standard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          )}
          <TableContainer style={{ maxHeight: HEIGHT_DEVICE - 220, marginBottom: 5 }}>
            {dataRender.length > 0 ? (
              map(
                dataRender.sort((a: any, b: any) => a?.label?.localeCompare(b?.label)),
                (row, idx) => {
                  return <SpamListItem row={row} key={idx} isShowModified={isShowModified} getData={getData} />;
                }
              )
            ) : (
              <Stack direction="column" justifyContent="center" alignItems="center" py={3}>
                Không có dữ liệu
              </Stack>
            )}
          </TableContainer>
        </Collapse>
      </Paper>
    </Grid>
  );
};

export default SpamListLandiMapping;
