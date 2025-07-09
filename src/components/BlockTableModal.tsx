import React, { useState, useEffect } from 'react';

interface BlockTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (tableId: number, startTime: string, endTime: string, date: string) => void;
  tableId: number | null;
  currentSalonName: string;
  generateTimeOptions: () => string[];
  fechaSeleccionada?: string; // <- Aquí agregas esta prop
}


const BlockTableModal: React.FC<BlockTableModalProps> = ({
  isOpen,
  onClose,
  onBlock,
  tableId,
  currentSalonName,
  generateTimeOptions,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [blockDate, setBlockDate] = useState('');

  // Función para redondear minutos al múltiplo de 30 más cercano
  const roundMinutes = (date: Date) => {
    const minutes = date.getMinutes();
    return minutes < 30 ? 0 : 30;
  };

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      now.setMinutes(roundMinutes(now));
      now.setSeconds(0);
      now.setMilliseconds(0);

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const formattedStartTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

      // Calcula hora fin sumando 30 minutos
      let endDate = new Date(now.getTime() + 30 * 60000);
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
      setBlockDate(formattedDate);
    } else {
      // Resetea valores al cerrar modal
      setStartTime('');
      setEndTime('');
      setBlockDate('');
    }
  }, [isOpen]);

  const handleBlockConfirm = () => {
    if (tableId === null) {
      alert('Mesa no seleccionada');
      return;
    }
    if (!startTime || !endTime || !blockDate) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const today = new Date();
    const selectedDate = new Date(blockDate);
    // Comparar fechas sin horas
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('La fecha no puede ser anterior a hoy.');
      return;
    }

    if (startTime >= endTime) {
      alert('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }
    onBlock(tableId, startTime, endTime, blockDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blockTableModalTitle"
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h2 id="blockTableModalTitle" className="text-xl font-bold mb-4 text-gray-800">
          Bloquear Mesa {tableId} en {currentSalonName}
        </h2>

        {/* Fecha */}
        <div className="mb-4">
          <label htmlFor="blockDate" className="block font-semibold text-sm text-gray-700 mb-1">
            Fecha:
          </label>
          <input
            id="blockDate"
            type="date"
            value={blockDate}
            min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
            onChange={(e) => setBlockDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Hora inicio */}
        <div className="mb-4">
          <label htmlFor="startTime" className="block font-semibold text-sm text-gray-700 mb-1">
            Hora de inicio:
          </label>
          <select
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {generateTimeOptions().map((time) => (
              <option key={`start-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Hora fin */}
        <div className="mb-6">
          <label htmlFor="endTime" className="block font-semibold text-sm text-gray-700 mb-1">
            Hora de fin:
          </label>
          <select
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {generateTimeOptions().map((time) => (
              <option key={`end-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleBlockConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            type="button"
          >
            Confirmar Bloqueo
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockTableModal;
