import Header from "./layout/Header";
import Content from "./layout/Content.jsx";
import { useState, useEffect } from "react";
import supabase from "./database.js";
import Feature from "./layout/Feature.jsx";
import Footer from "./layout/Footer.jsx";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
    // <Router>
      // <Switch>
      <div>

        <Header />
        <Feature setFactList={setFactList} factList={factList} />
       
        <Content
          factList={factList}
          setFactList={setFactList}
          isLoaded={isLoaded}
          setSelectedCategory={setSelectedCategory}
          />
        <Footer />
          </div>
    //   </Switch>
    // </Router>
  );
}

export default App;
