import alertCircleFill from "@iconify/icons-eva/alert-circle-fill";
import alertTriangleFill from "@iconify/icons-eva/alert-triangle-fill";
import checkmarkCircle2Fill from "@iconify/icons-eva/checkmark-circle-2-fill";
import infoFill from "@iconify/icons-eva/info-fill";
import { Icon, IconifyIcon } from "@iconify/react";
import { Box, alpha } from "@mui/material";
import { ColorSchema } from "_types_/ThemeColorType";
import { useAppSelector } from "hooks/reduxHook";
import { ReactNode, useEffect } from "react";
import toast, { Renderable, Toaster, ToasterProps, ValueOrFunction } from "react-hot-toast";
import { toastStore } from "store/redux/toast/slice";

// ----------------------------------------------------------------------

export type VariantNotificationType = "info" | "success" | "warning" | "error" | "promise" | null;

interface Props {
  children: ReactNode | JSX.Element | React.ReactElement | Element;
}

enum NOTIFICATION_TYPE {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  PROMISE = "promise",
}

export const showToast = (notification: {
  variant: VariantNotificationType;
  message: string;
  duration?: number;
  promise?: {
    promise: Promise<void>;
    loading: Renderable;
    success: ValueOrFunction<Renderable, any>;
    error: ValueOrFunction<Renderable, any>;
  };
}) => {
  switch (notification.variant) {
    case NOTIFICATION_TYPE.SUCCESS: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={checkmarkCircle2Fill} color="success" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.ERROR: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={infoFill} color="error" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.INFO: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={alertCircleFill} color="info" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.WARNING: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={alertTriangleFill} color="warning" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.PROMISE: {
      notification.promise?.promise &&
        toast.promise(notification.promise?.promise, {
          loading: notification.promise?.loading,
          success: notification.promise?.success,
          error: notification.promise?.error,
        });
      break;
    }
    default:
      toast(notification.message, { duration: notification.duration });
      break;
  }
};
const ToastShower = ({ children }: Props) => {
  const toastSlice = useAppSelector(toastStore);

  useEffect(() => {
    if (toastSlice.variant && toastSlice.message) {
      showToast(toastSlice);
    }
  }, [toastSlice]);

  return <>{children}</>;
};

type SnackbarIconProps = {
  icon: IconifyIcon;
  color: ColorSchema;
};

function SnackbarIcon({ icon, color }: SnackbarIconProps) {
  return (
    <Box
      component="span"
      sx={{
        width: 40,
        height: 40,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        justifyContent: "center",
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      <Icon icon={icon} width={24} height={24} />
    </Box>
  );
}

// ----------------------------------------------------------------------

const defaultConfig: ToasterProps = {
  position: "top-right",
  reverseOrder: false,
  gutter: 8,
  containerClassName: "toast-container",
  containerStyle: {},
  toastOptions: {
    // Define default options
    duration: 2000,
    style: {
      fontWeight: 600,
      fontSize: "0.8125rem",
    },
  },
};

export default function ToastProvider({
  children,
  config,
}: {
  children: JSX.Element | React.ReactNode;
  config?: ToasterProps;
}) {
  return (
    <>
      <Toaster {...defaultConfig} {...config} />
      <ToastShower>{children}</ToastShower>
    </>
  );
}
