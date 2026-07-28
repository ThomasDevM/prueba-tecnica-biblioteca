import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Libros from './components/Libros'; // Importamos el nuevo componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Aquí conectamos la ruta con el componente real */}
        <Route path="/libros" element={<Libros />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;