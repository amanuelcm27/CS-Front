import "./App.css";
import Signup from "./pages/Authentication/SignUp";
import Signin from "./pages/Authentication/SignIn";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./pages/NavFoot/NavBar";
import Profile from "./pages/Profile/Profile";
import Footer from "./pages/NavFoot/Footer";
import Discussion from "./pages/Discussion/Discussion";
import Home from "./pages/Home/Home";
import CurrentEvents from "./pages/Events/CurrentEvents";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Answer from "./pages/Discussion/Answer";
import HostsPage from "./pages/HostsPage/HostsPage";
import HostDetailPage from "./pages/HostsDetail/HostDetailPage";
import EventDetails from "./pages/Events/EventDetails/EventDetails";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <div className="wrapper">
            <div className="main-content">
              <NavBar />
              <Routes>
                <Route path="/login" element={<Signin />}></Route>
                <Route path="/register" element={<Signup />}></Route>
                <Route path="/" element={<Navigate to="/home"></Navigate>}></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/" element={<PrivateRoute />}>
                 
                  <Route path="/profile/:user_id" element={<Profile />}></Route>
                  <Route path="/hosts" element={<HostsPage />}></Route>
                  <Route path="/hosts/:hostid" element={<HostDetailPage />}></Route>
                  <Route path="/events" element={<CurrentEvents />}></Route>
                  <Route path="/event-detail/:id" element={<EventDetails />}></Route>
                  <Route path="/discussion" element={<Discussion />}></Route>
                  <Route path="/answers/:question_id/" element={<Answer/>}></Route>
                  <Route
                    path="/event-detail/1/"
                    element={<EventDetails />}
                  ></Route>
                  <Route path="*" element={<Home/>}></Route>
                </Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
