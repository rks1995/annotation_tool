import Canvas from './components/Canvas';

function App() {
  return (
    <div
      style={{ height: '100vh', width: '100vw', marginTop: '1rem' }}
      id="iframeHolder"
    >
      <Canvas />
    </div>
  );
}

export default App;
