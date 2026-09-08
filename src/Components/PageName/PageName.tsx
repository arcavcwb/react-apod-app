import React from "react";

export const PageName = ({ children }) => {
  return (
    <h1 className="text-4xl text-neutral-100 text-center font-bold">
      {children}
    </h1>
  );
};
