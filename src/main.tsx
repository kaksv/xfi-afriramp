import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Web3Provider } from './connect/Web3Provider.tsx';
import { BigScreenProvider } from './connect/BigScreenProvider.tsx';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BigScreenProvider>
      <Web3Provider>
          <App />
        </Web3Provider>  
    </BigScreenProvider>
  </StrictMode>
);


// "@web3modal/wagmi": "^4.0.11",