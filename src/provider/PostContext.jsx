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
          filteredQuery = filteredQuery.ilike(
            "head_text",
            `%${searchKeyword}%`
          );
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
      // 检查 localStorage 中是否有用户信息
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);

        // console.log(userObj);

        // setUser immediately so that header can get the user picture.
        setUser(userObj);

        localStorage.setItem("user", JSON.stringify(userObj));
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

  // update USER db
  useEffect(() => {
    if (user) {
      const updateDB = async () => {
        console.log("Checking for existing user...");
        const { data: existingUsers, error: existingUserError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email);

        if (existingUserError) {
          console.error(
            "Error checking for existing user:",
            existingUserError.message
          );
          return;
        }

        if (existingUsers && existingUsers.length > 0) {
          console.log("User already exists in the database:", existingUsers[0]);
        } else {
          console.log("No existing user found. Adding new user...");
          const { data, error } = await supabase
            .from("users")
            .insert([{ email: user.email }])
            .select();

          if (error) {
            console.error("Error adding new user:", error.message);
          } else {
            console.log("New user added:", data);
          }
        }
      };

      updateDB();
    }
  }, [user]);

  function handleCallbackResponse(response) {
    const userObj = jwtDecode(response.credential);
    localStorage.setItem("user", JSON.stringify(userObj));
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
