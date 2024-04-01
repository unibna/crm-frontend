import { useRef, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * When a component unmounts, we need to cancel any potentially
 * ongoing Axios calls that result in a state update on success / fail.
 * This function sets up the appropriate useEffect to handle the canceling.
 *
 * @returns {newCancelToken: function, isCancel: boolean}
 * newCancelToken - used to generate the cancel token sent in the Axios request.
 * isCancel - used to check if error returned in response is a cancel token error.
 *
 */

let CancelToken = axios.CancelToken;

export const useCancelToken = (deps: any[] = []) => {
  const axiosSource = useRef(null) as any;

  const newCancelToken = useCallback(() => {
    axiosSource.current = CancelToken.source();
    return axiosSource.current.token;
  }, deps);

  useEffect(
    () => () => {
      if (axiosSource.current) axiosSource.current.cancel();
    },
    deps
  );

  return { newCancelToken, isCancel: axios.isCancel };
};
