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
  const fetchdata = async () => {
    try {
      const response = await axios.request(
        "https://natty.pythonanywhere.com/user/hosts/"
      );
      setHosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="hostpage-container">
      <>
        {showOverlay && (
          <HostOverlay
            fetchdata={fetchdata}
            showOverlay={showOverlay}
            setshowOverlay={setshowOverlay}
          />
        )}
      </>
      <div style={{ margin: "0px auto" }}>
        <button onClick={() => setshowOverlay(!showOverlay)} className="">
          Be a Host <i className="fa fa-plus"></i>
        </button>
      </div>
      <Search setHosts={setHosts} />
      <div className="hostspage-hosts">
        {loading ? (
          <img src="loading.gif" alt="Loading..." />
        ) : hosts.length > 0 ? (
          hosts.map((host) => <HostsCard key={host.id} host={host} />)
        ) : (
          <div
            style={{
              marginLeft: "30%",
              textAlign: "center",
              boxShadow: "none",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "20px" }}>No Hosts found</span>
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
