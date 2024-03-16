import React, { useState } from "react";
import { CATEGORIES } from "../../data";
import supabase from "../database.js";

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
  const categoryColor = categoryObject ? categoryObject.color : "#000"; // Default color if category not found

  const isDisputed =
    fact.votesFalse >= 5 && fact.votesFalse > fact.votesInteresting;

  return (
    <div className="bg-white shadow p-2 m-2 mb-3 d-flex align-items-center justify-content-between rounded row">
      <div className="p-2 col-7 pe-3">
        {isDisputed ? (
          <span className="text-danger fw-bold">[⛔️ DISPUTED] </span>
        ) : (
          ""
        )}
        {fact.text}
        <a href={fact.source} className="source ms-1" target="_blank">
          (Source)
        </a>
      </div>
      <div
        className=" tag d-flex justify-content-center align-items-center p-1 rounded fw-bold col-2 "
        style={{ backgroundColor: categoryColor }}
      >
        {fact.category}
      </div>
      <div className="vote-buttons d-flex justify-content-end gap-2 p-0 align-items-center col-3 ">
        <button
          className="btn btn-light d-flex align-items-center m-1 p-1 shadow-sm"
          onClick={() => handleVote("votesInteresting")}
          disabled={isVoting}
          style={{ width: "50px" }}
        >
          👍
          <strong className="count m-0 border">{fact.votesInteresting}</strong>
        </button>
        <button
          className="btn btn-light d-flex align-items-center m-1 p-1 shadow-sm"
          onClick={() => handleVote("votesMindblowing")}
          disabled={isVoting}
          style={{ width: "50px" }}
        >
          🤯
          <strong className="count">{fact.votesMindblowing}</strong>
        </button>
        <button
          className="btn btn-light d-flex align-items-center m-1 p-1 shadow-sm"
          onClick={() => handleVote("votesFalse")}
          disabled={isVoting}
          style={{ width: "50px" }}
        >
          ⛔️
          <strong className="count">{fact.votesFalse}</strong>
        </button>
      </div>
    </div>
  );
}
