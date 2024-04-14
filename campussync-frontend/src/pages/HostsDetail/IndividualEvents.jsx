import React, { useContext } from "react";
import "./individual.css";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import timeFormater from "../../utils/timeformater";

function IndividualEvents({ userid, item, name }) {
  const humanReadable = "https://natty.pythonanywhere.com/media/" + item.poster;
  const timestamp = item.date_posted;
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const humanReadableTime = `${formattedHours}:${formattedMinutes}`;
  const {user} = useContext(AuthContext);
  console.log(item)
  return (
    <>
      <div className="individual-container">
        <div className="individual-container-pic">
          <img src={humanReadable} alt="" />
        </div>
        <Link to={`/event-detail/${item.id}/`}>
        <div className="individual-details-container">
          <h1>{item.name}</h1>
          <div className="individual-details">
            <div className="individual-content">
              <p><i className="fa-solid fa-location-dot"></i>{item.address}</p>
              <p><i className="fa-regular fa-clock"></i>{timeFormater(item.date_posted)}</p>
            </div> 
          </div>
        </div>
        </Link>
     
      </div>
    </>
  );
}

export default IndividualEvents;
