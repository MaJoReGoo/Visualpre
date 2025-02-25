import React,{useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Inicio } from "./components/Inicio/Inicio";
import { Parametrizacion } from "./components/Inicio/Parametrizacion";
import { EditServer } from "./components/Inicio/EditServer";
import { AgregarMedicion } from "./components/Inicio/AgregarMedicion";
import { AgregarServidor } from "./components/Inicio/AgregarServidor";
import { ListarMediciones } from "./components/Inicio/ListadoMedicion";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {

  useEffect(() => {
    let servers = [1,2];

    servers.forEach(serverId => {
      socket.emit("metrics",serverId);
    });

    socket.on("dataMetrics", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("metrics");
    };
  }, []);
 

  return (
    <Router>
      <Routes>
        {/* Ruta raíz "/" apunta al componente Login */}
        <Route path="/" element={<Inicio />} />
        <Route path="/Parametrizacion" element={<Parametrizacion />} />
        <Route path="/EditServer/:id" element={<EditServer />} />
        <Route path="/AgregarMedicion" element={<AgregarMedicion />} />
        <Route path="/AgregarServidor" element={<AgregarServidor />} />
        <Route path="/ListarMediciones" element={<ListarMediciones />} />
      </Routes>
    </Router>
  );
}

export default App;
