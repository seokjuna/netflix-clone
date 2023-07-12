import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import TvSlider from "./Components/TvSlider";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:id" element={<Home />} />
        </Route>
        <Route path="/tv/*" element={<Tv />}>
          <Route path="tv/:id" element={<TvSlider />} />
        </Route>
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
