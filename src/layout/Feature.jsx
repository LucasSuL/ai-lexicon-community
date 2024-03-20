import React, { useState } from "react";
import Form from "../components/Form";

const Feature = ({ setFactList, factList }) => {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <div
        className="display-2 fw-medium mt-5 d-flex flex-column align-items-center text-center"
        style={{ maxWidth: "1100px" }}
      >
        <strong className="cust-title">
          Your Multi-language Collaborative Dictionary
        </strong>
        <p className="mt-3 fs-3 text-secondary">
          A next generation online translating platform of new AI terms!
        </p>
      </div>

      <div className="mt-3 d-flex gap-3">
        <button
          type="button"
          className="btn w-3 text-light"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
          onClick={() => handleShowForm()}
          style={{
            backgroundColor: showForm ? "#ef4444" : "#198754",
            width: "160px",
          }}
        >
          {showForm ? "Close" : "Share Translation"}
        </button>
        <a
          className="btn btn-dark d-flex align-items-center justify-content-center"
          style={{ width: "160px" }}
          href="https://github.com/LucasSuL/today-i-learned"
          target="_blank"
          rel="noreferrer"
          role="button"
        >
          <i className="fab fa-github fs-5 me-2"></i>
          <p className="m-0">GitHub</p>
        </a>
      </div>
      <div
        className="collapse border mt-4 w-100 shadow-sm rounded bg-light"
        id="collapseExample"
      >
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
