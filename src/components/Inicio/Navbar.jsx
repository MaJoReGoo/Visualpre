import React from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { FaSearchengin } from "react-icons/fa";
import logo from "../../assets/Visualpre.png";
import { NavLink } from "react-router-dom"; // Importar NavLink

export default function Navbar() {
  // Items del Menubar
  const items = [
    {
      label: "Visuales",
      icon: "pi pi-home",
      className: "text-white m-2",
      to: "/Inicio", // Ruta de navegación
    },
    {
      label: "Parametrización",
      icon: "pi pi-star",
      className: "text-white m-2",
      to: "/Parametrizacion", // Ruta de navegación
    },
  ];

  // Contenido a la izquierda (start) y derecha (end) del Menubar
  const start = (
    <img
      alt="logo"
      src={logo}
      height="16" // Imagen más pequeña
      className="m-4 w-10 mr-6" // Agregamos margen derecho para separarlo de los otros elementos
    />
  );

  const end = (
    <div className="flex items-center gap-2">
      {" "}
      {/* Reducir espacio entre los elementos */}
      <FaSearchengin className="w-5 h-6" />
      <InputText
        placeholder="Buscar"
        type="text"
        className="m-2 p-1 w-8rem sm:w-auto border-rounded rounded-full mr-2 px-2 bg-white" // Márgenes ajustados
      />
    </div>
  );

  // Modificación: Usamos una versión simple donde envuelves los items con NavLink
  const model = items.map((item) => ({
    ...item,
    template: (
      <NavLink
        to={item.to}
        className="flex align-items-center p-menuitem-link text-white"
      >
        <span className={item.icon}></span>
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && (
          <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
            {item.shortcut}
          </span>
        )}
      </NavLink>
    ),
  }));

  return (
    < >
      {/* Contenedor del Menubar con posición fija */}
      
        <Menubar model={model} start={start} end={end} className="text-white" />
      
    </>
  );
}
