import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Chart } from "primereact/chart";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de importar axios

export function Inicio() {
  const [selectedVisuals, setSelectedVisuals] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [transitioning, setTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Recuperamos los servidores seleccionados desde el localStorage
  useEffect(() => {
    const savedSelectedVisuals = localStorage.getItem("selectedVisuals");
    if (savedSelectedVisuals) {
      setSelectedVisuals(JSON.parse(savedSelectedVisuals));
    }
  }, []);

  // Función para obtener los datos de las gráficas según el servidor
  const fetchChartData = async () => {
    if (selectedVisuals.length === 0) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }
      // Usamos Promise.all para manejar las solicitudes asíncronas de manera concurrente
      const fetchedData = await Promise.all(
        selectedVisuals.map(async (visual) => {
          console.log(`Obteniendo datos para el servidor con ID: ${visual.id}`);

          // Asegúrate de que la URL esté correctamente construida
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/visuals/${visual.id}`,
            {
              headers: { Authorization: `Bearer ${token}` }, // Agregamos el token en los encabezados correctamente
            }
          );

          // Si la respuesta no tiene datos válidos, puedes colocar valores por defecto
          return {
            labels: ["A", "B", "C"], // Cambia esto según los datos reales
            datasets: [
              {
                data: response.data.metrics || [
                  Math.random() * 500,
                  Math.random() * 100,
                  Math.random() * 200,
                ],
                backgroundColor: ["#42A5F5", "#66BB6A", "#FF9800"],
                hoverBackgroundColor: ["#1E88E5", "#81C784", "#FFA000"],
              },
            ],
          };
        })
      );

      setChartData(fetchedData);
      setChartOptions({
        cutout: "60%",
      });
    } catch (error) {
      console.error("Error al obtener los datos de las gráficas:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedVisuals]); // Se vuelve a ejecutar cada vez que cambian los servidores seleccionados

  const renderCharts = () => {
    if (selectedVisuals.length === 0) {
      return (
        <div className="text-center text-white">
          No hay servidores seleccionados para la vista.
        </div>
      );
    }

    // Only render charts for the current server in the carousel
    const currentServerCharts = chartData[currentIndex] ? (
      <div className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <h3 className="text-white mb-4 text-lg md:text-xl">{`Gráficas del servidor ${selectedVisuals[currentIndex].serverName}`}</h3>
        {chartData[currentIndex].datasets.map((dataset, idx) => (
          <Chart
            key={idx}
            type="doughnut"
            data={chartData[currentIndex]}
            options={chartOptions}
            className={`w-full transition-opacity duration-500 ${
              transitioning ? "opacity-0" : "opacity-100"
            }`}
          />
        ))}
      </div>
    ) : null;

    return currentServerCharts;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % selectedVisuals.length
        );
        setTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedVisuals]);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        {/* Título de la primera sección */}
        <div className="text-center mt-8 mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-semibold">
            Servidor{" "}
            {selectedVisuals[currentIndex]?.serverName || "Desconocido"}
          </h1>
        </div>

        {/* Carrusel de Gráficas */}
        <div className="flex flex-wrap justify-center gap-8 transition-all duration-500 ease-in-out opacity-100">
          {renderCharts()}
        </div>

        {/* Controles de navegación manual con flechas */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() =>
              setCurrentIndex(
                (prevIndex) =>
                  (prevIndex - 1 + selectedVisuals.length) %
                  selectedVisuals.length
              )
            }
            className="bg-transparent text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-2xl"
          >
            &#8592; {/* Flecha hacia la izquierda */}
          </button>
          <button
            onClick={() =>
              setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % selectedVisuals.length
              )
            }
            className="bg-transparent text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-2xl"
          >
            &#8594; {/* Flecha hacia la derecha */}
          </button>
        </div>

        {/* Botón "Agregar más gráficas" */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => navigate("/Parametrizacion")}
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            Agregar más gráficas
          </button>
        </div>
      </div>
    </div>
  );
}
