import useAuth from "hooks/useAuth";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { CDP_TABS_ROUTE } from "views/CDPView/constants";
import { TabRouteWrap } from "components/Tabs";
import { Page } from "components/Page";
import { customerApi } from "_apis_/customer.api";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";
import { TITLE_PAGE } from "constants/index";

// ---------------------------------------------

const CustomerPage = () => {
  const { user } = useAuth();

  return <TabRouteWrap routes={CDP_TABS_ROUTE(user, user?.group_permission?.data)} />;
};

export const CDPContext = createContext<{
  tags: {
    tags: {
      id: number;
      name: string;
    }[];
    loading: boolean;
  };
  rankRequires: {
    rankRequires: {
      id: number;
      name: string;
    }[];
    loading: boolean;
  };
  setTags: React.Dispatch<
    React.SetStateAction<{
      tags: {
        id: number;
        name: string;
      }[];
      loading: boolean;
    }>
  >;
  setRankRequires: React.Dispatch<
    React.SetStateAction<{
      rankRequires: {
        id: number;
        name: string;
      }[];
      loading: boolean;
    }>
  >;
} | null>(null);

const CDPWrapper = () => {
  const [tags, setTags] = useState<{
    tags: { id: number; name: string }[];
    loading: boolean;
  }>({ loading: false, tags: [] });
  const [rankRequires, setRankRequires] = useState<{
    rankRequires: { id: number; name: string }[];
    loading: boolean;
  }>({ loading: false, rankRequires: [] });
  const { newCancelToken } = useCancelToken();

  const getListTags = useCallback(async (search?: string) => {
    setTags((prev) => ({ ...prev, loading: true }));
    const result = await customerApi.get<{ id: number; name: string }>({
      endpoint: "tags/",
      params: { limit: 1000, page: 1, search },
    });
    if (result.data) {
      setTags((prev) => ({ ...prev, tags: result.data.results, loading: false }));
    } else {
      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }
      setTags((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const getListReasons = useCallback(async (search?: string) => {
    setRankRequires((prev) => ({ ...prev, loading: true }));
    const result = await customerApi.get<{ id: number; name: string }>({
      endpoint: "modified-reason/",
      params: { limit: 1000, page: 1, search },
    });
    if (result.data) {
      setRankRequires((prev) => ({ ...prev, loading: false, rankRequires: result.data.results }));
    } else {
      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }
      setRankRequires((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    getListTags();
  }, [getListTags]);

  useEffect(() => {
    getListReasons();
  }, [getListReasons]);

  return (
    <Page title={TITLE_PAGE.CDP}>
      <CDPContext.Provider
        value={{
          setTags,
          tags,
          rankRequires,
          setRankRequires,
        }}
      >
        <CustomerPage />
      </CDPContext.Provider>
    </Page>
  );
};
export default CDPWrapper;
