import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import "./AgregarServidor.css";

export const AgregarServidor = () => {
  const navigate = useNavigate();

  const [serverData, setServerData] = useState({
    name: "",
    ipAddress: "",
    typeMeasurements: [],
  });

  const [typeMeasurements, setTypeMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tipos de medición
  useEffect(() => {
    const fetchTypeMeasurements = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/types-measurements`
        );
  
        console.log(response.data); // Verifica la estructura real
        
        // Verifica que la respuesta tenga un array de objetos con 'id' y 'name'
        if (response.data && Array.isArray(response.data)) {
          setTypeMeasurements(response.data); // Asigna la lista al estado
        } else {
          console.error("Error: La estructura de la respuesta no es la esperada.");
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los tipos de medición", error);
        alert("Hubo un error al cargar los tipos de medición.");
      }
    };
  
    fetchTypeMeasurements();
  }, []);

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setServerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Manejo de selección de tipos de medición
  const handleMeasurementChange = useCallback((e) => {
    setServerData((prevData) => ({
      ...prevData,
      typeMeasurements: e.value, // Asigna los valores seleccionados
    }));
  }, []);

  // Guardar el servidor
  const handleSaveServer = async () => {
    if (!serverData.name || !serverData.ipAddress || !serverData.typeMeasurements.length) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const dataToCreate = {
      name: serverData.name,
      ipAddress: serverData.ipAddress,
      typeMeasurements: serverData.typeMeasurements,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/servers/create`,
        dataToCreate
      );

      alert("¡Servidor creado con éxito!");
      navigate("/Parametrizacion");
    } catch (error) {
      console.error("Error al guardar el servidor", error);
      alert("Hubo un error al crear el servidor.");
    }
  };

  // Regresar a la página anterior
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
            {/* Nombre del servidor */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-semibold">
                Nombre del Servidor
              </label>
              <InputText
                id="name"
                name="name"
                value={serverData.name}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nombre del servidor"
              />
            </div>

            {/* IP del servidor */}
            <div className="mb-4">
              <label htmlFor="ipAddress" className="block text-lg font-semibold">
                IP del Servidor
              </label>
              <InputText
                id="ipAddress"
                name="ipAddress"
                value={serverData.ipAddress}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IP del servidor"
              />
            </div>

            {/* Tipos de medición */}
            <div className="mb-4">
              <label className="block text-lg font-semibold">
                Tipos de Medición
              </label>
              <div className="flex items-center rounded-lg p-3">
                <MultiSelect
                  value={serverData.typeMeasurements}
                  options={typeMeasurements} // Usamos el estado 'typeMeasurements' con los datos de la API
                  onChange={handleMeasurementChange}
                  optionLabel="name" // El nombre que se muestra en la lista
                  optionValue="id" // El valor que se guarda (id del tipo de medición)
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
                className="p-button-lg text-white bg-black rounded-lg p-3 hover:bg-gray-800"
                onClick={handleSaveServer}
              />
              {/* Botón de "Regresar" */}
              <Button
                label="Regresar"
                className="p-button-lg text-white bg-gray-500 rounded-lg p-3 hover:bg-gray-600"
                onClick={handleGoBack}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
