import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  User,
  Calendar,
  Users,
  StickyNote,
  Phone,
  Mail,
  X,
  Edit,
  Trash,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  correo_electronico?: string;
  telefono?: string;
}

interface Reserva {
  id: number;
  cliente_id: number | null;
  mesa_id: number;
  fecha_reserva: string;
  cantidad_personas: number;
  notas?: string;
  horario_id?: number;
  horario_descripcion?: string;
  cliente?: Cliente;
  mesa_numero?: string;
}

interface Props {
  reservaId: number;
  onClose: () => void;
  onReservaActualizada?: () => void;
}

const ReservationDetailsPanel: React.FC<Props> = ({
  reservaId,
  onClose,
  onReservaActualizada,
}) => {
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_electronico: '',
    telefono: '',
    fecha_reserva: '',
    cantidad_personas: 1,
    notas: '',
  });

  const toDateInputValue = (isoString: string | undefined) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  useEffect(() => {
    if (!reservaId || reservaId <= 0) {
      setError('ID de reserva inválido');
      setLoading(false);
      return;
    }

    const fetchReserva = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/reservas/${reservaId}`);
        const data = res.data.reserva || res.data;

        setReserva(data);
        setFormData({
          nombre: data.cliente?.nombre || '',
          apellido: data.cliente?.apellido || '',
          correo_electronico: data.cliente?.correo_electronico || '',
          telefono: data.cliente?.telefono || '',
          fecha_reserva: toDateInputValue(data.fecha_reserva),
          cantidad_personas: data.cantidad_personas || 1,
          notas: data.notas || '',
        });
        setError(null);
      } catch (err) {
        setError('No se pudo cargar la reserva.');
        console.error('Error fetching reserva:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [reservaId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Actualiza datos de reserva
      await axios.put(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        fecha_reserva: formData.fecha_reserva,
        cantidad_personas: formData.cantidad_personas,
        notas: formData.notas,
      });

      if (!reserva?.cliente_id) {
        alert('No se pudo actualizar el cliente: cliente_id no válido.');
        return;
      }

      // Actualiza datos de cliente
      await axios.put(`${API_BASE_URL}/api/clientes/${reserva.cliente_id}`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo_electronico: formData.correo_electronico,
        telefono: formData.telefono,
      });

      alert('Reserva y cliente actualizados correctamente');
      setIsEditing(false);

      if (onReservaActualizada) onReservaActualizada();
      onClose();
    } catch (err) {
      console.error('Error actualizando reserva o cliente:', err);
      alert('Error actualizando reserva o cliente');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro que deseas eliminar esta reserva?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/reservas/${reservaId}`);
      alert('Reserva eliminada');

      if (onReservaActualizada) onReservaActualizada();
      onClose();
    } catch (err) {
      console.error('Error al eliminar reserva:', err);
      alert('Error al eliminar reserva');
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 right-0 w-[400px] h-full bg-white p-6 shadow-lg border-l z-50">
        <p className="text-gray-600">Cargando reserva...</p>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="fixed top-0 right-0 w-[400px] h-full bg-white p-6 shadow-lg border-l z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-red-600">Error</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
            <X />
          </button>
        </div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[400px] h-full bg-white p-6 border-l border-gray-300 shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">🧾 Detalle de Reserva</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
          <X />
        </button>
      </div>

      <div className="space-y-4 text-sm text-gray-800 flex-1 overflow-y-auto">
        {/* Nombre */}
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-orange-600" />
          {isEditing ? (
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Nombre"
            />
          ) : (
            <p>
              <strong>Cliente:</strong> {formData.nombre} {formData.apellido}
            </p>
          )}
        </div>

        {/* Apellido */}
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-orange-600" />
          {isEditing ? (
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Apellido"
            />
          ) : null}
        </div>

        {/* Teléfono */}
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-600" />
          {isEditing ? (
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Teléfono"
            />
          ) : (
            formData.telefono && <p>{formData.telefono}</p>
          )}
        </div>

        {/* Correo */}
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          {isEditing ? (
            <input
              type="email"
              value={formData.correo_electronico}
              onChange={(e) => handleChange('correo_electronico', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Correo electrónico"
            />
          ) : (
            formData.correo_electronico && <p>{formData.correo_electronico}</p>
          )}
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          {isEditing ? (
            <input
              type="date"
              value={formData.fecha_reserva}
              onChange={(e) => handleChange('fecha_reserva', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <p>{formData.fecha_reserva}</p>
          )}
        </div>

        {/* Cantidad personas */}
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-pink-600" />
          {isEditing ? (
            <input
              type="number"
              min={1}
              value={formData.cantidad_personas}
              onChange={(e) => handleChange('cantidad_personas', Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-20"
            />
          ) : (
            <p>{formData.cantidad_personas}</p>
          )}
        </div>

        {/* Notas */}
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-gray-600" />
          {isEditing ? (
            <textarea
              value={formData.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              rows={3}
              placeholder="Notas"
            />
          ) : (
            formData.notas && <p className="italic text-gray-700">{formData.notas}</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t mt-6 space-y-2">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" />
              Editar Reserva
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <Trash className="w-4 h-4" />
              Eliminar Reserva
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 w-full py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ReservationDetailsPanel;
