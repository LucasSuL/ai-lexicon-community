import { useState } from "react";
import { CATEGORIES } from "../../data";
import supabase from "../database.js";

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export default function Form({ factList, setFactList, setShowForm }) {
  const [wordCount, setWordCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    fact: "",
    source: "",
    category: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "fact") {
      const currCount = value.trim().split(/\s+/).length;
      if (currCount <= 20) {
        setFormData({ ...formData, [name]: value });
        setWordCount(currCount);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePost = async (event) => {
    event.preventDefault();

    //2-check data is valid or not
    if (formData.fact && formData.category && isValidHttpUrl(formData.source)) {
      //3-insert data to supabase
      try {
        setIsUploading(true);
        const { data: newFact, error } = await supabase
          .from("facts")
          .insert([
            {
              text: formData.fact,
              source: formData.source,
              category: formData.category,
            },
          ])
          .select();

        if (error) {
          throw new Error(error.message);
        }

        //4-reset input fields
        setFormData({
          fact: "",
          source: "",
          category: "",
        });

        //5-add the fact to state
        setFactList([newFact[0], ...factList]);
        setIsUploading(false);

        //6-close the form
        // setShowForm(false);
      } catch (error) {
        console.error("Error inserting fact:", error.message);
      }
    }
  };

  const optionList = CATEGORIES.map((cat) => {
    return (
      <option key={cat.name} value={`${cat.name}`}>
        {cat.name.toUpperCase()}
      </option>
    );
  });

  return (
    <div className="container">
      <form
        className="container bg-secondary p-3 d-flex align-items-center justify-content-center gap-4 rounded mb-3"
        action=""
        onSubmit={handlePost}
      >
        <input
          type="text"
          value={formData.fact}
          name="fact"
          onChange={handleChange}
          className="form-control"
          placeholder="Share a fact..."
        />
        <span style={{ color: 20 - wordCount === 0 ? "red" : "" }}>
          {20 - wordCount}
        </span>
        <input
          type="text"
          value={formData.source}
          name="source"
          onChange={handleChange}
          className="form-control"
          placeholder="Trustworthy Source"
        />
        <select
          className="form-select"
          aria-label="Default select example"
          value={formData.category}
          name="category"
          onChange={handleChange}
        >
          <option defaultValue>Chooose Category</option>
          {optionList}
        </select>
        <button disabled={isUploading} className="btn btn-light fw-bold">
          {isUploading ? "Uploading..." : "Post"}
        </button>
      </form>
    </div>
  );
}
