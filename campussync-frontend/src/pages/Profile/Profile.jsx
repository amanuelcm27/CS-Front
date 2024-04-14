import { useContext, useEffect, useState } from "react";
import "./profile.css";
import React from "react";
import axios from "axios";
import Endpoint from "../../api";
import AuthContext from "../../context/AuthContext";
import { Link, Navigate, useParams } from "react-router-dom";
import timeFormater from "../../utils/timeformater";

const Following = ({ user_id }) => {
  const [followingList, setFollowingList] = useState([]);
  const fetchFollowing = async () => {
    const response = await axios.post(`${Endpoint()}user/user_following/`, {
      user_id: user_id,
    });
    console.log(response);
    setFollowingList(response.data);
  };
  useEffect(() => {
    fetchFollowing();
  }, [user_id]);
  return (
    <div className="following-hosts">
      {followingList.length > 0 ? (
        followingList.map((host) => (
          <Link to={`/hosts/${host.id}`}>
            <div className="following-box">
              <img
                src={`http://natty.pythonanywhere.com/media/${host.account_pic}`}
                className="host-pic"
              />
              <p>{host.hostname}</p>
            </div>
          </Link>
        ))
      ) : (
        <div style={{ margin: "10px auto", textAlign: "center" }}>
          <span style={{ fontSize: "20px" }}>
            you are not following any one start
            <Link to="/hosts">
              <button
                style={{
                  margin: "5px",
                  padding: "10px",
                  borderRadius: "25px",
                  border: "none",
                  background: "purple",
                  color: "white",
                }}
              >
                here
              </button>
            </Link>
          </span>
          <div className="answer">
            <img style={{ width: "60%" }} src="/nofollow.gif" />
          </div>
        </div>
      )}
    </div>
  );
};
const AppointedEvents = ({ user_id }) => {
  const [events, setEvents] = useState([]);
  const fetchrRvpedEvents = async () => {
    const response = await axios.post(`${Endpoint()}user/events_rsvpd/`, {
      user_id: user_id,
    });
    setEvents(response.data);
    console.log(response.data);
  };
  useEffect(() => {
    fetchrRvpedEvents();
  }, [user_id]);
  return (
    <div className="event-cards">
      {events.length > 0 ? (
        events.map((event) => (
          <div className="event-card-prof">
            <img
              className="event-img"
              src={`http://natty.pythonanywhere.com/${event.poster}`}
            />
            <div className="event-detail">
              <p style={{ fontSize: "1.5rem" }}>{event.name}</p>
              <p>
                <i class="fa-solid fa-location-dot"></i> {event.address}
              </p>
              <p>
                <i class="fa-regular fa-clock"></i> :{" "}
                {timeFormater(event.event_date)}
              </p>
              <Link to={`/event-detail/${event.id}`}>
                <button className="view-details">View Details</button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div style={{ margin: "20px", boxShadow: "none" }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "20px" }}>
              you have no Scheduled events add some
              <Link to="/events">
                <button
                  style={{
                    margin: "5px",
                    padding: "10px",
                    borderRadius: "25px",
                    border: "none",
                    background: "purple",
                    color: "white",
                  }}
                >
                  here
                </button>
              </Link>
            </span>
            <div className="answer">
              <img src="/empty.gif" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const ProfileDetail = ({ ProfileDetail }) => {
  return (
    <div className="profile-detail">
      <span style={{ padding: "10px" }}>Username : {ProfileDetail.name}</span>
      <span style={{ padding: "10px" }}>Email : {ProfileDetail.email}</span>
    </div>
  );
};
const QuestionUnderUser = ({ user_id }) => {
  const [questions, setQuestions] = useState([]);
  const fetchQuestions = async () => {
    const response = await axios.post(`${Endpoint()}user/questions_by_user/`, {
      user_id: user_id,
    });
    setQuestions(response.data);
    console.log(response);
  };
  useEffect(() => {
    fetchQuestions();
  }, [user_id]);
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="q-head">
              <img
                src={`${Endpoint()}${question.author?.profile_pic}`}
                className="q-creator"
              />
              <span>
                {question.author?.name}
                <small style={{ color: "gray" }}> asked</small>
                <br /> <small>{timeFormater(question.created_date)}</small>
              </span>
            </div>

            <div className="q-content">
              <div className="question">
                <Link id="q-answers" to={`/answers/${question.id}`}>
                  {question.question}
                </Link>
              </div>
              <div style={{ display: "flex" }}>
                <button className="answer-btn">
                  <Link id="q-answers" to={`/answers/${question.id}`}>
                    <i className="fas fa-pen"></i> Answer
                  </Link>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ margin: "20px", boxShadow: "none" }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "20px" }}>
              you haven't asked a question yet start
              <Link to="/discussion">
                <button
                  style={{
                    margin: "5px",
                    padding: "10px",
                    borderRadius: "25px",
                    border: "none",
                    background: "purple",
                    color: "white",
                  }}
                >
                  here
                </button>
              </Link>
            </span>
            <div className="answer">
              <img src="/empty.gif" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const Profile = () => {
  const [selectedDetail, setSelectedDetail] = useState("Events");
  const [profile, setprofile] = useState([]);
  const { user } = useContext(AuthContext);
  const { user_id } = useParams();

  const fetchProfileDetail = async () => {
    const response = await axios.get(`${Endpoint()}user/users/${user_id}/`);
    setprofile(response.data);
  };

  const updateProfilePic = async (e) => {
    const file = e.target.files[0];
    const picData = new FormData();
    picData.append("profile_pic", file);
    console.log(picData);
    const response = await axios.patch(
      `${Endpoint()}user/users/${user_id}/`,
      picData
    );
    console.log(picData);

    fetchProfileDetail();
  };
  useEffect(() => {
    fetchProfileDetail();
  }, [user_id]);
  const renderDetail = () => {
    switch (selectedDetail) {
      case "Events":
        return <AppointedEvents user_id={user_id} />;
      case "Details":
        return <ProfileDetail ProfileDetail={profile} />;
      case "Following":
        return <Following user_id={user_id} />;
      case "Questions":
        return <QuestionUnderUser user_id={user_id} />;
      default:
        return <AppointedEvents />;
    }
  };
  return (
    <div className="profile-container">
      <div className="banner-card">
        <img className="banner-card-img-back" src={profile.profile_pic} />
        <div className="banner-card-for">
          <img className="banner-img" src={profile.profile_pic}></img>
        </div>
        <input
          onChange={updateProfilePic}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="edit-pic"
        />

        {profile.id === user.user_id ? (
          <label htmlFor="edit-pic" className="edit-pic">
            <i className="fa fa-pen"></i>
          </label>
        ) : (
          ""
        )}
      </div>
      <div className="profile-name">
        <span>{profile.name}</span>
      </div>
      <div className="profile-grid">
        <div className="content-choices">
          <ul className="choices-list">
            <li onClick={() => setSelectedDetail("Events")} className="choice">
              Scheduled Events
            </li>
            <li
              onClick={() => setSelectedDetail("Following")}
              className="choice"
            >
              Following
            </li>
            <li
              onClick={() => setSelectedDetail("Questions")}
              className="choice"
            >
              Questions
            </li>
            <li onClick={() => setSelectedDetail("Details")} className="choice">
              Profile Details
            </li>
          </ul>
        </div>
        <div className="contents-detail">
          <div className="detail-title">
            <p
              style={{
                padding: "10px",
                fontSize: "1.5rem",
                borderBottom: "0.1px solid silver",
              }}
            >
              {" "}
              {selectedDetail}
            </p>
          </div>
          {renderDetail()}
        </div>
      </div>
    </div>
  );
};
export default Profile;
