import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { createDraftSafeSelector, createSelector } from "@reduxjs/toolkit";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const selectSelf = (state: RootState) => state;

export const getUnsafeSelector = <T extends keyof RootState>(keyState: T) =>
  createSelector(selectSelf, (state) => state[keyState]);

export const getDraftSafeSelector = <T extends keyof RootState>(keyState: T) =>
  createDraftSafeSelector(selectSelf, (state) => state[keyState]);
