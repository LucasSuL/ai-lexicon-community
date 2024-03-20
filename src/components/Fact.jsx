import React, { useState } from "react";
import { CATEGORIES } from "../../data";
import supabase from "../database.js";
import { Link } from "react-router-dom";

export default function Fact({ fact, setFactList }) {
  const [isVoting, setIsVoting] = useState(false);
  const handleVote = async (type) => {
    setIsVoting(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [type]: fact[type] + 1 })
      .eq("id", fact.id)
      .select();

    if (!error) {
      setFactList((factList) =>
        factList.map((f) => {
          return f.id === fact.id ? updatedFact[0] : f;
        })
      );
    }
    setIsVoting(false);
  };

  const categoryObject = CATEGORIES.find(
    (category) => category.name === fact.category
  );
  const categoryColor = categoryObject ? categoryObject.color : "#cccccc"; // Default color if category not found

  const isDisputed =
    fact.votesFalse >= 5 && fact.votesFalse > fact.votesInteresting;

  return (
    <div className="bg-white shadow p-2 m-2 mb-4 d-flex align-items-center justify-content-between rounded row">
      <div className="p-2 col-12 col-lg-7 pe-3">
        {isDisputed ? (
          <span className="text-danger fw-bold">[⛔️ DISPUTED] </span>
        ) : (
          ""
        )}
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          to={`/today-i-learned/entries/${fact.id}`}
        >
          {fact.text}
        </Link>

        <a href={fact.source} className="source ms-1" target="_blank">
          (Source)
        </a>
      </div>
      <div className="col-8 col-lg-5">
        <div className="row">
          <div
            className=" tag d-flex justify-content-center align-items-center rounded fw-bold col-6 m-0"
            style={{ backgroundColor: categoryColor }}
          >
            {fact.category}
          </div>
          <div className="vote-buttons d-flex justify-content-between gap-2 align-items-center col-6">
            <button
              className="btn btn-light d-flex align-items-center justify-content-center gap-1 shadow-sm"
              onClick={() => handleVote("votesInteresting")}
              disabled={isVoting}
              style={{ width: "50px" }}
            >
              👍
              <p className="count m-0 fw-bold">{fact.votesInteresting}</p>
            </button>
            <button
              className="btn btn-light d-flex align-items-center justify-content-center gap-1 shadow-sm"
              onClick={() => handleVote("votesMindblowing")}
              disabled={isVoting}
              style={{ width: "50px" }}
            >
              🤯
              <p className="count m-0 fw-bold">{fact.votesMindblowing}</p>
            </button>
            <button
              className="btn btn-light d-flex align-items-center justify-content-center gap-1 shadow-sm"
              onClick={() => handleVote("votesFalse")}
              disabled={isVoting}
              style={{ width: "50px" }}
            >
              ⛔️
              <p className="count m-0 fw-bold">{fact.votesFalse}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
