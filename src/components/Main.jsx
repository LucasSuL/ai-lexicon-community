import { CATEGORIES } from "../../data";
import Tag from "./Tag";
import Fact from "./Fact";

export default function Content({
  factList,
  setFactList,
  isLoaded,
  setSelectedCategory,
}) {
  const handleTagClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleAllClick = () => {
    setSelectedCategory("all"); // Reset filter to show all facts
  };

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
  };

  const facts = isLoaded ? (
    factList.map((fact) => {
      return <Fact key={fact.id} fact={fact} setFactList={setFactList} />;
    })
  ) : (
    <Loader />
  );

  const tags = CATEGORIES.map((category) => {
    return (
      <Tag
        key={category.name}
        name={category.name}
        color={category.color}
        onClick={handleTagClick}
        isLoaded={isLoaded}
      />
    );
  });

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="tags col-12 col-xl-2 d-flex flex-column">
          <button
            className="btn btn-all m-2 tag text-light fw-bold mb-3 text-bg-dark shadow"
            onClick={handleAllClick}
          >
            All
            {/* {!isLoaded && (
              <div class="spinner-border spinner-border-sm ms-2" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            )} */}
          </button>
          <div className="row m-1 g-2 mb-3">{tags}</div>
        </div>
        <div className="main col-12 col-xl-10">
          <div className="">
            {facts.length == 0 ? (
              <p className="">
                No facts for this category, create your first one!
              </p>
            ) : (
              facts
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
