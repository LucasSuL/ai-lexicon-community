import React from "react";

const Footer = () => {
  return (
    <div className=" mb-5" id="about">
      <div
        className="container d-flex justify-content-center"
        style={{ marginTop: "100px" }}
      >
        <p className="text-secondary me-2">A project by</p>
        <p className="m-0">
          <a
            href="https://github.cs.adelaide.edu.au/MCI-Projects-2024/Team-12"
            className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover fw-bold"
            target="_blank"
            rel="noreferrer"
          >
            Group 12-D
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
