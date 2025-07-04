import React, { useState, useEffect, type MouseEvent } from 'react';

// Definimos la interfaz para las opciones de filtro
export interface ClientFilters {
  minVisits?: number;
  maxVisits?: number;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  selectedTags: string[];
}

interface FilterClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ClientFilters) => void;
  currentFilters: ClientFilters;
}

// Definición de todas las tags posibles, categorizadas
const allTagsByCategory = {
  'Preferencia de Asiento': [
    'Área de Fumadores', 'Área del Bar', 'Booth', 'Esquina', 'Fumador',
    'Interior', 'Mesa con Vista', 'Mesa Tranquila', 'Salón Principal', 'Terraza',
    'Ventana',
  ],
  'Restricciones de Dieta': [
    'Alergia', 'Huevos', 'Libre de Gluten', 'Libre de Lactosa', 'Mariscos',
    'Sin Maní', 'Vegano', 'Vegetariano',
  ],
  'Tipo de Cliente': [
    'Alto Consumo', 'Amigo de Empleado', 'Amigo del dueño', 'Blogger',
    'Buena Propina', 'Calificación Negativa', 'Calificación Positiva', 'Celebridad',
    'CEO', 'Cliente Frecuente', 'Cliente Regular', 'Concierge', 'Crítico',
    'Empleado', 'Foodie', 'Huésped', 'Influencer', 'Inversionista', 'Lista Negra',
    'No Show', 'Prensa', 'VIP',
  ],
  // Puedes añadir más categorías aquí si las tienes
};

const FilterClientsModal: React.FC<FilterClientsModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [minVisits, setMinVisits] = useState<string>(currentFilters.minVisits?.toString() || '');
  const [maxVisits, setMaxVisits] = useState<string>(currentFilters.maxVisits?.toString() || '');
  const [minTotalSpent, setMinTotalSpent] = useState<string>(currentFilters.minTotalSpent?.toString() || '');
  const [maxTotalSpent, setMaxTotalSpent] = useState<string>(currentFilters.maxTotalSpent?.toString() || '');
  const [selectedTagsInternal, setSelectedTagsInternal] = useState<string[]>(currentFilters.selectedTags || []);

  // Sincronizar el estado interno del modal con los currentFilters del padre
  useEffect(() => {
    setMinVisits(currentFilters.minVisits?.toString() || '');
    setMaxVisits(currentFilters.maxVisits?.toString() || '');
    setMinTotalSpent(currentFilters.minTotalSpent?.toString() || '');
    setMaxTotalSpent(currentFilters.maxTotalSpent?.toString() || '');
    setSelectedTagsInternal(currentFilters.selectedTags || []);
  }, [currentFilters]);

  // Función para alternar la selección de una tag
  const handleTagToggle = (tag: string) => {
    setSelectedTagsInternal(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag) // Deseleccionar
        : [...prevTags, tag] // Seleccionar
    );
  };

  const handleApply = () => {
    const filtersToApply: ClientFilters = {
      minVisits: minVisits ? Number(minVisits) : undefined,
      maxVisits: maxVisits ? Number(maxVisits) : undefined,
      minTotalSpent: minTotalSpent ? Number(minTotalSpent) : undefined,
      maxTotalSpent: maxTotalSpent ? Number(maxTotalSpent) : undefined,
      selectedTags: selectedTagsInternal,
    };
    onApplyFilters(filtersToApply);
    onClose(); // Cierra el modal después de aplicar
  };

  const handleClearFilters = () => {
    setMinVisits('');
    setMaxVisits('');
    setMinTotalSpent('');
    setMaxTotalSpent('');
    setSelectedTagsInternal([]);

    onApplyFilters({
      minVisits: undefined,
      maxVisits: undefined,
      minTotalSpent: undefined,
      maxTotalSpent: undefined,
      selectedTags: [],
    });
    onClose(); // Cierra el modal
  };

  // Cierra el modal si se hace clic fuera del contenido principal
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#211B17] p-8 rounded-lg shadow-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scale-in"> {/* Ajustes para p-8, shadow-2xl, max-w-xl y animación */}
        {/* Botón de cierre (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F7F7ED] hover:text-[#F2994A] transition-colors duration-200 focus:outline-none"
          aria-label="Cerrar modal"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Aumentado a w-8 h-8 */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-[#F7F7ED] mb-8 text-center">Filtros de Clientes</h2> {/* Ajustado a text-3xl, font-bold, mb-8 */}

        {/* Sección de Filtros Numéricos (Visitas y Gasto Total) */}
        <div className="mb-8 pb-6 border-b border-gray-700"> {/* Ajustado a mb-8 pb-6 */}
          <h3 className="text-xl font-semibold text-[#F7F7ED] mb-4">Estadísticas</h3> {/* Ajustado a text-xl, font-semibold, mb-4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Ajustado a gap-6 */}
            {/* Visitas */}
            <div>
              <label htmlFor="minVisits" className="block text-[#F7F7ED] text-sm font-medium mb-2">Visitas:</label> {/* font-medium */}
              <div className="flex gap-2">
                <input
                  type="number"
                  id="minVisits"
                  placeholder="Mínimo" 
                  className="flex-1 px-4 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base" /* px-4, py-2, text-base, placeholder-gray-500 */
                  value={minVisits}
                  onChange={(e) => setMinVisits(e.target.value)}
                />
                <input
                  type="number"
                  id="maxVisits"
                  placeholder="Máximo" 
                  className="flex-1 px-4 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  value={maxVisits}
                  onChange={(e) => setMaxVisits(e.target.value)}
                />
              </div>
            </div>

            {/* Gasto Total */}
            <div>
              <label htmlFor="minTotalSpent" className="block text-[#F7F7ED] text-sm font-medium mb-2">Gasto Total:</label> {/* font-medium */}
              <div className="flex gap-2">
                <input
                  type="number"
                  id="minTotalSpent"
                  placeholder="Mínimo" 
                  className="flex-1 px-4 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  value={minTotalSpent}
                  onChange={(e) => setMinTotalSpent(e.target.value)}
                />
                <input
                  type="number"
                  id="maxTotalSpent"
                  placeholder="Máximo" 
                  className="flex-1 px-4 py-2 rounded-md bg-[#332A25] border border-[#F2994A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                  value={maxTotalSpent}
                  onChange={(e) => setMaxTotalSpent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIONES DE TAGS DINÁMICAS */}
        {Object.entries(allTagsByCategory).map(([category, tags]) => (
          <div key={category} className="mb-8"> {/* Ajustado a mb-8 */}
            <h3 className="text-xl font-semibold text-[#F7F7ED] mb-4">{category}</h3> {/* Ajustado a text-xl, font-semibold, mb-4 */}
            <div className="flex flex-wrap gap-3"> {/* Ajustado a gap-3 */}
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    px-5 py-2 rounded-full border text-sm font-medium whitespace-nowrap
                    ${selectedTagsInternal.includes(tag)
                      ? 'bg-[#F2994A] border-[#F2994A] text-white shadow-md' // Seleccionado: shadow-md
                      : 'border-[#F2994A] text-[#F2994A] hover:bg-[#F2994A] hover:text-white hover:shadow-sm' // No seleccionado: hover:shadow-sm
                    }
                    transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#211B17] focus:ring-[#F2994A]
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700"> {/* Ajustes para mt-8, pt-6, gap-4, border-t */}
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 border border-[#F2994A] text-[#F2994A] rounded-md hover:bg-[#F2994A] hover:text-white transition-colors duration-200 font-semibold text-lg shadow-md" /* px-6, py-3, text-lg, shadow-md */
          >
            Limpiar Filtros
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors duration-200 font-semibold shadow-md text-lg" /* px-6, py-3, text-lg, shadow-md */
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterClientsModal;