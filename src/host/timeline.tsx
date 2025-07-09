import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Move } from 'lucide-react';
import ReservationDetailsPanel from '../components/ReservationDetailsPanel';
import NewReservationModal from '../components/NewReservationModal';
import BlockTableModal from '../components/BlockTableModal';
import AgregarMesaModal from '../components/NuevaMesaModal';
import WalkInModal from '../components/WalkInModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Salon {
  id: number;
  nombre: string;
  capacidad: number;
  es_condicion_especial: boolean;
}

interface Mesa {
  id: number;
  salon_id: number;
  numero_mesa: string;
  tipo_mesa: string;
  tamanio: string;
  capacidad: number;
  esta_activa: boolean;
  posX?: number;
  posY?: number;
}

interface Reserva {
  id: number;
  cliente_id: number;
  mesa_id: number;
  fecha_reserva: string;
  cantidad_personas: number;
  notas?: string;
  cliente_nombre?: string;
  cliente_apellido?: string;
  horario_id?: number;
  horario_descripcion?: string;
}

interface BloqueoMesa {
  id: number;
  mesa_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return times;
};

const Timeline: React.FC = () => {
  const [salones, setSalones] = useState<Salon[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [reservasMesa, setReservasMesa] = useState<Reserva[]>([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [bloqueosMesa, setBloqueosMesa] = useState<BloqueoMesa[]>([]);
  const [bloqueoSeleccionado, setBloqueoSeleccionado] = useState<BloqueoMesa | null>(null);
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [showBlockTableModal, setShowBlockTableModal] = useState(false);
  const [showAgregarMesaModal, setShowAgregarMesaModal] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(new Date().toISOString().split('T')[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  // Carga salones
  useEffect(() => {
    const fetchSalones = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/salones`);
        const salonesData = res.data.salones || res.data;
        setSalones(salonesData);
        if (salonesData.length > 0) setSelectedSalonId(salonesData[0].id);
      } catch (error) {
        console.error('Error cargando salones:', error);
      }
    };
    fetchSalones();
  }, []);

  // Carga mesas cuando cambia el salón seleccionado
  useEffect(() => {
    if (!selectedSalonId) return;

    const fetchMesas = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/mesas/salon/${selectedSalonId}/mesas`);
        const mesasConPos = res.data.map((mesa: Mesa) => ({
          ...mesa,
          posX: typeof mesa.posX === 'number' && !isNaN(mesa.posX) ? mesa.posX : 50 + mesa.id * 5,
          posY: typeof mesa.posY === 'number' && !isNaN(mesa.posY) ? mesa.posY : 50 + mesa.id * 5,
        }));
        setMesas(mesasConPos);
        setMesaSeleccionada(null);
        setReservasMesa([]);
        setReservaSeleccionada(null);
        setBloqueosMesa([]);
        setBloqueoSeleccionado(null);
      } catch (error) {
        console.error('Error cargando mesas:', error);
        setMesas([]);
      }
    };
    fetchMesas();
  }, [selectedSalonId]);

  // Carga reservas y bloqueos cuando cambia la mesa o la fecha
  useEffect(() => {
    if (!mesaSeleccionada) {
      setReservasMesa([]);
      setBloqueosMesa([]);
      setReservaSeleccionada(null);
      setBloqueoSeleccionado(null);
      return;
    }

    const fetchReservasYBloqueos = async () => {
      try {
        const [resReservas, resBloqueos] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/reservas/mesa/${mesaSeleccionada.id}`, {
            params: { fecha: fechaSeleccionada },
            validateStatus: (status) => status === 200 || status === 404,
          }),
          axios.get(`${API_BASE_URL}/api/mesas/bloqueos/mesa/${mesaSeleccionada.id}`, {
            params: { fecha: fechaSeleccionada },
            validateStatus: (status) => status === 200 || status === 404,
          }),
        ]);
        setReservasMesa(resReservas.status === 200 ? resReservas.data.reservas || [] : []);
        setBloqueosMesa(resBloqueos.status === 200 ? resBloqueos.data.bloqueos || [] : []);
        setReservaSeleccionada(null);
        setBloqueoSeleccionado(null);
      } catch (error) {
        console.error('Error cargando reservas o bloqueos:', error);
        setReservasMesa([]);
        setBloqueosMesa([]);
      }
    };
    fetchReservasYBloqueos();
  }, [mesaSeleccionada, fechaSeleccionada]);

  // Mover mesa y guardar posición
  const handleDragEnd = async (mesaId: number, info: any) => {
    const { offset } = info;
    setMesas((prevMesas) =>
      prevMesas.map((mesa) => {
        if (mesa.id === mesaId) {
          const newPosX = (mesa.posX || 0) + offset.x;
          const newPosY = (mesa.posY || 0) + offset.y;

          axios
            .put(`${API_BASE_URL}/api/mesas/${mesaId}/posicion`, { posX: newPosX, posY: newPosY })
            .catch((err) => console.error('Error guardando posición:', err));

          return { ...mesa, posX: newPosX, posY: newPosY };
        }
        return mesa;
      })
    );
  };

  // Bloquear mesa
  const handleBlockTable = async (tableId: number, startTime: string, endTime: string, date: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/mesas/bloqueos/`, {
        mesa_id: tableId,
        fecha: date,
        hora_inicio: startTime,
        hora_fin: endTime,
      });
      alert('Mesa bloqueada correctamente');
      if (mesaSeleccionada) {
        setBloqueosMesa((prev) => [
          ...prev,
          { id: Date.now(), mesa_id: tableId, fecha: date, hora_inicio: startTime, hora_fin: endTime },
        ]);
      }
    } catch (error) {
      console.error('Error bloqueando mesa:', error);
      alert('Error bloqueando mesa. Intenta de nuevo.');
    }
  };

  // Desbloquear mesa
  const handleUnlockTable = async (bloqueoId: number) => {
    try {
      await axios.put(`${API_BASE_URL}/api/mesas/bloqueos/${bloqueoId}/desbloquear`);
      alert('Bloqueo eliminado correctamente');
      setBloqueosMesa((prev) => prev.filter((b) => b.id !== bloqueoId));
      setBloqueoSeleccionado(null);
    } catch (error) {
      console.error('Error desbloqueando mesa:', error);
      alert('Error desbloqueando mesa. Intenta de nuevo.');
    }
  };

  // Agregar nueva mesa
  const handleAgregarMesa = async (mesaData: { salon_id: number; tipo_mesa: string; tamanio: string }) => {
    try {
      await axios.post(`${API_BASE_URL}/api/mesas`, mesaData);
      if (selectedSalonId) {
        const res = await axios.get(`${API_BASE_URL}/api/mesas/salon/${selectedSalonId}/mesas`);
        const mesasConPos = res.data.map((mesa: Mesa) => ({
          ...mesa,
          posX: typeof mesa.posX === 'number' && !isNaN(mesa.posX) ? mesa.posX : 50 + mesa.id * 5,
          posY: typeof mesa.posY === 'number' && !isNaN(mesa.posY) ? mesa.posY : 50 + mesa.id * 5,
        }));
        setMesas(mesasConPos);
      }
      setShowAgregarMesaModal(false);
    } catch (error) {
      console.error('Error agregando mesa:', error);
      alert('No se pudo agregar la mesa. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel izquierdo */}
      <aside className="w-80 bg-[#FDF6E3] p-4 flex flex-col text-gray-800 shadow-lg">
        <label htmlFor="fechaSeleccionada" className="mb-2 font-semibold">
          Seleccionar Fecha
        </label>
        <input
          type="date"
          id="fechaSeleccionada"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {mesaSeleccionada ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Mesa {mesaSeleccionada.numero_mesa}</h2>

            {/* BLOQUEOS */}
            {bloqueosMesa.length > 0 ? (
              <div className="mb-4 p-3 bg-red-100 rounded border border-red-400 text-red-800 max-h-44 overflow-auto">
                <h3 className="font-semibold mb-2">Bloqueos:</h3>
                {bloqueosMesa.map((bloqueo) => (
                  <div
                    key={bloqueo.id}
                    className={`p-2 rounded-md border text-sm mb-2 cursor-pointer transition ${
                      bloqueoSeleccionado?.id === bloqueo.id
                        ? 'bg-red-300 border-red-600'
                        : 'bg-white border-red-300 hover:bg-red-200'
                    }`}
                    onClick={() => setBloqueoSeleccionado(bloqueo)}
                  >
                    <p className="font-semibold">
                      🕒 {bloqueo.hora_inicio} - {bloqueo.hora_fin}
                    </p>
                    <p className="text-xs">📅 {bloqueo.fecha}</p>
                  </div>
                ))}

                {bloqueoSeleccionado && (
                  <div className="mt-3 p-3 bg-red-200 rounded border border-red-500 text-sm">
                    <p>
                      <strong>Fecha:</strong> {bloqueoSeleccionado.fecha}
                    </p>
                    <p>
                      <strong>Inicio:</strong> {bloqueoSeleccionado.hora_inicio}
                    </p>
                    <p>
                      <strong>Fin:</strong> {bloqueoSeleccionado.hora_fin}
                    </p>
                    <button
                      onClick={() => handleUnlockTable(bloqueoSeleccionado.id)}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Desbloquear Mesa
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="mb-4 text-gray-600">No hay bloqueos para esta fecha.</p>
            )}

            {/* RESERVAS */}
            {reservasMesa.length === 0 ? (
              <p className="text-gray-600">No hay reservas para esta fecha.</p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                {reservasMesa.map((reserva) => (
                  <div
                    key={reserva.id}
                    onClick={() => setReservaSeleccionada(reserva)}
                    className={`p-3 rounded-lg border shadow-sm cursor-pointer transition text-sm ${
                      reservaSeleccionada?.id === reserva.id
                        ? 'bg-orange-100 border-orange-400'
                        : 'bg-white border-gray-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      👤 {reserva.cliente_nombre} {reserva.cliente_apellido}
                    </div>
                    <div className="text-gray-700">👥 {reserva.cantidad_personas} personas</div>
                    {reserva.horario_descripcion && (
                      <div className="text-gray-600">🕐 {reserva.horario_descripcion}</div>
                    )}
                    {reserva.notas && (
                      <div className="text-gray-500 italic truncate">📝 {reserva.notas}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ACCIONES */}
            <div className="mt-auto space-y-2 pt-4">
              <button
                onClick={() => setShowNewReservationModal(true)}
                className="w-full py-3 bg-orange-600 rounded text-white font-semibold hover:bg-orange-700 transition"
              >
                + Nueva reserva
              </button>
              <button
                onClick={() => setShowBlockTableModal(true)}
                className="w-full py-3 bg-red-600 rounded text-white font-semibold hover:bg-red-700 transition"
              >
                Bloquear Mesa
              </button>
              <button
                onClick={() => {
                  if (!mesaSeleccionada) {
                    alert('Selecciona una mesa primero.');
                    return;
                  }
                  setShowWalkInModal(true);
                }}
                className="w-full py-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 transition"
              >
                Sentar Walk-in
              </button>

              <button
                onClick={async () => {
                  if (!mesaSeleccionada) return;
                  if (
                    !window.confirm(
                      `¿Eliminar mesa ${mesaSeleccionada.numero_mesa}? Esta acción no se puede deshacer.`
                    )
                  )
                    return;
                  try {
                    await axios.delete(`${API_BASE_URL}/api/mesas/${mesaSeleccionada.id}`);
                    alert('Mesa eliminada correctamente');
                    if (selectedSalonId) {
                      const res = await axios.get(`${API_BASE_URL}/api/mesas/salon/${selectedSalonId}/mesas`);
                      const mesasConPos = res.data.map((mesa: Mesa) => ({
                        ...mesa,
                        posX: typeof mesa.posX === 'number' && !isNaN(mesa.posX) ? mesa.posX : 50 + mesa.id * 5,
                        posY: typeof mesa.posY === 'number' && !isNaN(mesa.posY) ? mesa.posY : 50 + mesa.id * 5,
                      }));
                      setMesas(mesasConPos);
                    }
                    setMesaSeleccionada(null);
                  } catch (error) {
                    console.error('Error eliminando mesa:', error);
                    alert('No se pudo eliminar la mesa. Intenta de nuevo.');
                  }
                }}
                className="w-full py-3 bg-red-700 rounded text-white font-semibold hover:bg-red-800 transition"
              >
                Eliminar Mesa
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-8">Selecciona una mesa para ver reservas</p>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Salones y Mesas</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAgregarMesaModal(true)}
              className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
            >
              Nueva Mesa
            </button>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow ${
                isEditMode ? 'bg-orange-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition`}
            >
              <Move className="w-5 h-5" />
              {isEditMode ? 'Modo mover activo' : 'Mover Mesas'}
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[calc(100vh-160px)] bg-white rounded shadow p-4"
        >
          {mesas.map((mesa) => {
            const bloqueosDeMesa = bloqueosMesa.filter((b) => b.mesa_id === mesa.id);

            return (
              <motion.div
                key={mesa.id}
                drag={isEditMode}
                dragConstraints={containerRef}
                whileDrag={{ scale: 1.05, zIndex: 100 }}
                onDragEnd={(event, info) => handleDragEnd(mesa.id, info)}
                onClick={() => {
                  setMesaSeleccionada(mesa);
                  setReservaSeleccionada(null);
                  setBloqueoSeleccionado(null);
                }}
                className={`absolute flex flex-col items-center justify-center text-gray-900 font-semibold shadow cursor-pointer ${
                  mesa.tipo_mesa === 'redonda'
                    ? 'rounded-full'
                    : mesa.tipo_mesa === 'cuadrada'
                    ? 'rounded'
                    : 'rounded-md'
                }`}
                style={{
                  width: mesa.tamanio === 'pequeña' ? 50 : mesa.tamanio === 'mediana' ? 70 : 90,
                  height: mesa.tamanio === 'pequeña' ? 50 : mesa.tamanio === 'mediana' ? 70 : 90,
                  backgroundColor:
                    mesaSeleccionada?.id === mesa.id
                      ? '#F97316'
                      : bloqueosDeMesa.length > 0
                      ? '#FCA5A5'
                      : '#F3E8D9',
                  border: '3px dashed #D97706',
                  top: 0,
                  left: 0,
                }}
                animate={{ x: mesa.posX || 0, y: mesa.posY || 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="text-sm">{mesa.numero_mesa}</div>
                {bloqueosDeMesa.length > 0 && (
                  <div className="text-xs text-red-700 mt-1">Bloqueada</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Modales */}
      {reservaSeleccionada && (
        <ReservationDetailsPanel
          reservaId={reservaSeleccionada.id}
          onClose={() => setReservaSeleccionada(null)}
        />
      )}

      {showNewReservationModal && mesaSeleccionada && (
        <NewReservationModal
          isOpen={showNewReservationModal}
          onClose={() => setShowNewReservationModal(false)}
          tableId={mesaSeleccionada.id}
          fechaSeleccionada={fechaSeleccionada}
          onReservationCreate={(newRes) => {
            setReservaSeleccionada(newRes);
            setShowNewReservationModal(false);
          }}
        />
      )}

      {showBlockTableModal && mesaSeleccionada && (
        <BlockTableModal
          isOpen={showBlockTableModal}
          onClose={() => setShowBlockTableModal(false)}
          tableId={mesaSeleccionada.id}
          currentSalonName={salones.find((s) => s.id === selectedSalonId)?.nombre || ''}
          generateTimeOptions={generateTimeOptions}
          fechaSeleccionada={fechaSeleccionada}
          onBlock={(tableId, startTime, endTime, fecha) => {
            handleBlockTable(tableId, startTime, endTime, fecha);
            setShowBlockTableModal(false);
          }}
        />
      )}

      {showWalkInModal && mesaSeleccionada && (
        <WalkInModal
          mesaId={mesaSeleccionada.id}
          mesaNumero={mesaSeleccionada.numero_mesa}
          fechaSeleccionada={fechaSeleccionada}
          onClose={() => setShowWalkInModal(false)}
          onReservaCreada={(nuevaReserva) => {
            setReservasMesa((prev) => [...prev, nuevaReserva]);
            setReservaSeleccionada(nuevaReserva);
            setShowWalkInModal(false);
          }}
        />
      )}

      {showAgregarMesaModal && (
        <AgregarMesaModal
          salones={salones}
          onClose={() => setShowAgregarMesaModal(false)}
          onAgregar={handleAgregarMesa}
        />
      )}
    </div>
  );
};

export default Timeline;
