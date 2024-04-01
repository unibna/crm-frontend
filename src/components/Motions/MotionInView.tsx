import { Box, BoxProps } from "@mui/material";
import { MotionProps, motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

// ----------------------------------------------------------------------

type Props = BoxProps & MotionProps;
interface MotionInViewProps extends Props {
  threshold?: number | number[];
  setInView: VoidFunction;
}

export default function MotionInView({
  children,
  variants,
  transition,
  threshold,
  setInView,
  ...other
}: MotionInViewProps) {
  const controls = useAnimation();

  const [ref, inView] = useInView({
    threshold: threshold || 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    inView && setInView();

    if (!variants) return;
    if (inView) {
      controls.start(Object.keys(variants)[1]);
    } else {
      controls.start(Object.keys(variants)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, inView, variants]);

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={variants ? Object.keys(variants)[0] : false}
      animate={controls}
      variants={variants}
      transition={transition}
      {...other}
    >
      {children}
    </Box>
  );
}
