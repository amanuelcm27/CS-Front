import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ id, imageSrc, title, description, location, time }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event-detail/${id}`);
  };

  return (
    <Link to={`/event-detail/${id}`}>
        <div className="event-card" onClick={handleClick}>
      <img src={imageSrc} alt={title} />
      <div className="event-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <p><i className='fa-solid fa-location-dot'></i> {location}</p>
        <p><i className='fa-regular fa-clock'></i> {time} </p>
      </div>
    </div>
    </Link>

  );
};


export default EventCard;