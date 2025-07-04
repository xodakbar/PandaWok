// src/components/RequestSidebar.tsx
import React from 'react';

// Si tus solicitudes de reserva tienen un tipo definido, lo pondrías aquí.
// Por ejemplo:
interface ReservationRequest {
  id: string;
  clientName: string;
  date: string;
  time: string;
  guests: number;
  // ... otras propiedades de la solicitud
}

interface RequestSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // Podrías pasar las solicitudes de reserva aquí si las gestionas en el padre
  // requests: ReservationRequest[];
  // onUpdateRequestStatus: (requestId: string, status: 'confirmed' | 'rejected') => void;
}

const RequestSidebar: React.FC<RequestSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full md:w-96 bg-[#212133] h-full shadow-lg p-6 flex flex-col">
        {/* Header del sidebar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Solicitudes de Reserva</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Cerrar solicitudes de reserva">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido de las solicitudes */}
        <div className="flex-1 overflow-y-auto text-white">
          <p className="text-gray-400 text-center mt-8">
            Aquí se mostrarían las solicitudes de reserva pendientes.
          </p>
          {/* Aquí iría la lógica para listar y gestionar las solicitudes */}
          {/* Ejemplo de una solicitud (descomentar y adaptar): */}
          {/*
          <div className="bg-[#33334F] p-3 rounded-md mb-3">
            <p className="text-lg font-medium">Cliente: Juan Pérez</p>
            <p>Fecha: 5 Jul, 2025</p>
            <p>Hora: 20:00</p>
            <p>Personas: 4</p>
            <div className="mt-2 flex justify-end space-x-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Aceptar</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Rechazar</button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default RequestSidebar;