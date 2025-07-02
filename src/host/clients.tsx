// src/host/clients.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import NewClientModal from '../components/NewClienteModal';
import FilterClientsModal, { type ClientFilters } from '../components/FilterClientsModal'; // Importa la interfaz ClientFilters
import type { Client } from '../types'; // Importa el tipo Client desde src/types/index.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Lo que se escribe en el input
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(''); // Lo que se usa para filtrar después de "Aplicar Búsqueda"
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Estado para controlar el modal de filtros avanzados
  const [currentAppliedFilters, setCurrentAppliedFilters] = useState<ClientFilters>({ // Estado para los filtros aplicados del modal
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

  // Función para manejar la aplicación de filtros desde el modal de filtros avanzados
  const handleApplyAdvancedFilters = (filters: ClientFilters) => {
    setCurrentAppliedFilters(filters);
    setIsFilterModalOpen(false); // Cierra el modal después de aplicar
  };

  // Función para aplicar el término de búsqueda de la barra al presionar el botón
  const handleApplySearchTerm = () => {
    setAppliedSearchTerm(searchTerm);
  };

  const filteredClients = clients.filter(client => {
    const lowerCaseAppliedSearchTerm = appliedSearchTerm.toLowerCase();
    const isNumberSearch = !isNaN(Number(appliedSearchTerm)) && appliedSearchTerm.trim() !== '';

    // Filtro por la BARRA DE BÚSQUEDA (aplicado al presionar "Aplicar Búsqueda" o Enter)
    let matchesSearchTerm = false;
    if (isNumberSearch) {
      matchesSearchTerm = client.visits === Number(appliedSearchTerm);
    } else {
      matchesSearchTerm = (
        client.name.toLowerCase().includes(lowerCaseAppliedSearchTerm) ||
        client.email.toLowerCase().includes(lowerCaseAppliedSearchTerm) ||
        client.phone.toLowerCase().includes(lowerCaseAppliedSearchTerm) ||
        client.tags.some(tag => tag.toLowerCase().includes(lowerCaseAppliedSearchTerm))
      );
    }

    // Filtro por el MODAL DE FILTROS AVANZADOS (min/max visitas, min/max gasto, tags)
    const matchesModalFilters =
      (!currentAppliedFilters.minVisits || client.visits >= currentAppliedFilters.minVisits) &&
      (!currentAppliedFilters.maxVisits || client.visits <= currentAppliedFilters.maxVisits) &&
      (!currentAppliedFilters.minTotalSpent || client.totalSpent >= currentAppliedFilters.minTotalSpent) &&
      (!currentAppliedFilters.maxTotalSpent || client.totalSpent <= currentAppliedFilters.maxTotalSpent) &&
      // Filtro de tags del modal (si hay tags seleccionados, el cliente debe tener al menos uno)
      (currentAppliedFilters.selectedTags.length === 0 ||
        currentAppliedFilters.selectedTags.some(tag => client.tags.includes(tag)));

    // El cliente debe coincidir con AMBOS criterios de filtrado
    return matchesSearchTerm && matchesModalFilters;
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
    <div className="min-h-screen bg-[#F7F7ED]">
      <Header />
      <div className="p-2 sm:p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#211B17]">Clientes</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Buscar"
              className="px-3 sm:px-4 py-2 rounded-md bg-white border border-[#F2994A] text-[#211B17] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              value={searchTerm} // El input controla searchTerm (lo que se ve en la caja)
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { // Permite aplicar búsqueda con Enter
                if (e.key === 'Enter') {
                  handleApplySearchTerm();
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {/* BOTÓN ORIGINAL DE TAGS */}
              <button className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm">
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="hidden sm:inline">Tags</span>
                </span>
              </button>

              {/* BOTÓN PARA ABRIR EL MODAL DE FILTROS AVANZADOS */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="hidden sm:inline">Filtros Avanzados</span>
                </span>
              </button>

              {/* BOTÓN PARA APLICAR LA BÚSQUEDA DEL INPUT */}
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

              {/* BOTÓN DE DESCARGAR */}
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

              {/* BOTÓN DE NUEVO CLIENTE */}
              <button
                onClick={handleOpenNewClientModal}
                className="px-3 sm:px-4 py-2 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors font-semibold shadow text-sm"
              >
                + Nuevo Cliente
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-[#211B17] rounded-lg shadow">
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

      {/* Modal para crear un nuevo cliente */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

      {/* Modal para filtros avanzados */}
      <FilterClientsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={currentAppliedFilters}
      />
    </div>
  );
};

export default Clients;