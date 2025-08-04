import React from 'react';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { mainnet, base } from "wagmi/chains";
// import MyCustomAvatar from '../connect/MyCustomAvatar';

const config = createConfig(
  getDefaultConfig({
    
    chains: [base, ],
    transports: {
      [base.id]: http(),
      [mainnet.id]: http(),
      
    },

    appName: 'AfriRamp',
    appDescription: 'On & Offramp Stablecoins on Base',
    appUrl: 'https://www.afriramp.xyz',
    
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID! || 'aa51d05f03cacb17680bb46a725c6032',
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
         theme='midnight'
         options={{
          // customAvatar: MyCustomAvatar,
          embedGoogleFonts: true,
          disclaimer: 'Welcome to AfriRamp! Enjoy your experience!',


         }}
         mode='auto'
          customTheme={{
            accentColor: '#2563eb',
            accentColorForeground: 'white',
            borderRadius: '8px',
            fontStack: 'system',
            overlayBlur: 'small',
            
          }}
          // defaultChain={base}
          // chains={[mainnet, base]}
          // walletConnectProjectId={import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'aa51d05f03cacb17680bb46a725c6032'}
         >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};