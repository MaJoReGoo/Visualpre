import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Inicio } from "./components/Inicio/Inicio";
import { Parametrizacion } from "./components/Inicio/Parametrizacion";
import { Login } from "./components/Login/login";
import { EditServer } from "./components/Inicio/EditServer";
import { AgregarMedicion } from "./components/Inicio/AgregarMedicion";
import { AgregarServidor } from "./components/Inicio/AgregarServidor";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz "/" apunta al componente Login */}
        <Route path="/" element={<Login />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Parametrizacion" element={<Parametrizacion />} />
        <Route path="/EditServer" element={<EditServer />} />
        <Route path="/AgregarMedicion" element={<AgregarMedicion />} />
        <Route path="/AgregarServidor" element={<AgregarServidor />} />
      </Routes>
    </Router>
  );
}

export default App;
