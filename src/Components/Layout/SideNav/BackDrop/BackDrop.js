import React from "react";

export const BackDrop = ({ isOpen, openHandler }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={openHandler}
      aria-hidden="true"
    />
  );
};

