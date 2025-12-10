import React from 'react';

interface OverlayProps {
  isAssembled: boolean;
  onToggleAssemble: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isAssembled, onToggleAssemble }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 md:p-12">
      {/* Header */}
      <header className="flex flex-col items-center md:items-start animate-fade-in-down">
        <h1 className="text-4xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-arix-goldLight to-arix-gold drop-shadow-lg tracking-widest uppercase">
          Arix
        </h1>
        <h2 className="text-xl md:text-2xl font-serif italic text-white/80 tracking-wide mt-2">
          Signature Collection
        </h2>
      </header>

      {/* Center Status */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-all duration-1000">
        <p className={`font-display text-xs tracking-[0.5em] text-arix-gold/50 transition-opacity duration-1000 ${isAssembled ? 'opacity-0' : 'opacity-100'}`}>
          AWAITING ASSEMBLY
        </p>
      </div>

      {/* Footer Controls */}
      <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
        <div className="text-center md:text-left">
          <p className="text-arix-goldLight/90 font-serif text-lg">The Golden Holiday</p>
          <p className="text-white/50 text-xs font-sans tracking-wider uppercase">Interactive 3D Experience</p>
        </div>

        <button
          onClick={onToggleAssemble}
          className="group relative px-10 py-4 bg-arix-emeraldDark/80 backdrop-blur-md border border-arix-gold/30 rounded-none transition-all duration-500 hover:border-arix-gold hover:bg-arix-emeraldDark hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <span className="relative z-10 font-display text-sm tracking-[0.2em] text-arix-gold group-hover:text-white transition-colors duration-300 uppercase">
            {isAssembled ? 'Scatter Elements' : 'Assemble Tree'}
          </span>
          {/* Button Fill Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arix-gold/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </button>
      </footer>
    </div>
  );
};

export default Overlay;