import { Template, TemplatePlaceholder, Plugin } from "@devexpress/dx-react-core";

import Grid from "@mui/material/Grid";

const pluginDependencies = [{ name: "Toolbar" }];

const ToolbarLeft = ({ children }: { children: React.ReactNode }) => {
  return (
    <Plugin name="ToolbarLeft" dependencies={pluginDependencies}>
      <Template name="toolbarContent">
        <Grid container mb={1.25}>
          {children}
        </Grid>
        <TemplatePlaceholder />
      </Template>
    </Plugin>
  );
};

export default ToolbarLeft;
