import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HostDetail.css";

const HostDetailCard = ({ item2, name, host }) => {
  const url = "https://natty.pythonanywhere.com/user/follow_host/";
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if the user is following the host
  useEffect(() => {
    setIsFollowing(host.some((follower) => follower.id === name));
  }, [host, name]);

  const handleFollow = () => {
    const requestBody = {
      user_id: name,
      host_id: item2.id,
    };

    axios
      .post(url, requestBody)
      .then((res) => {
        console.log(res.data);
        // Update isFollowing state based on the response
        setIsFollowing(!isFollowing);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="host-detail-cont"
      style={{ backgroundImage: `url(${item2.account_pic})` }}
    >
      <div className="host-detail-card">
     
        <div className="host-detail-info">
          <h2 style={{marginLeft:"30px"}}>{item2.hostname}</h2>
          <div style={{ width:'80%', marginLeft:"30px"}}>
          <span style={{ textAlign:"justify"}}>{item2.description}</span>

          </div>
          {isFollowing ? (
            <button style={{marginLeft:"30px"}} className="follow-button" onClick={handleFollow}>
              Following
            </button>
          ) : (
            <button style={{marginLeft:"30px"}}className="follow-button" onClick={handleFollow}>
              Follow
            </button>
          )}
        </div>

      </div>

    </div>
    
  );
};

export default HostDetailCard;
