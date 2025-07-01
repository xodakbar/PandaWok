import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timeline from './host/timeline';
import ReservationForm from './reservation/ReservationForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reservation" element={<ReservationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
