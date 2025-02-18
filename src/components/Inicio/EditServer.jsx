import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";

export const EditServer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serverId = location.state ? location.state.serverId : null;

  const [serverData, setServerData] = useState({
    serverName: "",
    serverIp: "",
    serverPort: null,
    measurementTypeIds: [],
  });

  const [loading, setLoading] = useState(true);
  const [measurementTypes, setMeasurementTypes] = useState([]);

  useEffect(() => {
    // Solo se ejecutará si serverId existe
    if (serverId) {
      const fetchServerData = async () => {
        try {
          const token = localStorage.getItem("authToken");

          if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            navigate("/login");
            return;
          }

          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/visuals/${serverId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setServerData({
            serverName: response.data.serverName,
            serverIp: response.data.serverIp,
            serverPort: response.data.serverPort,
            measurementTypeIds: response.data.measurementVisuals.map(
              (visual) => visual.measurementType.id
            ),
          });
        } catch (error) {
          console.error("Error al cargar los datos del servidor", error);
          if (error.response && error.response.status === 401) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            navigate("/login");
          } else {
            alert("Hubo un error al cargar los datos.");
          }
        } finally {
          setLoading(false);
        }
      };

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
        } catch (error) {
          console.error("Error al cargar los tipos de medición", error);
          alert("Hubo un error al cargar los tipos de medición.");
        }
      };

      fetchServerData();
      fetchMeasurementTypes();
    }
  }, [serverId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMeasurementTypeChange = (e) => {
    const uniqueMeasurementTypeIds = [...new Set(e.value)];
    setServerData((prevData) => ({
      ...prevData,
      measurementTypeIds: uniqueMeasurementTypeIds,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }

      const dataToUpdate = {
        serverName: serverData.serverName,
        serverIp: serverData.serverIp,
        serverPort: serverData.serverPort,
        measurementTypeIds: serverData.measurementTypeIds,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/visuals/${serverId}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("¡Servidor actualizado con éxito!");
        navigate("/parametrizacion");
      } else {
        alert("Hubo un error al guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar los cambios", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

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
              onValueChange={(e) =>
                handleInputChange({ target: { name: "serverPort", value: e.value } })
              }
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
