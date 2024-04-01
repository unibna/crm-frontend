import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { customerApi } from "_apis_/customer.api";
import { CustomerType } from "_types_/CustomerType";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { Page } from "components/Page";
import { TITLE_PAGE } from "constants/index";
import { useState } from "react";
import { isVietnamesePhoneNumber } from "utils/stringsUtil";
import CustomerDetail from "views/CDPView/components/CustomerDetail";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { NoDataPanel } from "components/DDataGrid/components";
import { MTextLine, TitleGroup } from "components/Labels";
import { fDate } from "utils/dateUtil";
import Iconify from "components/Icons/Iconify";

export interface Props {}

const CustomerView = () => {
  const [phone, setPhone] = useState("");
  const [isPhoneValidate, setIsPhoneValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Partial<CustomerType>>();

  const handleSearchCustomer = async () => {
    const isPhoneNumber = isVietnamesePhoneNumber(phone);
    if (isPhoneNumber) {
      setIsPhoneValidate(false);
      setLoading(true);
      const result = await customerApi.getById({ endpoint: `search-3rd/${phone}/` });
      if (result.data) {
        setCustomer(result.data);
      } else {
        setCustomer({ source: "not_found" });
      }
      setLoading(false);
      return;
    }
    setIsPhoneValidate(true);
  };

  const isNotPhoneNumber = isPhoneValidate && !isVietnamesePhoneNumber(phone);
  return (
    <Page title={TITLE_PAGE.CDP}>
      <Box style={{ padding: 8 }}>
        <Paper
          variant="elevation"
          elevation={3}
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            display: "flex",
            border: isNotPhoneNumber ? "1px solid red" : undefined,
          }}
        >
          <Box style={{ display: "flex", flex: 1 }}>
            <InputBase
              sx={{
                flex: 1,
                input: {
                  textAlign: "center",
                  fontSize: "18px !important",
                  fontWeight: "bold",
                  color: isNotPhoneNumber ? "red" : "unset",
                },
              }}
              placeholder="Nhập số điện thoại"
              inputProps={{ "aria-label": "search external customer" }}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchCustomer()}
            />
          </Box>
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSearchCustomer}
          >
            {loading ? <CircularProgress style={{ width: 24, height: 24 }} /> : <SearchIcon />}
          </IconButton>
        </Paper>
        {isNotPhoneNumber && (
          <FormHelperText error style={{ textAlign: "center", marginRight: 40 }}>
            {VALIDATION_MESSAGE.FORMAT_PHONE}
          </FormHelperText>
        )}
      </Box>
      <Box style={{ padding: 8 }}>{loading && <LinearProgress color="primary" />}</Box>
      <Box>
        {customer ? (
          customer?.source === "3rd" ? (
            <Box style={{ padding: 8 }}>
              <Paper elevation={3} style={{ padding: 32 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={8}>
                    <Stack spacing={1}>
                      <TitleGroup style={{ fontSize: 22 }}>Thông tin chung</TitleGroup>
                      <MTextLine label="Tên:" value={customer.full_name_3rd} />
                      <MTextLine label="Số điện thoại:" value={customer.phone} />
                      <MTextLine label="Ngày sinh:" value={fDate(customer.birthday_3rd)} />
                      <MTextLine label="Địa chỉ:" value={customer.address_3rd} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TitleGroup style={{ fontSize: 22 }}>Mạng xã hội</TitleGroup>
                    <Stack direction={"row"} spacing={2}>
                      {customer?.facebook_id_3rd ? (
                        <Iconify
                          icon={"devicon:facebook"}
                          width={40}
                          height={40}
                          sx={{ "&:hover": { cursor: "pointer" } }}
                          onClick={() =>
                            window.open(
                              `https://www.facebook.com/${customer?.facebook_id_3rd}`,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        />
                      ) : null}

                      <Iconify
                        icon={"simple-icons:zalo"}
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        width={40}
                        height={40}
                        color={"#1768aa"}
                        onClick={() =>
                          window.open(
                            `https://zalo.me/${customer?.phone}`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ) : customer.source === "not_found" ? (
            <Box style={{ padding: 8 }}>
              <NoDataPanel
                containerSx={{ minHeight: 400, border: "1px dashed red" }}
                messageStyles={{ fontSize: 16, color: "red" }}
                message="Không tìm thấy thông tin khách hàng"
              />
            </Box>
          ) : (
            <CustomerDetail
              overviewLayoutColumns={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
              }}
              customerDefault={customer}
              isShowTimeline
              isShowTableDetail
            />
          )
        ) : (
          <Box style={{ padding: 8 }}>
            <NoDataPanel
              containerSx={{ minHeight: 400 }}
              messageStyles={{ fontSize: 16 }}
              message="Nhập số điện thoại để tìm kiếm khách hàng"
            />
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default CustomerView;
