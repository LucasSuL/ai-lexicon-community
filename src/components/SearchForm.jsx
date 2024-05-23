import React, { useState, useEffect } from "react";
import { usePosts } from "../provider/PostContext";

const SearchForm = () => {
  const { setSearchKeyword } = usePosts();
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    // 当 localSearch 变化时，更新搜索关键字，并清除选定的分类
    setSearchKeyword(localSearch);
  }, [localSearch, setSearchKeyword]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在提交表单时已经在 useEffect 中更新了搜索关键字，这里无需再次更新
  };

  return (
    <form
      className="container d-flex"
      role="search"
      onSubmit={handleSubmit}
      style={{ maxWidth: "500px" }}
    >
      <input
        className="form-control"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <button className="btn btn-outline-success ms-3" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;