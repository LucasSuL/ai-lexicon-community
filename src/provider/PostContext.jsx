import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../database";
import { jwtDecode } from "jwt-decode";

const PostContext = createContext();

function PostProvider({ children, isLoaded, setIsLoaded }) {
  const [factList, setFactList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const storedUser = sessionStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    const getFacts = async () => {
      try {
        setIsLoaded(false);
        let query = supabase.from("facts").select("*");

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        if (searchKeyword.trim() !== "") {
          console.log("search:" + searchKeyword);
          query = query.textSearch("head_text", searchKeyword, {
            type: "websearch",
          });
        }

        let { data: facts, error } = await query
          .limit(10)
          .order("votesMain", { ascending: false });

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

  useEffect(() => {
    const loadGoogleScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    loadGoogleScript().then(() => {
      // 检查会话存储中是否有用户信息
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);

        // setUser immediately so that header can get the user picture.
        setUser(userObj);

        sessionStorage.setItem("user", JSON.stringify(userObj));
        document.getElementById("signInDiv").hidden = true;
      } else {
        // 如果没有用户信息，显示登录按钮
        document.getElementById("signInDiv").hidden = false;
      }

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
    });
  }, []);

  function handleCallbackResponse(response) {
    const userObj = jwtDecode(response.credential);
    sessionStorage.setItem("user", JSON.stringify(userObj));
    // setUser
    setUser(userObj);

    document.getElementById("signInDiv").hidden = true;
  }

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
  if (context === undefined) {
    throw new Error("PostContext used outside of PostProvider");
  }
  return context;
}

export { PostProvider, usePosts };
