import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import airtableReducer from "store/redux/airtable/slice";
import attributesReducer from "store/redux/attributes/slice";
import phoneLeadReducer from "store/redux/leads/slice";
import rolesReducer from "store/redux/roles/slice";
import sidebarReducer from "store/redux/sidebar/slice";
import toastsReducer from "store/redux/toast/slice";
import userManualsReducer from "store/redux/usermanuals/slice";
import userReducer from "store/redux/users/slice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    users: userReducer,
    toasts: toastsReducer,
    leads: phoneLeadReducer,
    roles: rolesReducer,
    airtable: airtableReducer,
    sidebar: sidebarReducer,
    attributes: attributesReducer,
    usermanuals: userManualsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const { dispatch } = store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
