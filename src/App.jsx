import Header from "./layout/Header";
import Content from "./layout/Content.jsx";
import Footer from "./layout/Footer.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import SinglePage from "./components/SinglePage.jsx";
import { PostProvider } from "./provider/PostContext.jsx";
import ScrollToTop from "./hook/ScrollToTop.jsx";
import { useState } from "react";

function App() {

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <PostProvider isLoaded={isLoaded} setIsLoaded={setIsLoaded}>
        <Header />
      
        <Routes>
          <Route path="/ai-lexicon-community/" element={<Content />}></Route>
          {isLoaded && (
            <Route
              path="/ai-lexicon-community/entries/:id"
              element={<SinglePage />}
            ></Route>
          )}
        </Routes>
      <Footer />
      </PostProvider>
    </Router>
  );
}

export default App;
