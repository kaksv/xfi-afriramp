import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Shield, BarChart4, Globe, Sparkle } from 'lucide-react';
import { ConnectKitButton } from 'connectkit';


export default function Welcome() {
  const features = [
    {
      icon: <Wallet size={24} />,
      title: 'Simple Wallet',
      description: 'Connect your favorite wallet like Coinbase and start transacting in seconds.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure Transactions',
      description: 'Your keys are never stored on our servers, ensuring complete security and control.'
    },
    {
      icon: <BarChart4 size={24} />,
      title: 'Track Your Portfolio',
      description: 'Monitor your Ethereum balance and transaction history in one place.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Support',
      description: 'Buy and sell Ethereum with your local currency, supported worldwide.'
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800">
      {/* <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-dark-800/80 border-b border-slate-200 dark:border-dark-700 px-4 md:px-8 py-4"> */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-dark-800/80 border-b border-slate-200 dark:border-dark-700 px-4 md:px-8 py-4">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="AfriRamp" className="w-8 h-8 rounded-md" />
            <span className="font-bold text-xl">AfriRamp</span>
          </div>
         <div className='z-20'>

              <ConnectKitButton />
                     
          </div>
        </div>
      </header>
      
      <main className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
             <h1 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">On & Offramp</span> USDC on Base tokens.  <br />
               <span className="gradient-text"> Made Simple in East Africa.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-4">
              The easiest way to buy, sell, send, and receive Stablecoins in East Africa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* <button
                onClick={() => (document.querySelector('w3m-button') as any)?.click()}
                className="btn btn-primary text-lg px-6 py-3 flex items-center justify-center"
              >
                Connect Wallet
                <ArrowRight size={20} className="ml-2" />
              </button> */}
              <a href="#features" className="flex btn btn-outline text-lg px-6 py-3">
                Learn More
                <ArrowRight />
              </a>
            </div>
            
            <div className="mt-8 text-slate-500 dark:text-slate-400">
              <p>Available on MetaMask,Coinbase Wallet and more and more.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-dark-600">
                <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
                <div className="p-6">
                  <div className="flex justify-between items-baseline mb-6">
                    <h2 className="text-lg font-semibold">Your Balance</h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Mainnet</span>
                  </div>
                  
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold mr-2">*****</span>
                    {/* <span className="text-xl font-medium text-slate-500 dark:text-slate-400">ETH</span> */}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="btn btn-primary flex items-center justify-center opacity-50 cursor-not-allowed">
                      <ArrowRight size={18} className="mr-2 rotate-45" />
                      Send
                    </button>
                    <button className="btn btn-outline flex items-center justify-center opacity-50 cursor-not-allowed">
                      <ArrowRight size={18} className="mr-2 rotate-225" />
                      Receive
                    </button>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-dark-600 p-4 rounded-lg text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      Connect your wallet to start transacting
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl transform translate-x-4 translate-y-4 -z-0 blur-xl" />
          </motion.div>
        </div>
        
        <div id="features" className="mt-24 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              On and Off Chain Transactions <span className="gradient-text">Made easy.</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We've simplified the process of buying, selling, and transferring Stablecoins  for East Africans.
              No more complications. It just works.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-2">
            <Sparkle size={16} className="mr-2" />
            <span className="font-medium">Start Using AfriRamp Today</span>
          </div>
          {/* <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience <span className="gradient-text">the Future of Finance</span>?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Connect your wallet and join thousands of users who are already experiencing
            the simplicity of Ethereum transactions with EthFlow.
          </p>
          
          <button
            onClick={() => (document.querySelector('w3m-button') as any)?.click()}
            className="btn btn-primary text-lg px-6 py-3 inline-flex items-center justify-center"
          >
            Get Started Now
            <ArrowRight size={20} className="ml-2" />
          </button> */}
        </motion.div>
      </main>
      
      <footer className="bg-white dark:bg-dark-700 border-t border-slate-200 dark:border-dark-600 py-10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <img src="/logo.jpg" alt="AfriRamp Logo" className="w-8 h-8 rounded-md" />
              <span className="font-bold text-xl">AfriRamp</span>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400">
              © 2025 AfriRamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}