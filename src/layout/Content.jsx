import { CATEGORIES } from "../../data";
import Tag from "../components/Tag";
import Fact from "../components/Fact";
import Feature from "./Feature";
import { usePosts } from "../provider/PostContext";
import Loader from "../components/Loader";
import FilterShow from "../components/FilterShow";
import { Link } from "react-router-dom";

export default function Content() {
  const { factList, isLoaded, setSelectedCategory, latest, popular } = usePosts();

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
      <div className="" id="posts">
        <FilterShow />
        <div className="mt-2">
          <div className="row">
            {/* main display */}
            <div className="main col-12 col-xl-9">
              {facts.length == 0 ? (
                <p className="m-2">
                  No facts for this selection, create your first one!
                </p>
              ) : (
                facts
              )}
            </div>

            {/* side display */}
            <div className="tags col-12 col-xl-3 d-flex flex-column">
              <div className="mx-2">
                {/* latest */}
                <div className="fs-4">Latest Posts</div>
                <div className="mt-2">
                  {latest.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="my-3 d-flex gap-2 align-items-center "
                      >
                        <p
                          className="text-bg-dark p-1 rounded m-0 text-center"
                          style={{ width: "30px" }}
                        >
                          {item.votesMain}
                        </p>
                        <Link
                          to={`/ai-lexicon-community/entries/${item.id}`}
                          class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                        >
                          {item.head}
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* popular */}
                <div className="fs-4 mt-5">Most Popular</div>
                <div className="mt-2">
                  {popular.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="my-3 d-flex gap-2 align-items-center "
                      >
                        <p
                          className="text-bg-dark p-1 rounded m-0 text-center"
                          style={{ width: "30px" }}
                        >
                          {item.votesMain}
                        </p>
                        <Link
                          to={`/ai-lexicon-community/entries/${item.id}`}
                          class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                        >
                          {item.head}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* selection button */}
              <div className="mx-2">
                <div className="fs-4 mt-5">Tags</div>
              </div>
              <button
                className="btn btn-all m-2 tag text-light fw-bold mb-3 text-bg-dark shadow"
                onClick={handleAllClick}
              >
                All
              </button>
              <div className="row m-0 g-3 mb-3">{tags}</div>
            </div>

            <div className="container ">
              <div className="d-flex justify-content-end m-2">
                <a href="#">
                  <button className="btn btn-sm">Back to top{" \u2191"}</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
