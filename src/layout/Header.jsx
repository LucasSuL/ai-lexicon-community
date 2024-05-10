import React, { useEffect, useState } from "react";
import { usePosts } from "../provider/PostContext";

export default function Header() {

  const {user, setUser} =  usePosts();

  function handleSignOut(e) {
    // 清除会话存储中的用户信息
    sessionStorage.removeItem("user");
    // 显示登录按钮
    document.getElementById("signInDiv").hidden = false;
    // 更新用户State为 null
    setUser(null);
  }

  // 监听用户状态变化，并在状态更新时重新渲染组件
  useEffect(() => {
    // This effect does nothing, but it triggers a re-render when user state changes
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">

          {/* 设置绝对路径，handle github.io 上的路径问题 */}
        <a className="navbar-brand" href="./">
          
          <div className="d-flex align-items-center">
            <img src="./logo.png" className="ms-0 logo me-3" />
            <p className="fw-bold text-dark m-0 fs-4 text-uppercase d-none d-sm-block font-ave-b">
              AI Lexicon Community
            </p>
          </div>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse text-center justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/ai-lexicon-community/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#posts">
                Posts
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>
            <div className="ms-2" id="signInDiv"></div>

            {user && (
              <div className="ms-3 d-flex align-items-center gap-2 ">
                <p className="m-0"> Hello {user.name}!</p>

                <div className="dropdown">
                  <a
                    className="btn dropdown-toggle p-0"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      className="rounded-5 m-0"
                      src={user.picture}
                      style={{ maxWidth: "35px", maxHeight: "35px" }}
                    ></img>
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <p className="dropdown-item text-secondary m-0">
                      {user.email}
                    </p>
                    <div className="dropdown-item" href="#">
                      <button
                        type="button"
                        className="btn btn-danger w-100"
                        onClick={(e) => handleSignOut(e)}
                      >
                        Sign Out
                      </button>
                      {/* )} */}
                    </div>
                  </ul>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
