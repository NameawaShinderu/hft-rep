import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector(state => state.ui);

  return (
    <div className="flex h-screen bg-bg-dark text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - Fixed Mobile Layout */}
      <div className="flex-1 flex flex-col lg:ml-0 transition-all duration-300">
        {/* Header */}
        <Header />
        
        {/* Main Content - Better Mobile Scrolling */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-bg-dark">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay - Enhanced */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
    </div>
  );
};

export default MainLayout;