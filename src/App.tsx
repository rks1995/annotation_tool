import { useState } from 'react';
import Canvas from './components/Canvas';
// import { Canvas1 } from './components/Test';

function App() {
  return (
    <div
      style={{ height: '100vh', width: '100vw', marginTop: '1rem' }}
      id="iframeHolder"
    >
      <Canvas />
      {/* <Canvas1 /> */}
    </div>
  );
}

export default App;
