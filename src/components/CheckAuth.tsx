import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const RequireAuth = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default RequireAuth;
