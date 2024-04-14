import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "./Search";
import HostsCard from "./HostsCard";
import "./hostpage.css";
import "./hostcard.css";
import HostOverlay from "./HostOverlay";
import { Link } from "react-router-dom";
function HostsPage() {
  const [hosts, setHosts] = useState(null);
  const [showOverlay, setshowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.request(
          "https://natty.pythonanywhere.com/user/hosts/"
        );
        console.log(response.data);
        setHosts(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div className="hostpage-container">
      <>
        {showOverlay && (
          <HostOverlay
            showOverlay={showOverlay}
            setshowOverlay={setshowOverlay}
          />
        )}

        <button
          onClick={() => setshowOverlay(!showOverlay)}
          className="add-event-btn"
          style={{ top: "15%" }}
        >
          Be a Host <i className="fa fa-plus"></i>
        </button>
      </>
      <Search setHosts={setHosts} />
      <div className="hostspage-hosts">
        {loading ? (
          <img src="loading.gif" alt="Loading..." />
        ) : hosts.length > 0 ? (
          hosts.map((host) => <HostsCard host={host} />)
        ) : (
          <div style={{ marginLeft: "30%", textAlign:"center", boxShadow: "none" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "20px" }}>
                No Hosts found

              </span>
              <div className="answer">
                <img src="/empty.gif" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostsPage;
