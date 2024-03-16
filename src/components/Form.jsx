import { useState } from "react";
import { CATEGORIES } from "../../data";
import supabase from "../database.js";

function isValidHttpUrl(string) {
  // let url;

  // try {
  //   url = new URL(string);
  // } catch (_) {
  //   return false;
  // }

  // return url.protocol === "http:" || url.protocol === "https:";
  return true;
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
      <option key={cat.name} value={`${cat.name}`} className="text-capitalize">
        {cat.name}
      </option>
    );
  });

  return (
    <div className="mt-3">
      <form
        className="p-3 mb-3 needs-validation"
        action=""
        onSubmit={handlePost}
        novalidate
      >
        <div className="row">
          <div className="col-6 ">
            <div class="">
              <label htmlFor="fact">Share a Fact...</label>
              <textarea
                required
                type="text"
                value={formData.fact}
                name="fact"
                onChange={handleChange}
                className="form-control mt-2"
                style={{ height: "132px" }}
              />
            </div>

            <div
              className="mt-2"
              style={{ color: 20 - wordCount === 0 ? "red" : "" }}
            >
              {20 - wordCount}
            </div>
          </div>

          <div className="col-6">
            <div className="mb-4">
              <label htmlFor="source">Trustworthy Source</label>
              <div class="input-group">
                <span class="input-group-text mt-2" id="basic-addon3">
                  https://
                </span>

                <input
                  required
                  aria-describedby="basic-addon3 basic-addon4"
                  type="text"
                  value={formData.source}
                  name="source"
                  onChange={handleChange}
                  className="form-control mt-2"
                  // placeholder="Trustworthy Source"
                  id="source"
                />
              </div>

              {/* <div id="source-description" className="form-text text-danger">
                Please provide a valid URL starting with http:// or https://.{" "}
              </div> */}
            </div>
            <div>
              <label htmlFor="category">Choose Category</label>
              <select
                required
                className="form-select mt-2"
                aria-label="Default select example"
                value={formData.category}
                name="category"
                onChange={handleChange}
              >
                <option disabled value="">
                  Chooose Category
                </option>
                {optionList}
              </select>
            </div>
          </div>
          <div className="col-12 mt-5">
            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-success fw-bold"
              style={{ width: "120px" }}
            >
              {isUploading ? "Uploading..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
