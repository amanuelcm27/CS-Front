import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./TopHosts.css";
import { Link } from 'react-router-dom';

const EventHostCard = ({ name, description, imageUrl }) => {
  return (
    <div className="event-host-card">
      <img src={imageUrl} alt={name} />
      <div className="host-info">
        <h3>{name}</h3>
        <p> {description}</p>
      </div>
    </div>
  );
};

const TopHosts = () => {
  const [hostsData, setHostsData] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("https://natty.pythonanywhere.com/user/hosts/");
        // Sort hosts based on a relevant property and take the first 6
        const sortedHosts = response.data.sort((a, b) => b.id - a.id).slice(0, 6);
        setHostsData(sortedHosts);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <section className="top-event-hosts">
      <h2 style={{margin:"20px"}}>Top Event Hosts</h2> 
      <div className="hosts-container">
        {hostsData.map((host, index) => (
          <EventHostCard key={index} imageUrl={host.account_pic} name={host.hostname} description={host.description} />
        ))}
      </div>
      <Link to="/hosts">
      <button className="view-more"> More <i class="fa-solid fa-circle-chevron-down"></i></button>
      </Link>
    </section>
  );
};

export default TopHosts;