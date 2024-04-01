import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import useSound from "use-sound";
import { useEffect, useState } from "react";

import { useTheme } from "@mui/material";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import TableResultSheetScanned from "./TableResultSheetScanned";

import { orderApi } from "_apis_/order.api";

import vi from "locales/vi.json";

import { toastError, toastSuccess } from "store/redux/toast/slice";
import { store } from "store";

import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

import errorSound from "./sounds/errorSFX.mp3";
import successSound from "./sounds/successSFX.mp3";
import { TypeWarehouseSheet } from "_types_/WarehouseType";

const SOUND_CONFIG = {
  playbackRate: 0.9,
  interrupt: true,
  volume: 0.9,
};
interface Props {
  // open: boolean;
  // handleClose: any;
  type: TypeWarehouseSheet.IMPORTS | TypeWarehouseSheet.EXPORTS;
}

let html5QrCode: Html5Qrcode | undefined;

let qrboxFunction = function (viewfinderWidth: number, viewfinderHeight: number) {
  let minEdgePercentage = 0.5; // 70%
  let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
  let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
  return {
    width: qrboxSize,
    height: qrboxSize,
  };
};

const brConfig = {
  fps: 10,
  qrbox: qrboxFunction,
  aspectRatio: 1,
  disableFlip: true,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true,
  },
  formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
  verbose: true,
};

function ScanOptionV2(props: Props) {
  const { type } = props;

  const theme = useTheme();

  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [waitingScan, setWaitingScan] = useState(false);
  const [scannedList, setScannedList] = useState<
    { order_key: string; is_confirm: boolean; message?: string }[]
  >([]);
  const [sequenceCode, setSequenceCode] = useState<string>("");

  const [playSuccess] = useSound(successSound, SOUND_CONFIG);
  const [playError] = useSound(errorSound, SOUND_CONFIG);

  useEffect(() => {
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode(`reader`, brConfig);
    }
    handleClickAdvanced();
    code && setCode("");
    sequenceCode && setSequenceCode("");
    scannedList.length > 0 && setScannedList([]);
    return () => handleStop();
  }, []);

  useDidUpdateEffect(() => {
    code && setCode("");
    scannedList.length > 0 && setScannedList([]);
  }, [sequenceCode]);

  useEffect(() => {
    if (code && code[0] === "#" && code.length > 6 && /^\d+$/.test(code.slice(1)) && sequenceCode)
      handleConfirm();
  }, [code]);

  const handleClickAdvanced = () => {
    const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      if (
        decodedText &&
        decodedText[0] === "#" &&
        decodedText.length > 6 &&
        /^\d+$/.test(decodedText.slice(1))
      )
        setCode(decodedText);
    };
    const qrCodeErrorCallback = (errorMessage: string, error: any) => {
      console.log("Lỗi quét mã:", errorMessage);
    };

    html5QrCode?.start(
      { facingMode: "environment" },
      brConfig,
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    );
  };

  const handleStop = () => {
    try {
      html5QrCode
        ?.stop()
        .then((res) => {
          html5QrCode?.clear();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    let newList = JSON.parse(JSON.stringify(scannedList));

    const resultApi = await orderApi.create({
      params: { order_key: code, sheet_type: type, turn: sequenceCode },
      endpoint: "sheets/confirm/",
    });

    if (resultApi?.data) {
      playSuccess();
      store.dispatch(
        toastSuccess({
          status: "success",
          message:
            type === TypeWarehouseSheet.IMPORTS ? "Nhập hàng thành công" : "Xuất hàng thành công",
        })
      );

      newList = [
        ...newList,
        {
          order_key: code,
          is_confirm: true,
        },
      ];
    } else {
      const { error } = (resultApi || {}) as any;
      playError();
      store.dispatch(
        toastError({
          status: "error",
          message: error?.data?.length ? error?.data[0] : "Lỗi quét mã",
        })
      );
      newList = [
        ...newList,
        {
          order_key: code,
          is_confirm: false,
          message: error?.data?.length ? error?.data[0] : "Lỗi quét mã",
        },
      ];
    }

    setScannedList(newList);
    setLoading(false);
  };

  const handleStartScan = async () => {
    setWaitingScan(true);
    const resultApi: any = await orderApi.get({ endpoint: "confirm/logs/turn" });
    if (resultApi.data) {
      setSequenceCode(resultApi.data.turn);
    } else {
      store.dispatch(
        toastError({
          status: "error",
          message: "Lỗi. Vui lòng thử lại!",
        })
      );
    }
    setWaitingScan(false);
  };

  return (
    <>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          p: 0,
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        <Typography sx={{ ...styles.title, color: theme.palette.primary.contrastText }}>
          {type === TypeWarehouseSheet.IMPORTS ? vi.scan_import : vi.scan_export}
          {sequenceCode && ` (${sequenceCode})`}
        </Typography>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {!sequenceCode && (
          <Box sx={styles.overlay}>
            {waitingScan ? (
              <LinearProgress color="primary" sx={{ width: "90%", mt: 20 }} />
            ) : (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                size="large"
                onClick={handleStartScan}
                sx={{ mt: 30 }}
              >
                Bắt đầu quét
              </Button>
            )}
          </Box>
        )}
        {loading ? (
          <Stack
            direction="column"
            spacing={1}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 5,
            }}
          >
            <LinearProgress color="primary" sx={{ width: "100%" }} />
            <Typography variant="body2">Đang xác nhận...</Typography>
          </Stack>
        ) : (
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <TextField
              value={code}
              inputRef={(input) => input?.focus()}
              onChange={(e) => {
                const { value } = e.target;
                const arr = value.split("#");
                const tempValue = arr?.[arr.length - 1] ? `#${arr?.[arr.length - 1]}` : "";
                setCode(tempValue);
              }}
              sx={{ ...styles.hiddenInput }}
              autoFocus
              variant="standard"
            />
          </Box>
        )}

        <Box
          id={`reader`}
          sx={{
            position: "absolute",
            top: 0,
            "& video": {
              width: "100%!important",
              height: "100%",
              overflow: "hidden",
            },
          }}
        />

        <Box sx={styles.wrapList}>
          <TableResultSheetScanned sheets={scannedList} />
        </Box>
      </DialogContent>
    </>
  );
}

export default ScanOptionV2;

const styles: any = {
  button: {
    borderRadius: 8,
    width: "50%",
    fontSize: "1.2rem",
    py: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  code: {
    color: "success.main",
    fontSize: "2rem",
    fontWeight: 700,
  },
  message: {
    fontSize: "1.2rem",
    fontWeight: 600,
    pb: 3,
    textAlign: "center",
  },
  icon: {
    fontSize: "5rem",
  },
  wrapList: {},
  hiddenInput: {
    width: "100%",
    // position: "absolute",
    // top: 0,
    // left: 0,
    // zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    width: "100%",
    fontWeight: 700,
    fontSize: "1.2rem",
    textAlign: "center",
    py: 3,
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    textTransform: "uppercase",
  },
  dialogContent: {
    p: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    minWidth: 320,
    pt: 4,
    position: "relative",
  },
  overlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
  },
};
