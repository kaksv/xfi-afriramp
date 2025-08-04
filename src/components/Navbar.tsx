import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Menu, Moon, Sun } from 'lucide-react';
import NetworkSelector from './NetworkSelector';
import { ConnectKitButton } from 'connectkit';


interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [darkMode, setDarkMode] = useState(false);
  // const { isConnected } = useAccount();
  const { isConnected, address } = useAccount();
  
  // Get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/send':
        return 'Send ETH';
      case '/receive':
        return 'Receive ETH';
      case '/onramp':
        return 'Buy ';
      case '/offramp':
        return 'Sell ';
      case '/history':
        return 'Transaction History';
      default:
        return 'AfriRamp';
    }
  };
  
  // Toggle dark mode


  // Crossify connect Functionality.
    
  // End
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  
  // Set initial dark mode based on user preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-dark-800/80 border-b border-slate-200 dark:border-dark-700 px-4 md:px-8 py-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="mr-4 p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <img src="/logo.jpg" alt="AfriRamp Logo" className="w-8 h-8 rounded-md" />
            {/* <span className="font-bold text-xl">AfriRamp</span> */}
          </div>
          <h1 className="text-xl font-semibold md:ml-8">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected && <NetworkSelector />}
          </div>
          {/* <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button> */}
          <div className="flex items-center space-x-2">  
             
              {isConnected && address
               ? 
              //   <button>
              //  {address.slice(0, 6) + '...' + address.slice(-4)}
              //   </button>
               <ConnectKitButton.Custom>
                {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                  return (
                    <button onClick={show} className='p-2 border rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white  ' >
                      {isConnected ? address?.slice(0, 6) + '...' + address?.slice(-4) : " "}
                    </button>
                  );
                }}
              </ConnectKitButton.Custom>
                : 
                ' '
                }
          </div>
        </div>
      </div>
    </nav>
  );
}