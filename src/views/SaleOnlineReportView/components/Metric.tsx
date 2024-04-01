import { Theme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { useTheme } from "@mui/material/styles";

export interface MetricProps {
  title: string;
  name: string;
  value: number | string;
  icon: Element;
  color: string;
}

const Metric = ({ title, value, icon, color }: MetricProps) => {
  const theme = useTheme();
  const styles = styleFunc({ theme });
  return (
    <Box sx={styles.container}>
      <Box sx={styles.wrapIcon}>
        <IconButton sx={{ ...styles.icon, backgroundColor: color }}>{icon}</IconButton>
      </Box>
      <Box sx={styles.wrapContent}>
        <Typography sx={styles.title}>{title}</Typography>
        <Typography sx={styles.value}>{value}</Typography>
      </Box>
    </Box>
  );
};

export default Metric;

const styleFunc: any = ({ theme }: { theme: Theme }) => ({
  container: {
    display: "flex",
    alignItems: "flex-start",
    padding: "10px 12px",
  },
  wrapContent: {
    flexGrow: 1,
    pl: 2,
  },
  wrapIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    lineHeight: "1.57143",
    fontSize: "0.8125rem",
    color: "rgb(99, 115, 129)",
  },
  value: {
    fontWeight: 600,
    lineHeight: "150%",
    fontSize: "1.2rem",
  },
  icon: {
    borderRadius: "10px",
    color: theme.palette.common.white,
    fontSize: "2rem",
    padding: "16px",
  },
});
