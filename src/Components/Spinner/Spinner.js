import React from "react";

export const Spinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div
      role="status"
      aria-label="Cargando contenido"
      className="flex items-center justify-center min-h-[50vh] w-full"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin"></div>
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

