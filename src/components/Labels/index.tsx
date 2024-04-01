import { SxProps, Theme, styled, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export const TitleDrawer = styled(Typography)(() => ({
  fontWeight: 700,
  lineHeight: 1.55556,
  fontSize: 16,
}));

export const Section = styled(Paper)(() => ({
  padding: 16,
}));

export const TitleSection = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: 14,
}));

export const TextInfo = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: 13,
}));

export const LabelInfo = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: 13,
  color: "#637381",
}));

export const SubLabelInfo = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 12,
}));

export const TitleGroup = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: 14,
}));

export const WrapperSection = ({
  title,
  children,
  containerStyles,
  loading,
}: {
  title?: string;
  children: any;
  containerStyles?: SxProps<Theme>;
  loading?: boolean;
}) => {
  return (
    <Section elevation={3} sx={{ ...containerStyles }}>
      {title && (
        <>
          <TitleSection>{title}</TitleSection>
          <Divider sx={{ my: 1 }} />
        </>
      )}
      <Box py={2}>{loading ? <LinearProgress /> : children}</Box>
    </Section>
  );
};

export const BadgeLabel = ({ label, number }: { label: string; number: number }) => {
  const theme = useTheme();

  return (
    <Box display={"flex"}>
      <Box> {label} </Box>
      {number > 0 && (
        <Box display={"flex"} alignItems="center">
          <Box
            bgcolor={theme.palette.primary.main}
            color={theme.palette.text.primary}
            borderRadius={"50%"}
            ml={1}
            px={1}
          >
            {number}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const FormControlLabelStyled = styled(FormControlLabel)(() => ({
  "& .MuiTypography-root.MuiFormControlLabel-label": {
    fontWeight: 600,
    fontSize: "0.8125rem",
  },
}));

export * from "./MTextLine";
export * from "./Span";
