import React/* , { useState, useEffect } */ from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Inicio } from "./components/Inicio/Inicio";
import { Parametrizacion } from "./components/Inicio/Parametrizacion";
import { EditServer } from "./components/Inicio/EditServer";
import { AgregarMedicion } from "./components/Inicio/AgregarMedicion";
import { AgregarServidor } from "./components/Inicio/AgregarServidor";
import { ListarMediciones } from "./components/Inicio/ListadoMedicion";
/* import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); */

function App() {
/*   const [metricsData, setMetricsData] = useState([]);

  useEffect(() => {
    // Lista de servidores a los que se les solicitarán métricas
    const servers = [1, 2];

    // Limpiar el estado antes de emitir la solicitud
    setMetricsData([]); // Limpia el estado de métricas antes de emitir nuevas solicitudes

    // Emitir solicitud de métricas para cada servidor
    servers.forEach((server) => {
      socket.emit("metrics", server);
    });

    // Escuchar la respuesta de las métricas
    const handleMetricsData = (data) => {
      if (data) {
        setMetricsData((prevData) => {
          // Actualiza o agrega las métricas al estado
          const updatedData = [...prevData];
          const existingMetricIndex = updatedData.findIndex(
            (metric) => metric.server.ipAddress === data.server.ipAddress
          );

          if (existingMetricIndex >= 0) {
            // Si ya existe la métrica del servidor, la actualizamos
            updatedData[existingMetricIndex].metrics = data.metrics;
          } else {
            // Si no existe la métrica del servidor, la agregamos
            updatedData.push(data);
          }

          return updatedData;
        });
      }
    };

    // Escuchar el evento de métricas
    socket.on("dataMetrics", handleMetricsData);

    // Limpieza de eventos cuando el componente se desmonte
    return () => {
      socket.off("dataMetrics", handleMetricsData);
    };
  }, []); // El array vacío asegura que este effect solo se ejecute una vez al montarse el componente

  useEffect(() => {
    console.log("Datos completos recibidos:", metricsData); // Log de datos
  }, [metricsData]); // Este effect se ejecuta cada vez que `metricsData` cambia
 */
  return (
    <Router>
      <Routes>
        {/* Ruta raíz "/" apunta al componente Inicio */}
        <Route path="/" element={<Inicio /* metricsData={metricsData} */ />} />
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
