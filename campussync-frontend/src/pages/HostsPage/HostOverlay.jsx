import React, { useContext } from "react";
import { useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import Endpoint from "../../api";
const HostOverlay = ({ showOverlay, setshowOverlay }) => {
  const { user } = useContext(AuthContext);
  const [isuploading, setUploading] = useState(false);

  const [hostData, setHostData] = useState({
    hostname: "",
    description: "",
    account_pic: null,
    admins:[user.user_id]
  });
  const handleImage = (e) => {
    const poster_overlay = document.querySelector(".overlay-poster");
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      poster_overlay.style.backgroundImage = `url(${fileUrl})`;
    }
    setHostData({ ...hostData, account_pic: file });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHostData({ ...hostData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("hostname", hostData.hostname);
    formData.append("description", hostData.description);
    formData.append("admins", hostData.admins);
    formData.append("account_pic", hostData.account_pic);
    console.log(formData);

    try {
      const response = await axios.post(`${Endpoint()}user/hosts/`, formData);
      console.log(response);
      setshowOverlay(!showOverlay);
    } catch (e) {
      console.log("error:", e);
    }
    
  };
  return (
    <>
      <div className="overlay-container">
        <div className="overlay-box">
          <i
            onClick={() => {
              document.body.style.overflowY = "scroll";
              setshowOverlay(!showOverlay);
            }}
            className="fa-solid fa-x"
          ></i>
          <h3 style={{ textAlign: "center" }}>Be a Host</h3>
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
                    Host Poster
                  </p>
                </label>
              </div>

              <input
                onChange={handleImage}
                type="file"
                id="poster"
                name="account_pic"
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
                name="hostname"
                placeholder="host name ..."
                required
              />
            </div>

            <div className="event-inputs">
              <textarea
                onChange={handleChange}
                type="text"
                className="event-desc"
                name="description"
                placeholder="tell us a bit about this host ..."
                required
              ></textarea>
            </div>
            {isuploading ? (
              <span>
                <img style={{ width: "70px" }} src="loading.gif" />
              </span>
            ) : (
              <button type="submit" className="create-event-btn">
                Create Host
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default HostOverlay;
