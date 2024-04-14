import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import ErrorCard from "./ErrorCard";
import AuthContext from "../../context/AuthContext";

const Signin = () => {
  const { authenticationError, loginUser } = useContext(AuthContext);
  const [formdata, setData] = useState({
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [issigning, setIsSigning] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...formdata, [name]: value });
  };

  const validateForm = () => {
    if (formdata.email.trim() === "" || formdata.password.trim() === "") {
      setError(" Email and password are required !");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sign in in in");
    if (validateForm()) {
      loginUser(formdata.email.trim(), formdata.password.trim());
      setIsSigning(true);
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (authenticationError) {
      setShowError(true);
      setError(authenticationError);
      setIsSigning(false)
    }
  }, [authenticationError]);

  return (
    <>
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-left">
            <span className="sign-up-title">Sign In</span>
            {showError && <ErrorCard error={error} />}
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-input-container">
                <i className="fas fa-envelope"></i>
                <input
                  className="signup-input"
                  placeholder="Email"
                  name="email"
                  type="email"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div className="signup-input-container">
                <i className="fas fa-lock"></i>
                <input
                  className="signup-input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={handleChange}
                />
              </div>
              {issigning ? (
                <button type="button" className="register-btn">
                  <span>
                    <img style={{ width: "20px"}} src="login.gif" />
                  </span>
                </button>
              ) : (
                <button type="submit" className="register-btn">
                  Login
                </button>
              )}
            </form>
            <span style={{ margin: "20px" }}>
              Haven't Registered Yet ?{" "}
              <Link to="/register" style={{ color: "red" }}>
                Register
              </Link>
            </span>
          </div>
          <div className="auth-right">
            <img className="auth-right-pic" src="/pointing.webp" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
