import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-6 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NASA Open API Conectada</span>
          <span className="text-slate-600">•</span>
          <span>APOD Explorer</span>
        </div>
        <div className="flex items-center space-x-2 text-center sm:text-right">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="text-slate-600">•</span>
          <a
            href="https://github.com/arcavcwb/react-apod-app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors underline-offset-4 hover:underline"
          >
            arcavcwb
          </a>
          <span className="text-slate-600">•</span>
          <span>NASA Astronomy Picture of the Day</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
