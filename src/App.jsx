import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Inicio } from "./components/Inicio/Inicio";
import { Parametrizacion } from "./components/Inicio/Parametrizacion";
import { Visual2 } from "./components/Inicio/Visual2";
import { Login } from "./components/Login/login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz "/" apunta al componente Login */}
        <Route path="/" element={<Login />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Parametrizacion" element={<Parametrizacion />} />
        <Route path="/Visual2" element={<Visual2 />} />
      </Routes>
    </Router>
  );
}

export default App;
