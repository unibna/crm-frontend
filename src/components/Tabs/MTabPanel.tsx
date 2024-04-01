import Box from "@mui/material/Box";

export interface TabPanelProps {
  children?: React.ReactNode | JSX.Element;
  index: number;
  value: number;
  sx?: any;
}

export function MTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </Box>
  );
}
