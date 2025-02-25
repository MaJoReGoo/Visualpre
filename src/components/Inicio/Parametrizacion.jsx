import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaEdit } from "react-icons/fa";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Parametrizacion = () => {
  const [servers, setServers] = useState([]); // Lista de servidores
  const [selectedServers, setSelectedServers] = useState([]); // Servidores seleccionados
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState(""); // Filtro global
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [editingServer, setEditingServer] = useState(null); // Servidor a editar

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serversResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/servers`
        );
  
        console.log("Servidores recibidos:", serversResponse.data);
  
        // Mapeo de los datos de servidores
        const filteredData = serversResponse.data.map((server) => {
          return {
            name: server.name,
            ipAddress: server.ipAddress,
            estado: server.estado,
            typeMeasurements: server.typeMeasurements || [],
            id: server.id,
          };
        });
  
        setServers(filteredData); // Guardar todos los servidores
  
        // Obtener servidores seleccionados desde localStorage
        const storedSelectedServers = JSON.parse(localStorage.getItem("selectedServers")) || [];
  
        // Filtrar los servidores seleccionados para mantener solo los que están en la base de datos
        const validSelectedServers = storedSelectedServers.filter((selectedServer) =>
          filteredData.some((server) => server.id === selectedServer.id)
        );
  
        // Actualizar la selección con los servidores válidos
        setSelectedServers(validSelectedServers);
  
        // Actualizar el localStorage con la nueva lista de servidores seleccionados
        localStorage.setItem("selectedServers", JSON.stringify(validSelectedServers));
  
        setLoading(false); // Marcar como carga completa
      } catch (error) {
        console.error("Error al obtener los servers", error);
        setLoading(false);
      }
    };
  
    fetchServers(); // Llamada para obtener servidores
  }, []); // Se ejecuta solo al cargar la página
  

  useEffect(() => {
    const storedSelectedServers = JSON.parse(localStorage.getItem("selectedServers"));
    if (storedSelectedServers) {
      setSelectedServers(storedSelectedServers); // Cargar selección desde localStorage
    }
  }, []);
  

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onEditServer = (server) => {
    console.log("Editando server con ID:", server.id);
    navigate(`/EditServer/${server.id}`);
  };

  const onCheckboxChange = (e, server) => {
    const selected = [...selectedServers];
    if (e.target.checked) {
      selected.push(server); // Agregar servidor seleccionado
    } else {
      const index = selected.findIndex((s) => s.id === server.id);
      if (index !== -1) {
        selected.splice(index, 1); // Eliminar servidor deseleccionado
      }
    }
    setSelectedServers(selected); // Actualizar el estado
    localStorage.setItem("selectedServers", JSON.stringify(selected)); // Guardar en localStorage
  };
  
  const onSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedServers(servers);
      localStorage.setItem("selectedServers", JSON.stringify(servers)); // Guardar todos los servidores seleccionados
    } else {
      setSelectedServers([]); 
      localStorage.setItem("selectedServers", JSON.stringify([])); // Limpiar la selección
    }
  };
  

  const saveChanges = () => {
    // Guardar en localStorage los servidores seleccionados
    localStorage.setItem("selectedServers", JSON.stringify(selectedServers));
    alert("Cambios guardados!");
  };

  const isSelected = (server) => {
    return selectedServers.some((selected) => selected.id === server.id);
  };

  const renderCheckboxList = () => {
    return (
      <div className="bg-black rounded-lg shadow-lg p-4 flex justify-center items-center mx-auto mt-6 w-48">
        <Button
          label="Guardar cambios"
          className="p-button-lg text-white"
          onClick={saveChanges}
        />
      </div>
    );
  };

  const renderHeader = () => (
    <div className="text-center mb-4 my-4 text-white">
      <h1 className="text-4xl font-bold">Bienvenido a parametrización</h1>
      <div className="flex justify-center items-center mt-4">
        <div className="flex justify-between items-center w-full max-w-6xl">
          <div className="flex gap-4">
            <div className="card bg-black p-2 rounded-lg w-48 hover:bg-zinc-800">
              <Button
                label="Agregar medición"
                className="p-button-sm w-full text-white"
                onClick={() => navigate("/AgregarMedicion")}
              />
            </div>
            <div className="card bg-black p-2 rounded-lg w-48 hover:bg-zinc-800">
              <Button
                label="Agregar servidor"
                className="p-button-sm w-full text-white"
                onClick={() => navigate("/AgregarServidor")}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-48">
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Buscar server"
              className="p-inputtext-sm p-shadow-2 rounded-lg w-full p-2 text-black"
              aria-label="Global search"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>; // Cargando
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      <Navbar />
      <div className="card mt-28 mx-auto max-w-7xl shadow-xl p-6 rounded-lg bg-transparent">
        <DataTable
          value={servers}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "name",
            "ipAddress",
            "estado",
            "typeMeasurements",
          ]}
          loading={loading}
          header={renderHeader()}
          emptyMessage="No servers found."
          responsiveLayout="scroll"
          className="text-white"
        >
          <Column
            header={
              <input
                type="checkbox"
                onChange={onSelectAllChange}
                checked={selectedServers.length === servers.length}
                className="rounded-lg"
              />
            }
            body={(rowData) => (
              <input
                type="checkbox"
                checked={isSelected(rowData)}
                onChange={(e) => onCheckboxChange(e, rowData)}
                className="rounded-lg"
              />
            )}
            style={{ width: "3rem" }}
          />

          <Column
            field="name"
            header="Nombre del Server"
            style={{ minWidth: "12rem" }}
          />

          <Column
            field="ipAddress"
            header="IP Server"
            style={{ minWidth: "12rem" }}
          />

          <Column
            field="estado"
            header="Estado"
            body={(rowData) => {
              return rowData.estado ? "Activo" : "Inactivo";
            }}
            style={{ minWidth: "10rem" }}
          />

          <Column
            field="typeMeasurements"
            header="Tipos de Medición"
            body={(rowData) => {
              if (rowData.typeMeasurements && rowData.typeMeasurements.length > 0) {
                return rowData.typeMeasurements
                  .map((measurement) => measurement.name)
                  .join(", ");
              }
              return "Ningún tipo de medición"; // Si no hay tipos asociados
            }}
            style={{ minWidth: "12rem" }}
          />

          <Column
            header="Editar"
            body={(rowData) => (
              <Button
                icon={<FaEdit className="text-white" />}
                onClick={() => onEditServer(rowData)}
                className="p-button-rounded p-button-sm text-white"
              />
            )}
            style={{ width: "5rem" }}
          />
        </DataTable>

        {renderCheckboxList()}
      </div>
    </div>
  );
};
