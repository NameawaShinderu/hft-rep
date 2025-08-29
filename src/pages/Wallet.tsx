import React, { useState } from 'react';
import { useGetUserDataQuery } from '../services/api';
import { 
  Wallet,
  Plus,
  Minus,
  Bitcoin,
  CreditCard,
  Building2,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface PaymentMethodCardProps {
  method: {
    id: string;
    name: string;
    type: string;
    minimumDeposit: number;
    icon: React.ReactNode;
    isAvailable: boolean;
    processingTime: string;
    fee: number;
  };
  onSelect: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        !method.isAvailable 
          ? 'border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed'
          : 'border-gray-600 bg-neutral hover:border-primary hover:bg-neutral/80'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            method.type === 'crypto' ? 'bg-orange-600/20' :
            method.type === 'bank' ? 'bg-blue-600/20' :
            'bg-success/20'
          }`}>
            {method.icon}
          </div>
          <div>
            <h4 className="font-medium text-white">{method.name}</h4>
            <p className="text-sm text-gray-400">{method.processingTime}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Min: ${method.minimumDeposit}</div>
          <div className="text-xs text-gray-500">Fee: {method.fee}%</div>
        </div>
      </div>

      {!method.isAvailable && (
        <div className="text-xs text-gray-500 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          Currently unavailable
        </div>
      )}
    </div>
  );
};
const WalletPage: React.FC = () => {
  const { data: userData, isLoading } = useGetUserDataQuery('user123');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);

  // Enhanced payment methods with dark theme styling
  const paymentMethods = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      type: 'crypto',
      minimumDeposit: 100,
      maximumDeposit: 50000,
      processingTime: 'Instant',
      fee: 0,
      isAvailable: true,
      icon: <Bitcoin className="w-5 h-5 text-orange-400" />,
      description: 'Fast and secure Bitcoin deposits'
    },
    {
      id: 'ethereum',
      name: 'ETH',
      type: 'crypto',
      minimumDeposit: 100,
      maximumDeposit: 50000,
      processingTime: 'Instant',
      fee: 0,
      isAvailable: true,
      icon: <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">E</div>,
      description: 'Ethereum network deposits'
    },
    {
      id: 'crypto_gateway',
      name: 'Crypto Payment Gateway',
      type: 'crypto',
      minimumDeposit: 100,
      maximumDeposit: 100000,
      processingTime: '5-10 min',
      fee: 1.5,
      isAvailable: true,
      icon: <DollarSign className="w-5 h-5 text-success" />,
      description: 'Multiple cryptocurrency support'
    },    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank',
      minimumDeposit: 100,
      maximumDeposit: 1000000,
      processingTime: '1-3 days',
      fee: 0,
      isAvailable: true,
      icon: <Building2 className="w-5 h-5 text-primary" />,
      description: 'Traditional bank wire transfer'
    },
    {
      id: 'crypto_gateway_xtreme',
      name: 'Crypto Payment Gateway (XTREMENEXT)',
      type: 'crypto',
      minimumDeposit: 100,
      maximumDeposit: 100000,
      processingTime: 'Instant',
      fee: 2,
      isAvailable: false,
      icon: <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">X</div>,
      description: 'Advanced crypto gateway (maintenance)'
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'digital_wallet',
      minimumDeposit: 1000,
      maximumDeposit: 200000,
      processingTime: 'Instant',
      fee: 0,
      isAvailable: true,
      icon: <Smartphone className="w-5 h-5 text-success" />,
      description: 'Indian UPI payments'
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 5000,
      method: 'Bitcoin',
      status: 'completed',
      timestamp: new Date('2025-08-28T14:30:00'),
      txHash: '0x1234...5678'
    },    {
      id: 'TXN002',
      type: 'investment',
      amount: 1000,
      method: 'PAMM Subscription',
      status: 'completed',
      timestamp: new Date('2025-08-27T09:15:00'),
      provider: 'Harsha'
    },
    {
      id: 'TXN003',
      type: 'withdrawal',
      amount: 2500,
      method: 'Bank Transfer',
      status: 'pending',
      timestamp: new Date('2025-08-26T16:45:00')
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = paymentMethods.find(m => m.id === methodId);
    if (method) {
      setAmount(method.minimumDeposit);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    console.log(`${activeTab.toUpperCase()} Request:`, {
      method: method.name,
      amount,
      fee: (amount * method.fee) / 100,
      total: activeTab === 'deposit' ? amount : amount - (amount * method.fee) / 100
    });

    alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} request submitted successfully!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-h1 font-display font-semibold text-white mb-2">
          Wallet Management
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Manage your deposits, withdrawals, and account funding
        </p>
      </div>

      {/* Wallet Overview - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Available Balance</h3>
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-mono text-white">
            ${userData?.data.balance.toLocaleString() || '50,000.00'}
          </div>
          <div className="text-xs text-success flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            Available for trading
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">PAMM Invested</h3>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono text-white">
            $1,200.00
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Across 2 providers
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total P&L</h3>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-mono text-success">
            +$47.58
          </div>
          <div className="text-xs text-success mt-1">
            +3.97% return
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Pending</h3>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-mono text-white">
            $2,500.00
          </div>
          <div className="text-xs text-warning mt-1">
            1 withdrawal pending
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">

        {/* Deposit/Withdraw Section */}
        <div className="bg-neutral rounded-xl border border-gray-700 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'deposit'
                  ? 'bg-success/20 text-success border-b-2 border-success'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Deposit</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'withdraw'
                  ? 'bg-danger/20 text-danger border-b-2 border-danger'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Minus className="w-4 h-4" />
                <span>Withdraw</span>
              </div>
            </button>
          </div>

          <div className="p-6">{activeTab === 'deposit' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">Deposit Payment</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-full">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Choose payment method</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      onSelect={() => method.isAvailable && handleMethodSelect(method.id)}
                    />
                  ))}
                </div>
                {/* Amount Input */}
                {selectedMethod && (
                  <div className="border-t border-gray-700 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Deposit Amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            min={selectedPaymentMethod?.minimumDeposit}
                            max={selectedPaymentMethod?.maximumDeposit}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Min: ${selectedPaymentMethod?.minimumDeposit}</span>
                          {selectedPaymentMethod?.maximumDeposit && (
                            <span>Max: ${selectedPaymentMethod.maximumDeposit.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {/* Fee Calculation */}
                      {selectedPaymentMethod && selectedPaymentMethod.fee > 0 && (
                        <div className="bg-warning/20 border border-warning/30 rounded-lg p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Processing Fee ({selectedPaymentMethod.fee}%)</span>
                            <span className="text-white font-medium">${((amount * selectedPaymentMethod.fee) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium border-t border-warning/30 pt-2 mt-2">
                            <span className="text-gray-300">Total Amount</span>
                            <span className="text-white">${amount.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-success hover:bg-success/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Proceed with Deposit</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">Withdraw Funds</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-full">
                    <Minus className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Choose withdrawal method</span>
                  </div>
                </div>

                {/* Withdrawal Methods */}
                <div className="space-y-3">
                  {paymentMethods.filter(method => method.isAvailable).map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      onSelect={() => handleMethodSelect(method.id)}
                    />
                  ))}
                </div>

                {/* Withdrawal Form */}
                {selectedMethod && (
                  <div className="border-t border-gray-700 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Withdrawal Amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            min={selectedPaymentMethod?.minimumDeposit}
                            max={userData?.data.balance || 0}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Available: ${userData?.data.balance?.toLocaleString() || '0'}</span>
                          <span>Min: ${selectedPaymentMethod?.minimumDeposit}</span>
                        </div>
                      </div>

                      {/* Fee Calculation for Withdrawal */}
                      {selectedPaymentMethod && selectedPaymentMethod.fee > 0 && (
                        <div className="bg-warning/20 border border-warning/30 rounded-lg p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Processing Fee ({selectedPaymentMethod.fee}%)</span>
                            <span className="text-white font-medium">${((amount * selectedPaymentMethod.fee) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium border-t border-warning/30 pt-2 mt-2">
                            <span className="text-gray-300">You'll Receive</span>
                            <span className="text-white">${(amount - (amount * selectedPaymentMethod.fee) / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-danger hover:bg-danger/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Minus className="w-4 h-4" />
                        <span>Process Withdrawal</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-neutral rounded-xl border border-gray-700 overflow-hidden">
          <div className="border-b border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-2">Recent Transactions</h3>
            <p className="text-sm text-gray-400">Your latest wallet activity</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'deposit' ? 'bg-success/20' :
                      tx.type === 'withdrawal' ? 'bg-danger/20' :
                      'bg-purple-500/20'
                    }`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4 text-success" /> :
                       tx.type === 'withdrawal' ? <ArrowUpRight className="w-4 h-4 text-danger" /> :
                       <TrendingUp className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{tx.method}</div>
                      <div className="text-sm text-gray-400">{tx.timestamp.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-mono text-lg ${
                      tx.type === 'deposit' ? 'text-success' :
                      tx.type === 'withdrawal' ? 'text-danger' :
                      'text-purple-400'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {tx.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span className="text-success">Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-warning" />
                          <span className="text-warning">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;