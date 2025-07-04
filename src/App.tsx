import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import type { ReactNode } from 'react';
import Login from './login/login';
import RecoverPassword from './login/RecoverPassword';
import Timeline from './host/timeline';
import ReservationForm from './reservation/ReservationForm';
import ClientsList from './host/clients';
import RequestPage from './host/RequestPage';
import Header from './components/Header';
import ListaEsperaPage from './host/ListaEsperaPage';
import AdminUsersPage from './host/AdminUsersPage';

// Mock de salones para el header
const mockSalones = [
  { id: '1', name: 'Salón Principal', tables: [] },
  { id: '2', name: 'Terraza Exterior', tables: [] },
];

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contraseña" element={<RecoverPassword />} />

        {/* Rutas privadas */}
        <Route
          path="/timeline"
          element={
            <PrivateRoute>
              <>
                <Header salones={mockSalones} />
                <Timeline />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <>
                <Header salones={mockSalones} />
                <ClientsList />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/solicitudes"
          element={
            <PrivateRoute>
              <>
                <Header salones={mockSalones} />
                <RequestPage />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/reservation"
          element={
            <PrivateRoute>
              <>
                <Header salones={mockSalones} />
                <ReservationForm />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/lista-espera"
          element={
            <PrivateRoute>
              <>
                <Header salones={mockSalones} />
                <ListaEsperaPage />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute>
              <>
                <Header salones={mockSalones} />
                <AdminUsersPage />
              </>
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto (cuando no coincide ninguna) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
