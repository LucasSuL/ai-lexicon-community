import React from "react";

export default function Header() {
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
        <div class="collapse navbar-collapse text-center justify-content-end" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#posts">
                Posts
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
