import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import "./AgregarServidor.css";

export const AgregarServidor = () => {
  const navigate = useNavigate();

  const [serverData, setServerData] = useState({
    serverName: "",
    serverIp: "",
    serverPort: null,
    measurementTypes: [],
  });

  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurementTypes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/measurement-types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMeasurementTypes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los tipos de medición", error);
        alert("Hubo un error al cargar los tipos de medición.");
      }
    };

    fetchMeasurementTypes();
  }, [navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setServerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleMeasurementChange = useCallback((e) => {
    setServerData((prevData) => ({
      ...prevData,
      measurementTypes: e.value,
    }));
  }, []);

  const handleSaveServer = async () => {
    if (
      !serverData.serverName ||
      !serverData.serverIp ||
      !serverData.serverPort
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const dataToCreate = {
      serverName: serverData.serverName,
      serverIp: serverData.serverIp,
      serverPort: serverData.serverPort,
      measurementTypeIds: serverData.measurementTypes,
    };

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/visuals`,
        dataToCreate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("¡Servidor creado con éxito!");
      const serverId = response.data.id;

      localStorage.setItem("serverId", serverId);
      navigate("/Parametrizacion");
    } catch (error) {
      console.error("Error al guardar el servidor", error);
      alert("Hubo un error al crear el servidor.");
    }
  };

  const handleGoBack = () => {
    navigate("/Parametrizacion"); // Regresa a la página anterior
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Agregar Servidor
        </h2>
        <div className="card p-4 bg-transparent shadow-xl">
          <form autoComplete="off">
            {/* Campos del formulario */}
            <div className="mb-4">
              <label
                htmlFor="serverName"
                className="block text-lg font-semibold"
              >
                Nombre del Servidor
              </label>
              <InputText
                id="serverName"
                name="serverName"
                value={serverData.serverName}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nombre del servidor"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="serverIp" className="block text-lg font-semibold">
                IP del Servidor
              </label>
              <InputText
                id="serverIp"
                name="serverIp"
                value={serverData.serverIp}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IP del servidor"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="serverPort"
                className="block text-lg font-semibold"
              >
                Puerto del Servidor
              </label>
              <InputNumber
                id="serverPort"
                name="serverPort"
                value={serverData.serverPort}
                onValueChange={(e) =>
                  handleInputChange({
                    target: { name: "serverPort", value: e.value },
                  })
                }
                autoComplete="off"
                inputClassName="bg-black text-white"
                className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Puerto del servidor"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold">
                Tipos de Medición
              </label>
              <div className="flex items-center rounded-lg p-3">
                <MultiSelect
                  value={serverData.measurementTypes}
                  options={measurementTypes}
                  onChange={handleMeasurementChange}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Selecciona tipos de medición"
                  className="w-full p-4 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  panelClassName="bg-black text-white mt-2 rounded-lg p-3"
                  itemClassName="bg-black text-white rounded-lg p-2"
                  filter
                  filterBy="name"
                  filterPlaceholder="Buscar por nombre..."
                />
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              {/* Botón de "Guardar Servidor" */}
              <Button
                label="Guardar Servidor"
                className="p-button-lg text-white bg-black rounded-lg p-2 hover:bg-gray-800"
                onClick={handleSaveServer}
              />
              {/* Botón de "Regresar" */}
              <Button
                label="Regresar"
                className="p-button-lg text-white bg-gray-600 rounded-lg p-2 hover:bg-gray-700"
                onClick={handleGoBack}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
