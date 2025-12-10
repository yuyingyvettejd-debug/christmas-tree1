import React, { useState } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [isAssembled, setIsAssembled] = useState<boolean>(false);
  // We can keep rotation as a subtle effect that is always on, or controlled separately.
  // For now, let's keep it simple: auto-rotate when assembled looks nice.
  
  const toggleAssemble = () => setIsAssembled(prev => !prev);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Overlay isAssembled={isAssembled} onToggleAssemble={toggleAssemble} />
      <Scene isAssembled={isAssembled} />
    </div>
  );
};

export default App;