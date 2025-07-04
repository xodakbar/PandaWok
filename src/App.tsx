import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/login.tsx';
import RecoverPassword from './login/RecoverPassword.tsx';
import Timeline from './host/timeline';
import ReservationForm from './reservation/ReservationForm';
import ClientsList from './host/clients.tsx';
import RequestPage from './host/RequestPage';
import Header from './components/Header';
import ListaEsperaPage from './host/ListaEsperaPage'; // Importa la nueva página de lista de espera

// Optional: Define your salons here if you need them in the Header.
// If salons are loaded dynamically, this part would change.
const mockSalones = [
  { id: '1', name: 'Salón Principal', tables: [] },
  { id: '2', name: 'Terraza Exterior', tables: [] },
  // ... more salons
];

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes without the Header (e.g., login, password recovery) */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contraseña" element={<RecoverPassword />} />

          {/*
            Routes that need the Header:
            We can wrap these routes in a layout that includes the Header,
            or render the Header directly within the route's element
            if there isn't a more complex layout.
            For simplicity in this example, I'll put it directly in each element.
            In a real app, consider a "Layout" component.
          */}
          <Route
            path="/timeline"
            element={
              <>
                <Header salones={mockSalones} />
                <Timeline />
              </>
            }
          />
          <Route
            path="/clientes"
            element={
              <>
                <Header salones={mockSalones} />
                <ClientsList />
              </>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <>
                <Header salones={mockSalones} />
                <RequestPage />
              </>
            }
          />
          <Route
            path="/reservation" // If this also needs the Header
            element={
              <>
                <Header salones={mockSalones} />
                <ReservationForm />
              </>
            }
          />
          {/* New route for the waiting list page */}
          <Route
            path="/lista-espera"
            element={
              <>
                <Header salones={mockSalones} />
                <ListaEsperaPage />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;