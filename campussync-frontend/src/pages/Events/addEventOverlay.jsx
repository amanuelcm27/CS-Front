import React, { useContext, useEffect } from "react";
import "./overlay.css";
import axios from "axios";
import Endpoint from "../../api";
import { useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import ErrorCard from "../Authentication/ErrorCard";
const AddEventOverlay = ({ showOverlay, setshowOverlay, fetchEvents }) => {
  const { user } = useContext(AuthContext);
  const [isuploading, setUploading] = useState(false);

  const [eventData, setData] = useState({
    host_id: "",
    name: "",
    description: "",
    event_date: "",
    poster: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const handleImage = (e) => {
    const poster_overlay = document.querySelector(".overlay-poster");
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      poster_overlay.style.backgroundImage = `url(${fileUrl})`;
    }
    setData({ ...eventData, poster: file });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...eventData, [name]: value });
  };
  const validateForm = () => {
    if (eventData.host_id == "") {
      setError("Choose as which host you want to create the event!");
      return false;
    }
    return true;
  };
  const [hostsUnderUser, setHostsUnderUser] = useState([]);
  const fetchHostsUnderUser = async () => {
    const response = await axios.post(`${Endpoint()}user/hosts_under_user/`, {
      user_id: user.user_id,
    });
    setHostsUnderUser(response.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setUploading(true);
      const formData = new FormData();
      formData.append("host_id", eventData.host_id);
      formData.append("event_date", eventData.event_date);
      eventData.poster ? formData.append("poster", eventData.poster) : "";
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      formData.append("address", eventData.address);
      try {
        const response = await axios.post(
          `${Endpoint()}event/events/`,
          formData
        );
        fetchEvents();
        setshowOverlay(!showOverlay);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log(eventData.host_id);
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchHostsUnderUser();
  }, []);
  return (
    <>
      <div className="overlay-container">
        <div className="overlay-box">
          <i
            onClick={() => {
              document.body.style.overflowY = "scroll";
              setshowOverlay(!showOverlay);
            }}
            class="fa-solid fa-x"
          ></i>
          <form
            onSubmit={handleSubmit}
            className="event-form"
            encType="multipart/form-data"
          >
            <div className="overlay-poster">
              <div className="upload-icon">
                <label htmlFor="poster">
                  <i className="fa-solid fa-upload"></i>
                  <p style={{ color: "black", fontSize: "1.5rem" }}>
                    Event Poster
                  </p>
                </label>
              </div>

              <input
                onChange={handleImage}
                type="file"
                id="poster"
                name="poster"
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <div className="event-inputs">
              <i className="fa fa-pen"></i>
              <input
                onChange={handleChange}
                type="text"
                className="event-input"
                name="name"
                placeholder="your event ..."
                required
              />
            </div>

            <div className="event-inputs">
              <i class="fa-solid fa-calendar-days"></i>

              <input
                onChange={handleChange}
                type="date"
                className="event-input"
                name="event_date"
                placeholder="event date ..."
                required
              />
            </div>
            <div className="event-inputs">
              <i class="fa-solid fa-location-dot"></i>
              <input
                onChange={handleChange}
                type="text"
                className="event-input"
                name="address"
                placeholder="location ..."
                required
              />
            </div>
            <div>
              {showError && <ErrorCard error={error} />}
              <div style={{ marginTop: "20px" }}>
                <ul className="host-choices">
                  {hostsUnderUser.length > 0 ? (
                    <div>
                      <span>As which host</span>
                      <ul className="host-choices">
                        {hostsUnderUser.map((host) => (
                          <li
                            key={host.id}
                            style={{
                              backgroundColor:
                                eventData.host_id === host.id ? "#ac95e6" : "",
                            }}
                            onClick={() =>
                              setData({ ...eventData, host_id: host.id })
                            }
                          >
                            {host.hostname}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <Link to="/hosts" style={{ color: "red" }}>
                        You Can't create an Event if you're not a host? <li style={{ color: "black" }}>Be a Host</li>
                      </Link>
                    </div>
                  )}
                </ul>
              </div>
            </div>
            <div className="event-inputs">
              <textarea
                onChange={handleChange}
                type="text"
                className="event-desc"
                name="description"
                placeholder="description ..."
                required
              ></textarea>
            </div>
            {isuploading ? (
              <span>
                <img style={{ width: "70px" }} src="loading.gif" />
              </span>
            ) : (
              <button className="create-event-btn">Create Event</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEventOverlay;
