import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import useSound from "use-sound";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import TableResultSheetScanned from "./TableResultSheetScanned";

import { orderApi } from "_apis_/order.api";

import vi from "locales/vi.json";

import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

import { store } from "store";
import { toastError } from "store/redux/toast/slice";

import errorSound from "./sounds/errorSFX.mp3";
import successSound from "./sounds/successSFX.mp3";
import { TypeWarehouseSheet } from "_types_/WarehouseType";
interface Props {
  open: boolean;
  handleClose: any;
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

function ScanOption(props: Props) {
  const { open, type } = props;
  const [code, setCode] = useState<string>("");
  const [result, setResult] = useState<{
    status: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannedList, setScannedList] = useState<{ order_key: string; is_confirm: boolean }[]>([]);
  const [waitingScan, setWaitingScan] = useState(false);
  const [sequenceCode, setSequenceCode] = useState<string>("");
  const [playbackRate, setPlaybackRate] = useState(0.9);

  const [playSuccess] = useSound(successSound, {
    playbackRate,
    interrupt: true,
    volume: 0.9,
  });

  const [playError] = useSound(errorSound, {
    playbackRate,
    interrupt: true,
    volume: 0.9,
  });

  const handleClickAdvanced = () => {
    const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      if (
        decodedText &&
        decodedText[0] === "#" &&
        decodedText.length > 6 &&
        /^\d+$/.test(decodedText.slice(1))
      )
        setCode(decodedText);
      // html5QrCode?.pause();
    };
    const qrCodeErrorCallback = (errorMessage: string, error: any) => {};

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
    // html5QrCode?.pause();
    setLoading(true);
    let newList = JSON.parse(JSON.stringify(scannedList));

    const resultApi = await orderApi.create({
      params: { order_key: code, sheet_type: type, turn: sequenceCode },
      endpoint: "sheets/confirm/",
    });
    if (resultApi?.data) {
      playSuccess();
      setResult({
        status: "success",
        message:
          type === TypeWarehouseSheet.IMPORTS ? "Nhập hàng thành công" : "Xuất hàng thành công",
      });

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
      setResult({
        status: "error",
        message: error?.data?.length ? error?.data[0] : "Lỗi quét mã",
      });
      newList = [
        ...newList,
        {
          order_key: code,
          is_confirm: false,
        },
      ];
    }

    setScannedList(newList);
    setLoading(false);
  };

  const handleContinueScanning = () => {
    // html5QrCode?.resume();
    setCode("");
    setResult(null);
    // html5QrCode?.clear();
  };

  const handleStartScan = async () => {
    setWaitingScan(true);
    const resultApi = await orderApi.get({
      endpoint: "confirm/logs/turn",
    });
    if (resultApi.data) {
      const { turn } = resultApi.data as any;
      setSequenceCode(turn);
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

  useEffect(() => {
    if (!html5QrCode && open) {
      html5QrCode = new Html5Qrcode(`reader`, brConfig);
    }
    open && handleClickAdvanced();
    code && setCode("");
    result && setResult(null);
    sequenceCode && setSequenceCode("");
    scannedList.length > 0 && setScannedList([]);
    return () => {
      open && handleStop();
    };
  }, [open]);

  useDidUpdateEffect(() => {
    code && setCode("");
    scannedList.length > 0 && setScannedList([]);
  }, [sequenceCode]);

  return (
    <>
      <DialogContent sx={styles.dialogContent}>
        {loading && <LinearProgress />}
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
        <Box sx={{ position: "relative", mb: 4 }}>
          <TextField
            value={code}
            inputRef={(input) => input?.focus()}
            onChange={(e) => {
              const { value } = e.target;
              const arr = value.split("#");
              setCode(arr?.[arr.length - 1] ? `#${arr?.[arr.length - 1]}` : "");
            }}
            sx={{ ...styles.hiddenInput }}
            autoFocus
            variant="standard"
          />
          <Box
            sx={{
              width: "100%",
              height: "50px",
              position: "absolute",
              zIndex: 2,
              top: 0,
              left: 0,
              display: Boolean(code) ? "block" : "none",
              backgroundColor: "white",
            }}
          />
        </Box>

        <Box
          id={`reader`}
          sx={{
            display: !Boolean(code) ? "block" : "none",
            // display: "none",
            "& video": {
              width: "100%!important",
              height: "100%",
              overflow: "hidden",
            },
          }}
        />

        {!Boolean(code) && scannedList.length > 0 && (
          <Box sx={styles.wrapList}>
            <TableResultSheetScanned sheets={scannedList} />
          </Box>
        )}

        {Boolean(code) && !result && (
          <Stack
            direction="column"
            spacing={2}
            sx={{ width: "100%", p: 2, height: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <CheckCircle sx={{ color: "success.main", ...styles.icon }} />
            <Typography sx={styles.message}>{"Mã đơn hàng"}</Typography>
            <Typography sx={styles.code}>{code}</Typography>
            <Stack
              direction="column"
              spacing={4}
              sx={{ width: "100%" }}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                sx={{ ...styles.button }}
                disabled={loading || !code || !sequenceCode}
                onClick={handleConfirm}
              >
                {vi.button.accept}
              </Button>
              <Button
                variant="contained"
                sx={{ ...styles.button, backgroundColor: "white", color: "primary.main" }}
                onClick={handleContinueScanning}
              >
                {vi.button.back_to_scanning}
              </Button>
            </Stack>
          </Stack>
        )}

        {Boolean(result) && (
          <Stack
            direction="column"
            spacing={2}
            sx={{ width: "100%", p: 2, height: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            {result?.status === "success" ? (
              <CheckCircle sx={{ color: "success.main", ...styles.icon }} />
            ) : (
              <ErrorIcon sx={{ color: "error.main", ...styles.icon }} />
            )}
            <Typography sx={styles.message}>{result?.message}</Typography>
            <Button variant="contained" sx={{ ...styles.button }} onClick={handleContinueScanning}>
              {vi.button.back_to_scanning}
            </Button>
          </Stack>
        )}
      </DialogContent>
    </>
  );
}

export default ScanOption;

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
  wrapList: {
    // height: `calc(${window.innerHeight}px - ${window.innerWidth}px - 100px)`,
    height: "500px",
    overflowY: "auto",
  },
  hiddenInput: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
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
