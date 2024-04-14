import React, { useEffect, useState, useContext } from "react";
import "./CurrentEvents.css";
import AddEventOverlay from "./addEventOverlay";
import { Link } from "react-router-dom";
import axios from "axios";
import Endpoint from "../../api";
import AuthContext from "../../context/AuthContext";

const timeFormater = (isoDateString) => {
  const date = new Date(isoDateString);
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formattedDate;
};

const CurrentEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOverlay, setshowOverlay] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setloading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterState, setFilterState] = useState("");
  const { user, AuthUser } = useContext(AuthContext);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.get(
      `${Endpoint()}event/events/?search=${searchTerm}`
    );
    setFilteredEvents(response.data);
  };

  const handleFilter = (filter) => {
    console.log("Filtering by:", filter);
    let sortedEvents = [];
    setFilterState(filter);
    switch (filter) {
      case "all":
        sortedEvents = [...events];
      case "recent":
        sortedEvents = [...events].sort(
          (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
        );
        break;
      case "old":
        sortedEvents = [...events].sort(
          (a, b) => new Date(a.date_posted) - new Date(b.date_posted)
        );
        break;
      case "upvote":
        sortedEvents = [...events].sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "downvote":
        sortedEvents = [...events].sort((a, b) => b.downvotes - a.downvotes);
        break;
      default:
        sortedEvents = [...events];
    }
    setFilteredEvents(sortedEvents);
  };

  const handleUpvote = async (eventId, userId) => {
    try {
      let form_data = new FormData();
      form_data.append("user_id", [userId]);
      await axios.post(
        `https://natty.pythonanywhere.com/event/${eventId}/upvote/`,
        form_data
      );
      fetchEvents();
    } catch (error) {
      console.error("Error upvoting the event:", error);
    }
  };

  const handleDownvote = async (eventId, userId) => {
    try {
      let form_data = new FormData();
      form_data.append("user_id", [userId]);
      await axios.post(
        `https://natty.pythonanywhere.com/event/${eventId}/downvote/`,
        form_data
      );
      fetchEvents();
    } catch (error) {
      console.error("Error downvoting the event:", error);
    }
  };
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${Endpoint()}event/events`);
      setEvents(response.data);
      setFilteredEvents(response.data);
      setloading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <>
      {showOverlay && (
        <AddEventOverlay
          fetchEvents={fetchEvents}
          showOverlay={showOverlay}
          setshowOverlay={setshowOverlay}
        />
      )}
      <div className="current-events">
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for events..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button>Search</button>
          </form>
        </div>
        <div className="filters">
          <button
            style={{ backgroundColor: filterState === "all" ? "silver" : "" }}
            onClick={() => handleFilter("all")}
          >
            All
          </button>
          <button
            style={{
              backgroundColor: filterState === "recent" ? "silver" : "",
            }}
            onClick={() => handleFilter("recent")}
          >
            Recent
          </button>
          <button
            style={{ backgroundColor: filterState === "old" ? "silver" : "" }}
            onClick={() => handleFilter("old")}
          >
            Old
          </button>
          <button
            style={{
              backgroundColor: filterState === "upvote" ? "silver" : "",
            }}
            onClick={() => handleFilter("upvote")}
          >
            Upvote
          </button>
          <button
            style={{
              backgroundColor: filterState === "downvote" ? "silver" : "",
            }}
            onClick={() => handleFilter("downvote")}
          >
            Downvote
          </button>
        </div>
        <button
          onClick={() => setshowOverlay(!showOverlay)}
          className="add-event-btn"
        >
          Add Event <i className="fa fa-plus"></i>
        </button>

        {loading ? (
          <img src="loading.gif" alt="Loading..." />
        ) :
         filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={event.id} className="event_card">
              <img
                src={event.poster}
                style={{ width: "400px", height: "100%" }}
                alt={event.title}
              />
              <div className="event_detail">
                <Link to={`/event-detail/${event.id}/`}>
                  <h3>{event.name}</h3>
                  <p><i className="fa-solid fa-location-dot"></i> {event.address}</p>
                  <p><i className="fa-regular fa-clock"></i> {timeFormater(event.date_posted)}</p>
                  <p><i className="fa fa-user"></i> Hosted by:{event.host ? event.host.hostname : ""}</p>
                </Link>
              </div>
              <div className="voting">
                <button
                  style={{ borderRadius: "20px" }}
                  onClick={() => handleUpvote(event.id, user.user_id)}
                >
                  <i class="fa-solid fa-circle-up"></i>
                  {event.upvotes}
                </button>
                <button
                  style={{ borderRadius: "20px" }}
                  onClick={() => handleDownvote(event.id, user.user_id)}
                >
                  <i class="fa-solid fa-circle-down"></i>
                  {event.downvotes}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ margin: "20px", boxShadow: "none" }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "20px" }}>
              Oops can't find anything !!!
             
            </span>
            <div className="answer">
              <img src="/empty.gif" />
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default CurrentEvents;
