import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Asegúrate de que estas rutas sean correctas para tus modales de tags
import ClientTagsModal from './ClientTagsModal';
import ReservationTagsModal from './ReservationTagsModal';

// Puedes definir una interfaz para los datos del formulario
interface WaitingListData {
  date: Date;
  guests: number;
  waitingTime: number; // en minutos
  name: string;
  lastName: string;
  phone: string;
  email: string;
  membershipId: string;
  clientTags: string[];
  reservationTags: string[]; // Actualizado para almacenar los tags seleccionados
  notes: string;
  // Puedes añadir file: File | null; si vas a manejar archivos
}

interface NewWaitingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WaitingListData) => void;
}

const NewWaitingEntryModal: React.FC<NewWaitingEntryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<WaitingListData>({
    date: new Date(),
    guests: 2, // Valor por defecto
    waitingTime: 15, // Valor por defecto
    name: '',
    lastName: '',
    phone: '',
    email: '',
    membershipId: '',
    clientTags: [],
    reservationTags: [], // Inicialmente vacío
    notes: '',
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isClientTagsModalOpen, setIsClientTagsModalOpen] = useState(false);
  const [isReservationTagsModalOpen, setIsReservationTagsModalOpen] = useState(false);

  // Efecto para cerrar los dropdowns al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cierra el calendario si se hace clic fuera
      if (showCalendar && !(event.target as HTMLElement).closest('.react-datepicker')) {
        setShowCalendar(false);
      }
      // Cierra el dropdown de invitados si se hace clic fuera
      if (showGuestsDropdown && !(event.target as HTMLElement).closest('.guests-dropdown-container')) {
        setShowGuestsDropdown(false);
      }
      // Cierra el dropdown de tiempo si se hace clic fuera
      if (showTimeDropdown && !(event.target as HTMLElement).closest('.time-dropdown-container')) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar, showGuestsDropdown, showTimeDropdown]);


  if (!isOpen) return null; // No renderiza el modal si no está abierto

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
      setShowCalendar(false); // Cerrar el calendario al seleccionar
    }
  };

  const handleGuestsChange = (guests: number) => {
    setFormData(prev => ({ ...prev, guests }));
    setShowGuestsDropdown(false);
  };

  const handleTimeChange = (time: number) => {
    setFormData(prev => ({ ...prev, waitingTime: time }));
    setShowTimeDropdown(false);
  };

  // Función para guardar los tags de cliente seleccionados desde el modal
  const handleSaveClientTags = (selectedTags: string[]) => {
    setFormData(prev => ({ ...prev, clientTags: selectedTags }));
    setIsClientTagsModalOpen(false); // Cerrar el modal después de guardar
  };

  // Función para guardar los tags de reserva seleccionados desde el modal
  const handleSaveReservationTags = (selectedTags: string[]) => {
    setFormData(prev => ({ ...prev, reservationTags: selectedTags }));
    setIsReservationTagsModalOpen(false); // Cerrar el modal después de guardar
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Llama a la función onSubmit pasada por props
    // La navegación o el manejo de datos se hará en el componente padre (ListaEsperaPage)
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long' }).format(date);
  };

  return (
    // Overlay del modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* Contenido del modal */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <div className="flex justify-between items-center mb-6">
          {/* Botón de cerrar el modal */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Nuevo en Lista de Espera</h1>
          {/* Botón de enviar el formulario */}
          <button type="submit" form="waitingListForm" className="text-green-500 hover:text-green-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        {/* Sección de encabezado de datos clave */}
        <div className="flex flex-wrap justify-around text-center border-b pb-4 mb-6 -mx-2">
          <div className="p-2 relative">
            <div
              className="flex items-center space-x-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-4 10h.01M12 17h.01M7 17h.01M17 17h.01M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              <span>{formatDate(formData.date)}</span>
            </div>
            {showCalendar && (
              <div className="absolute z-10 bg-white shadow-lg rounded-md mt-2">
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  inline
                  dateFormat="dd MMMM"
                />
              </div>
            )}
          </div>
          <div className="p-2 relative guests-dropdown-container">
            <div
              className="flex items-center space-x-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-5m-2 0h-5a2 2 0 01-2-2v-3a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2zM9 9V7a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0a2 2 0 110-4m0 4a2 2 0 100-4m0 4h6m-6 0z"></path></svg>
              <span>{formData.guests} Invitado{formData.guests !== 1 ? 's' : ''}</span>
            </div>
            {showGuestsDropdown && (
              <div className="absolute z-10 bg-white shadow-lg rounded-md mt-2 w-40 max-h-48 overflow-y-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                  <button
                    key={num}
                    className={`block w-full text-left px-4 py-2 ${formData.guests === num ? 'bg-orange-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
                    onClick={() => handleGuestsChange(num)}
                  >
                    {num} Invitado{num !== 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 relative time-dropdown-container">
            <div
              className="flex items-center space-x-1 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{formData.waitingTime} minutos</span>
            </div>
            {showTimeDropdown && (
              <div className="absolute z-10 bg-white shadow-lg rounded-md mt-2 w-40 max-h-48 overflow-y-auto">
                {[5, 10, 15, 20, 25, 30, 45, 60].map(time => (
                  <button
                    key={time}
                    className={`block w-full text-left px-4 py-2 ${formData.waitingTime === time ? 'bg-orange-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
                    onClick={() => handleTimeChange(time)}
                  >
                    {time} minutos
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 flex items-center space-x-1 text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span>Nombre</span> {/* Este no es interactivo, solo muestra el label */}
          </div>
        </div>

        <form id="waitingListForm" onSubmit={handleSubmit}>
          {/* Campo "Buscar comensal" */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar comensal"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
              />
            </div>
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div className="flex">
                {/* Puedes implementar un selector de país real o solo el prefijo */}
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-200 text-gray-600 rounded-l-lg text-sm">
                  🇨🇱 +56
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
              />
            </div>
          </div>

          {/* # Membresía */}
          <div className="mb-4">
            <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700 mb-1"># Membresía</label>
            <input
              type="text"
              id="membershipId"
              name="membershipId"
              value={formData.membershipId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
            />
          </div>

          {/* Tags del cliente */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags del cliente</label>
            <button
              type="button"
              onClick={() => setIsClientTagsModalOpen(true)}
              className="w-full flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              {formData.clientTags.length > 0 ? (
                <span className="flex flex-wrap gap-2">
                  {formData.clientTags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </span>
              ) : (
                <span>Toca para agregar tags</span>
              )}
            </button>
          </div>

          {/* Tags de la reserva */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags de la reserva</label>
            <button
              type="button" // Importante: para que no envíe el formulario
              onClick={() => setIsReservationTagsModalOpen(true)} // Abre el modal de tags de reserva!
              className="w-full flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              {formData.reservationTags.length > 0 ? (
                <span className="flex flex-wrap gap-2">
                  {formData.reservationTags.map(tag => (
                    <span key={tag} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </span>
              ) : (
                <span>Toca para agregar tags</span>
              )}
            </button>
          </div>

          {/* Notas */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800 resize-y"
              placeholder="Notas"
            ></textarea>
          </div>

          {/* Adjuntar archivo */}
          <div className="mb-6 flex items-center justify-between">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Adjuntar archivo</label>
            <button
              type="button"
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg flex items-center space-x-2 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              <span>Cargar</span>
            </button>
            <input id="file-upload" type="file" className="hidden" /> {/* Input de archivo real */}
          </div>

          {/* Botón de "Agregar a la Lista de espera" */}
          <button
            type="submit"
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Agregar a la Lista de espera
          </button>
        </form>
      </div>

      {/* Renderiza el ClientTagsModal */}
      <ClientTagsModal
        isOpen={isClientTagsModalOpen}
        onClose={() => setIsClientTagsModalOpen(false)}
        onSaveTags={handleSaveClientTags}
        initialSelectedTags={formData.clientTags}
      />

      {/* ¡Renderiza el ReservationTagsModal! */}
      <ReservationTagsModal
        isOpen={isReservationTagsModalOpen}
        onClose={() => setIsReservationTagsModalOpen(false)}
        onSaveTags={handleSaveReservationTags}
        initialSelectedTags={formData.reservationTags}
      />
    </div>
  );
};

export default NewWaitingEntryModal;