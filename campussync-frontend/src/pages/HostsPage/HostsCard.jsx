import React from "react";
import "./hostcard.css";
import { Link } from "react-router-dom";

function HostsCard({ host }) {
  return (
    <Link to={`/hosts/${host.id}`}>
        <div className="host-card" style={{ backgroundImage: `url(${host.account_pic})` }}>
          <div className="overlay-content">
            <h2 className="card-title">{host.hostname}</h2>
          </div>
        </div>
    </Link>
  );
}

export default HostsCard;
