import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../../data.json";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePosts } from "../provider/PostContext";
import MultiLan from "./MultiLan.jsx";
import supabase from "../database.js";

export default function SinglePage() {
  const { user, setUser, factList } = usePosts();
  const [isVoting, setIsVoting] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // This effect does nothing, but it triggers a re-render when user state changes
  }, [user]);

  const factId = parseInt(id); // Convert id to integer
  const fact = factList.find((fact) => fact.id === factId);

  const categoryObject = CATEGORIES.find(
    (category) => category.name === fact.category
  );
  const categoryColor = categoryObject ? categoryObject.color : "#cccccc"; // Default color if category not found

  // TODO
  const isDisputed = false;

  const handleUpVote = async () => {
    setIsVoting(true);

    const { data, error } = await supabase
      .from("facts")
      .update({ votesMain: fact.votesMain + 1 })
      .eq("id", fact.id)
      .select();

    // Check for errors
    if (error) {
      console.error("Error updating vote count:", error.message);
      setIsVoting(false);
      return;
    }

    setIsVoting(false);

    // update value
    fact.votesMain = fact.votesMain + 1;
  };

  const handleDownVote = async () => {
    setIsVoting(true);

    const { data, error } = await supabase
      .from("facts")
      .update({ votesMain: fact.votesMain - 1 })
      .eq("id", fact.id)
      .select();

    // Check for errors
    if (error) {
      console.error("Error updating vote count:", error.message);
      setIsVoting(false);
      return;
    }

    setIsVoting(false);

    // update value
    fact.votesMain = fact.votesMain - 1;
  };

  return (
    <div className="container">
      <div className="bg-white shadow p-3 py-4 mt-3 rounded-4">
        {/* head */}
        <h3 className="fw-bold font-ave-b mb-4">{fact.head}</h3>

        <div className="d-flex">
          {/* voting */}
          <div className="px-2 me-3">
            <div className="d-flex flex-column align-items-center gap-2">
              <button
                disabled={isVoting}
                type="button"
                className="btn btn-outline-dark rounded-4 m-0 py-0"
                onClick={handleUpVote}
              >
                <i className="fas fa-arrow-up fs-6 m-0 p-1"></i>
              </button>
              <p className="m-0 fs-6">{fact.votesMain}</p>
              <button
                disabled={isVoting}
                type="button"
                className="btn btn-outline-dark rounded-4 m-0 py-0"
                onClick={handleDownVote}
              >
                <i className="fas fa-arrow-down fs-6 m-0 p-1"></i>
              </button>
            </div>
          </div>

          <div>
            {/* label */}
            <div
              className="mt-3 tag d-inline p-1 px-3 justify-content-center align-items-center rounded fw-bold m-0"
              style={{ backgroundColor: categoryColor }}
            >
              {fact.category}
            </div>

            {/* text */}
            <div className="mt-4">
              {isDisputed ? (
                <div className="text-danger fw-bold mb-2">[⛔️ DISPUTED] </div>
              ) : (
                ""
              )}
              <p className="fs-5">{fact.text}</p>
            </div>

            {/* source */}
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

            {/* user */}
            <div>Contributed by {fact.user_name}</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <MultiLan id={fact.id} head={fact.head} />
      </div>

      {/* return */}
      <div className="mt-5 text-secondary">
        <Link
          to="/ai-lexicon-community/"
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          {"\u2190 "}Back to Home
        </Link>
      </div>
    </div>
  );
}
