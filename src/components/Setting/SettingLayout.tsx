// @mui
import { styled, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import RadioGroup from "@mui/material/RadioGroup";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// hooks
import useSettings from "hooks/useSettings";
//
import { BoxMask } from ".";

// ----------------------------------------------------------------------

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1.5),
  color: theme.palette.text.disabled,
  border: `solid 1px ${theme.palette.grey[500_12]}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

// ----------------------------------------------------------------------

const LIST_LAYOUT = [
  {
    value: "vertical",
    component: VerticalBox,
  },
  {
    value: "horizontal",
    component: HorizontalBox,
  },
  {
    value: "vertical_collapsed",
    component: VerticalCollapsedBox,
  },
];

export default function SettingLayout() {
  const { themeLayout, onChangeLayout } = useSettings();

  return (
    <RadioGroup name="themeLayout" value={themeLayout} onChange={onChangeLayout}>
      <Grid dir="ltr" container spacing={2.5}>
        {LIST_LAYOUT.map((layout) => {
          const isSelected = themeLayout === layout.value;
          return (
            <Grid key={layout.value} item xs={6}>
              <BoxStyle
                sx={{
                  ...(isSelected && {
                    color: "primary.main",
                    boxShadow: (theme) => theme.customShadows.z20,
                  }),
                }}
              >
                <layout.component isSelected={isSelected} />
                <BoxMask value={layout.value} />
              </BoxStyle>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------

type LayoutBoxProps = {
  isSelected: boolean;
};

const style = {
  width: 1,
  height: 32,
  borderRadius: 0.5,
};

function HorizontalBox({ isSelected }: LayoutBoxProps) {
  return (
    <>
      <Box
        sx={{
          ...style,
          mb: 0.75,
          height: 12,
          bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.72),
          ...(isSelected && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.72),
          }),
        }}
      />
      <Box
        sx={{
          ...style,
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.08),
          ...(isSelected && {
            border: (theme) => `dashed 1px ${theme.palette.primary.main}`,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          }),
        }}
      />
    </>
  );
}

function VerticalBox({ isSelected }: LayoutBoxProps) {
  return (
    <>
      <Box
        sx={{
          ...style,
          mb: 0.75,
          height: 12,
          bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.72),
          ...(isSelected && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.72),
          }),
        }}
      />
      <Stack width={1} direction="row" justifyContent="space-between">
        <Box
          sx={{
            ...style,
            width: 20,
            bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.32),
            ...(isSelected && {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.32),
            }),
          }}
        />
        <Box
          sx={{
            ...style,
            width: `calc(100% - 26px)`,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
            bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.08),
            ...(isSelected && {
              border: (theme) => `dashed 1px ${theme.palette.primary.main}`,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            }),
          }}
        />
      </Stack>
    </>
  );
}

function VerticalCollapsedBox({ isSelected }: LayoutBoxProps) {
  return (
    <>
      <Box
        sx={{
          ...style,
          mb: 0.75,
          height: 12,
          bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.72),
          ...(isSelected && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.72),
          }),
        }}
      />
      <Stack width={1} direction="row" justifyContent="space-between">
        <Box
          sx={{
            ...style,
            width: 10,
            bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.32),
            ...(isSelected && {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.32),
            }),
          }}
        />
        <Box
          sx={{
            ...style,
            width: `calc(100% - 16px)`,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
            bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.08),
            ...(isSelected && {
              border: (theme) => `dashed 1px ${theme.palette.primary.main}`,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            }),
          }}
        />
      </Stack>
    </>
  );
}
