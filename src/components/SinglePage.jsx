import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../../data.json";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePosts } from "../provider/PostContext.jsx";
import MultiLan from "./MultiLan.jsx";
import supabase, { admin } from "../database.js";
import { useNavigate } from "react-router-dom";

export default function SinglePage() {
  const { user, factList, latest } = usePosts();
  const [isVoting, setIsVoting] = useState(false);
  const { id } = useParams();
  const navigateTo = useNavigate();

  useEffect(() => {
    // This effect does nothing, but it triggers a re-render when user state changes
  }, [user]);

  const factId = parseInt(id); // Convert id to integer
  let fact = factList.find((fact) => fact.id === factId);

  // if cannot find in original main array, search in latest array
  if (!fact) {
    fact = latest.find((fact) => fact.id === factId);
  }

  const categoryObject = CATEGORIES.find(
    (category) => category.name === fact.category
  );
  const categoryColor = categoryObject ? categoryObject.color : "#cccccc"; // Default color if category not found

  // TODO
  const isDisputed = false;

  const handleVote = async (increment) => {
    // Check if the user is logged in
    if (!user) {
      // User is not logged in, display a prompt message
      alert("Please login to vote.");
      return; // Abort the form submission
    }

    setIsVoting(true);

    // Retrieve the current 'user_voted' array from the database
    const { data: factData, error: factError } = await supabase
      .from("facts")
      .select("user_voted")
      .eq("id", fact.id)
      .single();

    // Check for errors
    if (factError) {
      console.error("Error retrieving user_voted array:", factError.message);
      setIsVoting(false);
      return;
    }

    const currentUserVotedArray = factData.user_voted || []; // Handle case when user_voted is null

    // Check if the user's email is already in the array
    if (currentUserVotedArray.includes(user.email)) {
      // User has already voted, display an alert and abort
      alert("You have already voted. You cannot vote again.");
      setIsVoting(false);
      return; // Abort the form submission
    }

    // Append the user's email to the 'user_voted' array
    currentUserVotedArray.push(user.email);
    const voteIncrement = increment ? 1 : -1;
    const newVotesMain = fact.votesMain + voteIncrement;

    // Update the 'user_voted' column with the new array
    const { data, error } = await supabase
      .from("facts")
      .update({
        votesMain: newVotesMain,
        user_voted: currentUserVotedArray,
      })
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
    fact.votesMain = newVotesMain;
  };

  const handleUpVote = () => {
    handleVote(true);
  };

  const handleDownVote = () => {
    handleVote(false);
  };

  const handelDel = async () => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete?")) {
      const { error } = await supabase
        .from("translations")
        .delete()
        .eq("fact_id", id);

      if (error) {
        console.error("Error deleting translations:", error.message);
      } else {
        const { error1 } = await supabase.from("facts").delete().eq("id", id);
        if (error1) {
          console.error("Error deleting fact:", error.message);
        } else {
          console.log("Fact deleted successfully!");
          // push back to home page
          navigateTo("/ai-lexicon-community/");

          // Delay for 500 milliseconds before reloading the page
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }
      }
    }
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

          <div className="w-100">
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

            <div className="d-flex justify-content-between w-100 align-items-center">
              {/* user */}
              <div className="text-secondary roboto-regular">
                Contributed by{" "}
                <span className="roboto-bold text-dark">{fact.user_name}</span>
              </div>
              {/* del */}
              {user?.email === admin ? (
                <div>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => handelDel()}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
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
          className="roboto-regular"
        >
          {"\u2190 "}Back to Home
        </Link>
      </div>
    </div>
  );
}
