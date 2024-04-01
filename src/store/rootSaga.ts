import { all, fork } from "redux-saga/effects";
import userSaga from "store/redux/users/saga";

export default function* () {
  yield all([fork(userSaga)]);
}
