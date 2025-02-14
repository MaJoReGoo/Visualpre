import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Chart } from "primereact/chart";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

export function Inicio() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  console.log(import.meta.env.MODE);

  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    const data1 = {
      labels: ["A", "B", "C"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
          ],
        },
      ],
    };

    const data2 = {
      labels: ["X", "Y", "Z"],
      datasets: [
        {
          data: [200, 120, 80],
          backgroundColor: [
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--orange-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--orange-400"),
          ],
        },
      ],
    };

    const data3 = {
      labels: ["One", "Two", "Three"],
      datasets: [
        {
          data: [400, 150, 50],
          backgroundColor: [
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--purple-500"),
            documentStyle.getPropertyValue("--pink-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--purple-400"),
            documentStyle.getPropertyValue("--pink-400"),
          ],
        },
      ],
    };

    const data4 = {
      labels: ["Alpha", "Beta", "Gamma"],
      datasets: [
        {
          data: [200, 100, 50],
          backgroundColor: [
            documentStyle.getPropertyValue("--pink-500"),
            documentStyle.getPropertyValue("--indigo-500"),
            documentStyle.getPropertyValue("--teal-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--pink-400"),
            documentStyle.getPropertyValue("--indigo-400"),
            documentStyle.getPropertyValue("--teal-400"),
          ],
        },
      ],
    };

    const data5 = {
      labels: ["Delta", "Epsilon", "Zeta"],
      datasets: [
        {
          data: [250, 150, 90],
          backgroundColor: [
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--blue-600"),
            documentStyle.getPropertyValue("--red-600"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--red-400"),
          ],
        },
      ],
    };

    const data6 = {
      labels: ["Lambda", "Mu", "Nu"],
      datasets: [
        {
          data: [180, 200, 120],
          backgroundColor: [
            documentStyle.getPropertyValue("--teal-500"),
            documentStyle.getPropertyValue("--green-600"),
            documentStyle.getPropertyValue("--orange-600"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--teal-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--orange-400"),
          ],
        },
      ],
    };

    const options = {
      cutout: "60%",
    };

    setChartData([data1, data2, data3, data4, data5, data6]);
    setChartOptions(options);
  }, []);

  // Función para redirigir al usuario cuando haga clic en el botón
  const redirectToAddCharts = () => {
    navigate("/Parametrizacion"); // Redirecciona usando navigate
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        {/* Título de la primera sección */}
        <div className="text-center mt-8 mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-semibold">
            Servidor 190
          </h1>
        </div>

        {/* Fila 1: Gráficas A, B, C */}
        <div className="flex flex-wrap justify-center gap-8">
          {["Gráfica A", "Gráfica B", "Gráfica C"].map((title, index) => (
            <div
              key={index}
              className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <h3 className="text-white mb-4 text-lg md:text-xl">{title}</h3>
              <Chart
                type="doughnut"
                data={chartData[index]}
                options={chartOptions}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Título de la segunda sección */}
        <div className="text-center mt-16 mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-semibold">
            Servidor 200
          </h1>
        </div>

        {/* Fila 2: Gráficas 200 */}
        <div className="flex flex-wrap justify-center gap-8">
          {["Gráfica 200 A", "Gráfica 200 B", "Gráfica 200 C"].map(
            (title, index) => (
              <div
                key={index}
                className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <h3 className="text-white mb-4 text-lg md:text-xl">{title}</h3>
                <Chart
                  type="doughnut"
                  data={chartData[index + 3]}
                  options={chartOptions}
                  className="w-full"
                />
              </div>
            )
          )}
        </div>

        {/* Botón "Agregar más gráficas" en el costado derecho */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={redirectToAddCharts}
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            Agregar más gráficas
          </button>
        </div>
      </div>
    </div>
  );
}
