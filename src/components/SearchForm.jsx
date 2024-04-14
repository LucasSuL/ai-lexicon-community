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
    <form className="container d-flex mt-5" role="search" onSubmit={handleSubmit}
    style={{maxWidth:"500px"}}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
