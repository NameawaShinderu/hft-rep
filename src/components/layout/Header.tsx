import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setTheme } from '../../store/slices/uiSlice';
import { Bell, Sun, Moon, User, Search } from 'lucide-react';
import ConnectionStatus from '../status/ConnectionStatus';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.ui);
  const user = useAppSelector(state => state.user);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="h-16 bg-neutral border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left Section - Search */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search symbols, providers..."
            className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {/* Right Section - User Info & Actions */}
      <div className="flex items-center space-x-4">
        {/* Account Balance */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <div className="text-right">
            <div className="text-gray-400">Balance</div>
            <div className="text-white font-mono font-semibold">
              ${user.balance.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400">P&L</div>
            <div className={`font-mono font-semibold ${
              user.pl >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {user.pl >= 0 ? '+' : ''}${user.pl.toLocaleString()}
            </div>
          </div>
        </div>

        {/* WebSocket Connection Status */}
        <ConnectionStatus size="md" showText={false} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:block text-right text-sm">
            <div className="text-white font-medium">{user.name}</div>
            <div className="text-gray-400 text-xs">{user.email}</div>
          </div>
          <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;