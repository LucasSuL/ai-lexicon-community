import React, { useEffect, useState } from "react";
import supabase from "../database";

import fr from "/flags/fr.png";
import cn from "/flags/cn.png";
import de from "/flags/de.png";
import es from "/flags/es.png";
import it from "/flags/it.png";
import jp from "/flags/jp.png";
import kr from "/flags/kr.png";
import vn from "/flags/vn.png";
// import { usePosts } from "../provider/PostContext";

const MultiLan = ({ head }) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [translations, setTranslations] = useState([]);
  const [isVoting, setIsVoting] = useState(false);

  const [lan, setLan] = useState("");

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
        .eq("language", lan);

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

  const handleVote = async (type) => {
    setIsVoting(true);
    const { data: updatedFact, error } = await supabase
      .from("translations")
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

  // const isDisputed =
  // fact.votesFalse >= 5 && fact.votesFalse > fact.votesInteresting;

  const TransSection = () => {
    return translations.slice(0, 5).map((item) => (
      <div className="bg-light p-4 shadow rounded-3 mt-3">
        <div className="" key={item.id}>
          {item.text}
        </div>
        <div className="vote-buttons d-flex justify-content-start gap-3 align-items-center mt-3">
          <button
            className="btn btn-light d-flex align-items-center justify-content-center gap-1 shadow-sm"
            onClick={() => handleVote("votesInteresting")}
            disabled={isVoting}
            style={{ width: "50px" }}
          >
            👍
            <p className="count m-0 fw-bold">{item.vote_1}</p>
          </button>
          <button
            className="btn btn-light d-flex align-items-center justify-content-center gap-1 shadow-sm"
            onClick={() => handleVote("votesMindblowing")}
            disabled={isVoting}
            style={{ width: "50px" }}
          >
            🤯
            <p className="count m-0 fw-bold">{item.vote_2}</p>
          </button>
          <button
            className="btn btn-light d-flex align-items-center justify-content-center gap-1 shadow-sm"
            onClick={() => handleVote("votesFalse")}
            disabled={isVoting}
            style={{ width: "50px" }}
          >
            ⛔️
            <p className="count m-0 fw-bold">{item.vote_3}</p>
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <p className="fs-5">Community Contributions</p>
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
        <div className="mt-3">
          <div className="d-flex align-items-center gap-3">
            <img src={languageFlags[lan]} alt={lan} style={{ width: "30px" }} />
            <p className="m-0">{languageNames[lan]}</p>
          </div>

          {isLoaded ? (
            <div className="mt-3">
              <TransSection />
            </div>
          ) : (
            <div className="mt-3">loading....</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiLan;
