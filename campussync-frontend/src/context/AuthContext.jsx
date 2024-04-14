import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { json, useNavigate } from "react-router-dom";
import Endpoint from "../api";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [authenticationError, setauthenticationError] = useState("");
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const endpoint = Endpoint();
  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${endpoint}api/token/`,
        {
          email: email,
          password: password,
        }
      );
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      navigate("/home");
    } catch (e) {
      setauthenticationError(e.response.data.detail);
    }
  };
  const updateToken = async () => {
    try {
      const { data } = await axios.post(
        `${endpoint}/api/token/refresh/`,
        {
          refresh: authTokens.refresh,
        }
      );

      setAuthTokens({ ...authTokens, access: data.access });
      setUser(jwtDecode(data.access));
      localStorage.setItem(
        "authTokens",
        JSON.stringify({ ...authTokens, access: data.access })
      );
    } catch (e) {
      logoutUser();
    }
  };
  const logoutUser = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
  };
  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    authenticationError: authenticationError,
  };
  useEffect(() => {
    const fiveminutes=1000*60*5
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fiveminutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
