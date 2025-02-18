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
  const [visuals, setVisuals] = useState([]);
  const [selectedVisuals, setSelectedVisuals] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [editingVisual, setEditingVisual] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisualsAndMeasurementTypes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }

        const [visualsResponse, measurementTypesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/visuals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/measurement-types`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMeasurementTypes(measurementTypesResponse.data);

        const filteredData = visualsResponse.data.map((visual) => {
          const measurementTypeNames = visual.measurementVisuals.map(
            (measurementVisual) => measurementVisual.measurementType.name
          );

          return {
            serverName: visual.serverName,
            serverIp: visual.serverIp,
            serverPort: visual.serverPort,
            measurementTypes: measurementTypeNames.join(", "),
            measurementTypeIds: visual.measurementVisuals.map(
              (measurementVisual) => measurementVisual.measurementType.id
            ),
            id: visual.id,
          };
        });

        setVisuals(filteredData);

        // Cargar los visuales seleccionados desde el localStorage (si ya hubo cambios previos)
        const savedSelectedVisuals =
          JSON.parse(localStorage.getItem("selectedVisuals")) || [];
        setSelectedVisuals(savedSelectedVisuals);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los visuals o measurementTypes", error);
        setLoading(false);
      }
    };

    fetchVisualsAndMeasurementTypes();
  }, []);

  // Manejar el filtro global de búsqueda
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Función para manejar la acción de editar visual
  const onEditVisual = (visual) => {
    console.log("Editando visual con ID:", visual.id);
    navigate(`/EditServer/${visual.id}`); // Redirigir a la página de edición, pasando el ID
  };

  // Manejar la selección/desmarcado de un checkbox
  const onCheckboxChange = (e, visual) => {
    const selected = [...selectedVisuals];
    if (e.target.checked) {
      selected.push(visual); // Agregar a la lista de seleccionados
    } else {
      const index = selected.findIndex((s) => s.id === visual.id);
      if (index !== -1) {
        selected.splice(index, 1); // Eliminar de la lista de seleccionados
      }
    }
    setSelectedVisuals(selected); // Actualizar el estado con la lista seleccionada
  };

  // Manejar el "Seleccionar todos"
  const onSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedVisuals(visuals); // Seleccionar todos
    } else {
      setSelectedVisuals([]); // Desmarcar todos
    }
  };

  // Guardar los cambios en localStorage
  const saveChanges = () => {
    localStorage.setItem("selectedVisuals", JSON.stringify(selectedVisuals));
    alert("Cambios guardados!");
  };

  // Verificar si un visual está seleccionado
  const isSelected = (visual) => {
    return selectedVisuals.some((selected) => selected.id === visual.id);
  };

  // Mostrar el botón de "Guardar cambios" si hay al menos un cambio
  const renderCheckboxList = () => {
    return (
      <div
        className={`bg-black rounded-lg shadow-lg p-4 flex justify-center items-center mx-auto mt-6 w-48`} // Ajustar el ancho si es necesario
      >
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
              placeholder="Buscar visual"
              className="p-inputtext-sm p-shadow-2 rounded-lg w-full p-2 text-black"
              aria-label="Global search"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      <Navbar />
      <div className="card mt-28 mx-auto max-w-7xl shadow-xl p-6 rounded-lg bg-transparent">
        <DataTable
          value={visuals}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["serverName", "serverIp", "serverPort"]}
          loading={loading}
          header={renderHeader()}
          emptyMessage="No visuals found."
          responsiveLayout="scroll"
          className="text-white"
        >
          <Column
            header={
              <input
                type="checkbox"
                onChange={onSelectAllChange}
                checked={selectedVisuals.length === visuals.length}
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
            field="serverName"
            header="Nombre del visual"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="serverIp"
            header="IP Visual"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="serverPort"
            header="Puerto Visual"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="measurementTypes"
            header="Tipos de medición"
            style={{ minWidth: "12rem" }}
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
