import { Template, TemplatePlaceholder, Plugin } from "@devexpress/dx-react-core";

import Grid from "@mui/material/Grid";

const pluginDependencies = [{ name: "Toolbar" }];

export default function ToolbarRight({ children }: { children: React.ReactNode }) {
  return (
    <Plugin name="ToolbarRight" dependencies={pluginDependencies}>
      <Template name="toolbarContent">
        <TemplatePlaceholder />
        <Grid container mb={1.25}>
          {children}
        </Grid>
      </Template>
    </Plugin>
  );
}
