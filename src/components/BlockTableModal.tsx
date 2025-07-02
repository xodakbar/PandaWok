// src/components/BlockTableModal.tsx
import React, { useState, useEffect } from 'react';

interface BlockTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (tableId: number, startTime: string, endTime: string, date: string) => void;
  tableId: number | null; // El ID de la mesa a bloquear
  currentSalonName: string; // Nombre del salón actual
  generateTimeOptions: () => string[]; // Función para generar las opciones de hora
}

const BlockTableModal: React.FC<BlockTableModalProps> = ({ isOpen, onClose, onBlock, tableId, currentSalonName, generateTimeOptions }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [blockDate, setBlockDate] = useState(''); // Estado para la fecha del bloqueo

  useEffect(() => {
    if (isOpen) {
      // Establecer la hora actual como predeterminada al abrir el modal
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const formattedCurrentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      setStartTime(formattedCurrentTime);
      
      // Establecer la hora de fin una hora después por defecto, si es posible
      const endHour = (currentHour + 1) % 24;
      const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      setEndTime(formattedEndTime);

      // Establecer la fecha actual como predeterminada
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setBlockDate(`${year}-${month}-${day}`); // Formato YYYY-MM-DD
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBlockConfirm = () => {
    if (tableId !== null && startTime && endTime && blockDate) {
      // Validación básica para que la hora de inicio no sea posterior a la de fin
      if (startTime >= endTime) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return;
      }
      onBlock(tableId, startTime, endTime, blockDate);
      onClose();
    } else {
      alert('Por favor, selecciona una mesa, una fecha y un rango de horas.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bloquear Mesa {tableId} en {currentSalonName}</h2>

        {/* Selector de fecha */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Bloqueo:</label>
          <input
            type="date"
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
          />
        </div>

        {/* Selector de hora de inicio */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Hora de inicio:</label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
          >
            {generateTimeOptions().map((time) => (
              <option key={`start-${time}`} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {/* Selector de hora de fin */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Hora de fin:</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
          >
            {generateTimeOptions().map((time) => (
              <option key={`end-${time}`} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleBlockConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Confirmar Bloqueo
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockTableModal;