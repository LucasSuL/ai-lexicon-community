import React from "react";
import { CATEGORIES } from "../../data.json";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePosts } from "../provider/PostContext";
import MultiLan from "./MultiLan.jsx";

export default function SinglePage() {
  const { factList } = usePosts();

  const { id } = useParams();
  const factId = parseInt(id); // Convert id to integer
  const fact = factList.find((fact) => fact.id === factId);

  const categoryObject = CATEGORIES.find(
    (category) => category.name === fact.category
  );
  const categoryColor = categoryObject ? categoryObject.color : "#cccccc"; // Default color if category not found

  const isDisputed =
    fact.votesFalse >= 5 && fact.votesFalse > fact.votesInteresting;

  const Title = () => {
    return <h3 className="fw-bold mt-2 font-ave-b">{fact.head}</h3>;
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
      <div className="mt-4">
        {isDisputed ? (
          <div className="text-danger fw-bold mb-2">[⛔️ DISPUTED] </div>
        ) : (
          ""
        )}
        <p className="fs-5">{fact.text}</p>
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
          {"\u2190 "}Back to Home
        </Link>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="mt-5">
        <Title />
        <Cat />
        <Text />
        <Source />
      </div>
      <div className="mt-5">
        <MultiLan id = {fact.id} head={fact.head} />
      </div>
      <Return />
    </div>
  );
}
