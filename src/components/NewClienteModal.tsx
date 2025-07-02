// src/components/NewClientModal.tsx
import React, { useState, useEffect } from 'react';
import type { Client } from '../types'; // <-- Add 'type' keyword here // <--- Asegúrate que esta ruta sea correcta: de components a src/types
import ClientTagsModal from './ClientTagsModal';

// (La interfaz Client YA NO DEBE ESTAR DEFINIDA AQUÍ si ya está en src/types/index.ts)

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (newClient: Client) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onClientCreated }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+56');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [birthday, setBirthday] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isClientTagsModalOpen, setIsClientTagsModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFirstName('');
      setLastName('');
      setPhoneCountryCode('+56');
      setPhoneNumber('');
      setEmail('');
      setCompany('');
      setBirthday('');
      setMembershipNumber('');
      setComment('');
      setTags([]);
    }
  }, [isOpen]);

  const handleOpenClientTagsModal = () => {
    setIsClientTagsModalOpen(true);
  };

  const handleSaveTagsFromModal = (selectedTagsFromModal: string[]) => {
    setTags(selectedTagsFromModal);
    setIsClientTagsModalOpen(false);
  };

  const handleCreateClient = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Por favor, ingresa el nombre y apellido del cliente.');
      return;
    }

    const newClient: Client = { // Aquí es donde se usa la interfaz Client
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `${firstName.trim()} ${lastName.trim()}`,
      phone: `${phoneCountryCode} ${phoneNumber.trim()}`,
      email: email.trim(),
      visits: 0,
      lastVisit: '-',
      tags: tags,
      totalSpent: 0.00,
      spentPerVisit: 0.00,
      profileNote: comment.trim(),
    };
    onClientCreated(newClient);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 relative overflow-y-auto max-h-[90vh]">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center mt-6">Nuevo Cliente</h2>

        {/* Formulario */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Nombre"
              className="w-1/2 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-1/2 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Teléfono</label>
            <div className="flex items-center">
              <select
                className="mr-2 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
              >
                <option value="+56">+56 (Chile)</option>
                <option value="+1">+1 (EE.UU./Canadá)</option>
                <option value="+52">+52 (México)</option>
                <option value="+54">+54 (Argentina)</option>
                <option value="+34">+34 (España)</option>
              </select>
              <input
                type="tel"
                placeholder="Número de teléfono"
                className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Empresa"
              className="w-1/2 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              type="date"
              placeholder="Cumpleaños"
              className="w-1/2 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="# Membresía"
              className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Comentario de una línea"
              className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          {/* Sección de Tags del cliente */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Tags del cliente</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Ningún tag seleccionado</span>
              )}
            </div>
            {/* Botón para abrir el modal de tags */}
            <button
              type="button"
              onClick={handleOpenClientTagsModal}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Toca para agregar tags
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCreateClient}
            className="px-4 py-2 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors font-semibold w-full sm:w-auto"
          >
            Crear Cliente
          </button>
        </div>

        {/* Botón de confirmar (esquina superior derecha) */}
        <button
          className="absolute top-2 right-2 text-[#F2994A] hover:text-[#d97d23] focus:outline-none"
          onClick={handleCreateClient}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Renderiza el modal de selección de tags */}
      <ClientTagsModal
        isOpen={isClientTagsModalOpen}
        onClose={() => setIsClientTagsModalOpen(false)}
        onSaveTags={handleSaveTagsFromModal}
        initialSelectedTags={tags}
      />
    </div>
  );
};

export default NewClientModal;