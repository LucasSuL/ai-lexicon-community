import React, { useEffect, useState } from "react";
import supabase from "../database";
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

  // deal with list refresh
  const handleRefresh = () => {
    fetchTranslation()
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

  const handleUpVote = async (id, vote_sub) => {
    setIsVoting(true);

    try {
      const { data, error } = await supabase
        .from("translations")
        .update({ vote_sub: vote_sub + 1 })
        .eq("id", id)
        .single(); // 只更新单个翻译项

      if (error) {
        throw new Error(error.message);
      }

      // 找到更新后的翻译项并更新状态
      const updatedTranslations = translations.map((translation) =>
        translation.id === id
          ? { ...translation, vote_sub: translation.vote_sub + 1 }
          : translation
      );
      setTranslations(updatedTranslations);
    } catch (error) {
      console.error("Error updating vote count:", error.message);
    } finally {
      setIsVoting(false);
      fetchTranslation()
    }
  };

  const handleDownVote = async (id, vote_sub) => {
    setIsVoting(true);

    try {
      const { data, error } = await supabase
        .from("translations")
        .update({ vote_sub: vote_sub - 1 })
        .eq("id", id)
        .single(); // 只更新单个翻译项

      if (error) {
        throw new Error(error.message);
      }

      // 找到更新后的翻译项并更新状态
      const updatedTranslations = translations.map((translation) =>
        translation.id === id
          ? { ...translation, vote_sub: translation.vote_sub - 1 }
          : translation
      );
      setTranslations(updatedTranslations);
    } catch (error) {
      console.error("Error updating vote count:", error.message);
    } finally {
      setIsVoting(false);
      fetchTranslation()
    }
  };

  const TransSection = () => {
    return translations.map((item) => (
      <div key={item.id} className="bg-light p-4 shadow rounded-3 mt-3">
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

          <div className="d-flex flex-column gap-5">
            <div className="d-flex align-items-center gap-2">
              {item.vote_sub <= -5 ? (
                <span className="text-danger fw-bold">[⛔️DISPUTED] </span>
              ) : (
                ""
              )}

              <div className="fs-5">{item.text}</div>
            </div>
            <div className="text-secondary">Contributed by {item.user_name}</div>
          </div>
        </div>
      </div>
    ));
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
            <SubForm lan={lan} head={head} id = {id} onSubFormSubmit={handleRefresh} />
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
