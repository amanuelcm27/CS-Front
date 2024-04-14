import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TopEvents.css';
import EventCard from './EventCard';

const timeFormater = (isoDateString) => {
  const date = new Date(isoDateString);
  const formattedDate = date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric', 
  });
  return formattedDate;
}

const TopEvents = () => {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("https://natty.pythonanywhere.com/event/events/");
        // Sort events by date_posted in descending order and take the first 6
        const sortedEvents = response.data.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted)).slice(0, 8);
        setEventsData(sortedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div className="event-container">
      <h2>Top Events Happening Now</h2> 
      <div className="events-grid">
        {eventsData.map((event, index) => (
          <EventCard 
            key={event.id}
            id={event.id}
            imageSrc={event.poster}
            title={event.name}
            location={event.address}
            time={timeFormater(event.date_posted)} 
          />
        ))}
      </div>
      <button className="view-more"><Link to="/events">More<i class="fa-solid fa-circle-chevron-down"></i></Link></button>
    </div>
  );
};

export default TopEvents;

