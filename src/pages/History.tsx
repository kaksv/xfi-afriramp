import { useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Filter, Search, ExternalLink } from 'lucide-react';

// Mock transaction data (in a real app, this would come from a blockchain API)
const mockTransactions = [
  { 
    id: '1', 
    type: 'send', 
    amount: '0.05', 
    address: '0x1234...5678', 
    timestamp: new Date(Date.now() - 1000 * 60 * 30), 
    status: 'confirmed',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  { 
    id: '2', 
    type: 'receive', 
    amount: '0.2', 
    address: '0x8765...4321', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    status: 'confirmed',
    hash: '0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba'
  },
  { 
    id: '3', 
    type: 'send', 
    amount: '0.01', 
    address: '0x9876...5432', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    status: 'confirmed',
    hash: '0x1122334455667788990011223344556677889900112233445566778899001122'
  },
  { 
    id: '4', 
    type: 'receive', 
    amount: '0.15', 
    address: '0x2345...6789', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), 
    status: 'confirmed',
    hash: '0x3344556677889900112233445566778899001122334455667788990011223344'
  },
  { 
    id: '5', 
    type: 'send', 
    amount: '0.025', 
    address: '0x3456...7890', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), 
    status: 'confirmed',
    hash: '0x5566778899001122334455667788990011223344556677889900112233445566'
  },
  { 
    id: '6', 
    type: 'receive', 
    amount: '0.3', 
    address: '0x4567...8901', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), 
    status: 'confirmed',
    hash: '0x7788990011223344556677889900112233445566778899001122334455667788'
  },
  { 
    id: '7', 
    type: 'onramp', 
    amount: '0.5', 
    address: '-', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), 
    status: 'confirmed',
    hash: '0x9900112233445566778899001122334455667788990011223344556677889900'
  },
  { 
    id: '8', 
    type: 'offramp', 
    amount: '0.4', 
    address: '-', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144), 
    status: 'confirmed',
    hash: '0x1122334455667788990011223344556677889900112233445566778899001122'
  },
];

export default function History() {
  const { address } = useAccount();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter transactions by type and search query
  const filteredTransactions = mockTransactions.filter(tx => {
    // Filter by type
    if (filter !== 'all' && tx.type !== filter) {
      return false;
    }
    
    // Filter by search query (address or amount)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        tx.address.toLowerCase().includes(lowerCaseQuery) ||
        tx.amount.includes(searchQuery) ||
        tx.hash.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return true;
  });
  
  // Format date to relative time
  const formatRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };
  
  // Format date to full format
  const formatFullDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight size={18} />;
      case 'receive':
        return <ArrowDownLeft size={18} />;
      case 'onramp':
        return <ArrowDownLeft size={18} />;
      case 'offramp':
        return <ArrowUpRight size={18} />;
      default:
        return null;
    }
  };
  
  // Get transaction color class
  const getTransactionColorClass = (type: string) => {
    switch (type) {
      case 'send':
      case 'offramp':
        return 'bg-error-100 dark:bg-error-900/20 text-error-600 dark:text-error-400';
      case 'receive':
      case 'onramp':
        return 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400';
      default:
        return 'bg-slate-100 dark:bg-dark-600 text-slate-600 dark:text-slate-400';
    }
  };
  
  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'send':
        return 'Sent ';
      case 'receive':
        return 'Received ';
      case 'onramp':
        return 'Bought ';
      case 'offramp':
        return 'Sold ';
      default:
        return 'Transaction';
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-2 text-sm w-48 md:w-64"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input appearance-none pr-10 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="send">Sent</option>
                <option value="receive">Received</option>
                <option value="onramp">Bought</option>
                <option value="offramp">Sold</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="bg-slate-50 dark:bg-dark-600 rounded-lg p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-2">No transactions found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {searchQuery 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Your transactions will appear here once you start using EthFlow.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={tx.id}
                className="flex items-center p-4 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColorClass(tx.type)}`}>
                  {getTransactionIcon(tx.type)}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <p className="font-medium">
                        {getTransactionTypeLabel(tx.type)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {tx.address !== '-' ? tx.address : (tx.type === 'onramp' ? 'Fiat Purchase' : 'Fiat Sale')}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <p className={`font-semibold ${
                        tx.type === 'send' || tx.type === 'offramp' ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'
                      }`}>
                        {tx.type === 'send' || tx.type === 'offramp' ? '-' : '+'}{tx.amount} ETH
                      </p>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <span className="md:hidden">{formatRelativeTime(tx.timestamp)}</span>
                        <span className="hidden md:inline" title={formatFullDate(tx.timestamp)}>{formatRelativeTime(tx.timestamp)}</span>
                        <a 
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors"
                          title="View on Etherscan"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold mb-4">Transaction Information</h3>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          {/* <p>
            This page displays your transaction history from your connected wallet. In a production environment, 
            this data would be fetched directly from the blockchain.
          </p> */}
          <p>
            All Ethereum transactions are permanently recorded on the blockchain and can be viewed by anyone. 
            For detailed transaction information, click the external link icon to view the transaction on Etherscan.
          </p>
        </div>
      </motion.div>
    </div>
  );
}