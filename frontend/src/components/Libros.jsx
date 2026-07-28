import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  
  // Estado para el modal de Crear/Editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null, titulo: '', autor: '', isbn: '', precio: '', fechaPublicacion: ''
  });

  // NUEVO: Estado para el modal de Eliminar
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

  // --- NUEVA LÓGICA DE ELIMINAR (MODAL PERSONALIZADO) ---
  const confirmarEliminacion = async () => {
    if (!libroAEliminar) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/libros/${libroAEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filtramos la lista y cerramos el modal
      setLibros(libros.filter(libro => libro.id !== libroAEliminar.id));
      setLibroAEliminar(null); // Esto cierra el modal
    } catch (err) {
      console.error("Error al eliminar:", err);
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
      console.error("Error al guardar libro:", err);
      alert("Hubo un error al guardar el libro.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📚 Gestión de Libros</h1>
          <div className="space-x-4">
            <button 
              onClick={() => {
                setFormData({ id: null, titulo: '', autor: '', isbn: '', precio: '', fechaPublicacion: '' });
                setMostrarModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
            >
              + Nuevo Libro
            </button>
            <button 
              onClick={cerrarSesion}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4">ID</th>
                <th className="p-4">Título</th>
                <th className="p-4">Autor</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Precio (CLP)</th>
                <th className="p-4">Publicación</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{libro.id}</td>
                  <td className="p-4 font-semibold text-gray-800">{libro.titulo}</td>
                  <td className="p-4 text-gray-600">{libro.autor}</td>
                  <td className="p-4 text-gray-500">{libro.isbn}</td>
                  <td className="p-4 text-green-600 font-bold">
                    ${libro.precio.toLocaleString('es-CL')}
                  </td>
                  <td className="p-4 text-gray-500">{libro.fechaPublicacion}</td>
                  <td className="p-4 text-center space-x-3">
                    <button 
                      onClick={() => abrirModalEditar(libro)}
                      className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    >
                      Editar
                    </button>
                    {/* Al hacer clic en eliminar, ahora solo guardamos qué libro queremos borrar para abrir el modal */}
                    <button 
                      onClick={() => setLibroAEliminar(libro)}
                      className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {libros.length === 0 && !error && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Aún no hay libros registrados. ¡Crea el primero!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA CREAR / EDITAR LIBRO (Ahora con fondo transparente y blur) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formData.id ? 'Editar Libro' : 'Agregar Nuevo Libro'}
            </h2>
            
            <form onSubmit={guardarLibro} className="space-y-4">
              {/* Campos del formulario... (se mantienen igual) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  type="text" required value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input 
                  type="text" required value={formData.autor}
                  onChange={(e) => setFormData({...formData, autor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input 
                    type="text" required value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input 
                    type="number" required min="0" step="0.01" value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Publicación</label>
                <input 
                  type="date" required value={formData.fechaPublicacion}
                  onChange={(e) => setFormData({...formData, fechaPublicacion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button 
                  type="button" onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NUEVO: MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {libroAEliminar && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            
            {/* Ícono de advertencia */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar libro?</h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar el libro <br/>
              <strong>"{libroAEliminar.titulo}"</strong>? <br/>
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setLibroAEliminar(null)} // Cierra el modal sin hacer nada
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors w-full"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion} // Llama al backend
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors shadow-md w-full"
              >
                Sí, eliminar
              </button>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}