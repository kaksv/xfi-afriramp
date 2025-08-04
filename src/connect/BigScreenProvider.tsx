import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, base, baseSepolia, celo, celoAlfajores } from 'wagmi/chains';
// Create the query client
const queryClient = new QueryClient();

// Create the Wagmi config
const config = createConfig({
  chains: [
    // mainnet, 
    // sepolia, 
    base, 
    // baseSepolia, 
    // celo, 
    // celoAlfajores, 
    // lisk
  ],
  transports: {
    // [mainnet.id]: http(),
    // [sepolia.id]: http(),
    [base.id]: http(),
    // [baseSepolia.id]: http(),
    // [celo.id]: http(),
    // [celoAlfajores.id]: http(),
    // [lisk.id]: http(),
  },
});

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  // projectId: 'YOUR_WEB3MODAL_PROJECT_ID', // Replace with your Web3Modal project ID
  projectId: 'aa51d05f03cacb17680bb46a725c6032',
  enableAnalytics: false,
  themeMode: 'dark',
  themeVariables: {
    // ... existing variables
    '--w3m-modal-z-index': '1000', // Ensure proper stacking
    '--w3m-modal-mobile-max-width': '100%', // Fix mobile width
    '--w3m-modal-mobile-min-width': '100%', // Ensure full width on mobile
    '--w3m-modal-max-width': '360px', // Desktop width
    '--w3m-modal-min-width': '360px', // Desktop width
    '--w3m-modal-border-radius': '12px', // Match your theme
  },
  // Add mobile-specific config
  mobileWallets: [
    {
      id: 'metamask',
      name: 'MetaMask',
      links: {
        native: 'metamask://',
        universal: 'https://metamask.app.link',
      },
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      links: {
        native: 'coinbasewallet://',
        universal: 'https://go.cb-w.com',
      },
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      links: {
        native: 'trust://',
        universal: 'https://link.trustwallet.com',
      },
    },
  ],                                                                                                                    
  
  defaultChain: base,
});
export const BigScreenProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
