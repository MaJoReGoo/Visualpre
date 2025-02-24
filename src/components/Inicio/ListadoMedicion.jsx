import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa"; // Importamos el ícono de lápiz
import "./ListadoMediciones.css";
import Navbar from "./Navbar";

export const ListarMediciones = () => {
  const [mediciones, setMediciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMediciones = async () => {
      setLoading(true);
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

        if (response.data) {
          setMediciones(response.data);
        }
      } catch (error) {
        console.error("Error al obtener las mediciones", error);
        alert("Hubo un error al obtener las mediciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediciones();
  }, [navigate]);

  const handleEditClick = (medicion) => {
    setEditingMeasurement(medicion);
    setUpdatedName(medicion.name);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (!updatedName.trim()) {
      alert("Por favor, ingresa un nombre para la medición.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        navigate("/login");
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/measurement-types/${
          editingMeasurement.id
        }`,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("¡Medición actualizada con éxito!");
      setEditingMeasurement(null);
      setUpdatedName("");
      setShowModal(false);

      const newMediciones = await axios.get(
        `${import.meta.env.VITE_API_URL}/measurement-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMediciones(newMediciones.data);
    } catch (error) {
      console.error(
        "Error al actualizar la medición",
        error.response ? error.response.data : error
      );
      alert("Hubo un error al actualizar la medición.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/Parametrizacion");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black from-black to-blue-900 text-white">
      {/* Ensure the Navbar has the same background as the rest of the page */}
      <Navbar />

      <div className="flex flex-col items-center justify-center p-24">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Lista de Mediciones
          </h2>

          <div className="card p-4 bg-transparent shadow-xl rounded-xl">
            {loading ? (
              <div className="text-center text-lg">Cargando mediciones...</div>
            ) : (
              <div>
                <ul>
                  {mediciones && mediciones.length > 0 ? (
                    mediciones.map((medicion) => (
                      <li
                        key={medicion.id}
                        className="mb-4 border-b border-gray-600 pb-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{medicion.name}</span>
                          <Button
                            icon={<FaEdit />}
                            className="p-button-sm text-white transition duration-200 rounded"
                            onClick={() => handleEditClick(medicion)}
                          />
                        </div>
                      </li>
                    ))
                  ) : (
                    <div>No se encontraron mediciones.</div>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal de edición */}
        <Dialog
          visible={showModal}
          style={{ width: "400px" }}
          onHide={() => setShowModal(false)}
          className="bg-black text-white rounded-xl shadow-lg p-4"
        >
          <div>
            <label
              htmlFor="updatedName"
              className="block text-lg font-semibold"
            >
              Editar nombre medición
            </label>
            <InputText
              id="updatedName"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="w-full p-3 mt-2 text-white bg-black border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nuevo nombre de la medición"
              autoComplete="off" // Agrega esta línea
            />
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <Button
              label={loading ? "Guardando..." : "Guardar Cambios"}
              className="p-button-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg p-2 m-4"
              onClick={handleSaveEdit}
              disabled={loading}
            />
            <Button
              label="Cancelar"
              className="p-button-lg text-white bg-gray-600 hover:bg-gray-700 transition duration-200 rounded-lg p-2 m-4"
              onClick={() => setShowModal(false)}
            />
          </div>
        </Dialog>

        {/* Botón de regresar centrado */}
        <div className="mt-6 text-center">
          <Button
            label="Regresar"
            className="p-button-lg text-white bg-gray-600 hover:bg-gray-700 transition duration-200 rounded-lg p-2"
            onClick={handleGoBack}
          />
        </div>
      </div>
    </div>
  );
};
