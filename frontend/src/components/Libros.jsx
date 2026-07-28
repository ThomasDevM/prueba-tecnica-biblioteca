import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null, titulo: '', autor: '', isbn: '', precio: '', fechaPublicacion: ''
  });
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerLibros = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const respuesta = await axios.get('http://localhost:8080/api/libros', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLibros(respuesta.data);
      } catch (err) {
        setError('Tu sesión podría haber expirado.');
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    obtenerLibros();
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const confirmarEliminacion = async () => {
    if (!libroAEliminar) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/libros/${libroAEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLibros(libros.filter(libro => libro.id !== libroAEliminar.id));
      setLibroAEliminar(null);
    } catch (err) {
      alert("No se pudo eliminar el libro.");
    }
  };

  const abrirModalEditar = (libro) => {
    setFormData(libro);
    setMostrarModal(true);
  };

  const guardarLibro = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (formData.id) {
        const respuesta = await axios.put(`http://localhost:8080/api/libros/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLibros(libros.map(l => l.id === formData.id ? respuesta.data : l));
      } else {
        const respuesta = await axios.post('http://localhost:8080/api/libros', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLibros([...libros, respuesta.data]);
      }
      setFormData({ id: null, titulo: '', autor: '', isbn: '', precio: '', fechaPublicacion: '' });
      setMostrarModal(false);
    } catch (err) {
      alert("Hubo un error al guardar el libro.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">📚 Gestión de Libros</h1>
          <div className="flex w-full sm:w-auto gap-2">
            <button 
              onClick={() => {
                setFormData({ id: null, titulo: '', autor: '', isbn: '', precio: '', fechaPublicacion: '' });
                setMostrarModal(true);
              }}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
            >
              + Nuevo
            </button>
            <button 
              onClick={cerrarSesion}
              className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
            >
              Salir
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4 hidden md:table-cell">ID</th>
                  <th className="p-4">Título</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4 hidden md:table-cell">ISBN</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4 hidden sm:table-cell">Publicación</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {libros.map((libro) => (
                  <tr key={libro.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-500 hidden md:table-cell">{libro.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{libro.titulo}</td>
                    <td className="p-4 text-gray-600">{libro.autor}</td>
                    <td className="p-4 text-gray-500 hidden md:table-cell">{libro.isbn}</td>
                    <td className="p-4 text-green-600 font-bold">
                      ${libro.precio.toLocaleString('es-CL')}
                    </td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">{libro.fechaPublicacion}</td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <button onClick={() => abrirModalEditar(libro)} className="text-blue-500 hover:text-blue-700 font-medium">Editar</button>
                      <button onClick={() => setLibroAEliminar(libro)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{formData.id ? 'Editar Libro' : 'Nuevo Libro'}</h2>
            <form onSubmit={guardarLibro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" required value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <input type="text" required value={formData.autor} onChange={(e) => setFormData({...formData, autor: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ISBN</label>
                  <input type="text" required value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input type="number" required min="0" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                <input type="date" required value={formData.fechaPublicacion} onChange={(e) => setFormData({...formData, fechaPublicacion: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setMostrarModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {libroAEliminar && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">¿Eliminar libro?</h3>
            <p className="text-gray-500 mb-6">¿Estás seguro de eliminar <strong>"{libroAEliminar.titulo}"</strong>?</p>
            <div className="flex justify-center space-x-3">
              <button onClick={() => setLibroAEliminar(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg w-full">Cancelar</button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg w-full">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}