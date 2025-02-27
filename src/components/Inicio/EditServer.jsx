import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import "./EditServer.css";

export const EditServer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serverData, setServerData] = useState({
    name: "",
    ipAddress: "",
    typeMeasurements: [],
    estado: true,
  });

  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const estados = [
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/servers/${id}`
        );
        const server = response.data;
  
        const estadoValor = server.estado === "activo" ? true : server.estado === "inactivo" ? false : true; // Asegurarse de que si no tiene valor se ponga 'true'
  
        setServerData({
          name: server.name || "",
          ipAddress: server.ipAddress || "",
          typeMeasurements: server.typeMeasurements
            ? server.typeMeasurements.map((m) => m.id)
            : [],
          estado: estadoValor, // Esto asegura que el valor de estado es 'activo' por defecto
        });
  
        const measurementTypesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/types-measurements`
        );
        setMeasurementTypes(measurementTypesResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos del servidor:", error);
        alert("Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

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
      typeMeasurements: uniqueMeasurementTypeIds,
    }));
  };

  const handleEstadoChange = (e) => {
    setServerData((prevData) => ({
      ...prevData,
      estado: e.value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(serverData.ipAddress)) {
        alert("La IP proporcionada no es válida.");
        return;
      }

      console.log("Enviando datos:", serverData);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/servers/update/${id}`,
        {
          name: serverData.name,
          ipAddress: serverData.ipAddress,
          typeMeasurements: serverData.typeMeasurements,
          estado: serverData.estado,
        }
      );
      alert("Datos del servidor actualizados correctamente");
      navigate("/Parametrizacion");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  const handleRegresar = () => {
    navigate("/Parametrizacion");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white flex items-center justify-center p-6">
  <div className="w-full max-w-xl"> {/* Aumenté el tamaño máximo a "max-w-xl" */}
    <h2 className="text-3xl font-bold mb-4 text-center">Editar Servidor</h2>

    <div className="card p-6 bg-transparent shadow-xl">
      {/* Nombre del servidor */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-lg font-semibold">
          Nombre del Servidor
        </label>
        <InputText
          id="name"
          name="name"
          value={serverData.name}
          onChange={handleInputChange}
          className="w-full p-4 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del servidor"
        />
      </div>

      {/* IP del servidor */}
      <div className="mb-6">
        <label htmlFor="ipAddress" className="block text-lg font-semibold">
          IP Server
        </label>
        <InputText
          id="ipAddress"
          name="ipAddress"
          value={serverData.ipAddress}
          onChange={handleInputChange}
          className="w-full p-4 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="IP del servidor"
        />
      </div>

      {/* Tipos de medición */}
      <div className="mb-6">
        <label htmlFor="measurementTypes" className="block text-lg font-semibold">
          Tipos de Medición
        </label>
        <MultiSelect
          id="measurementTypes"
          value={serverData.typeMeasurements}
          onChange={handleMeasurementTypeChange}
          options={measurementTypes}
          optionLabel="name"
          optionValue="id"
          className="w-full p-4 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Selecciona los tipos de medición"
          itemTemplate={(option) => (
            <div className="flex items-center p-2 hover:bg-blue-600 rounded-md">
              <span>{option.name}</span>
            </div>
          )}
          panelClassName="bg-black text-white border-2 border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
          filter
          filterBy="name"
          filterPlaceholder="Buscar por nombre..."
          style={{ maxWidth: "100%" }}
        />
      </div>

      {/* Estado del servidor */}
      <div className="mb-6">
        <label htmlFor="estado" className="block text-lg font-semibold">
          Estado
        </label>
        <Dropdown
          id="estado"
          value={serverData.estado}
          onChange={handleEstadoChange}
          options={estados}
          pt={
            {
              item: {
                className: "w-full p-4 text-white bg-black border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2",
              },
            }
          }
          optionLabel="label"
          optionValue="value"
          className="w-full p-4 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Selecciona el estado"
        />
      </div>

      {/* Botones de guardar cambios y regresar */}
      <div className="flex justify-between mt-6">
        <Button
          label="Guardar Cambios"
          className="p-button-lg text-white bg-black rounded-lg p-3 hover:bg-slate-900"
          onClick={handleSaveChanges}
        />
        <Button
          label="Regresar"
          className="p-button-lg text-white bg-gray-500 rounded-lg p-3 hover:bg-gray-600"
          onClick={handleRegresar}
        />


      </div>
      
    </div>
  </div>
 
</div>

  );
};
