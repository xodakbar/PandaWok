import React, { useState } from 'react';
import logo from '../assets/wokpanda-white.png';

const Header: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('Todo el día');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const viewModes = ['Todo el día', 'Horario'];

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectViewMode = (mode: string) => {
    setViewMode(mode);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#3C2022' }}>
      <div className="flex items-center space-x-4">
        <button className="p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <img 
            src={logo}
            alt="Wok Panda Logo" 
            className="h-16 w-24"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-6 flex-1">
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            <span>{viewMode}</span>
            <svg className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7-7-7 7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 rounded-md shadow-lg z-50 min-w-[120px]" style={{ backgroundColor: '#211B17' }}>
              {viewModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => selectViewMode(mode)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-orange-500/20 first:rounded-t-md last:rounded-b-md transition-colors"
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={goToToday}
          className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Ir a hoy
        </button>
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousDay} className="hover:bg-white/10 p-1 rounded transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white min-w-[100px] text-center">{formatDate(currentDate)}</span>
          <button onClick={goToNextDay} className="hover:bg-white/10 p-1 rounded transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="w-48"></div>
    </div>
  );
};

export default Header;