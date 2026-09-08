import React from "react";

export const Error = ({ error, onClick }) => {

  return (
    <div className="h-screen flex flex-co " onClick={onClick}>
      <div className="w-11/12 h-32 cursor-pointer m-auto bg-[#010f24] rounded-xl shadow-md shadow-white">
        {error && (
          <div className="flex h-full text-white items-center justify-center">
            <p>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
