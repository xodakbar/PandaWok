import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

interface User {
  id: number | string;
  nombre_usuario: string;
  apellido_usuario?: string;
  correo_electronico: string;
  rol: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Simulación usuario logueado (reemplaza con tu lógica real, ej localStorage o context)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cargar usuario actual y usuarios
  useEffect(() => {
    // Ejemplo: obtener usuario actual de localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar usuarios');
    }
  };

  const handleOpenNewUserModal = () => setIsNewUserModalOpen(true);
  const handleCloseModal = () => {
    setIsNewUserModalOpen(false);
    setIsEditUserModalOpen(false);
    setEditingUser(null);
  };

  const handleEditClick = (userId: number | string) => {
    const userToEdit = users.find((u) => u.id === userId) || null;
    setEditingUser(userToEdit);
    setIsEditUserModalOpen(true);
  };

  // Crear usuario
  const handleNewUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const newUser = {
      nombre_usuario: (form.elements.namedItem('newUserName') as HTMLInputElement).value,
      apellido_usuario: (form.elements.namedItem('newUserLastName') as HTMLInputElement)?.value || '',
      correo_electronico: (form.elements.namedItem('newUserEmail') as HTMLInputElement).value,
      contrasena: (form.elements.namedItem('newUserPassword') as HTMLInputElement).value,
      rol: (form.elements.namedItem('newUserRole') as HTMLSelectElement).value.toLowerCase(),
    };

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }
      const data = await res.json();
      setUsers((prev) => [...prev, data.user]);
      alert('Usuario creado exitosamente');
      handleCloseModal();
      form.reset();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  // Editar usuario
  const handleEditUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const updatedUser = {
      nombre_usuario: (form.elements.namedItem('editUserName') as HTMLInputElement).value,
      apellido_usuario: (form.elements.namedItem('editUserLastName') as HTMLInputElement)?.value || '',
      correo_electronico: (form.elements.namedItem('editUserEmail') as HTMLInputElement).value,
      rol: (form.elements.namedItem('editUserRole') as HTMLSelectElement).value.toLowerCase(),
    };

    const userId = (form.elements.namedItem('editUserId') as HTMLInputElement).value;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }
      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
      alert('Usuario actualizado exitosamente');
      handleCloseModal();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id: number | string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert('Usuario eliminado correctamente');
    } catch (error: any) {
      alert(`Error eliminando usuario: ${error.message}`);
    }
  };

  return (
    <div className="font-sans p-5 bg-gray-50 text-gray-800">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-7xl mx-auto my-5">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Administrar Usuarios</h2>
          {currentUser?.rol === 'administrador' && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-base flex items-center gap-2 transition duration-300 ease-in-out"
              onClick={handleOpenNewUserModal}
            >
              Nuevo Usuario
            </button>
          )}
        </header>

        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No hay usuarios para mostrar.</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left bg-blue-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Nombre</th>
                  <th className="py-3 px-4 text-left bg-blue-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Apellido</th>
                  <th className="py-3 px-4 text-left bg-blue-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Correo Electrónico</th>
                  <th className="py-3 px-4 text-left bg-blue-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Rol</th>
                  {currentUser?.rol === 'administrador' && (
                    <th className="py-3 px-4 text-left bg-blue-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{user.nombre_usuario}</td>
                    <td className="py-3 px-4">{user.apellido_usuario}</td>
                    <td className="py-3 px-4">{user.correo_electronico}</td>
                    <td className="py-3 px-4">{user.rol}</td>
                    {currentUser?.rol === 'administrador' && (
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-lg p-1 transition duration-300 ease-in-out"
                          onClick={() => handleEditClick(user.id)}
                          title="Editar usuario"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 text-lg p-1 transition duration-300 ease-in-out"
                          onClick={() => eliminarUsuario(user.id)}
                          title="Eliminar usuario"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Nuevo Usuario */}
        {isNewUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-lg relative">
              <span
                className="absolute top-4 right-6 text-gray-400 text-3xl font-bold cursor-pointer hover:text-gray-700"
                onClick={handleCloseModal}
              >
                &times;
              </span>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Nuevo Usuario</h3>
              <form onSubmit={handleNewUserSubmit}>
                <div className="mb-4">
                  <label htmlFor="newUserName" className="block text-gray-700 text-sm font-medium mb-2">Nombre:</label>
                  <input type="text" id="newUserName" name="newUserName" required className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label htmlFor="newUserLastName" className="block text-gray-700 text-sm font-medium mb-2">Apellido:</label>
                  <input type="text" id="newUserLastName" name="newUserLastName" required className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label htmlFor="newUserEmail" className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico:</label>
                  <input type="email" id="newUserEmail" name="newUserEmail" required className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label htmlFor="newUserPassword" className="block text-gray-700 text-sm font-medium mb-2">Contraseña:</label>
                  <input type="password" id="newUserPassword" name="newUserPassword" required className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label htmlFor="newUserRole" className="block text-gray-700 text-sm font-medium mb-2">Rol:</label>
                  <select id="newUserRole" name="newUserRole" required defaultValue="anfitrion" className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="administrador">Administrador</option>
                    <option value="jefe">Jefe</option>
                    <option value="anfitrion">Anfitrión</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md w-full transition duration-300 ease-in-out">
                  Crear Usuario
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Usuario */}
        {isEditUserModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-lg relative">
              <span
                className="absolute top-4 right-6 text-gray-400 text-3xl font-bold cursor-pointer hover:text-gray-700"
                onClick={handleCloseModal}
              >
                &times;
              </span>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Editar Usuario</h3>
              <form onSubmit={handleEditUserSubmit}>
                <input type="hidden" id="editUserId" name="editUserId" value={editingUser.id} />
                <div className="mb-4">
                  <label htmlFor="editUserName" className="block text-gray-700 text-sm font-medium mb-2">Nombre:</label>
                  <input
                    type="text"
                    id="editUserName"
                    name="editUserName"
                    required
                    defaultValue={editingUser.nombre_usuario}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editUserLastName" className="block text-gray-700 text-sm font-medium mb-2">Apellido:</label>
                  <input
                    type="text"
                    id="editUserLastName"
                    name="editUserLastName"
                    required
                    defaultValue={editingUser.apellido_usuario}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editUserEmail" className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico:</label>
                  <input
                    type="email"
                    id="editUserEmail"
                    name="editUserEmail"
                    required
                    defaultValue={editingUser.correo_electronico}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editUserRole" className="block text-gray-700 text-sm font-medium mb-2">Rol:</label>
                  <select
                    id="editUserRole"
                    name="editUserRole"
                    required
                    defaultValue={editingUser.rol}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="jefe">Jefe</option>
                    <option value="anfitrion">Anfitrión</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md w-full transition duration-300 ease-in-out">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
