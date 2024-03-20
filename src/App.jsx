import Header from "./layout/Header";
import Content from "./layout/Content.jsx";
import { useState, useEffect } from "react";
import supabase from "./database.js";
import Footer from "./layout/Footer.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import SinglePage from "./components/SinglePage.jsx";

function App() {
  const [factList, setFactList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getFacts = async () => {
      try {
        setIsLoaded(false);
        let query = supabase.from("facts").select("*");

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
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
  }, [selectedCategory]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/today-i-learned"
          element={
            <Content
              factList={factList}
              setFactList={setFactList}
              isLoaded={isLoaded}
              setSelectedCategory={setSelectedCategory}
            />
          }
        ></Route>
        {isLoaded && factList.length > 0 && (
          <Route
            path="/today-i-learned/entries/:id"
            element={
              <SinglePage factList={factList} setFactList={setFactList} />
            }
          ></Route>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
