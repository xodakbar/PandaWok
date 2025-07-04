// src/components/TagsModal.tsx
import React, { useState, useEffect, type MouseEvent } from 'react';

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onApplyTags recibe las tags seleccionadas
  onApplyTags: (tags: string[]) => void;
  // currentSelectedTags para pre-rellenar el modal
  currentSelectedTags: string[];
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
  'Otros': [ // Añadida categoría "Otros" si existe
    'Cliente frecuente'
  ]
};

const TagsModal: React.FC<TagsModalProps> = ({
  isOpen,
  onClose,
  onApplyTags,
  currentSelectedTags,
}) => {
  const [selectedTagsInternal, setSelectedTagsInternal] = useState<string[]>(currentSelectedTags);

  // Sincronizar el estado interno con las tags pasadas por props
  useEffect(() => {
    setSelectedTagsInternal(currentSelectedTags);
  }, [currentSelectedTags]);

  // Función para alternar la selección de una tag
  const handleTagToggle = (tag: string) => {
    setSelectedTagsInternal(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag) // Deseleccionar
        : [...prevTags, tag] // Seleccionar
    );
  };

  // Función para aplicar las tags seleccionadas
  const handleApply = () => {
    onApplyTags(selectedTagsInternal);
    onClose();
  };

  // Función para restablecer todas las tags seleccionadas
  const handleReset = () => {
    setSelectedTagsInternal([]);
    onApplyTags([]); // También notifica al padre que se han limpiado
  };

  // Cierra el modal si se hace clic fuera
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calcula el número de tags seleccionadas para el botón "Aplicar (X)"
  const numberOfSelectedTags = selectedTagsInternal.length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-end z-50" // Alinear a la derecha
      onClick={handleOverlayClick}
    >
      <div className="bg-white text-[#211B17] w-full max-w-sm h-full shadow-lg flex flex-col transform transition-transform duration-300 ease-out translate-x-0"> {/* Estilo de barra lateral */}
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#211B17]">TAGS</h2>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-[#F2994A] text-sm transition-colors duration-200"
          >
            Restablecer
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#F2994A] transition-colors duration-200 focus:outline-none"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Contenido principal del modal - Tags */}
        <div className="flex-1 p-4 overflow-y-auto">
          {Object.entries(allTagsByCategory).map(([category, tags]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium text-[#211B17] mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`
                      px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap
                      ${selectedTagsInternal.includes(tag)
                        ? 'bg-[#F2994A] border-[#F2994A] text-white shadow-sm' // Seleccionado: Fondo naranja, texto blanco
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400' // No seleccionado: Borde gris, texto gris, hover suave
                      }
                      transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#F2994A]
                    `}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pie de página con botón Aplicar */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleApply}
            className="w-full px-6 py-3 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors duration-200 font-semibold text-lg shadow-md"
          >
            Aplicar ({numberOfSelectedTags})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsModal;