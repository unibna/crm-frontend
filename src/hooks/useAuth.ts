import { useContext } from "react";
import { AuthContext } from "contexts/JWTContext";
import { useAppDispatch } from "hooks/reduxHook";
import { toastError } from "store/redux/toast/slice";

// ----------------------------------------------------------------------

const useAuth = () => {
  const context = useContext(AuthContext);
  const dispatch = useAppDispatch();

  if (!context) {
    dispatch(toastError({ message: "Lỗi nối được dữ liệu" }));
    throw new Error("Auth context must be use inside AuthProvider");
  }

  return context;
};

export default useAuth;
