import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Inicio } from "./components/Inicio/Inicio";
import { Parametrizacion } from "./components/Inicio/Parametrizacion";
import { Visual2 } from "./components/Inicio/Visual2";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Inicio como la ruta principal */}
        <Route path="/" element={<Inicio />} />
        <Route path="/Parametrizacion" element={<Parametrizacion />} />
        <Route path="/Visual2" element={<Visual2 />} />
      </Routes>
    </Router>
  );
}

export default App;
