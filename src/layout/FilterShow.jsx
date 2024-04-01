import React from "react";
import { usePosts } from "../provider/PostContext";
import { CATEGORIES } from "../../data";

const FilterShow = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchKeyword,
    setSearchKeyword,
  } = usePosts();

  let color = "";
  for (const cat in CATEGORIES) {
    if (CATEGORIES[cat].name === selectedCategory) {
      color = CATEGORIES[cat].color;
      break;
    }
  }

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center border">
        <p className="py-2 m-0 me-3 fw-bold">Selection: </p>

        {selectedCategory === "all" && !searchKeyword ? (
          <div
            className="d-flex align-items-center fs-7 m-0 p-1 mx-1 px-2 rounded shadow-sm"
            style={{ backgroundColor:"#e1e1e1" }}
          >
            None
          </div>
        ) : (
          <>
            {selectedCategory == "all" ? (
              ""
            ) : (
              <div
                className="d-flex align-items-center fs-7 m-0 p-1 mx-1 px-2 rounded shadow-sm"
                style={{ backgroundColor: `${color}` }}
              >
                {selectedCategory}
                <button
                  type="button"
                  className="btn-close fs-7 ms-2"
                  aria-label="Close"
                  onClick={() => setSelectedCategory("all")}
                ></button>
              </div>
            )}
            {searchKeyword && (
              <div
                className="d-flex align-items-center fs-7 m-0 p-1 px-2 rounded shadow-sm mx-1"
                style={{ backgroundColor: "#dddddd" }}
              >
                {searchKeyword}
                <button
                  type="button"
                  className="btn-close fs-7 ms-2"
                  aria-label="Close"
                  onClick={() => setSearchKeyword("")}
                ></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilterShow;
