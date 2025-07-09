import React, { useState } from 'react';
import axios from 'axios';

interface WalkInModalProps {
  mesaId: number;
  mesaNumero: string | number;
  fechaSeleccionada: string;
  onClose: () => void;
  onReservaCreada: (reserva: any) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WalkInModal: React.FC<WalkInModalProps> = ({
  mesaId,
  mesaNumero,
  fechaSeleccionada,
  onClose,
  onReservaCreada,
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  const cantidades = Array.from({ length: 25 }, (_, i) => i + 1);

  const handleSubmit = async () => {
    if (cantidad <= 0 || !mesaId || !fechaSeleccionada) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/reservas/walk-in`, {
        mesa_id: mesaId,
        fecha_reserva: fechaSeleccionada,
        cantidad_personas: cantidad,
        notas: notas.trim(),
      });

      onReservaCreada(res.data.reserva);
      onClose();
    } catch (err) {
      console.error('Error creando walk-in:', err);
      alert('Ocurrió un error al crear la reserva walk-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#FDF6E3] rounded-lg shadow-lg w-80 p-6 relative text-gray-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Sentar Walk-in</h2>
        <p className="mb-2 font-semibold">Mesa: {mesaNumero}</p>

        <label className="block mb-1 font-semibold">Cantidad de comensales</label>
        <div className="max-h-48 overflow-y-auto mb-4 border rounded bg-white">
          {cantidades.map((num) => (
            <button
              key={num}
              onClick={() => setCantidad(num)}
              className={`w-full py-2 text-center text-gray-900 font-bold border-b last:border-none ${
                cantidad === num ? 'bg-orange-500 text-white' : 'hover:bg-orange-100'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <label htmlFor="notas" className="block mb-1 font-semibold">
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full h-20 rounded border border-gray-300 p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Agregar notas..."
        />

        <button
          disabled={loading || cantidad <= 0}
          onClick={handleSubmit}
          className={`w-full py-3 rounded font-semibold ${
            cantidad > 0
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
        >
          {loading ? 'Creando...' : 'Sentar Walk-in'}
        </button>
      </div>
    </div>
  );
};

export default WalkInModal;
