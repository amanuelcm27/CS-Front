import React from "react";
import "./alreadyregisteredpopout.css";

function AlreadyRegisteredPopout({ onClose }) {
  return (
    <div className="popout-container">
      <div className="popout-content">
        <p>You have already registered for this event.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AlreadyRegisteredPopout;
