import React, { useState } from "react";
import "./congratulationopout.css";

function CongratulationPopout({ onClose }) {
  return (
    <div className="congra-cont">
      <div className="congratulation-popout">
        <h2>Congratulations!</h2>
        <p>You have successfully RSVP'd to the event.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CongratulationPopout;
