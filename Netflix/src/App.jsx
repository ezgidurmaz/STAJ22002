import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import MovieDetail from "./pages/MovieDetail";

function AppContent() {
  return (
    <>
      <Home />

      <Routes>
        <Route path="/:type/:id" element={<MovieDetail />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;