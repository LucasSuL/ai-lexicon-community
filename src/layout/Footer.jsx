import React, { useState } from "react";
import { usePosts } from "../provider/PostContext";
import supabase from "../database";

const Footer = () => {
  const { user } = usePosts();
  const [isUploading, setIsUploading] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setUserMsg(value);
  };

  const handlePost = async (event) => {
    console.log(user.email, userMsg);
    event.preventDefault();

    if (!user) {
      // 用户未登录，显示提示消息
      alert("Please login to submit the form.");
      return; // 中断表单提交
    }
    setIsUploading(true);

    try {
      const { data, error } = await supabase
        .from("usersMsg")
        .insert([{ email: user.email, msg: userMsg }])
        .select();

      if (error) throw error;

      setUserMsg("");
      alert("Thank you for leaving a message, we will get back to you as soon as possible!")
      confetti(); 
    } catch (error) {
      console.error("Error uploading message:", error.message);
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mb-5" id="about">
      <div className="row">
        <div className="container mt-5 col-12 col-xl-8" id="term">
          <p className="fs-5">Terms and conditions</p>
          <p className="text-secondary roboto-light">
            By using this community website, users agree
            to actively contribute high-quality content and refrain from posting
            inappropriate material, including but not limited to obscene,
            violent, defamatory, discriminatory, or illegal content. The
            management team reserves the right to permanently ban users and
            pursue legal action against those who violate these rules. Your
            cooperation helps maintain a positive and constructive community
            environment.
          </p>
        </div>
        <div className="container mt-5 col-12 col-xl-4">
          <p className="fs-5">Leave a message</p>
          <form action="" onSubmit={handlePost} novalidate>
            <textarea
              required
              type="text"
              value={userMsg}
              name="fact"
              onChange={handleChange}
              className="form-control mt-2"
              style={{ height: "82px" }}
            />
            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-success fw-bold mt-3"
              style={{ width: "80px" }}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <div
        className="container d-flex justify-content-center"
        style={{ marginTop: "80px" }}
      >
        <p className="text-secondary me-2">A project by</p>
        <p className="m-0">
          <a
            href="www.linkedin.com/in/lucassudev"
            className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover fw-bold"
            target="_blank"
            rel="noreferrer"
          >
            Lucas Su
          </a>
        </p>
      </div>
      <div className="d-flex justify-content-center align-items-center pb-5">
        <span className=" text-secondary text-s-2 me-1">Made with</span>
        <p className="m-0">
          <a
            href="https://getbootstrap.com/"
            className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover fw-bold"
            target="_blank"
            rel="noreferrer"
          >
            Bootstrap
          </a>
        </p>
        <p className="m-0 me-1">, </p>
        <p className="m-0">
          <a
            href="https://supabase.com/"
            className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover fw-bold"
            target="_blank"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
