import { CATEGORIES } from "../../data";
import Tag from "../components/Tag";
import Fact from "../components/Fact";
import Feature from "./Feature";
import { useContext } from "react";
import PostContext from "../provider/PostContext";
import Loader from "../components/Loader";

export default function Content() {
  const { factList, isLoaded, setSelectedCategory } = useContext(PostContext);

  const handleTagClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleAllClick = () => {
    setSelectedCategory("all"); // Reset filter to show all facts
  };

  const facts = isLoaded ? (
    factList.map((fact) => {
      return <Fact key={fact.id} fact={fact} />;
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
      />
    );
  });

  return (
    <div className="container">
      <Feature />
      <div className="mt-5">
        <div className="row">
          <div className="tags col-12 col-xl-2 d-flex flex-column">
            <button
              className="btn btn-all m-2 tag text-light fw-bold mb-3 text-bg-dark shadow"
              onClick={handleAllClick}
            >
              All
            </button>
            <div className="row m-0 g-3 mb-3">{tags}</div>
          </div>
          <div className="main col-12 col-xl-10">
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
