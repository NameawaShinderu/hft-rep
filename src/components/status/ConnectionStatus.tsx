import React from 'react';
import { Wifi, WifiOff, RotateCcw, AlertTriangle } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className = '', 
  showText = true,
  size = 'sm'
}) => {
  const { connection, reconnect } = useWebSocket();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  const getStatusConfig = () => {
    switch (connection.status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-success',
          bgColor: 'bg-success/20',
          text: 'Live Data',
          pulse: false
        };
      case 'connecting':
        return {
          icon: RotateCcw,
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          text: 'Connecting...',
          pulse: true
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          color: 'text-danger',
          bgColor: 'bg-danger/20',
          text: 'Offline',
          pulse: false
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-danger',
          bgColor: 'bg-danger/20',
          text: 'Connection Error',
          pulse: true
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/20',
          text: 'Unknown',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;  const handleStatusClick = () => {
    if (connection.status === 'disconnected' || connection.status === 'error') {
      reconnect();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Status Indicator */}
      <div 
        className={`
          relative flex items-center justify-center rounded-full p-1.5 cursor-pointer
          ${config.bgColor} ${config.color}
          hover:opacity-80 transition-opacity
        `}
        onClick={handleStatusClick}
        title={`Market Data Status: ${config.text}${connection.reconnectAttempts > 0 ? ` (${connection.reconnectAttempts} reconnect attempts)` : ''}`}
      >
        <IconComponent 
          className={`
            ${sizeClasses[size]} 
            ${config.pulse ? 'animate-pulse' : ''} 
            ${connection.status === 'connecting' ? 'animate-spin' : ''}
          `} 
        />
        
        {/* Pulse animation for connected state */}
        {connection.status === 'connected' && (
          <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-25"></div>
        )}
      </div>
      
      {/* Status Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
          {connection.reconnectAttempts > 0 && (
            <span className="text-xs text-gray-400">
              Attempt: {connection.reconnectAttempts}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;