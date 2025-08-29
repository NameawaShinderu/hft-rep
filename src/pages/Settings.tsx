import React, { useState } from 'react';
import { useGetUserDataQuery } from '../services/api';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTheme } from '../store/slices/uiSlice';
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  Volume2,
  VolumeX,
  CreditCard,
  Settings as SettingsIcon,
  Save,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.ui);
  const { data: userData } = useGetUserDataQuery('user123');
  
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.data.name || 'John Trader',
    email: userData?.data.email || 'john@trader.com',
    phone: '+1 (555) 123-4567',
    notifications: userData?.data.preferences.notifications ?? true,
    soundAlerts: userData?.data.preferences.soundAlerts ?? false,
    theme: theme || 'dark',
    sidebarCollapsed: userData?.data.preferences.sidebarCollapsed ?? false,
    tablePageSize: userData?.data.preferences.tablePageSize || 20,
    currency: userData?.data.preferences.currency || 'USD',
    twoFactorEnabled: true,
    tradingPassword: '••••••••',
  });

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your account information and personal details',
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 'preferences',
      title: 'Interface Preferences',
      description: 'Customize your trading platform experience',
      icon: <SettingsIcon className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure alerts and notification settings',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage your account security and privacy settings',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'trading',
      title: 'Trading Settings',
      description: 'Configure trading preferences and risk management',
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', formData);
    alert('Settings saved successfully!');
  };

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setFormData(prev => ({ ...prev, theme: newTheme }));
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-h1 font-display font-semibold text-white mb-2">
          Settings & Preferences
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Customize your trading platform experience and manage account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-neutral rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Settings Menu</h3>
            </div>
            <nav className="p-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${
                    activeSection === section.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <div>
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs opacity-75">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-neutral rounded-xl border border-gray-700">
            
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-6">Profile Settings</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full md:w-1/2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Interface Preferences */}
            {activeSection === 'preferences' && (
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-6">Interface Preferences</h3>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Theme</label>
                    <div className="flex space-x-3">
                      {[
                        { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                        { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                        { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleThemeChange(option.value as any)}
                          className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                            formData.theme === option.value
                              ? 'border-primary bg-primary/20 text-primary'
                              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {option.icon}
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Base Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Table Page Size</label>
                      <select
                        value={formData.tablePageSize}
                        onChange={(e) => setFormData(prev => ({ ...prev, tablePageSize: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-6">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-white font-medium">Push Notifications</div>
                        <div className="text-sm text-gray-400">Receive alerts for price movements and orders</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications}
                        onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {formData.soundAlerts ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                      <div>
                        <div className="text-white font-medium">Sound Alerts</div>
                        <div className="text-sm text-gray-400">Audio notifications for important events</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.soundAlerts}
                        onChange={(e) => setFormData(prev => ({ ...prev, soundAlerts: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-6">Security & Privacy</h3>
                
                <div className="space-y-6">
                  {/* Password Change */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Change Trading Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.tradingPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, tradingPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two Factor Authentication */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-success" />
                      <div>
                        <div className="text-white font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-400">Add an extra layer of security to your account</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.twoFactorEnabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Trading Settings */}
            {activeSection === 'trading' && (
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-6">Trading Configuration</h3>
                
                <div className="space-y-6">
                  {/* Risk Management */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Risk Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Max Daily Loss ($)</label>
                        <input
                          type="number"
                          defaultValue={5000}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Max Position Size</label>
                        <input
                          type="number"
                          defaultValue={10}
                          step="0.1"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Default Settings */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">Default Order Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Default Volume</label>
                        <input
                          type="number"
                          defaultValue={1}
                          step="0.01"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Default Stop Loss (pips)</label>
                        <input
                          type="number"
                          defaultValue={50}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Default Take Profit (pips)</label>
                        <input
                          type="number"
                          defaultValue={100}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;