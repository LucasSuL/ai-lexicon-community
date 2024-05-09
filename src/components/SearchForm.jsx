import React, { useState } from "react";
import { usePosts } from "../provider/PostContext";

const SearchForm = () => {
  const { setSearchKeyword } = usePosts();
  const [ localSearch, setLocalSearch ] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchKeyword(localSearch);
  };

  return (
    <form className="container d-flex" role="search" onSubmit={handleSubmit}
    style={{maxWidth:"500px"}}>
      <input
        className="form-control"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <button className="btn btn-outline-success ms-3" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
