// src/components/ReservationDetailsPanel.tsx
import React from 'react';

interface Reservation {
  id: number;
  cliente_id: number;
  mesa_id: number;
  fecha_reserva: string;
  cantidad_personas: number;
  notas?: string;
  nombre?: string;
  apellido?: string;
  correo_electronico?: string;
  telefono?: string;
}

interface ReservationDetailsPanelProps {
  reserva: Reservation;
  onClose: () => void;
}

const ReservationDetailsPanel: React.FC<ReservationDetailsPanelProps> = ({ reserva, onClose }) => {
  return (
    <div className="bg-white p-4 border-r border-gray-300 h-full w-80 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-orange-600">Reserva mesa #{reserva.mesa_id}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition text-sm"
        >
          Cerrar
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-800">
        <p><strong>Cliente:</strong> {reserva.nombre} {reserva.apellido}</p>
        <p><strong>Correo:</strong> {reserva.correo_electronico}</p>
        <p><strong>Teléfono:</strong> {reserva.telefono}</p>
        <p><strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString()}</p>
        <p><strong>Personas:</strong> {reserva.cantidad_personas}</p>
        {reserva.notas && <p><strong>Notas:</strong> {reserva.notas}</p>}
      </div>
    </div>
  );
};

export default ReservationDetailsPanel;
