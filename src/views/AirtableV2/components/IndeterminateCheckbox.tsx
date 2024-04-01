import { Box, styled } from "@mui/material";
import { forwardRef, useEffect, useRef } from "react";

const IndeterminateCheckbox = forwardRef(({ indeterminate, label, labelStyles, ...rest }: any, ref) => {
  const defaultRef = useRef();
  const resolvedRef: any = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <Wrapper>
      <Checkbox
        defaultValue={false}
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        name="IndeterminateCheckbox"
      />
      <Label sx={labelStyles}>{label}</Label>
    </Wrapper>
  );
});

export default IndeterminateCheckbox;

const Wrapper = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

const Label = styled("label")(({}) => ({
  fontSize: 12,
}));

const Checkbox = styled("input")(({ theme }) => ({
  WebkitAppearance: "none",
  appearance: "none",
  margin: 0,
  font: "inherit",
  color: "currentColor",
  width: 18,
  height: 18,
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: "4px",
  display: "grid",
  placeContent: "center",
  marginRight: 8,

  "&:before": {
    content: `""`,
    width: "0.65em",
    height: "0.65em",
    clipPath: "polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)",
    transform: "scale(0)",
    transformOrigin: "bottom left",
    transition: "120ms transform ease-in-out",
    boxShadow: `inset 1em 1em ${theme.palette.primary.main}`,
    backgroundColor: "CanvasText",
  },

  "&:checked": {
    border: `2px solid ${theme.palette.primary.main}`,
  },

  "&:checked::before": {
    transform: "scale(1)",
  },
  "&:focus": {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  "&:disabled": {
    color: "#959495",
    cursor: "not-allowed",
  },
}));
