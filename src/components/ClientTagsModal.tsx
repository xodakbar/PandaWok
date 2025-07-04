// src/components/ClientTagsModal.tsx
import React, { useState, useEffect } from 'react';

interface ClientTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTags: (tags: string[]) => void;
  initialSelectedTags: string[];
  selectedTags?: string[];
  onTagsUpdate?: (tags: string[]) => void;
}




// Definición de todos los tags disponibles, categorizados
const ALL_CLIENT_TAGS = {
  'Preferencia de Asiento': [
    'Área de Fumadores', 'Área del Bar', 'Booth', 'Esquina', 'Fumador', 'Interior',
    'Mesa con Vista', 'Mesa Tranquila', 'Salón Principal', 'Terraza', 'Ventana'
  ],
  'Restricciones de Dieta': [
    'Alergia', 'Huevos', 'Libre de Gluten', 'Libre de Lactosa', 'Mariscos', 'Sin Maní',
    'Vegano', 'Vegetariano'
  ],
  'Tipo de Cliente': [
    'Alto Consumo', 'Amigo de Empleado', 'Amigo del dueño', 'Blogger',
    'Buena Propina', 'Calificación Negativa', 'Calificación Positiva', 'Celebridad',
    'CEO', 'Cliente Frecuente', 'Concierge', 'Crítico'
  ],
  'Otros': [
    'Cliente frecuente'
  ]
};

const ClientTagsModal: React.FC<ClientTagsModalProps> = ({ isOpen, onClose, onSaveTags, initialSelectedTags }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);

  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag); // Deseleccionar
      } else {
        return [...prevTags, tag]; // Seleccionar
      }
    });
  };

  const handleConfirm = () => {
    onSaveTags(selectedTags);
    onClose();
  };

  // Función auxiliar para determinar el color del tag
  const getTagColors = (tag: string, isSelected: boolean) => {
    
    const dietRestrictionTags = ['Alergia', 'Huevos', 'Libre de Gluten', 'Libre de Lactosa', 'Mariscos', 'Sin Maní', 'Vegano', 'Vegetariano'];
    const clientTypeTags = ['Alto Consumo', 'Amigo de Empleado', 'Amigo del dueño', 'Blogger', 'Buena Propina', 'Calificación Negativa', 'Calificación Positiva', 'Celebridad', 'CEO', 'Cliente Frecuente', 'Concierge', 'Crítico'];
    const otherTags = ['Cliente frecuente'];


    if (isSelected) {
      if (dietRestrictionTags.includes(tag)) {
        return 'bg-[#4CAF50] border-[#4CAF50] text-white'; // Un verde para dieta (similar a tu imagen)
      } else if (clientTypeTags.includes(tag)) {
        return 'bg-[#F2994A] border-[#F2994A] text-white'; // Naranja para tipo de cliente
      } else if (otherTags.includes(tag)) {
        return 'bg-[#e74c3c] border-[#e74c3c] text-white'; // Un rojo para "Otros" (similar a tu imagen "Cliente frecuente")
      } else {
        return 'bg-[#3498db] border-[#3498db] text-white'; // Azul para asiento (similar a tu imagen)
      }
    } else {
      // Tags no seleccionados
      return 'border-[#655644] text-[#F7F7ED] hover:bg-[#655644] hover:border-[#F2994A] transition-colors';
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-[#211B17] rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header del modal */}
        <div className="p-4 border-b border-[#655644] flex justify-between items-center">
          <button onClick={onClose} className="text-[#F7F7ED] hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-[#F7F7ED]">Tags de Cliente</h2>
          <button onClick={handleConfirm} className="text-[#F2994A] hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal - Tags */}
        <div className="p-4 flex-grow overflow-y-auto custom-scrollbar">
          {Object.entries(ALL_CLIENT_TAGS).map(([category, tags]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium text-[#F7F7ED] mb-3">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      className={`
                        px-4 py-2 rounded-full border
                        ${getTagColors(tag, isSelected)}
                        text-sm
                      `}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer del modal */}
        <div className="p-4 border-t border-[#655644] flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-md border border-[#655644] text-[#F7F7ED] hover:bg-[#655644] hover:border-[#F2994A] transition-colors font-semibold"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors font-semibold"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTagsModal;