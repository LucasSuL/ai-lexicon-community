import React, { useContext, useState } from "react";
import { CATEGORIES } from "../../data.json";
import supabase from "../database.js";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import PostContext from "../provider/PostContext";

export default function SinglePage() {

  const { factList, setFactList } = useContext(PostContext);

  const { id } = useParams();
  const factId = parseInt(id); // Convert id to integer
  const fact = factList.find((fact) => fact.id === factId);

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

  const colonIndex = fact.text.indexOf(":");
  const title = fact.text.substring(0, colonIndex).trim();
  const after = fact.text.substring(colonIndex + 1).trim();

  const Title = () => {
    return <h3 className="fw-bold mt-2">{title}</h3>;
  };

  const Source = () => {
    return (
      <div className="d-flex mt-3 text-secondary">
        <p className="w-100">
          <strong>Source:</strong>
          <a
            href="#"
            className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover ms-1"
          >
            {" "}
            {fact.source}
          </a>
        </p>
      </div>
    );
  };

  const Cat = () => {
    return (
      <div
        className="mt-3 tag d-inline p-1 px-3 justify-content-center align-items-center rounded fw-bold m-0"
        style={{ backgroundColor: categoryColor }}
      >
        {fact.category}
      </div>
    );
  };

  const Text = () => {
    return (
      <div className="mt-5">
        {isDisputed ? (
          <div className="text-danger fw-bold mb-2">[⛔️ DISPUTED] </div>
        ) : (
          ""
        )}
        <p className="fs-5">{after}</p>
      </div>
    );
  };

  const Return = () => {
    return (
      <div className="mt-5 text-secondary">
        <Link
          to="/ai-lexicon-community/"
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          {'\u2190 '}Back to Home
        </Link>
      </div>
    );
  };

  const Votes = () => {
    return (
      <div className="vote-buttons d-flex justify-content-start gap-3 align-items-center mb-3 mt-3">
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
    );
  };

  return (
    <div className="container">
      <div className="bg-light p-4 shadow rounded-3 mt-5">
        <Title />
        <Cat />
        <Text />
        <Source />
        <Votes />
        <Return />
      </div>
    </div>
  );
}
