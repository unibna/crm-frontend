import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { BaseResponseType } from "_types_/ResponseApiType";
import { UserType } from "_types_/UserType";
import { authApi } from "_apis_/auth.api";
import { userApi } from "_apis_/user.api";
import {
  createUserResponseAction,
  deleteUserResponseAction,
  getAllUserAction,
  getAllUserResponseAction,
  getProfileResponseAction,
  updateUserResponseAction,
  showWelcomePopup,
} from "./action";
import {
  CreateUserAction,
  CREATE_A_USER,
  DeleteUserAction,
  DELETE_A_USER,
  FetchUserAction,
  FETCH_ALL_USER,
  GET_PROFILE,
  UpdateUserAction,
  UPDATE_A_USER,
} from "./type";
import { getStorage, setStorage } from "utils/asyncStorageUtil";
import { dd_MM_yyyy } from "constants/time";
import format from "date-fns/format";

export function* fetchUserSaga(action: FetchUserAction) {
  const result: BaseResponseType<any> = yield call(userApi.getAllUser, {
    params: {
      ...action.params,
      page: 1,
      limit: 500,
    },
  });
  yield put(getAllUserResponseAction(result.data.results));
}

export function* createUserSaga(action: CreateUserAction) {
  const result: BaseResponseType<UserType | null> = yield call(userApi.createUser, {
    form: action.body,
  });
  yield put(createUserResponseAction(result.data, result.message));
}

export function* updateUserSage(action: UpdateUserAction) {
  const result: BaseResponseType<UserType | null> = yield call(userApi.updateUser, {
    id: action.body.id,
    form: action.body,
  });
  if (result && result.data) {
    yield all([put(updateUserResponseAction(result.data, result.message))]);
    return;
  }
}

export function* deleteUserSaga(action: DeleteUserAction) {
  const result: BaseResponseType<{ message: string }> = yield call(userApi.deleteUser, {
    id: action.id,
  });
  if (result && result.data) {
    yield put(deleteUserResponseAction(action.id, result.message));
  } else yield put(deleteUserResponseAction(null, result.message));
}

export function* getProfileSaga(isGetAllUser?: boolean) {
  const result: { data: Partial<UserType>; message: string } = yield call(authApi.getProfile);
  if (result && result.data) {
    if (isGetAllUser) yield put(getAllUserAction());
  }
  if (result && result.data) {
    const dateInStorage = getStorage("today");
    const todayMoment = format(new Date(), dd_MM_yyyy);
    if (dateInStorage !== todayMoment) {
      setStorage("today", todayMoment);
      yield put(showWelcomePopup(true));
    }
    yield put(getProfileResponseAction(result.data));
  }
}

export default function* userSaga() {
  yield takeEvery(FETCH_ALL_USER, fetchUserSaga);
  yield takeLatest(CREATE_A_USER, createUserSaga);
  yield takeLatest(UPDATE_A_USER, updateUserSage);
  yield takeLatest(DELETE_A_USER, deleteUserSaga);
  yield takeEvery(GET_PROFILE, getProfileSaga);
}
