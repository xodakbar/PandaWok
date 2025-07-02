// src/components/WalkInModal.tsx
import React, { useState, useEffect } from 'react';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmWalkIn: (tableId: number, guestName: string, partySize: number, notes: string) => void;
  tableId: number | null;
  tableCurrentSize: string | undefined; // Para sugerir tamaño de grupo inicial
}

const WalkInModal: React.FC<WalkInModalProps> = ({ isOpen, onClose, onConfirmWalkIn, tableId, tableCurrentSize }) => {
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState<number>(1);
  const [notes, setNotes] = useState('');

  // Opciones de tamaño de comensales
  const partySizeOptions = Array.from({ length: 8 }, (_, i) => i + 1); // 1 a 8 invitados

  // Efecto para restablecer los estados cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setGuestName('');
      setNotes('');
      // Sugerir un tamaño de grupo basado en el tamaño de la mesa
      let defaultPartySize = 1;
      if (tableCurrentSize === 'small') defaultPartySize = 2;
      else if (tableCurrentSize === 'medium') defaultPartySize = 4;
      else if (tableCurrentSize === 'large') defaultPartySize = 6;
      setPartySize(defaultPartySize);
    }
  }, [isOpen, tableCurrentSize]);

  if (!isOpen || tableId === null) return null;

  const handleConfirm = () => {
    if (partySize < 1) {
      alert('La cantidad de comensales debe ser al menos 1.');
      return;
    }
    onConfirmWalkIn(tableId, guestName, partySize, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Sentar Walk-in</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-700 text-lg font-medium mb-4">Mesa: {tableId}</p>

        {/* Input Comensal (Nombre) */}
        <div className="mb-4">
          <label htmlFor="guestName" className="block text-gray-700 text-sm font-semibold mb-2">Comensal (Opcional):</label>
          <div className="relative">
            <input
              type="text"
              id="guestName"
              placeholder="Nombre del comensal"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Cantidad de comensales */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Cantidad de comensales:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {partySizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setPartySize(size)}
                className={`py-3 px-4 rounded-md font-medium transition-colors ${
                  partySize === size
                    ? 'bg-blue-500 text-white' // Cambiado a blue-500 para diferenciar de naranja de reserva
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {size} {size === 1 ? 'Invitado' : 'Invitados'}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="mb-6">
          <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2">Notas (Opcional):</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
            placeholder="Añadir notas sobre el walk-in..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Sentar Walk-in
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkInModal;