// Libraries
import { useState } from "react";

// Components
import AttributesDialog from "views/ReportFacebookView/components/AttributesDialog"
import Button from "@mui/material/Button";

const AddAttributes = (props: any) => {
  const {
    handleSubmit
  } = props
  const [isOpenAddAttribute, setOpenAddAttribute] = useState(false)

  const handleSubmitAdd = (value: string) => {
    setOpenAddAttribute(false)
    handleSubmit(value)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <AttributesDialog
        isOpen={isOpenAddAttribute}
        title='Thêm thuộc tính'
        buttonText='Thêm'
        handleClose={() => setOpenAddAttribute(false)}
        handleSubmit={handleSubmitAdd}
      />
      <Button
        type="submit"
        style={{ width: 200 }}
        variant="contained"
        size="large"
        onClick={() => setOpenAddAttribute(true)}
      >
        Thêm thuộc tính
      </Button>
    </div>
  );
};

export default AddAttributes;