import Header from "./layout/Header";
import Content from "./layout/Content.jsx";
import Footer from "./layout/Footer.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import SinglePage from "./components/SinglePage.jsx";
import { PostProvider } from "./provider/PostContext.jsx";
import ScrollToTop from "./hook/ScrollToTop.jsx";
import { useEffect, useState } from "react";

function App() {

  const [isLoaded, setIsLoaded] = useState(false);
  // const [user, setUser] = useState({});


  // useEffect(() => {
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id:
  //       "574847166176-q8555hjl1s1pctmqhk2klpq879degm3j.apps.googleusercontent.com",
  //     callback: handleCallbackResponse,
  //   });
  //   google.accounts.id.renderButton(document.getElementById("signInDiv"), {
  //     theme: "outline",
  //     size: "large",
  //   });

  //   google.accounts.id.prompt();
  // }, []);

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
      </PostProvider>
      <Footer />
    </Router>
  );
}

export default App;
