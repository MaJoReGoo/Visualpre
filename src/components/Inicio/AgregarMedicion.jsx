import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AgregarMedicion = () => {
  const [measurementName, setMeasurementName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setMeasurementName(e.target.value);
  };

  const handleSaveMeasurement = async () => {
    if (!measurementName.trim()) {
      alert("Por favor, ingresa un nombre para la medición.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/measurement-types`,
        {
          name: measurementName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("¡Medición creada con éxito!");
      navigate("/parametrizacion");
    } catch (error) {
      console.error("Error al guardar la medición", error);
      alert("Hubo un error al guardar la medición.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Crear Medición</h2>

        <div className="card p-4 bg-transparent shadow-xl">
          <div className="mb-4">
            <label htmlFor="measurementName" className="block text-lg font-semibold">
              Nombre de la Medición
            </label>
            <InputText
              id="measurementName"
              value={measurementName}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la medición"
            />
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            {/* Botón de "Crear Medición" */}
            <Button
              label={loading ? "Guardando..." : "Crear Medición"}
              className="p-button-lg text-white bg-black rounded-lg p-2"
              onClick={handleSaveMeasurement}
              disabled={loading}
            />
            {/* Botón de "Regresar" */}
            <Button
              label="Regresar"
              className="p-button-lg text-white bg-gray-600 rounded-lg p-2"
              onClick={handleGoBack}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
