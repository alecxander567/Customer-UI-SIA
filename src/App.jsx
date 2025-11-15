import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./Components/Landingpage.jsx";
import Homepage from "./Components/Homepage.jsx";
import Mockup from "./Components/Mockup.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/mockup" element={<Mockup />} />
      </Routes>
    </Router>
  );
}

export default App;
