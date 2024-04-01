// Components
import Box from "@mui/material/Box";
import TemplateItem from "views/ZaloView/components/ContentZns/TemplateItem";

// -------------------------------------------------------------------

const Template = (props: any) => {
  const { watch } = props;
  const { zaloOa, template } = watch();

  return (
    <Box sx={{ width: 450, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <TemplateItem
        item={template}
        avatar={zaloOa?.avatar || ""}
        {...props}
      />
    </Box>
  )
}

export default Template;