import React from 'react'

const Loader = () => {
  return [...Array(5)].map(() => (
    <div
      className="bg-light p-2 m-2 mb-3 rounded d-flex align-items-center row"
      key={Math.random() * 1000000}
    >
      <div className="p-2 col-7 pe-3 ">
        <div className="skeleton skeleton-text mb-2 rounded"></div>
        <div className="skeleton skeleton-text mb-2 rounded"></div>
        <div className="skeleton skeleton-text rounded"></div>
      </div>

      <div className="skeleton skeleton-text tag p-1 rounded col-2 "></div>

      <div className="vote-buttons p-0 col-3 d-flex justify-content-end">
        <button className="skeleton btn m-1 p-1"> </button>
        <button className="skeleton btn m-1 p-1"> </button>
        <button className="skeleton btn m-1 p-1"> </button>
      </div>
    </div>
  ));
}

export default Loader