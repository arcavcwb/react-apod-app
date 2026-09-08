import React from "react";

export const AstroFrame: React.FC<{ dataUrl?: string }> = ({ dataUrl }) => {
  return (
    <iframe
      className="rounded-3xl my-2"
      title="space-video"
      src={dataUrl}
      allow="autoplay"
      allowFullScreen
    />
  );
};
