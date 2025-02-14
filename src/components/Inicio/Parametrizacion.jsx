import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaEdit } from "react-icons/fa"; // Usamos Font Awesome para el ícono de lápiz
import Navbar from "./Navbar";
import axios from "axios"; // Importamos axios

export const Parametrizacion = () => {
  const [visuals, setVisuals] = useState([]); // Aquí cambiamos de servers a visuals
  const [selectedVisuals, setSelectedVisuals] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hacemos la solicitud HTTP para obtener los datos de "visuals" usando la variable de entorno
    const fetchVisuals = async () => {
      try {
        // Recuperar el token de autenticación del localStorage
        const token = localStorage.getItem("authToken");

        // Si no hay token, puedes redirigir al usuario a la página de login o manejarlo como un error
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }

        // Hacer la solicitud a la API con el token en los encabezados
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/visuals`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
          }
        );

        // Solo seleccionamos los campos necesarios de la respuesta
        const filteredData = response.data.map((visual) => ({
          serverName: visual.serverName,
          serverIp: visual.serverIp,
          serverPort: visual.serverPort,
        }));

        setVisuals(filteredData); // Guardamos solo los datos necesarios
        setLoading(false); // Dejamos de cargar cuando se recibe la respuesta
      } catch (error) {
        console.error("Error al obtener los visuals", error);
        setLoading(false); // Dejamos de cargar aunque haya un error
      }
    };

    fetchVisuals();
  }, []); // La dependencia es vacía porque solo queremos que se ejecute una vez cuando el componente se monte

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
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
              placeholder="Buscar visual"
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
        className={`bg-black rounded-lg shadow-lg w-48 hover:bg-zinc-800 p-4 flex justify-center items-center mx-auto mt-6 ${
          selectedVisuals.length === 0 ? "hidden" : ""
        }`}
      >
        <Button
          label="Guardar cambios"
          className="p-button-lg w-full text-white"
          onClick={() => alert("Cambios guardados!")}
        />
      </div>
    );
  };

  const onCheckboxChange = (e, visual) => {
    const selected = [...selectedVisuals];
    if (e.target.checked) {
      selected.push(visual);
    } else {
      const index = selected.findIndex((s) => s.id === visual.id);
      selected.splice(index, 1);
    }
    setSelectedVisuals(selected);
  };

  const onSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedVisuals(visuals);
    } else {
      setSelectedVisuals([]);
    }
  };

  const onEditVisual = (visual) => {
    alert(`Editando visual: ${visual.serverName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      <Navbar />
      <div className="card mt-28 mx-auto max-w-7xl shadow-xl p-6 rounded-lg bg-transparent">
        <DataTable
          value={visuals} // Aquí cambiamos de "servers" a "visuals"
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["serverName", "serverIp", "serverPort"]} // Filtramos por los campos correctos
          loading={loading}
          header={renderHeader()}
          emptyMessage="No visuals found." // Cambié el mensaje a "No visuals found."
          responsiveLayout="scroll"
          className="text-white"
        >
          <Column
            header={
              <input
                type="checkbox"
                onChange={onSelectAllChange}
                checked={selectedVisuals.length === visuals.length} // Comparamos con "visuals"
                className="rounded-lg"
              />
            }
            body={(rowData) => (
              <input
                type="checkbox"
                checked={selectedVisuals.some(
                  (visual) => visual.id === rowData.id
                )}
                onChange={(e) => onCheckboxChange(e, rowData)}
                className="rounded-lg"
              />
            )}
            style={{ width: "3rem" }}
          />
          <Column
            field="serverName"
            header="Nombre del visual"
            style={{ minWidth: "12rem" }}
          />
          <Column field="serverIp" header="IP Visual" style={{ minWidth: "12rem" }} />
          <Column
            field="serverPort"
            header="Puerto Visual"
            style={{ minWidth: "10rem" }}
          />
          <Column
            header="Editar"
            body={(rowData) => (
              <Button
                icon={<FaEdit className="text-white" />}
                onClick={() => onEditVisual(rowData)}
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
