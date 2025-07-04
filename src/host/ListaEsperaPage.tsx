
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewWaitingEntryModal from '../components/NewWaitingEntryModal'; // Importa el nuevo modal

const ListaEsperaPage: React.FC = () => {
  const navigate = useNavigate();
  const [isNewWaitingEntryModalOpen, setIsNewWaitingEntryModalOpen] = useState(false);

  // Define la interfaz para los datos de la lista de espera si aún no la tienes en un archivo compartido
  interface WaitingListData {
    date: Date;
    guests: number;
    waitingTime: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    membershipId: string;
    clientTags: string[];
    reservationTags: string[];
    notes: string;
  }

  const handleCreateNewList = () => {
    setIsNewWaitingEntryModalOpen(true); // Abre el modal al hacer clic
  };

  const handleNewWaitingEntrySubmit = (data: WaitingListData) => {
    console.log('Nueva entrada en lista de espera creada:', data);
    // Aquí puedes añadir la lógica para guardar esta entrada en tu estado o backend
    // Por ejemplo, podrías añadirla a un array de listas de espera que se muestre en esta página.
    // Después de guardar, puedes cerrar el modal.
    setIsNewWaitingEntryModalOpen(false);
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F7F7ED', color: '#3C2022' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#CC5500' }}>
          Listas de Espera
        </h1>

        <button
          onClick={handleCreateNewList}
          className="px-6 py-3 rounded-lg shadow-md text-white font-semibold mb-8 transition-colors duration-300 bg-[#CC5500] hover:bg-[#FF6B00]"
        >
          Crear Nueva Lista de Espera
        </button>

        {/* Aquí iría la lógica para mostrar las listas de espera existentes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600">
            Aquí se mostrarán las listas de espera activas.
            <br />
            (Implementa la carga y visualización de datos aquí)
          </p>
          {/* Ejemplo de una tarjeta de lista de espera */}
          <div className="mt-4 border-t pt-4 border-gray-200">
            <h2 className="text-xl font-semibold" style={{ color: '#3C2022' }}>Mesa 5 - (4 personas)</h2>
            <p className="text-gray-700">Tiempo de espera: ~15 min</p>
            <p className="text-sm text-gray-500">Añadido: 17:30</p>
            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Asignar Mesa</button>
            <button className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Cancelar</button>
          </div>
        </div>
      </div>

      {/* Renderiza el nuevo modal */}
      <NewWaitingEntryModal
        isOpen={isNewWaitingEntryModalOpen}
        onClose={() => setIsNewWaitingEntryModalOpen(false)}
        onSubmit={handleNewWaitingEntrySubmit}
      />
    </div>
  );
};

export default ListaEsperaPage;