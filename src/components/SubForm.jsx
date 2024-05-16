import { useState } from "react";
import { CATEGORIES } from "../../data";
import supabase from "../database.js";
import { usePosts } from "../provider/PostContext";

export default function Form({ lan, head, id, onSubFormSubmit }) {
  const { user } = usePosts();
  const [isUploading, setIsUploading] = useState(false);
  const [translation_text, setTranslation_text] = useState("");

  const handlePost = async (event) => {
    event.preventDefault();

    // 检查用户是否登录
    if (!user) {
      // 用户未登录，显示提示消息
      alert("Please login to submit the form.");
      return; // 中断表单提交
    }

    // Process form data here (e.g., send it to a server)
    if (translation_text) {
      try {
        setIsUploading(true);
        const { data, error } = await supabase
          .from("translations")
          .insert([
            {
              fact_id: id,
              head: head,
              language: lan,
              text: translation_text,
              vote_sub: 0,
              user_acct: user.email,
              user_name: user.name,
            },
          ])
          .select();

        if (error) {
          throw new Error(error.message);
        }

        //4-reset input fields
        setTranslation_text("");

        setIsUploading(false);

        //6-close the form
        // setShowForm(false);

        // refresh parent
        onSubFormSubmit();
        confetti();

      } catch (error) {
        console.error("Error inserting fact:", error.message);
      }
    }
  };

  // react form
  const handleChange = (event) => {
    const { value } = event.target;
    setTranslation_text(value);
  };

  return (
    <div className="">
      <form
        className="p-3 mb-3 needs-validation"
        action=""
        onSubmit={handlePost}
        novalidate
      >
        <div className="row">
          <div className="col-6 ">
            <div className="mb-3">
              <label for="validationCustom01" class="form-label">
                Your translation
              </label>
              <input
                type="text"
                class="form-control"
                id="validationCustom01"
                value={translation_text}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div class="col-12">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck"
                required
              />
              <label class="form-check-label" for="invalidCheck">
                Agree to terms and conditions
              </label>
              <div class="invalid-feedback">
                You must agree before submitting.
              </div>
            </div>
          </div>
          <div className="col-12 mt-3">
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
