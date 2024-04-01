import React, { useState } from "react";
import { usePosts } from "../provider/PostContext";

export default function Header() {
  const { setSearchKeyword } = usePosts();
  const [ localSearch, setLocalSearch ] = useState("");

  // const [filteredContent, setFilteredContent] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchKeyword(localSearch);
    // const filteredResults = setFilteredContent(filteredResults);
  };


  return (
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <div className="d-flex align-items-center">
            <img src="./logo.png" className="ms-0 logo me-3" />
            <p className="fw-bold text-dark m-0 fs-4 text-uppercase d-none d-sm-block">
              AI Lexicon Community
            </p>
          </div>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          {/* <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Link
                </a>
              </li>
            </ul> */}
          <div className="me-auto"></div>
          <form class="d-flex" role="search" onSubmit={handleSubmit}>
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
