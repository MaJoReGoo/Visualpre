import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Chart } from "primereact/chart";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de importar axios
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); 
export const Inicio = () => {
  const [selectedVisuals, setSelectedVisuals] = useState([]); // Servidores seleccionados
  const [chartData, setChartData] = useState([]); // Datos de las gráficas
  const [chartOptions, setChartOptions] = useState({}); // Opciones de la gráfica
  const [transitioning, setTransitioning] = useState(false); // Animación de transición
  const [currentIndex, setCurrentIndex] = useState(0); // Índice del servidor actual
  const [serverDetails, setServerDetails] = useState({}); // Detalles del servidor (IP, Nombre)
  const navigate = useNavigate();
  const [metricsData, setMetricsData] = useState([]);

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
  }, [metricsData]);

  // Recuperamos los servidores seleccionados desde el localStorage
  useEffect(() => {
    const savedSelectedVisuals = localStorage.getItem("selectedServers");
    if (savedSelectedVisuals) {
      setSelectedVisuals(JSON.parse(savedSelectedVisuals));
    }
  }, []);

  // Función para obtener los datos de las gráficas según el servidor
  const fetchChartData = async () => {
    if (selectedVisuals.length === 0) return;

    try {
      const fetchedData = await Promise.all(
        selectedVisuals.map(async (visual) => {
          console.log(`Obteniendo datos para el servidor con ID: ${visual.id}`);

          // Realizamos la consulta para obtener los datos del servidor con el ID específico
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/servers/${visual.id}`
          );

          // Guardamos los detalles del servidor directamente
          setServerDetails((prevDetails) => ({
            ...prevDetails,
            [visual.id]: response.data, // Guardamos el objeto completo del servidor
          }));

          // Verifica si la respuesta contiene las métricas necesarias
          if (!response.data || !response.data.typeMeasurements) {
            console.error("No se encontraron métricas para el servidor", visual.id);
            return []; // Fallback para los datos
          }

          // Dividimos las mediciones en un máximo de 3 gráficas
          const measurements = response.data.typeMeasurements.slice(0, 3); // Tomamos solo los primeros 3 tipos de medición
          return measurements.map((measurement) => ({
            labels: [measurement.name],
            datasets: [
              {
                data: [measurement.value || Math.random() * 100], // Usamos los valores de las mediciones o valores aleatorios
                backgroundColor: ["#42A5F5"], 
                hoverBackgroundColor: ["#1E88E5"],
              },
            ],
          }));
        })
      );

      setChartData(fetchedData.flat()); // Aplanamos la matriz de datos para tener todas las gráficas en un solo array
      setChartOptions({
        cutout: "60%",
      });
    } catch (error) {
      console.error("Error al obtener los datos de las gráficas:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedVisuals]); // Re-llama a la función cuando cambian los servidores seleccionados

  const renderCharts = () => {
    if (selectedVisuals.length === 0) {
      return (
        <div className="text-center text-white">
          No hay servidores seleccionados para la vista.
        </div>
      );
    }

    if (!chartData[currentIndex]) {
      return (
        <div className="text-center text-white">
          Cargando las gráficas para el servidor {selectedVisuals[currentIndex]?.name || "Desconocido"}...
        </div>
      );
    }

    // Si no se encontraron métricas
    if (!chartData[currentIndex].datasets) {
      return (
        <div className="text-center text-white">
          No se encontraron métricas para el servidor {selectedVisuals[currentIndex]?.name || "Desconocido"}.
        </div>
      );
    }

    const currentServerCharts = chartData.slice(currentIndex * 3, currentIndex * 3 + 3).map((data, idx) => (
      <div key={idx} className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto">
        <h3 className="text-white mb-4 text-lg md:text-xl">
          {`Gráficas del servidor ${serverDetails[selectedVisuals[currentIndex]?.id]?.name || "Desconocido"}`}
        </h3>
        <p className="text-white text-sm mb-4">{`ipAddress: ${serverDetails[selectedVisuals[currentIndex]?.id]?.ipAddress || "No disponible"}`}</p>
        <Chart
          type="doughnut"
          data={data}
          options={chartOptions}
          className={`w-full transition-opacity duration-500 ${transitioning ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    ));

    return currentServerCharts;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedVisuals.length);
        setTransitioning(false);
      }, 500); // Duración de la transición
    }, 8000); // Intervalo de cambio de servidor

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [selectedVisuals]);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      <Navbar />
      <div className="card mt-28 mx-auto max-w-7xl shadow-xl p-6 rounded-lg bg-transparent">
        {renderCharts()}
      </div>
    </div>
  );
};