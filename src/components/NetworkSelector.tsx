import { useState } from 'react';
import { useSwitchChain, useConfig, useAccount, useChainId } from 'wagmi';
import { mainnet, sepolia, base, baseSepolia, celo, celoAlfajores } from 'wagmi/chains';
// import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Chain } from 'viem';


export const CrossFiMainnet = {
  id: 4158,
  name: 'CrossFi Mainnet',
  nativeCurrency: { name: 'CrossFi', symbol: 'XFi', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.ms'] },
  },
  blockExplorers: {
    default: { name: 'XFiScan', url: 'https://xfiscan.com/' },
  },
} as const satisfies Chain;

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const config = useConfig();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();
  
  if (!isConnected) return null;
  
  // Get the list of supported chains from the config
  const chains = config.chains.map(chain => {
    switch (chain.id) {
      case mainnet.id:
        return { id: chain.id, name: 'Ethereum Mainnet', icon: '🔲' };
      case 4158:
        return { id: chain.id, name: 'CrossFi Mainnet', icon: '🔲' };  
      case sepolia.id:  
        return { id: chain.id, name: 'Sepolia Testnet', icon: '🟣' };
      case base.id:
        return { id: chain.id, name: 'Base', icon: '🔵' };
      case baseSepolia.id:
        return { id: chain.id, name: 'Base Sepolia', icon: '🟦' };
      case celo.id:
        return { id: chain.id, name: 'Celo', icon: '🌱' };
      case celoAlfajores.id:
        return { id: chain.id, name: 'Celo Alfajores', icon: '🌿' };
      case 1135: // Lisk
        return { id: chain.id, name: 'Lisk', icon: '🔷' };
      default:
        return { id: chain.id, name: chain.name, icon: '⭐' };
    }
  });
  
  const currentChain = chains.find(chain => chain.id === 4158) || chains[0];
  
  const handleSwitchChain = (chainId: number) => {
    switchChain({ chainId });
    setIsOpen(false);
  };

  const handleSwitchCrossFi = () => {
    switchChain({ chainId: 4158 });
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between space-x-2 px-3 py-2 rounded-lg md:border md:border-slate-200 dark:border-dark-600 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentChain.icon}</span>
          <span className="hidden md:flex font-medium text-sm">{currentChain.name}</span>
        </div>
        {/* <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /> */}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
          
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 overflow-hidden z-20"
            >
              <div className="py-1">
                {chains.map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => handleSwitchCrossFi()}
                    className="w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors"
                  >
                    <span className="text-lg">{chain.icon}</span>
                    <span className=" font-medium text-sm">{chain.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}