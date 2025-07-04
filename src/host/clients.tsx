import React, { useState } from 'react';
// ELIMINADA: import Header from '../components/Header'; // ¡Esta línea debe ser eliminada!
import NewClientModal from '../components/NewClienteModal';
import TagsModal from '../components/TagsModal';
import type { Client } from '../types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Definimos ClientFilters aquí, ya que FilterClientsModal fue removido.
// Podrías mover esta interfaz a 'types.ts' si la usas en múltiples lugares.
export interface ClientFilters {
  minVisits?: number;
  maxVisits?: number;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  selectedTags: string[];
}

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  const [currentAppliedFilters, setCurrentAppliedFilters] = useState<ClientFilters>({
    minVisits: undefined,
    maxVisits: undefined,
    minTotalSpent: undefined,
    maxTotalSpent: undefined,
    selectedTags: [],
  });

  const [clients, setClients] = useState<Client[]>([
    {
      id: 'client-1',
      name: 'Alejandro Garay',
      phone: '+56 09 4507 8880',
      email: 'aleleon_237@hotmail.com',
      visits: 0,
      lastVisit: '-',
      tags: [],
      totalSpent: 0.00,
      spentPerVisit: 0.00,
      profileNote: '-',
    },
    {
      id: 'client-2',
      name: 'Maria Perez',
      phone: '+56 09 1234 5678',
      email: 'maria.perez@example.com',
      visits: 5,
      lastVisit: '15/05/2025',
      tags: ['VIP', 'Familia', 'Alto Consumo'],
      totalSpent: 120.50,
      spentPerVisit: 24.10,
      profileNote: 'Siempre pide mesa junto a la ventana.'
    },
    {
      id: 'client-3',
      name: 'Juan Gomez',
      phone: '+56 09 8765 4321',
      email: 'juan.gomez@example.com',
      visits: 1,
      lastVisit: '01/07/2025',
      tags: ['Vegano'],
      totalSpent: 45.00,
      spentPerVisit: 45.00,
      profileNote: '-'
    },
    {
      id: 'client-4',
      name: 'Ana Ramirez',
      phone: '+56 09 2345 6789',
      email: 'ana.ramirez@example.com',
      visits: 10,
      lastVisit: '20/06/2025',
      tags: ['Cliente Frecuente', 'Mesa Tranquila'],
      totalSpent: 300.00,
      spentPerVisit: 30.00,
      profileNote: 'Le gusta el café descafeinado.'
    }
  ]);

  const handleOpenNewClientModal = () => {
    setIsNewClientModalOpen(true);
  };

  const handleClientCreated = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
    setIsNewClientModalOpen(false);
  };

  const handleApplyTagsFromModal = (tags: string[]) => {
    setCurrentAppliedFilters(prevFilters => ({
      ...prevFilters,
      selectedTags: tags,
      minVisits: undefined,
      maxVisits: undefined,
      minTotalSpent: undefined,
      maxTotalSpent: undefined,
    }));
    setIsTagsModalOpen(false);
  };

  const handleApplySearchTerm = () => {
    setAppliedSearchTerm(searchTerm);
  };

  const filteredClients = clients.filter(client => {
    const lowerCaseAppliedSearchTerm = appliedSearchTerm.toLowerCase();
    const isNumberSearch = !isNaN(Number(appliedSearchTerm)) && appliedSearchTerm.trim() !== '';

    let matchesSearchTerm = false;
    if (appliedSearchTerm === '') {
      matchesSearchTerm = true;
    } else if (isNumberSearch) {
      matchesSearchTerm = client.visits === Number(appliedSearchTerm);
    } else {
      matchesSearchTerm = (
        client.name.toLowerCase().includes(lowerCaseAppliedSearchTerm) ||
        client.email.toLowerCase().includes(lowerCaseAppliedSearchTerm) ||
        client.phone.toLowerCase().includes(lowerCaseAppliedSearchTerm) ||
        client.tags.some(tag => tag.toLowerCase().includes(lowerCaseAppliedSearchTerm))
      );
    }

    const matchesTags =
      currentAppliedFilters.selectedTags.length === 0 ||
      currentAppliedFilters.selectedTags.some(tag => client.tags.includes(tag));

    return matchesSearchTerm && matchesTags;
  });

  const handleDownloadClientsXLSX = () => {
    const dataForSheet = clients.map(client => ({
      ID: client.id,
      Nombre: client.name,
      Teléfono: client.phone,
      'Correo Electrónico': client.email,
      Visitas: client.visits,
      'Última Visita': client.lastVisit,
      'Tags del Cliente': client.tags.join(', '),
      'Gasto Total': client.totalSpent,
      'Gasto por Visita': client.spentPerVisit,
      'Nota del Perfil': client.profileNote,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataForSheet);
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes PandaWok');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateString = `${day}-${month}-${year}`;

    const fileName = `clientes_pandawok_${dateString}.xlsx`;
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
  };

  return (
    // Contenedor principal de la página de Clientes.
    // Este div gestiona el layout interno de la página de Clientes.
    // Asumimos que el Header global de la aplicación ya lo envuelve.
    <div className="flex flex-col flex-1 bg-[#F7F7ED] h-full"> {/* Usamos flex-1 y h-full para que ocupe el espacio disponible del layout superior */}
      
      {/* Header específico de la página de Clientes */}
      {/* Este div es sticky y se fija justo debajo del Header global. */}
      {/* Ajusta 'top-[64px]' si la altura de tu Header global es diferente. */}
      <div className="bg-[#F7F7ED] p-2 sm:p-4 pb-0 z-10 sticky top-[64px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#211B17]">Clientes</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Buscar"
              className="px-3 sm:px-4 py-2 rounded-md bg-white border border-[#F2994A] text-[#211B17] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplySearchTerm();
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {/* Botón Tags */}
              <button
                onClick={() => setIsTagsModalOpen(true)}
                className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="hidden sm:inline">Tags</span>
                </span>
              </button>

              {/* Botón Aplicar Búsqueda */}
              <button
                onClick={handleApplySearchTerm}
                className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Aplicar Búsqueda</span>
                </span>
              </button>

              {/* Botón Descargar */}
              <button
                onClick={handleDownloadClientsXLSX}
                className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Descargar</span>
                </span>
              </button>

              {/* Botón Nuevo Cliente */}
              <button
                onClick={handleOpenNewClientModal}
                className="px-3 sm:px-4 py-2 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors font-semibold shadow text-sm"
              >
                + Nuevo Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Mostrar tags aplicadas como pildoras */}
        {currentAppliedFilters.selectedTags.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[#211B17] font-semibold">Tags Aplicadas:</span>
            {currentAppliedFilters.selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-[#F2994A] text-white text-sm font-medium">
                {tag}
                <button
                  onClick={() => handleApplyTagsFromModal(currentAppliedFilters.selectedTags.filter(t => t !== tag))}
                  className="ml-2 -mr-1 text-white hover:text-gray-100 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              onClick={() => handleApplyTagsFromModal([])}
              className="ml-2 text-[#F2994A] hover:underline text-sm"
            >
              Limpiar Todas
            </button>
          </div>
        )}
      </div>

      {/* Área de la tabla de clientes - ESTA ES LA ÚNICA QUE DEBE TENER SCROLL VERTICAL */}
      {/* flex-1 asegura que este div ocupe el resto del espacio vertical disponible */}
      {/* overflow-y-auto permite el scroll vertical si el contenido excede la altura */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-4"
           style={{ scrollbarWidth: 'thin', scrollbarColor: '#B24E00 #F7F7ED' }}>
        <div className="bg-[#211B17] rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F7F7ED]/20">
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Teléfono</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Correo Electrónico</th>
                <th className="py-3 px-4 text-center text-[#F7F7ED] font-semibold">Visitas</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Última Visita</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Tags del cliente</th>
                <th className="py-3 px-4 text-right text-[#F7F7ED] font-semibold">Gasto total</th>
                <th className="py-3 px-4 text-right text-[#F7F7ED] font-semibold">Gasto/Visita</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Nota del perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F7ED]/20">
              {filteredClients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-[#655644] group">
                  <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">{client.name}</td>
                  <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">{client.phone}</td>
                  <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">{client.email}</td>
                  <td className="py-3 px-4 text-center text-[#F7F7ED] group-hover:text-white">{client.visits}</td>
                  <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">{client.lastVisit}</td>
                  <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">
                    {client.tags.length > 0 ? client.tags.map(tag => (
                      <span key={tag} className="inline-block bg-[#F2994A] text-white text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        {tag}
                      </span>
                    )) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-[#F7F7ED] group-hover:text-white">{client.totalSpent.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-[#F7F7ED] group-hover:text-white">{client.spentPerVisit.toFixed(2)}</td>
                  <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">{client.profileNote}</td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#F7F7ED]/70">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales fuera del flujo principal de scroll */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

      <TagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        onApplyTags={handleApplyTagsFromModal}
        currentSelectedTags={currentAppliedFilters.selectedTags}
      />
    </div>
  );
};

export default Clients;