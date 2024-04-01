import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

interface Props {
  children: JSX.Element;
  title: string | JSX.Element;
  activeStep: number;
  index: number;
}

const StepWrap = ({ children, activeStep, index, title }: Props) => {
  return (
    <Step active={activeStep === index} index={index} completed={activeStep > index}>
      <StepLabel>{title}</StepLabel>
      <StepContent>{children}</StepContent>
    </Step>
  );
};

export default StepWrap;
