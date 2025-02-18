import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";

export const EditServer = () => {
  const { id } = useParams(); // Obtén el `id` de la URL
  const navigate = useNavigate();

  // Estado para los datos del servidor
  const [serverData, setServerData] = useState({
    serverName: "",
    serverIp: "",
    serverPort: "", // Cambiar a cadena vacía por defecto para InputNumber
    measurementTypeIds: [],
  });

  // Estado para los tipos de medición
  const [measurementTypes, setMeasurementTypes] = useState([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Cargar datos del servidor y tipos de medición
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          navigate("/login");
          return;
        }

        // Cargar datos del servidor
        const serverResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/visuals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setServerData({
          serverName: serverResponse.data.serverName,
          serverIp: serverResponse.data.serverIp,
          serverPort: serverResponse.data.serverPort || "", // Aseguramos que el valor sea cadena vacía si no existe
          measurementTypeIds: serverResponse.data.measurementVisuals.map(
            (visual) => visual.measurementType.id
          ),
        });

        // Cargar tipos de medición
        const measurementTypesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/measurement-types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMeasurementTypes(measurementTypesResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos", error);
        alert("Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Manejar cambios en los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar cambios en los tipos de medición seleccionados
  const handleMeasurementTypeChange = (e) => {
    const uniqueMeasurementTypeIds = [...new Set(e.value)];
    setServerData((prevData) => ({
      ...prevData,
      measurementTypeIds: uniqueMeasurementTypeIds,
    }));
  };

  // Guardar cambios
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }
  
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/visuals/${id}`,
        serverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Datos actualizados correctamente");
      navigate("/Parametrizacion"); // Redirige a la vista de parametrización después de guardar
    } catch (error) {
      console.error("Error al guardar los datos", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  // Mostrar "Loading..." mientras se cargan los datos
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Editar Servidor</h2>

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
              onValueChange={(e) => handleInputChange({ target: { name: "serverPort", value: e.value } })}
              inputClassName="bg-black text-white"
              className="w-full p-3 bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Puerto del servidor"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="measurementTypes" className="block text-lg font-semibold">
              Tipos de Medición
            </label>
            <MultiSelect
              id="measurementTypes"
              value={serverData.measurementTypeIds}
              onChange={handleMeasurementTypeChange}
              options={measurementTypes}
              optionLabel="name"
              optionValue="id"
              className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Selecciona los tipos de medición"
              itemTemplate={(option) => (
                <div className="flex items-center p-2 hover:bg-blue-600 rounded-md">
                  <span>{option.name}</span>
                </div>
              )}
              panelClassName="bg-black text-white border-2 border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
            />
          </div>

          <div className="flex justify-center mt-6">
            <Button
              label="Guardar Cambios"
              className="p-button-lg text-white bg-black rounded-lg p-2"
              onClick={handleSaveChanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
