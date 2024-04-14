import React, { useState } from "react";
import "./search.css";
import axios from "axios";
import Endpoint from "../../api";

function Search({ setHosts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = async () => {
    const response = await axios.get(`${Endpoint()}user/hosts?search=${searchTerm}`);
    setHosts(response.data)
  };

  return (
    <>
      <div className="search-container">
        <form onSubmit={(e)=>{e.preventDefault() , handleSubmit()}} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="search for hosts ..."
            onChange={(e)=>{setSearchTerm(e.target.value) , handleSubmit()}}
          />
          <button className="search-btn">Search</button>
        </form>
      </div>
    </>
  );
}

export default Search;
