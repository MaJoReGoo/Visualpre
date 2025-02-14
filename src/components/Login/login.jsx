import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  // Función para mostrar mensajes de éxito
  const showSuccess = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: message,
        life: 3000,
        className:
          "bg-green-600 text-white border-l-4 border-green-800 shadow-lg p-4 rounded-lg",
      });
    }
  };

  // Función para mostrar mensajes de error
  const showError = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
        className:
          "bg-red-600 text-white border-l-4 border-red-800 shadow-lg p-4 rounded-lg",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      // Aquí verificamos si la respuesta tiene el token
      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token); // Guardamos el token
        showSuccess("Inicio de sesión exitoso.");
        navigate("/inicio"); // Redirigimos al usuario a la página principal
      } else {
        showError("No se recibió un token válido.");
      }
    } catch (error) {
      console.error("Error durante el login:", error);

      if (error.response) {
        // Error del servidor (por ejemplo, 401, 500)
        showError(
          "Error en el inicio de sesión. " + error.response.data.message
        );
      } else {
        // Error de conexión o no respuesta
        showError("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white flex justify-center items-center">
      <div className="bg-black bg-opacity-60 p-8 rounded-lg w-full sm:w-96">
        <h2 className="text-white text-3xl text-center mb-6 font-semibold">
          Iniciar sesión
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-lg">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 mt-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-lg">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 mt-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
