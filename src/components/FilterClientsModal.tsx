// src/components/FilterClientsModal.tsx
import React, { useState, useEffect } from 'react';

// Definimos una interfaz para las opciones de filtro.
// Esto es muy útil para que TypeScript nos ayude.
export interface ClientFilters {
  minVisits?: number;
  maxVisits?: number;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  selectedTags: string[]; // Para un futuro filtro por tags
}

interface FilterClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onApplyFilters recibirá las opciones de filtro cuando el usuario confirme
  onApplyFilters: (filters: ClientFilters) => void;
  // currentFilters para pre-rellenar el modal si ya hay filtros aplicados
  currentFilters: ClientFilters;
}

const FilterClientsModal: React.FC<FilterClientsModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  // Estados locales para los filtros dentro del modal
  // Usamos string para los inputs y convertimos a number al aplicar
  const [minVisits, setMinVisits] = useState<string>(currentFilters.minVisits?.toString() || '');
  const [maxVisits, setMaxVisits] = useState<string>(currentFilters.maxVisits?.toString() || '');
  const [minTotalSpent, setMinTotalSpent] = useState<string>(currentFilters.minTotalSpent?.toString() || '');
  const [maxTotalSpent, setMaxTotalSpent] = useState<string>(currentFilters.maxTotalSpent?.toString() || '');
  // Los tags los manejaremos más adelante, por ahora lo dejamos vacío.
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.selectedTags || []);

  // Usamos useEffect para actualizar los estados internos del modal
  // cuando las 'currentFilters' cambian desde el componente padre.
  // Esto asegura que el modal se pre-rellene con los filtros ya aplicados
  useEffect(() => {
    setMinVisits(currentFilters.minVisits?.toString() || '');
    setMaxVisits(currentFilters.maxVisits?.toString() || '');
    setMinTotalSpent(currentFilters.minTotalSpent?.toString() || '');
    setMaxTotalSpent(currentFilters.maxTotalSpent?.toString() || '');
    setSelectedTags(currentFilters.selectedTags || []);
  }, [currentFilters]); // Dependencia del efecto: currentFilters

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  const handleApply = () => {
    // Construimos el objeto de filtros a pasar al componente padre
    const filtersToApply: ClientFilters = {
      minVisits: minVisits ? Number(minVisits) : undefined, // Convertimos a número o undefined si está vacío
      maxVisits: maxVisits ? Number(maxVisits) : undefined,
      minTotalSpent: minTotalSpent ? Number(minTotalSpent) : undefined,
      maxTotalSpent: maxTotalSpent ? Number(maxTotalSpent) : undefined,
      selectedTags: selectedTags, // Por ahora, pasamos los tags tal cual
    };
    onApplyFilters(filtersToApply); // Llamamos a la función del padre con los filtros
    onClose(); // Cierra el modal después de aplicar
  };

  const handleClearFilters = () => {
    // Limpiar todos los estados locales del modal
    setMinVisits('');
    setMaxVisits('');
    setMinTotalSpent('');
    setMaxTotalSpent('');
    setSelectedTags([]); // Limpiar tags también

    // Aplicar filtros vacíos al componente padre para resetear
    onApplyFilters({
      minVisits: undefined,
      maxVisits: undefined,
      minTotalSpent: undefined,
      maxTotalSpent: undefined,
      selectedTags: [],
    });
    onClose(); // Cierra el modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#211B17] p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#F7F7ED] hover:text-[#F2994A] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#F7F7ED] mb-6 text-center">Filtros de Clientes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Filtros por Visitas */}
          <div>
            <label className="block text-[#F7F7ED] text-sm font-bold mb-2">Visitas:</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 px-3 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-[#F7F7ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={minVisits}
                onChange={(e) => setMinVisits(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="flex-1 px-3 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-[#F7F7ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={maxVisits}
                onChange={(e) => setMaxVisits(e.target.value)}
              />
            </div>
          </div>

          {/* Filtros por Gasto Total */}
          <div>
            <label className="block text-[#F7F7ED] text-sm font-bold mb-2">Gasto Total:</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 px-3 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-[#F7F7ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={minTotalSpent}
                onChange={(e) => setMinTotalSpent(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="flex-1 px-3 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-[#F7F7ED] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={maxTotalSpent}
                onChange={(e) => setMaxTotalSpent(e.target.value)}
              />
            </div>
          </div>

          {/* Aquí podríamos añadir más filtros en el futuro, como Tags */}
          {/* Por ahora, este bloque está comentado para simplificar, pero muestra cómo se podría expandir */}
          {/* <div className="col-span-full">
            <label className="block text-[#F7F7ED] text-sm font-bold mb-2">Tags:</label>
            <button
              onClick={() => alert('Abrir modal de tags - Implementar más adelante')}
              className="w-full px-4 py-2 bg-[#332A25] text-[#F7F7ED] rounded-md border border-[#F2994A] hover:bg-[#4A3D34] transition-colors"
            >
              Seleccionar Tags
            </button>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag, index) => (
                  <span key={index} className="inline-block bg-[#F2994A] text-white text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Ningún tag seleccionado</span>
              )}
            </div>
          </div> */}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClearFilters}
            className="px-5 py-2 border border-[#F2994A] text-[#F2994A] rounded-md hover:bg-[#F2994A] hover:text-white transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors font-semibold shadow"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterClientsModal;