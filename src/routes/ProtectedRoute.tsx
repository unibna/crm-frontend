import { UserType } from "_types_/UserType";
import LoadingScreen from "components/Loadings/LoadingScreen";
import { Navigate } from "react-router-dom";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: JSX.Element | null;
  hasPermission?: boolean;
  user?: Partial<UserType> | null;
};

export default function ProtectedRoute({ children, hasPermission, user }: AuthGuardProps) {
  return user ? hasPermission ? children : <Navigate to="*" /> : <LoadingScreen />;
}
