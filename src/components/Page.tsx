import { Helmet } from "react-helmet-async";
import { forwardRef, ReactNode, useEffect } from "react";
// material
import { BoxProps } from "@mui/material";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...other }, ref) => {
    useEffect(() => {
      document.title = title;
    }, [title]);

    return (
      <>
        <Box ref={ref} {...other} sx={{ ...other.sx }}>
          {children}
        </Box>
      </>
    );
  }
);
