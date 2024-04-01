import { Box, Card, CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import { fPercentOmitDecimal } from "utils/formatNumber";
interface Props {
  title: string;
  value: number | string;
  icon?: any;
  isLoading?: boolean;
  titleStyle?: React.CSSProperties;
  description?: string;
  subTitle?: string;
  subPercent?: number;
}

const ScoreCard = (props: Props) => {
  const {
    title,
    value,
    isLoading = false,
    icon,
    titleStyle = titleStyleDefault,
    description,
    subTitle,
    subPercent = 0,
  } = props;

  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Tooltip title={description || title} placement="top">
          <Typography style={titleStyle} variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Tooltip>
        {isLoading ? (
          <Box sx={{ mt: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Typography variant="h3">{value}</Typography>
        )}
        {!!subTitle && (
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle2" component="span">
              {fPercentOmitDecimal(subPercent)}
            </Typography>
            <Typography variant="body2" component="span" noWrap sx={{ color: "text.secondary" }}>
              &nbsp;{subTitle}
            </Typography>
          </Stack>
        )}
      </Box>
      {icon}
    </Card>
  );
};

export default ScoreCard;

const titleStyleDefault = { maxWidth: 150 };
