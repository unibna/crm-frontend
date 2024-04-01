import { useMemo, useState } from "react";

import Grid from "@mui/material/Grid";

import Empty from "../components/Empty";
import SideMenu from "../components/SideMenu";
import Create from "../components/Create";
import Post from "../components/Post";

import { NavListProps } from "_types_/NavSectionType";

import { useAppSelector } from "hooks/reduxHook";

import { getDataUserManuals } from "selectors/userManuals";

function UserManualContainer() {
  const { data, fetched } = useAppSelector((state) => getDataUserManuals(state.usermanuals));
  const [value, setValue] = useState<NavListProps | null>(null);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const handleChange = (newValue: NavListProps) => {
    showCreate && setShowCreate(!showCreate);
    setValue(newValue);
  };

  const dataItem = useMemo(() => {
    return (!!value && data.find((item) => item.code === value.code && item.content)) || null;
  }, [value?.code, data]);

  const handleOpenCreate = () => {
    setShowCreate(true);
  };

  return (
    <Grid container spacing={2} py={3} sx={{ height: "96vh", overflow: "hidden" }}>
      <Grid item xs={12} sm={6} md={4} sx={{ height: "100%", overflow: "auto", p: 2 }}>
        <SideMenu value={value} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6} md={8} sx={{ height: "100%", overflow: "auto", p: 2 }}>
        {showCreate ? (
          <Create />
        ) : (
          <>
            {!!dataItem ? (
              <Post title={value?.title} content={dataItem.content} />
            ) : (
              <Empty title={value?.title || ""} onClick={handleOpenCreate} />
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default UserManualContainer;
