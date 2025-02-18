import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";  // Importar MultiSelect

export const AgregarServidor = () => {
  const navigate = useNavigate();

  const [serverData, setServerData] = useState({
    serverName: "",
    serverIp: "",
    serverPort: null,
    measurementTypes: [], // Aquí guardaremos los ids seleccionados
  });

  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar los tipos de medición desde el backend
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  // Manejo de cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Guardar el servidor con los datos
  const handleSaveServer = async () => {
    // Validación de los campos
    if (!serverData.serverName || !serverData.serverIp || !serverData.serverPort) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Datos a enviar al backend
    const dataToCreate = {
      serverName: serverData.serverName,
      serverIp: serverData.serverIp,
      serverPort: serverData.serverPort,
      measurementTypeIds: serverData.measurementTypes, // Usamos los ids seleccionados
    };

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/visuals`, // Endpoint de la API
        dataToCreate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("¡Servidor creado con éxito!");
      navigate("/parametrizacion");
    } catch (error) {
      console.error("Error al guardar el servidor", error);
      alert("Hubo un error al crear el servidor.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Agregar Servidor</h2>

        <div className="card p-4 bg-transparent shadow-xl">
          <div className="mb-4">
            <label htmlFor="serverName" className="block text-lg font-semibold">
              Nombre del Servidor
            </label>
            <InputText
              id="serverName"
              name="serverName"
              value={serverData.serverName}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="IP del servidor"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="serverPort" className="block text-lg font-semibold">
              Puerto del Servidor
            </label>
            <InputNumber
              id="serverPort"
              name="serverPort"
              value={serverData.serverPort}
              onValueChange={(e) =>
                handleInputChange({ target: { name: "serverPort", value: e.value } })
              }
              inputClassName="bg-black text-white"
              className="w-full p-3 bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Puerto del servidor"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold">
              Tipos de Medición
            </label>
            <MultiSelect
              value={serverData.measurementTypes}
              options={measurementTypes}
              onChange={(e) =>
                setServerData((prevData) => ({
                  ...prevData,
                  measurementTypes: e.value,
                }))
              }
              optionLabel="name" // Esto se usa para mostrar el nombre de cada opción
              optionValue="id"   // Se usará el id al guardar en el backend
              placeholder="Selecciona tipos de medición"
              className="w-full p-3 bg-black text-white border-2 border-gray-600 rounded-lg"
            />
          </div>

          <div className="flex justify-center mt-6">
            <Button
              label="Guardar Servidor"
              className="p-button-lg text-white bg-black rounded-lg p-2"
              onClick={handleSaveServer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
