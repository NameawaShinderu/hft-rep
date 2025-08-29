import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  History, 
  Settings, 
  Menu,
  BarChart3,
  Wallet,
  Users
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector(state => state.ui);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'trading', icon: TrendingUp, label: 'Trading', path: '/trading' },
    { id: 'portfolio', icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { id: 'pamm', icon: Users, label: 'PAMM Manager', path: '/pamm' },
    { id: 'history', icon: History, label: 'History', path: '/history' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', path: '/wallet' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-16 bg-neutral border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (location.pathname === '/' && item.path === '/dashboard');
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      w-full flex items-center justify-center p-3 rounded-lg
                      transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }
                    `}
                    title={item.label}
                  >
                    <Icon className="w-6 h-6" />
                    
                    {/* Tooltip */}
                    <div className="
                      absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      whitespace-nowrap z-50 pointer-events-none
                    ">
                      {item.label}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="
          fixed top-4 left-4 z-50 lg:hidden
          w-10 h-10 bg-neutral rounded-lg
          flex items-center justify-center
          text-white hover:bg-gray-700
          transition-colors duration-200
        "
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};

export default Sidebar;