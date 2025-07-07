import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number | string;
  nombre_usuario: string;
  apellido_usuario: string;
  correo_electronico: string;
  rol: string;
}

const AdminUsersPage: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    nombre_usuario: '',
    apellido_usuario: '',
    correo_electronico: '',
    contrasena: '',
    rol: 'anfitrion',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<User[]>(`${API_BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function openCreateModal() {
    setFormData({ nombre_usuario: '', apellido_usuario: '', correo_electronico: '', contrasena: '', rol: 'anfitrion' });
    setShowCreateModal(true);
  }
  function closeModals() {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingUser(null);
    setError(null);
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.nombre_usuario || !formData.apellido_usuario || !formData.correo_electronico || !formData.contrasena || !formData.rol) {
      alert('Completa todos los campos');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users`, formData);
      setUsers([...users, res.data.user]);
      alert('Usuario creado');
      closeModals();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Error al crear usuario');
    }
  }

  function openEditModal(user: User) {
    setEditingUser(user);
    setFormData({
      nombre_usuario: user.nombre_usuario,
      apellido_usuario: user.apellido_usuario,
      correo_electronico: user.correo_electronico,
      contrasena: '', // no se edita aquí
      rol: user.rol,
    });
    setShowEditModal(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    const { nombre_usuario, apellido_usuario, correo_electronico, rol } = formData;
    if (!nombre_usuario || !apellido_usuario || !correo_electronico || !rol) {
      alert('Completa todos los campos');
      return;
    }
    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/${editingUser.id}`, {
        nombre_usuario,
        apellido_usuario,
        correo_electronico,
        rol,
      });
      setUsers(users.map(u => (u.id === editingUser.id ? res.data.user : u)));
      alert('Usuario actualizado');
      closeModals();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Error al actualizar usuario');
    }
  }

  async function handleDelete(userId: number | string) {
    if (!confirm('¿Seguro quieres eliminar este usuario?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      alert('Usuario eliminado');
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Error al eliminar usuario');
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Administrar Usuarios</h1>

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={openCreateModal}
      >
        Nuevo Usuario
      </button>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Apellido</th>
              <th className="border border-gray-300 p-2">Correo Electrónico</th>
              <th className="border border-gray-300 p-2">Rol</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.nombre_usuario}</td>
                <td className="border border-gray-300 p-2">{user.apellido_usuario}</td>
                <td className="border border-gray-300 p-2">{user.correo_electronico}</td>
                <td className="border border-gray-300 p-2 capitalize">{user.rol}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold hover:text-gray-600"
              onClick={closeModals}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="apellido_usuario"
                placeholder="Apellido"
                value={formData.apellido_usuario}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                name="correo_electronico"
                placeholder="Correo Electrónico"
                value={formData.correo_electronico}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="administrador">Administrador</option>
                <option value="jefe">Jefe</option>
                <option value="anfitrion">Anfitrión</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                Crear
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold hover:text-gray-600"
              onClick={closeModals}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="apellido_usuario"
                placeholder="Apellido"
                value={formData.apellido_usuario}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                name="correo_electronico"
                placeholder="Correo Electrónico"
                value={formData.correo_electronico}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              {/* No se edita contraseña aquí */}
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="administrador">Administrador</option>
                <option value="jefe">Jefe</option>
                <option value="anfitrion">Anfitrión</option>
              </select>
              <button type="submit" className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
