import React from "react";
import { BiGitBranch, BiRadar } from "react-icons/bi";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl py-6 mt-auto transition-colors z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-slate-300 font-semibold uppercase tracking-wider">TELESCOPIO VIRTUAL ACTIVO</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">NASA OPEN API // EDGE NODE</span>
        </div>
        <div className="flex items-center space-x-2 text-center sm:text-right">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="text-slate-600">|</span>
          <a
            href="https://github.com/arcavcwb/react-apod-app"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            <BiGitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span className="underline-offset-4 hover:underline">arcavcwb</span>
          </a>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-500 hidden md:inline">DEEP-SPACE SCIENTIFIC EXPLORER</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
