import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaEdit } from "react-icons/fa";  // Usamos Font Awesome para el ícono de lápiz
import Navbar from "./Navbar";

const mockServers = [
  {
    id: 1,
    name: "Servidor A",
    ip: "192.168.1.1",
    port: 8080,
    measurementType: "Type 1",
  },
  {
    id: 2,
    name: "Servidor B",
    ip: "192.168.1.2",
    port: 8081,
    measurementType: "Type 2",
  },
  {
    id: 3,
    name: "Servidor C",
    ip: "192.168.1.3",
    port: 8082,
    measurementType: "Type 3",
  },
];

export const Parametrizacion = () => {
  const [servers, setServers] = useState([]);
  const [selectedServers, setSelectedServers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setServers(mockServers);
    setLoading(false);
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="text-center mb-4 my-4 text-white">
      <h1 className="text-4xl font-bold">
        Bienvenido a parametrización
      </h1>
      <div className="flex justify-center items-center mt-4">
        <div className="flex justify-between items-center w-full max-w-6xl">
          <div className="flex gap-4">
            <div className="card bg-black p-2 rounded-lg w-48 hover:bg-zinc-800">
              <Button
                label="Agregar medición"
                className="p-button-sm w-full text-white"
              />
            </div>
            <div className="card bg-black p-2 rounded-lg w-48 hover:bg-zinc-800">
              <Button
                label="Agregar servidor"
                className="p-button-sm w-full text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-48">
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Buscar servidor"
              className="p-inputtext-sm p-shadow-2 rounded-lg w-full p-2 text-white"
              aria-label="Global search"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCheckboxList = () => {
    return (
      <div
        className={`bg-black rounded-lg shadow-lg w-48 hover:bg-zinc-800 p-4 flex justify-center items-center mx-auto mt-6 ${selectedServers.length === 0 ? 'hidden' : ''}`}
      >
        <Button
          label="Guardar cambios"
          className="p-button-lg w-full text-white"
          onClick={() => alert("Cambios guardados!")}
        />
      </div>
    );
  };

  const onCheckboxChange = (e, server) => {
    const selected = [...selectedServers];
    if (e.target.checked) {
      selected.push(server);
    } else {
      const index = selected.findIndex((s) => s.id === server.id);
      selected.splice(index, 1);
    }
    setSelectedServers(selected);
  };

  const onSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedServers(servers);
    } else {
      setSelectedServers([]);
    }
  };

  // Función para manejar el clic en el ícono de editar
  const onEditServer = (server) => {
    // Aquí podrías abrir un modal de edición o redirigir a una página de edición
    alert(`Editando servidor: ${server.name}`);
  };

  return (
    <>
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
            globalFilterFields={["name", "ip", "port", "measurementType"]}
            loading={loading}
            header={renderHeader()}
            emptyMessage="No servers found."
            responsiveLayout="scroll"
            className="text-white"
          >
            {/* Checkbox para seleccionar/desmarcar todos */}
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
                  checked={selectedServers.some((server) => server.id === rowData.id)}
                  onChange={(e) => onCheckboxChange(e, rowData)}
                  className="rounded-lg"
                />
              )}
              style={{ width: "3rem" }}
            />

            {/* Nombre del Servidor */}
            <Column
              field="name"
              header="Nombre del servidor"
              style={{ minWidth: "12rem" }}
            />
            
            {/* IP Servidor */}
            <Column
              field="ip"
              header="IP Servidor"
              style={{ minWidth: "12rem" }}
            />

            {/* Puerto Servidor */}
            <Column
              field="port"
              header="Puerto Servidor"
              style={{ minWidth: "10rem" }}
            />

            {/* Tipo de medición */}
            <Column
              field="measurementType"
              header="Tipo de medición"
              style={{ minWidth: "12rem" }}
            />

            {/* Columna de Edición */}
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
    </>
  );
};
