import React, { useState, useEffect } from 'react';

interface Salon {
  id: string;
  name: string;
  tables: any[]; // Asumiendo que 'tables' es un array de cualquier tipo
}

interface BlockSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  salones: Salon[];
  onBlockCreate: (blockData: any) => void; // Función para manejar la creación del bloqueo
}

const BlockSidebar: React.FC<BlockSidebarProps> = ({ isOpen, onClose, salones, onBlockCreate }) => {
  const [blockDate, setBlockDate] = useState<Date>(new Date());
  const [allDay, setAllDay] = useState<boolean>(true);
  const [timeFrom, setTimeFrom] = useState<string>('');
  const [timeTo, setTimeTo] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas las Áreas');
  const [applyTo, setApplyTo] = useState<'all' | 'min_persons' | 'max_persons'>('all');
  const [personsCount, setPersonsCount] = useState<number>(0);

  // Resetear el estado cuando se abre o cierra el sidebar para limpiar el formulario
  useEffect(() => {
    if (!isOpen) {
      setBlockDate(new Date());
      setAllDay(true);
      setTimeFrom('');
      setTimeTo('');
      setSelectedArea('Todas las Áreas');
      setApplyTo('all');
      setPersonsCount(0);
    }
  }, [isOpen]);

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Hoy, ${date.getDate()} ${months[date.getMonth()]}`;
    }
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const handleCreateBlock = () => {
    const blockData = {
      date: blockDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
      allDay: allDay,
      timeFrom: allDay ? null : timeFrom,
      timeTo: allDay ? null : timeTo,
      area: selectedArea,
      applyTo: applyTo,
      personsCount: (applyTo !== 'all') ? personsCount : null,
    };
    onBlockCreate(blockData);
    onClose(); // Cierra el sidebar después de crear el bloqueo
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full md:w-96 bg-[#212133] h-full shadow-lg p-6 flex flex-col">
        {/* Header del sidebar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Bloqueos</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crear nuevo bloqueo */}
        <div className="mb-6">
          <h3 className="text-lg text-white mb-4">Crear nuevo bloqueo</h3>

          {/* Fecha */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Fecha</label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(blockDate)}
                readOnly
                className="w-full p-2 rounded bg-[#33334F] text-white cursor-pointer"
                onClick={() => { /* Abre un date picker aquí */ }}
              />
              {/* Aquí iría un Date Picker para seleccionar la fecha */}
              {/* Por simplicidad, no incluyo un DatePicker completo, pero es donde se integraría */}
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => { /* Lógica para abrir DatePicker */ }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Todo el día / Horario */}
          <div className="flex items-center mb-4">
            <label htmlFor="allDayToggle" className="mr-3 text-white text-sm">Todo el día</label>
            <input
              type="checkbox"
              id="allDayToggle"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"
              onClick={() => setAllDay(!allDay)} // Esto permite hacer clic en el div para cambiarlo
            ></div>
          </div>

          {/* Desde / Hasta (condicional) */}
          {!allDay && (
            <div className="flex space-x-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Desde</label>
                <input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="w-full p-2 rounded bg-[#33334F] text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Hasta</label>
                <input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  className="w-full p-2 rounded bg-[#33334F] text-white"
                />
              </div>
            </div>
          )}

          {/* Área */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Área</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-2 rounded bg-[#33334F] text-white appearance-none"
            >
              <option value="Todas las Áreas">Todas las Áreas</option>
              {salones.map((salon) => (
                <option key={salon.id} value={salon.name}>
                  {salon.name}
                </option>
              ))}
            </select>
            {/* Ícono de flecha para el select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
            </div>
          </div>

          {/* Aplicar a: */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Aplicar a :</label>
            <div className="space-y-2">
              <label className="flex items-center text-white text-sm">
                <input
                  type="radio"
                  name="applyTo"
                  value="all"
                  checked={applyTo === 'all'}
                  onChange={() => setApplyTo('all')}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                Todas las reservas
              </label>
              <label className="flex items-center text-white text-sm">
                <input
                  type="radio"
                  name="applyTo"
                  value="min_persons"
                  checked={applyTo === 'min_persons'}
                  onChange={() => setApplyTo('min_persons')}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                Reservas de
                <input
                  type="number"
                  value={personsCount}
                  onChange={(e) => setPersonsCount(parseInt(e.target.value) || 0)}
                  disabled={applyTo !== 'min_persons'}
                  className={`ml-2 w-16 p-1 rounded bg-[#33334F] text-white text-center ${applyTo !== 'min_persons' ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                o más personas
              </label>
              <label className="flex items-center text-white text-sm">
                <input
                  type="radio"
                  name="applyTo"
                  value="max_persons"
                  checked={applyTo === 'max_persons'}
                  onChange={() => setApplyTo('max_persons')}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                Reservas de
                <input
                  type="number"
                  value={personsCount}
                  onChange={(e) => setPersonsCount(parseInt(e.target.value) || 0)}
                  disabled={applyTo !== 'max_persons'}
                  className={`ml-2 w-16 p-1 rounded bg-[#33334F] text-white text-center ${applyTo !== 'max_persons' ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                o menos personas
              </label>
            </div>
          </div>

          <button
            onClick={handleCreateBlock}
            className="w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition-colors"
          >
            Crear Bloqueo
          </button>
        </div>

        {/* Bloqueos Creados para hoy */}
        <div className="mt-auto text-center text-gray-400 text-sm">
          Bloqueos Creados para hoy (0) {/* Aquí deberías mostrar el número real de bloqueos */}
        </div>
      </div>
    </div>
  );
};

export default BlockSidebar;