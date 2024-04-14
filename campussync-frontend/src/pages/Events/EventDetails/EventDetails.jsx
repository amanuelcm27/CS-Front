import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./event-details.css";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import CongratulationPopout from "./CongratulationPopout/CongratulationPopout";
import AlreadyRegisteredPopout from "./AlreadyRegisteredPopout/AlreadyRegisteredPopout";
import timeFormater from "../../../utils/timeformater";

function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [choice, setChoice] = useState({});
  const [comment, setComment] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [postcomment, setPostComment] = useState({
    commentor_id: user.user_id,
    content: "",
    event: null,
  });
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);
  console.log("thsi is the param id", id);
  useEffect(() => {
    setPostComment({ ...postcomment, event: id });
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchComments();
    fetchAttendees();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://natty.pythonanywhere.com/event/events/${id}/`
      );
      const { data } = response;
      let timestamp = data.date_posted;
      const date = new Date(timestamp);
      timestamp = timestamp.slice(0, 10);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const humanReadableTime = `${formattedHours}:${formattedMinutes}`;
      data.date_posted = timestamp + ",   " + humanReadableTime;
      setChoice(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://natty.pythonanywhere.com/event/${id}/comments/`
      );

      setComment(response.data?.reverse());
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const fetchAttendees = async () => {
    try {
      const response = await axios.get(
        `https://natty.pythonanywhere.com/event/events/${id}/attendees/`
      );
      setAttendees(response.data);
    } catch (error) {
      console.log("Error fetching attendees:", error);
    }
  };

  const handleCommentChange = (e) => {
    setPostComment({ ...postcomment, content: e.target.value });
  };

  const handleRSVP = (e, userId, eventId) => {
    const isAttending = attendees.some((attendee) => attendee.id === userId);
    if (isAttending) {
      setShowAlreadyRegistered(true);
    } else {
      RSVP(userId, eventId);
    }
  };

  const RSVP = (userId, eventId) => {
    const eventData = { id: userId };
    let form_data = new FormData();
    form_data.append("id", eventData.id);
    let url = `https://natty.pythonanywhere.com/event/events/${eventId}/attendees/`;
    axios
      .post(url, form_data, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => {
        setAttendees((prev) => [...prev, { id: userId }]);
        setShowCongratulation(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCommentSubmitted) {
      setIsCommentSubmitted(true);
      let form_data = new FormData();
      form_data.append("commentor_id", postcomment.commentor_id);
      form_data.append("content", postcomment.content);
      form_data.append("event", postcomment.event);
      let url = "https://natty.pythonanywhere.com/event/comments/new/";
      try {
        const res = await axios.post(url, form_data, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        console.log(res.data);
        fetchComments();
        setPostComment({
          commentor_id: postcomment.commentor_id,
          content: "",
          event: id,
        });
        setIsCommentSubmitted(false);
      } catch (err) {
        console.log(err);
        setIsCommentSubmitted(false);
      }
    }
  };

  return (
    <>
      <div className="detail-container">
        <div className="detail-header" style={{ backgroundImage: `url(${choice.poster})` }}>
          <div className="detail-side">
            <div className="detail-description">
              <span className="detail-desc-head">Description</span>
              <div>{choice.description}</div>
            </div>
            <div className="detail-box">
              <span className="detail-desc-head">Detail</span>
              <div className="detail-box-2">
                <span>
                  <i className="fa-solid fa-location-dot"></i>
                  {choice.address}
                </span>
                <span>
                  <i className="fa-regular fa-clock"></i>
                  {timeFormater(choice.date_posted)}
                </span>
                <span>
                  <i className="fa fa-user"></i>Hosted by
                  {choice.host ? <Link style={{textTransform:"uppercase"}} to={`/hosts/${choice.host.id}`}> {choice.host.hostname}</Link>  : ""}
                </span>
                <button
                  onClick={(e) => handleRSVP(e, user.user_id, id)}
                  className="rsvp-btn">
                  RSVP
                </button>
              </div>
            </div>
          </div>
          {showCongratulation && (
            <CongratulationPopout
              onClose={() => setShowCongratulation(false)}
            />
          )}
          {showAlreadyRegistered && (
            <AlreadyRegisteredPopout
              onClose={() => setShowAlreadyRegistered(false)}
            />
          )}
        </div>
        <div className="comments-container">
          <span style={{ fontSize: "2rem", paddingBottom: "10px" }}>
            Comments
          </span>
          <form onSubmit={handleSubmit} className="comment-form">
            <input
              className="comment-text"
              value={postcomment.content}
              onChange={handleCommentChange}
              placeholder="share your opinion"
            />
            <button className="comment-btn">
              <i className="fa fa-paper-plane"></i>Send
            </button>
          </form>
          <div className="comment-card-container">
            {comment.map((comment) => (
              <div className="comment-card">
                <div style={{ display: "flex" }}>
                  <img
                    src={comment.commentor.profile_pic}
                    className="comment-pic"
                  />
                  <div className="comment-head">
                    <span>{comment.commentor.name}</span>
                    <span>{timeFormater(comment.date_posted)}</span>
                  </div>
                </div>

                <div className="comment-data">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default EventDetails;
