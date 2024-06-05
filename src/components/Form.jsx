import { useEffect, useState } from "react";
import { CATEGORIES } from "../../data";
import supabase from "../database.js";
import { usePosts } from "../provider/PostContext";

export default function Form() {
  const { factList, setFactList, user } = usePosts();

  const [wordCount, setWordCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fact: "",
    // source: "",
    category: "",
    userAcct: "",
  });

  useEffect(() => {
    // 初始化所有 Popovers
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );

    // 清理函数，用于在组件卸载时销毁 Popovers
    return () => {
      popoverList.forEach((popover) => popover.dispose());
    };
  }, []); // 依赖项列表为空，以确保只在组件挂载时执行一次

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
    // prevent defaulst submit
    event.preventDefault();

    // 检查用户是否登录
    if (!user) {
      // 用户未登录，显示提示消息
      alert("Please login to submit the form.");
      return; // 中断表单提交
    }

    //2-check data is valid or not
    if (formData.fact && formData.category) {
      //3-insert data to supabase
      try {
        // 先检查 'head' 是否已经存在
        const { data: existingFact, error: checkError } = await supabase
          .from("facts")
          .select("head")
          .eq("head", formData.head)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          // 116: no data returned
          throw new Error(checkError.message);
        }

        if (existingFact) {
          alert(
            "This terminology already exists. Please provide a unique terminology."
          );
          // reset input fields
          setFormData({
            head: "",
            fact: "",
            // source: "",
            category: "",
          });
          return; // 中断表单提交
        }

        setIsUploading(true);
        const { data: newFact, error } = await supabase
          .from("facts")
          .insert([
            {
              head: formData.head,
              text: formData.fact,
              // source: formData.source,
              category: formData.category,
              userAcct: user.email,
              user_name: user.name,
            },
          ])
          .select();

        if (error) {
          throw new Error(error.message);
        }

        //4-reset input fields
        setFormData({
          head: "",
          fact: "",
          // source: "",
          category: "",
        });

        //5-add the fact to state
        setFactList([newFact[0], ...factList]);
        setIsUploading(false);
        confetti();

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
        onSubmit={handlePost}
        novalidate
      >
        <div className="row">
          <div className="col-12 col-md-6 ">
            <div className="mb-3">
              <label htmlFor="head" className="form-label">
                Name of the Terminology
              </label>
              <input
                required
                type="text"
                name="head"
                value={formData.head}
                onChange={handleChange}
                className="form-control"
                // id="exampleFormControlInput1"
                placeholder=""
              />
            </div>
            <div className="">
              <label htmlFor="fact">Explanation</label>
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
              style={{ color: 30 - wordCount === 0 ? "red" : "" }}
            >
              {30 - wordCount}
            </div>
          </div>

          <div className="col-12 col-md-6 ">
            {/* <div className="mb-3">
              <label htmlFor="source">Trustworthy Source</label>
              <div className="input-group">
                <span className="input-group-text mt-2" id="basic-addon3">
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
                  id="source"
                />
              </div>
            </div> */}
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
          <div className="col-12">
            <div className="form-check mt-3 d-flex gap-2">
              <input
                className="form-check-input "
                type="checkbox"
                value=""
                id="invalidCheck"
                required
              />
              <label
                className="form-check-label d-flex gap-2"
                for="invalidCheck"
              >
                <p>Agree to </p>
                <p>
                  <a
                  // href="#"
                  >
                    terms and conditions.
                  </a>
                </p>
              </label>
              <div class="invalid-feedback">
                You must agree before submitting.
              </div>

              <a
                href="#term"
                class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              >
                (See more)
              </a>
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
