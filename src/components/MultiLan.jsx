import React, { useEffect, useState } from "react";
import supabase, { admin } from "../database";
import SubForm from "./SubForm";

import fr from "/flags/fr.png";
import cn from "/flags/cn.png";
import de from "/flags/de.png";
import es from "/flags/es.png";
import it from "/flags/it.png";
import jp from "/flags/jp.png";
import kr from "/flags/kr.png";
import vn from "/flags/vn.png";
import { usePosts } from "../provider/PostContext";

const MultiLan = ({ id, head }) => {
  const { user } = usePosts();
  const [isLoaded, setIsLoaded] = useState(true);
  const [translations, setTranslations] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [lan, setLan] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userCredits, setUserCredits] = useState({});

  // deal with list refresh
  const handleRefresh = () => {
    fetchTranslation();
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const languageFlags = {
    cn: cn,
    fr: fr,
    de: de,
    it: it,
    jp: jp,
    kr: kr,
    es: es,
    vn: vn,
  };

  const languageNames = {
    cn: "简体中文",
    fr: "Français",
    de: "Deutsche",
    it: "Italiano",
    jp: "日本語",
    kr: "한국어",
    es: "Español",
    vn: "Tiếng Việt",
  };

  useEffect(() => {
    if (lan) {
      fetchTranslation();
    }
  }, [lan]);

  const handleOnChange = (e) => {
    setLan(e.target.value);
  };

  const fetchTranslation = async () => {
    setIsLoaded(false);
    try {
      let { data: translations, error } = await supabase
        .from("translations")
        .select("*")
        .eq("head", head)
        .eq("language", lan)
        .limit(5)
        .order("vote_sub", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      setTranslations(translations);
    } catch (error) {
      console.error("Error fetching translations:", error.message);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleVote = async (id, vote_sub, increment) => {
    // 检查用户是否登录
    if (!user) {
      // 用户未登录，显示提示消息
      alert("Please login to vote.");
      return; // 中断表单提交
    }

    setIsVoting(true);

    try {
      // Retrieve the current 'user_voted' array from the database
      const { data: factData, error: factError } = await supabase
        .from("translations")
        .select("user_voted")
        .eq("id", id)
        .single();

      // Check for errors
      if (factError) {
        console.error("Error retrieving user_voted array:", factError.message);
        return;
      }

      const currentUserVotedArray = factData.user_voted || []; // Handle case when user_voted is null

      // Check if the user's email is already in the array
      if (currentUserVotedArray.includes(user.email)) {
        // User has already voted, display an alert and abort
        alert("You have already voted. You cannot vote again.");
        return; // Abort the form submission
      }

      // Append the user's email to the 'user_voted' array
      currentUserVotedArray.push(user.email);

      // Calculate the new vote count based on the increment value
      const newVoteSub = increment ? vote_sub + 1 : vote_sub - 1;

      // Update the 'user_voted' column with the new array
      const { data, error } = await supabase
        .from("translations")
        .update({
          vote_sub: newVoteSub,
          user_voted: currentUserVotedArray,
        })
        .eq("id", id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // update user's credit
      // Fetch the current credit value
      const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("credit")
        .eq("email", user.email)
        .single();

      if (userFetchError) {
        console.error("Error fetching user credit:", userFetchError.message);
        throw new Error(userFetchError.message);
      }

      // Calculate the new credit value
      const currentCredit = userData.credit;
      const newCredit = increment ? currentCredit + 1 : currentCredit - 1;

      // Update the user's credit
      const { data: updatedData, error: creditError } = await supabase
        .from("users")
        .update({ credit: newCredit })
        .eq("email", user.email)
        .select();

      if (creditError) {
        console.error("Error updating credit:", creditError.message);
        throw new Error(creditError.message);
      }

      console.log("User credit updated successfully:", updatedData);

      // 找到更新后的翻译项并更新状态
      const updatedTranslations = translations.map((translation) =>
        translation.id === id
          ? { ...translation, vote_sub: newVoteSub }
          : translation
      );
      setTranslations(updatedTranslations);
    } catch (error) {
      console.error("Error updating vote count:", error.message);
    } finally {
      setIsVoting(false);
      fetchTranslation();
    }
  };

  const handleUpVote = (id, vote_sub) => {
    handleVote(id, vote_sub, true);
  };

  const handleDownVote = (id, vote_sub) => {
    handleVote(id, vote_sub, false);
  };

  const handelDel = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      const { error } = await supabase
        .from("translations")
        .delete()
        .eq("fact_id", id);

      if (error) {
        console.error("Error deleting translations:", error.message);
      } else {
        console.log("Fact deleted successfully!");
        window.location.reload();
      }
    }
  };

  const TransSection = () => {
    const [userCredits, setUserCredits] = useState({});

    useEffect(() => {
      const fetchUserCredits = async () => {
        try {
          // Get unique user emails from translations
          const userEmails = [
            ...new Set(translations.map((item) => item.user_acct)),
          ];

          // Fetch credit for each user
          const { data: usersData, error: usersFetchError } = await supabase
            .from("users")
            .select("email, credit")
            .in("email", userEmails);

          if (usersFetchError) {
            console.error("Error fetching users:", usersFetchError.message);
            return;
          }

          // Create a mapping of email to credit
          const creditMapping = {};
          usersData.forEach((user) => {
            creditMapping[user.email] = user.credit;
          });

          setUserCredits(creditMapping);
        } catch (error) {
          console.error("Error fetching user credits:", error.message);
        }
      };

      fetchUserCredits();
    }, [translations]);

    return translations.map((item) => {
      // why i can't declare a vairable here?
      const isCredit = userCredits[item.user_acct] >= 100;
      return  <div key={item.id} className="bg-light p-4 shadow rounded-3 mt-3">
      <div className="d-flex">
        {/* voting */}
        <div className="px-2 me-3">
          <div className="d-flex flex-column align-items-center gap-2">
            <button
              disabled={isVoting}
              type="button"
              className="btn btn-outline-dark rounded-4 m-0 py-0"
              onClick={() => handleUpVote(item.id, item.vote_sub)}
            >
              <i className="fas fa-arrow-up fs-6 m-0 p-1"></i>
            </button>

            {/* NUM */}
            <p className="m-0 fs-6">{item.vote_sub}</p>

            <button
              disabled={isVoting}
              type="button"
              className="btn btn-outline-dark rounded-4 m-0 py-0"
              onClick={() => handleDownVote(item.id, item.vote_sub)}
            >
              <i className="fas fa-arrow-down fs-6 m-0 p-1"></i>
            </button>
          </div>
        </div>

        <div className="d-flex flex-column gap-5 w-100">
          <div className="d-flex align-items-center gap-2 w-100">
            {item.vote_sub <= -5 ? (
              <span className="text-danger fw-bold">[⛔️DISPUTED] </span>
            ) : (
              ""
            )}

            <div className="fs-5">{item.text}</div>
          </div>

          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="text-secondary roboto-regular">
              Contributed by{" "}
              <span className="roboto-bold text-dark">{item.user_name}</span>
              {item.user_acct === admin ? (
                <i class="fa-solid fa-circle-user text-dark fs-6 ms-1"></i>
              ) : (
                <></>
              )}
              {isCredit ? (
                <i class="fa-solid fa-star text-dark fs-6 ms-1"></i>
              ) : (
                <></>
              )}
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
    </div>;
    });
  };

  return (
    <div>
      <p className="fs-5">Community Contributions</p>

      {/* select */}
      <select
        className="form-select mt-3"
        aria-label="Default select example"
        onChange={handleOnChange}
      >
        <option selected disabled>
          Select your languages
        </option>
        <option value="cn">Chinese Simplified</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="jp">Japanese</option>
        <option value="kr">Korean</option>
        <option value="es">Spanish</option>
        <option value="vn">Vietnamese</option>
      </select>

      {lan && (
        <div>
          <div className="d-flex align-items-center justify-content-center mt-3 gap-3">
            <div className="d-flex align-items-center ">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={languageFlags[lan]}
                  alt={lan}
                  style={{ width: "30px" }}
                />
                <p className="m-0">{languageNames[lan]}</p>
              </div>
            </div>

            {/* post form */}
            <button
              type="button"
              className="btn text-light"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSub"
              aria-expanded="false"
              aria-controls="collapseExample"
              onClick={() => handleShowForm()}
              style={{
                backgroundColor: showForm ? "#ef4444" : "#198754",
                width: "120px",
              }}
            >
              {showForm ? "Close" : "Contribute"}
            </button>
          </div>

          <div
            className="collapse border mt-4 w-100 shadow-sm rounded bg-light"
            id="collapseSub"
          >
            <SubForm
              lan={lan}
              head={head}
              id={id}
              onSubFormSubmit={handleRefresh}
            />
          </div>

          <div>
            {isLoaded ? (
              <div className="mt-3">
                {translations.length == 0 ? (
                  <p className="m-2">
                    No contributes for this selection, create your first one!
                  </p>
                ) : (
                  <TransSection />
                )}
              </div>
            ) : (
              <div className="mt-3">loading....</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiLan;
