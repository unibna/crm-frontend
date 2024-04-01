import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
export interface MButtonProps extends ButtonProps {
  isLoading?: boolean;
  progress?: number;
  variantLoading?: "indeterminate" | "determinate";
}

export const MButton = (props: MButtonProps) => {
  const {
    fullWidth = false,
    color = "primary",
    disabled = false,
    size,
    variant = "contained",
    isLoading = false,
    progress = 0,
    variantLoading = "indeterminate",
    ...buttonProps
  } = props;

  return (
    <Button
      color={color}
      variant={variant}
      disabled={isLoading || disabled}
      size={size}
      fullWidth={fullWidth}
      {...buttonProps}
    >
      {isLoading && (
        <CircularProgress variant={variantLoading} size={20} sx={{ mr: 1 }} value={progress} />
      )}
      {props.children}
    </Button>
  );
};
