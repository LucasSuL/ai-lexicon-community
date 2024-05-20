import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../database";
import { jwtDecode } from "jwt-decode";

const PostContext = createContext();

function PostProvider({ children, isLoaded, setIsLoaded }) {
  const [factList, setFactList] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const storedUser = sessionStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    const getFacts = async () => {
      try {
        setIsLoaded(false);
        // get from latest
        let laQuery = supabase.from("facts").select("*");

        let { data: latestData, error: latestError } = await laQuery
          .order("created_at", { ascending: false })
          .limit(5);

        if (latestError) {
          throw new Error(latestError.message);
        }

        setLatest(latestData);

        // get from popular
        let poQuery = supabase.from("facts").select("*");

        let { data: popularData, error: popularError } = await poQuery
          .order("votesMain", { ascending: false })
          .limit(5);

        if (popularError) {
          throw new Error(popularError.message);
        }

        setPopular(popularData);

        // get from all filtered
        let filteredQuery = supabase.from("facts").select("*");

        if (selectedCategory !== "all") {
          filteredQuery = filteredQuery.eq("category", selectedCategory);
        }
        // 根据搜索关键词进行筛选
        if (searchKeyword.trim() !== "") {
          console.log("search:" + searchKeyword);
          filteredQuery = filteredQuery.textSearch("head_text", searchKeyword, {
            type: "websearch",
          });
        }

        // 获取筛选后的数据
        let { data: facts, error } = await filteredQuery
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

      // do not prompt out when user has logged in
      if (!storedUser) {
        google.accounts.id.prompt();
      }
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
        latest,
        popular,
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
