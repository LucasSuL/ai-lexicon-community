import React from "react";
import { CATEGORIES } from "../../data";
import { Link } from "react-router-dom";

export default function Fact({ fact }) {
  const categoryObject = CATEGORIES.find(
    (category) => category.name === fact.category
  );
  const categoryColor = categoryObject ? categoryObject.color : "#cccccc"; // Default color if category not found

  return (
    <div className="bg-white shadow p-2 m-2 mb-4 d-flex align-items-center justify-content-between rounded row">
     

      <div className="p-2 col-12 col-lg-9 pe-3">
        <Link
          className="me-2 font-ave-b text-capitalize"
          style={{ color: "inherit", textDecoration: "inherit" }}
          to={`/ai-lexicon-community/entries/${fact.id}`}
          // type="main"
        >
          {fact.head}:
        </Link>
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          to={`/ai-lexicon-community/entries/${fact.id}`}
        >
          {fact.text}
        </Link>

        {/* <a href={fact.source} className="source ms-1" target="_blank">
          (Source)
        </a> */}
      </div>
      <div className="col-8 col-lg-3">
        <div
          className=" tag d-flex justify-content-center align-items-center rounded fw-bold m-0"
          style={{ backgroundColor: categoryColor }}
        >
          {fact.category}
        </div>
      </div>
    </div>
  );
}
