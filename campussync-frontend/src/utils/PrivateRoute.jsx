import { useContext } from "react";
import { Outlet, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const PrivateRoute = () => {
  const {user} = useContext(AuthContext);
  const authenticated = user ? true : false;
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
