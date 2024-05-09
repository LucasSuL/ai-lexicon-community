import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../database";
import { jwtDecode } from "jwt-decode";


const PostContext = createContext();

function PostProvider({ children, isLoaded, setIsLoaded }) {
  const [factList, setFactList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    var userObj = jwtDecode(response.credential);
    console.log(userObj);
    setUser(userObj);
    document.getElementById("signInDiv").hidden = true;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "574847166176-q8555hjl1s1pctmqhk2klpq879degm3j.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  useEffect(() => {
    const getFacts = async () => {
      try {
        setIsLoaded(false);
        let query = supabase.from("facts").select("*");

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        if (searchKeyword.trim() !== "") {
          console.log("serach:" + searchKeyword);
          query = query.textSearch("head_text", searchKeyword, {
            type: "websearch",
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
        user,
        setUser,
        factList,
        setFactList,
        isLoaded,
        setIsLoaded,
        selectedCategory,
        setSelectedCategory,
        searchKeyword,
        setSearchKeyword,
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
