import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId?: number;       // Cambiado a tableId
  onReservationCreate?: (reservationData: any) => void;
  fechaSeleccionada?: string;
}

const NewReservationModal: React.FC<NewReservationModalProps> = ({ isOpen, onClose, tableId, onReservationCreate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedGuests, setSelectedGuests] = useState<number | null>(null);
  const [customGuests, setCustomGuests] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentStep, setCurrentStep] = useState<'date' | 'guests' | 'time' | 'name'>('date');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // NUEVOS CAMPOS
  const [guestName, setGuestName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date());
      setSelectedGuests(null);
      setCustomGuests('');
      setShowCustomInput(false);
      setCurrentStep('date');
      setSelectedTime(null);
      setGuestName('');
      setGuestLastName('');
      setGuestEmail('');
      setGuestPhone('');
      setNotes('');
    }
  }, [isOpen, tableId]);

  if (!isOpen) return null;

  const predefinedOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleDateSelection = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleGuestSelection = (guests: number) => {
    setSelectedGuests(guests);
    setShowCustomInput(false);
    setCustomGuests('');
  };

  const handleCustomGuests = () => {
    setShowCustomInput(true);
    setSelectedGuests(null);
  };

  const handleCustomGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomGuests(value);
    if (value && parseInt(value) > 0) {
      setSelectedGuests(parseInt(value));
    } else {
      setSelectedGuests(null);
    }
  };

  const getFormattedDate = (date: Date | null) => {
    if (!date) return 'Selecciona una fecha';
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 12; hour <= 18; hour++) {
      if (hour === 18) {
        times.push('6:30 PM');
        break;
      }
      const time12 = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      times.push(`${time12}:00 ${period}`);
      times.push(`${time12}:30 ${period}`);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const handleContinueFromDate = () => {
    if (selectedDate) {
      setCurrentStep('guests');
    }
  };

  const handleContinueFromGuests = () => {
    if (selectedGuests && selectedGuests > 0) {
      setCurrentStep('time');
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinueFromTime = () => {
    if (selectedTime) {
      setCurrentStep('name');
    }
  };

  const submitReservation = async (reservationData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/reservas`, reservationData);
      alert('Reserva creada correctamente');
      onReservationCreate?.(response.data);
    } catch (error: any) {
      console.error(error);
      alert(`Error al crear reserva: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
    }
  };

  const handleCreateReservation = () => {
    if (!guestName.trim() || !guestLastName.trim()) {
      alert('Nombre y apellido son obligatorios');
      return;
    }
    if (!guestEmail.trim() || !/\S+@\S+\.\S+/.test(guestEmail)) {
      alert('Correo electrónico inválido');
      return;
    }
    if (!guestPhone.trim()) {
      alert('Teléfono es obligatorio');
      return;
    }
    if (!selectedDate || !selectedGuests || !selectedTime) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    const fechaReservaStr = selectedDate.toISOString().split('T')[0];
    const horario_id = null; // Ajustar si tienes ids horarios

    const reservationData = {
      nombre: guestName.trim(),
      apellido: guestLastName.trim(),
      correo_electronico: guestEmail.trim(),
      telefono: guestPhone.trim(),
      mesa_id: tableId ?? null,
      horario_id,
      fecha_reserva: fechaReservaStr,
      cantidad_personas: selectedGuests,
      notas: notes.trim() || null,
    };

    submitReservation(reservationData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Nueva Reserva</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-wrap border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            {/* Steps Buttons */}
            <button
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-b-2 whitespace-nowrap ${
                currentStep === 'date' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">{getFormattedDate(selectedDate)}</span>
            </button>

            <button
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-b-2 whitespace-nowrap ${
                currentStep === 'guests' ? 'border-orange-500 text-orange-600' : currentStep === 'date' ? 'text-gray-500 border-transparent' : 'text-gray-400 border-transparent'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs sm:text-sm">{selectedGuests ? `${selectedGuests} Invitado${selectedGuests > 1 ? 's' : ''}` : 'Invitados'}</span>
            </button>

            <button
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-b-2 whitespace-nowrap ${
                currentStep === 'time' ? 'border-orange-500 text-orange-600' : 'text-gray-400 border-transparent'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm">{selectedTime || 'Hora'}</span>
            </button>

            <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-400 whitespace-nowrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs sm:text-sm">Nombre y Apellido</span>
            </button>
          </div>

          {currentStep === 'date' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Selecciona la fecha</h3>
              <div className="flex justify-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelection}
                  dateFormat="dd/MM/yyyy"
                  inline
                  minDate={new Date()}
                  className="react-datepicker-custom"
                />
              </div>
            </div>
          )}

          {currentStep === 'guests' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Cantidad de comensales</h3>
              <div className="space-y-2">
                {predefinedOptions.map((guests) => (
                  <button
                    key={guests}
                    onClick={() => handleGuestSelection(guests)}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors ${
                      selectedGuests === guests ? 'bg-orange-50 border-orange-300' : ''
                    }`}
                  >
                    <span className="text-sm sm:text-base text-gray-700">{guests} Invitado{guests > 1 ? 's' : ''}</span>
                  </button>
                ))}

                {showCustomInput ? (
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <label htmlFor="customGuests" className="block text-sm font-medium text-gray-700 mb-2">
                      Número personalizado de invitados:
                    </label>
                    <input
                      type="number"
                      id="customGuests"
                      min="1"
                      max="50"
                      value={customGuests}
                      onChange={handleCustomGuestsChange}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                      placeholder="Ingresa el número"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleCustomGuests}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors text-orange-600"
                  >
                    <span className="text-sm sm:text-base">Otro número de invitados...</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'time' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Selecciona la hora</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelection(time)}
                    className={`px-2 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors text-center ${
                      selectedTime === time ? 'bg-orange-50 border-orange-300 text-orange-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'name' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Información del cliente</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="Nombre"
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="guestLastName" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="guestLastName"
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="Apellido"
                  />
                </div>
                <div>
                  <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="guestEmail"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="guestPhone"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="Comentarios adicionales"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep !== 'date' && (
              <button
                onClick={() => {
                  if (currentStep === 'guests') setCurrentStep('date');
                  else if (currentStep === 'time') setCurrentStep('guests');
                  else if (currentStep === 'name') setCurrentStep('time');
                }}
                className="px-4 py-2 text-orange-600 border border-orange-600 rounded hover:bg-orange-50 transition-colors"
              >
                Atrás
              </button>
            )}

            {currentStep === 'date' && (
              <button
                onClick={handleContinueFromDate}
                disabled={!selectedDate}
                className={`px-4 py-2 rounded text-white ${
                  selectedDate ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-300 cursor-not-allowed'
                }`}
              >
                Continuar
              </button>
            )}

            {currentStep === 'guests' && (
              <button
                onClick={handleContinueFromGuests}
                disabled={!selectedGuests}
                className={`px-4 py-2 rounded text-white ${
                  selectedGuests ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-300 cursor-not-allowed'
                }`}
              >
                Continuar
              </button>
            )}

            {currentStep === 'time' && (
              <button
                onClick={handleContinueFromTime}
                disabled={!selectedTime}
                className={`px-4 py-2 rounded text-white ${
                  selectedTime ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-300 cursor-not-allowed'
                }`}
              >
                Continuar
              </button>
            )}

            {currentStep === 'name' && (
              <button
                onClick={handleCreateReservation}
                className="px-4 py-2 rounded text-white bg-orange-600 hover:bg-orange-700"
              >
                Crear Reserva
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservationModal;
