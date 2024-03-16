import React, { useState } from "react";
import Form from "./Form";

const Feature = ({ setFactList, factList }) => {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <div
        className="display-2 fw-medium mt-5 d-flex flex-column align-items-center"
        style={{ maxWidth: "1100px" }}
      >
        <strong className="cust-title ">Hey! Lucas here! </strong>
        <p className="mt-3 fs-3 text-secondary">
          Discover my stories and ideas!
        </p>
      </div>

      <div className="mt-3 d-flex gap-3">
        <button
          type="button"
          class="btn w-3 text-light"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
          onClick={() => handleShowForm()}
          style={{
            backgroundColor: showForm ? "#ef4444" : "#198754",
            width: "120px",
          }}
        >
          {showForm ? "Close" : "Share a Fact"}
        </button>
        <a
          class="btn btn-dark d-flex align-items-center justify-content-center"
          style={{ width: "120px" }}
          href="https://github.com/LucasSuL/today-i-learned"
          target="_blank"
          rel="noreferrer"
          role="button"
        >
          <i className="fab fa-github fs-5 me-2"></i>
          <p className="m-0">GitHub</p>
        </a>
      </div>
      <div class="collapse border mt-4 w-100 shadow-sm rounded bg-light" id="collapseExample">
        <Form
          factList={factList}
          setFactList={setFactList}
          setShowForm={setShowForm}
        />
      </div>
    </div>
  );
};

export default Feature;
