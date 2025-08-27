import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  const theme = useAppSelector(state => state.ui.theme);

  // Apply theme to document element
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className={`min-h-screen bg-bg-dark text-white font-primary ${theme}`}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;