import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Chart } from "primereact/chart";

export function Inicio() {

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

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

    const options = {
      cutout: "60%",
    };

    setChartData([data1, data2, data3]);
    setChartOptions(options);
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-800 to-black opacity-95">
    <Navbar />
      <div className="min-h-screen flex items-center justify-center relative">

        <h1 className="text-center text-white m-2 my-2">Servidor 190</h1>
        <div className="flex justify-around w-full space-x-4 mt-8">

          {/* Chart 1 */}
          <div className="text-center">
            
            <h3 className="text-white mb-4">Gráfica A</h3>
            <Chart
              type="doughnut"
              data={chartData[0]}
              options={chartOptions}
              className="w-full md:w-30rem"
            />
          </div>

          {/* Chart 2 */}
          <div className="text-center">
            <h3 className="text-white mb-4">Gráfica B</h3>
            <Chart
              type="doughnut"
              data={chartData[1]}
              options={chartOptions}
              className="w-full md:w-30rem"
            />
          </div>

          {/* Chart 3 */}
          <div className="text-center">
            <h3 className="text-white mb-4">Gráfica C</h3>
            <Chart
              type="doughnut"
              data={chartData[2]}
              options={chartOptions}
              className="w-full md:w-30rem"
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
