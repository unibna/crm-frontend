// Libraries
import { useContext } from "react";
import Grid from "@mui/material/Grid";
import produce from "immer";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";

// Components
import AttributeTable from "views/ReportFacebookView/components/AttributeTable";
import AddAttributes from "views/ReportFacebookView/components/AddAttributes";
import Card from "@mui/material/Card";

// Constants
import { message, actionType } from "views/ReportFacebookView/constants";
import { statusNotification } from "constants/index";
import toast from "react-hot-toast";

const EditAttributes = () => {
  const { state: store, dispatch } = useContext(StoreReportFacebook);
  const { listAttributes: attributes } = store;

  const handleDeleteAttributeValue = async (idAttribute: number, id: number, name: string) => {
    const objParams = {
      id,
    };

    const result: any = await facebookApi.remove(objParams, "attribute-value/");
    if (result && result) {
      const index = attributes.findIndex((item: any) => item.id === idAttribute);

      const newData = produce(attributes, (draftData: any) => {
        draftData[index].data = draftData[index].data.filter((item: any) => item.id !== id);
      });

      dispatch({
        type: actionType.UPDATE_LIST_ATTRIBUTES,
        payload: {
          listAttributes: newData,
        },
      });

      toast.success(message.DELETE_ATTRIBUTE_VALUE_SUCCESS);
    } else {
      toast.error(message.NOT_DELETE_ATTRIBUTE_VALUE);
    }
  };

  const handleDeleteAttribute = async (id: number) => {
    const objParams = {
      id,
    };

    const result: any = await facebookApi.remove(objParams, "attribute/");

    if (result && result) {
      const newData = attributes.filter((item: any) => item.id !== id);

      dispatch({
        type: actionType.UPDATE_LIST_ATTRIBUTES,
        payload: {
          listAttributes: newData,
        },
      });

      toast.success(message.DELETE_ATTRIBUTE_SUCCESS);
    } else {
      toast.error(message.NOT_DELETE_ATTRIBUTE);
    }
  };

  const handleAddAttributeValue = async (id: number, value: string) => {
    const objParams = {
      name: value,
      attribute: id,
    };

    const result = await facebookApi.create(objParams, "attribute-value/");

    if (result && result.data) {
      const index = attributes.findIndex((item: any) => item.id === id);
      const newData = produce(attributes, (draftData: any) => {
        draftData[index].data = [...draftData[index].data, result.data];
      });

      dispatch({
        type: actionType.UPDATE_LIST_ATTRIBUTES,
        payload: {
          listAttributes: newData,
        },
      });

      toast.success(message.ADD_ATTRIBUTE_VALUE_SUCCESS);
    } else {
      toast.error(message.ATTRIBUTE_VALUE_EXIST);
    }
  };

  const handleAddAttribute = async (value: string) => {
    const objParams = {
      name: value,
    };

    const result = await facebookApi.create(objParams, "attribute/");

    if (result && result.data) {
      const newData = [
        ...attributes,
        {
          ...result.data,
          data: [],
        },
      ];

      dispatch({
        type: actionType.UPDATE_LIST_ATTRIBUTES,
        payload: {
          listAttributes: newData,
        },
      });
      toast.success(message.ADD_ATTRIBUTE_SUCCESS);
    } else {
      toast.error(message.ATTRIBUTE_EXIST);
    }
  };

  const renderTable = () => {
    return attributes.map((item: any) => {
      const { id: idAttribute, name, data } = item;
      return (
        <Grid key={idAttribute} item sm={12} md={6}>
          <Card sx={{ p: 3 }}>
            <AttributeTable
              data={data}
              title={name}
              handleDeleteAttributeValue={(id: number, name: string) =>
                handleDeleteAttributeValue(idAttribute, id, name)
              }
              handleDeleteAttribute={() => handleDeleteAttribute(idAttribute)}
              handleAddAttributeValue={(value: string) =>
                handleAddAttributeValue(idAttribute, value)
              }
            />
          </Card>
        </Grid>
      );
    });
  };

  return (
    // <Container maxWidth={themeStretch ? false : 'lg'}>
    <>
      <AddAttributes handleSubmit={handleAddAttribute} />
      <Grid container spacing={3}>
        {renderTable()}
      </Grid>
    </>
    // </Container>
  );
};

export default EditAttributes;
