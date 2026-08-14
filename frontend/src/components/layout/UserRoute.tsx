import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

const UserPublicRoute = () => {
  const user = useUserStore((s) => s.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UserPublicRoute;
