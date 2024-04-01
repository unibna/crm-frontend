import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/types/types-external";
import { RootState, store } from "store";

export type CollapseDrawerContextProps = {
  click: boolean;
  hover: boolean;
};

const initialState: CollapseDrawerContextProps = {
  click: false,
  hover: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    onToggleCollapse: (state: WritableDraft<CollapseDrawerContextProps>) => {
      state.click = !state.click;
    },

    onHoverEnter: (state: WritableDraft<CollapseDrawerContextProps>) => {
      if (state.click) {
        state.hover = true;
      }
    },

    onHoverLeave: (state: WritableDraft<CollapseDrawerContextProps>) => {
      state.hover = false;
    },
  },
});

export const handleToggleCollapse = () => {
  const { dispatch } = store;
  dispatch(onToggleCollapse());
};

export const handleHoverEnter = () => {
  const { dispatch } = store;
  dispatch(onHoverEnter());
};

export const handleHoverLeave = () => {
  const { dispatch } = store;
  dispatch(onHoverLeave());
};

export const sidebarStore = (state: RootState) => state.sidebar;
export default sidebarSlice.reducer;
export const { onHoverEnter, onHoverLeave, onToggleCollapse } = sidebarSlice.actions;
