import { useState } from "react";
import Form from "../components/Form";

export default function Header({ setFactList, factList }) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
     setShowForm(!showForm);
  };

  return (
    <header>
      <div class="container d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center">
          <img src="./logo.png" class="m-2 logo me-4" />
          <h1 class="fw-bold">today i learned</h1>
        </div>
        <button
          type="button"
          class="btn btn-tag w-3 text-light fw-bold"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
          onClick={() => handleShowForm()}
          style={{ backgroundColor: showForm ? "#ef4444" : "#198754" }}
        >
          {showForm ? "close" : "share a fact"}
        </button>
      </div>

      <div class="collapse" id="collapseExample">
        <Form
          factList={factList}
          setFactList={setFactList}
          setShowForm={setShowForm}
        />
      </div>
    </header>
  );
}
