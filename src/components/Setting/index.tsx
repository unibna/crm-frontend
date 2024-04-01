import { AnimatePresence, m } from "framer-motion";
import { useEffect } from "react";
// @mui
import { alpha, styled } from "@mui/material/styles";
import { Backdrop, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
// hooks
import useSettings from "hooks/useSettings";
// utils
import { cssStyles } from "utils/cssStyles";
// config
import { NAVBAR } from "constants/index";
//
import Iconify from "components/Icons/Iconify";
//
import SettingMode from "./SettingMode";
import SettingLayout from "./SettingLayout";
import SettingStretch from "./SettingStretch";
import SettingDirection from "./SettingDirection";
import SettingFullscreen from "./SettingFullscreen";
import SettingColorPresets from "./SettingColor";

import Scrollbar from "components/Scrolls/Scrollbar";

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
  top: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  position: "fixed",
  overflow: "hidden",
  width: NAVBAR.BASE_WIDTH,
  flexDirection: "column",
  margin: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 3,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.common.black,
    0.16
  )}`,
}));

// ----------------------------------------------------------------------

export default function Settings() {
  const { onResetSetting, isOpenModal, onShowModal } = useSettings();

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpenModal]);

  const handleClose = () => {
    onShowModal(false);
  };

  return (
    <>
      <Backdrop
        open={isOpenModal}
        onClick={handleClose}
        sx={{ background: "transparent", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />
      <AnimatePresence>
        {isOpenModal && (
          <>
            <RootStyle>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 2, pr: 1, pl: 2.5 }}
              >
                <Typography variant="subtitle1">Settings</Typography>
                <div>
                  <Button onClick={onResetSetting}>
                    <Iconify icon={"ic:round-refresh"} width={20} height={20} />
                  </Button>
                  <Button onClick={handleClose}>
                    <Iconify icon={"eva:close-fill"} width={20} height={20} />
                  </Button>
                </div>
              </Stack>

              <Divider sx={{ borderStyle: "dashed" }} />

              <Scrollbar sx={{ flexGrow: 1 }}>
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Mode</Typography>
                    <SettingMode />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Direction</Typography>
                    <SettingDirection />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Layout</Typography>
                    <SettingLayout />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Presets</Typography>
                    <SettingColorPresets />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Stretch</Typography>
                    <SettingStretch />
                  </Stack>

                  <SettingFullscreen />
                </Stack>
              </Scrollbar>
            </RootStyle>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ----------------------------------------------------------------------

type Props = {
  value: string;
};

export function BoxMask({ value }: Props) {
  return (
    <FormControlLabel
      label=""
      value={value}
      control={<Radio sx={{ display: "none" }} />}
      sx={{
        m: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: "absolute",
      }}
    />
  );
}
