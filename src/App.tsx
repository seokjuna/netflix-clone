import { Routes, Route, HashRouter } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:id" element={<Home />} />
        </Route>
        <Route path="/tv/*" element={<Tv />}>
          <Route path="tv/:id" element={<Tv />} />
        </Route>
        <Route path="/search/*" element={<Search />}>
          <Route path="search/movies/:id" element={<Search />} />
          <Route path="search/tv/:id" element={<Search />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
