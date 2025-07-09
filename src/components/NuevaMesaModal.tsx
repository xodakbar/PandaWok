import React, { useState } from 'react';

export interface NuevaMesaData {
  shape: 'round' | 'square' | 'rectangular';
  size: 'small' | 'medium' | 'large';
}

export interface NuevaMesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTable: (tableData: NuevaMesaData) => void;
}

const NuevaMesaModal: React.FC<NuevaMesaModalProps> = ({
  isOpen,
  onClose,
  onAddTable,
}) => {
  const [shape, setShape] = useState<NuevaMesaData['shape']>('round');
  const [size, setSize] = useState<NuevaMesaData['size']>('small');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTable({ shape, size });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agregar Nueva Mesa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Forma</label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as NuevaMesaData['shape'])}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="round">Redonda</option>
              <option value="square">Cuadrada</option>
              <option value="rectangular">Rectangular</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tamaño</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as NuevaMesaData['size'])}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="small">Pequeña</option>
              <option value="medium">Mediana</option>
              <option value="large">Grande</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Agregar Mesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaMesaModal;
