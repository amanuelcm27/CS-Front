import "./auth.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Link } from "react-router-dom";
import ErrorCard from "./ErrorCard";
import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
const Signup = () => {
  const [formdata, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...formdata, [name]: value });
  };
  const {loginUser}=useContext(AuthContext);
  const validateForm = () => {
    if (
      formdata.name.trim() === "" ||
      formdata.email.trim() === "" ||
      formdata.password.trim() === "" ||
      formdata.confirm.trim() === ""
    ) {
      setError("Some fields are empty!");
      return false;
    }

    if (formdata.name.trim().toLowerCase() !== formdata.name.trim()) {
      setError("name should be all lowercase");
      return false;
    }

    if (formdata.password.trim().length < 5) {
      setError("Password is too short");
      return false;
    }

    const hasRequiredCharacters =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{5,20}$/;
    if (!hasRequiredCharacters.test(formdata.password.trim())) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, one symbol, and be between 5 to 20 characters"
      );
      return false;
    }

    if (formdata.confirm.trim() !== formdata.password.trim()) {
      setError("The two passwords don't match");
      return false;
    }

    setShowError(false);
    return true;
  };
  const registerUser = async () => {
    try {
      const response = await axios.post(
        "https://natty.pythonanywhere.com/user/users/",
        {
          name: formdata.name,
          email: formdata.email,
          password: formdata.password,
        }
      );
      loginUser(formdata.email.trim(),formdata.password.trim())
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      registerUser();
      setIsRegistering(true);
      
    } else {
      setShowError(true);
    }
  };
  return (
    <>
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-right">
            <img className="auth-right-pic" src="/right.png" alt="Right" />
          </div>
          <div className="auth-left">
            <span className="sign-up-title">Sign Up</span>
            {showError && <ErrorCard error={error} />}
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-input-container">
                <i className="fas fa-user"></i>
                <input
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="Username"
                  name="name"
                  type="text"
                  id="name"
                />
              </div>
              <label htmlFor="name">Username should be all lowercase</label>

              <div className="signup-input-container">
                <i className="fas fa-envelope"></i>
                <input
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="Email"
                  type="email"
                  name="email"
                  id="email"
                />
              </div>
              <label htmlFor="email">Email should be all lowercase</label>

              <div className="signup-input-container">
                <i className="fas fa-lock"></i>
                <input
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="Password..."
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
              <label htmlFor="password">
                Password must contain uppercase , lowercase , numbers and
                symbols minimum of 7 characters
              </label>

              <div className="signup-input-container">
                <i className="fas fa-lock"></i>
                <input
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="Confirm Password"
                  type="password"
                  name="confirm"
                />
              </div>
              {isRegistering ? (
                <button type="button" className="register-btn">
                  <span>
                    <img style={{ width: "20px"}} src="login.gif" />
                  </span>
                </button>
              ) : (
                <button type="submit" className="register-btn">
                  Register
                </button>
              )}
            </form>
            <span style={{ margin: "15px" }}>
              Already Registered? 
              <Link to="/" style={{ paddingLeft:"10px", color: "red" }}>
                 Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
