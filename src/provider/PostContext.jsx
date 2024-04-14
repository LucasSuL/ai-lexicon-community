import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../database";
const PostContext = createContext();

function PostProvider({ children, isLoaded, setIsLoaded }) {
  const [factList, setFactList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const getFacts = async () => {
      try {
        setIsLoaded(false);
        let query = supabase.from("facts").select("*");

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        if (searchKeyword.trim() !== "") {
          console.log('serach:' + searchKeyword);
          query = query.textSearch("text", searchKeyword,{
            type:'websearch',
          }); 
        }

        let { data: facts, error } = await query
          .limit(10)
          .order("votesInteresting", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setFactList(facts);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching facts:", error.message);
      }
    };
    getFacts();
  }, [selectedCategory, searchKeyword]);

  return (
    <PostContext.Provider
      value={{
        factList,
        setFactList,
        isLoaded,
        setIsLoaded,
        selectedCategory,
        setSelectedCategory,
        searchKeyword,
        setSearchKeyword
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context == undefined) {
    throw new Error("PostContext used outside of PostProvider");
  }
  return context;
}

export { PostProvider, usePosts };
