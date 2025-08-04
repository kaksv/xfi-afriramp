import { useState, useEffect } from 'react';
import { useAccount, useBalance, useEstimateFeesPerGas } from 'wagmi';
import { base } from 'wagmi/chains';
// import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import {  ArrowRight, ChevronDown, Phone, Smartphone } from 'lucide-react';
import { s } from 'framer-motion/client';



// https://afriramp-backend2.onrender.com/api/onramp  for onramp data

// Define TypeScript interface for transaction data
interface OnrampTransaction {
  userAddress: string;
  fiatAmount: number;
  fiatCurrency: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  paymentMethod: string;
  mobileNumber: string;
  networkFee: number;
  processingFee: number;
  totalAmount: number;
}


export default function OnRamp() {
  const { address } = useAccount();
  // const { data: balanceData } = useBalance({ address });
  
  // Options state
  const [fiatAmount, setFiatAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [fiatCurrency, setFiatCurrency] = useState('UGX');
  const [fiatExpanded, setFiatExpanded] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('USDC');
  const [cryptoExpanded, setCryptoExpanded] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [ethPrice, setEthPrice] = useState(null); // ETH price in USD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('');

   //  Rates use states
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect to handle the fetched EthPrice by coingecko.
  // Fetch ETH price in USD from CoinGecko API on component mount
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ETH price");
        return res.json();
      })
      .then((data) => {
        if (data.ethereum && data.ethereum.usd) {
          setEthPrice(data.ethereum.usd);
        } else {
          setError("ETH price data not available");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => console.log("ETH price fetched"));
  }, []);

  // useEffect to handle exchangeRate
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => {
        if(!response.ok) {
          throw new Error("Failed to fetch exchange Rate");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.rates && data.rates.UGX) {
          // setExchangeRate(data.rates.UGX.toFixed(2));
          // setExchangeRate(data.rates[selectedPair].toFixed(2));
          setExchangeRate(data.rates[fiatCurrency].toFixed(2));
        }else {
          setError(`Rate for {fiatCurrency} not found `);
          setExchangeRate(null)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => console.log("Exchange rate fetched"));
    }, [fiatCurrency]);
  
  // Exchange rates (1 USD = X local currency)
  const exchangeRates = {
    KSH: 143.50, // 1 USD = 143.50 KSH
    UGX: 3850.75, // 1 USD = 3850.75 UGX
  };

  // Crypto prices in USD (mock data - would be fetched from an API)
  const cryptoPrices = {
    ETH: 3452.78,
    USDC: 1.00,
    USDT: 1.00
  };


  // calculate gas on the blockchain.
  const gasResult = useEstimateFeesPerGas({
    chainId: base.id,
    formatUnits: 'wei',
  })
  

  // Crypto options
  const cryptoOptions = [
    { symbol: 'USDC', name: 'USD Coin', icon: '$' },
    { symbol: 'USDT', name: 'Tether', icon: '₮' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' }
  ];
  
  // Fiat currencies
  const fiatCurrencies = [
    
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
    { code: 'KSH', symbol: 'KSh', name: 'Kenyan Shilling' },
  ];
  
  // Payment methods based on currency
  const getPaymentMethods = () => {
    if (fiatCurrency === 'KSH') {
      return [
        { id: 'mpesa', name: 'M-PESA', icon: <Phone size={18} /> },
      ];
    } else if (fiatCurrency === 'UGX') {
      return [
        { id: 'mtn', name: 'MTN Mobile Money', icon: <Smartphone size={18} /> },
        { id: 'airtel', name: 'Airtel Money', icon: <Phone size={18} /> },
      ];
    }
    return [];
  };
  
  // Calculate estimated crypto amount based on fiat amount
  const calculateCryptoAmount = () => {
    if (!fiatAmount || isNaN(parseFloat(fiatAmount))) return '0';
    const rate = exchangeRates[fiatCurrency as keyof typeof exchangeRates] || 1;
    const usdAmount = parseFloat(fiatAmount) / rate;
    const cryptoAmount = usdAmount / cryptoPrices[selectedCrypto as keyof typeof cryptoPrices];
    return selectedCrypto === 'ETH' ? cryptoAmount.toFixed(6) : cryptoAmount.toFixed(2);
  };
  
  // Get current fiat currency symbol
  const getCurrencySymbol = () => {
    const currency = fiatCurrencies.find(c => c.code === fiatCurrency);
    return currency ? currency.symbol : 'KSh';
  };
  
  // Validate mobile number format
  const validateMobileNumber = (number: string) => {
    if (fiatCurrency === 'KSH') {
      // Kenya: +254 or 07xx/01xx format, 9-12 digits
      return /^(?:\+254|0)[17]\d{8}$/.test(number);
    } else if (fiatCurrency === 'UGX') {
      // Uganda: +256 or 07xx format, 9-12 digits
      return /^(?:\+256|0)[7]\d{8}$/.test(number);
    }
    return false;
  };
  
  // Format mobile number display
  const formatMobileNumber = (number: string) => {
    if (!number) return '';
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    if (fiatCurrency === 'KSH') {
      // Format as 07XX XXX XXX or +254 7XX XXX XXX
      if (cleaned.startsWith('254')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
      }
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (fiatCurrency === 'UGX') {
      // Format as 07XX XXX XXX or +256 7XX XXX XXX
      if (cleaned.startsWith('256')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
      }
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return number;
  };
  
  // Handle mobile number input
  const handleMobileNumberChange = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    setMobileNumber(cleaned);
  };
  
  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setFiatCurrency(currency);
    // Reset payment method to first available option for new currency
    const methods = currency === 'UGX' ?  ['mtn', 'airtel'] : ['mpesa'];
    setPaymentMethod(methods[0]);
    // Reset mobile number
    setMobileNumber('');
  };

  // Submit transaction to backend
  // Submit transaction to backend
  const submitTransaction = async (transactionData: OnrampTransaction) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/onramp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transaction failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };


  
  // Handle buy action
  const handleBuy = async () => {
    if (!address) {
      window.alert('Wallet not connected');
      return;
    }

    const transactionData: OnrampTransaction = {
      userAddress: address,
      fiatAmount: parseFloat(fiatAmount),
      fiatCurrency,
      cryptoAmount: parseFloat(calculateCryptoAmount()),
      cryptoCurrency: selectedCrypto,
      paymentMethod,
      mobileNumber,
      networkFee: parseFloat(fiatAmount) * 0.01,
      processingFee: parseFloat(fiatAmount) * 0.025,
      totalAmount: parseFloat(fiatAmount) * 1.035,
    };

    try {
      const result = await submitTransaction(transactionData);
      const paymentMethodName = getPaymentMethods().find(m => m.id === paymentMethod)?.name;
      
      window.alert(
        `Initiated ${paymentMethodName} payment request for ${fiatAmount} ${fiatCurrency} to buy ${calculateCryptoAmount()} ${selectedCrypto}\n\nTransaction ID: ${result.id}`
      );
    } catch (error) {
      window.alert(error.message || 'Failed to submit transaction');
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
        <h2 className="text-xl font-semibold mb-6">Buy Stablecoins</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              You Pay
            </label>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                1 {selectedCrypto} ≈ 
                {(((Number(exchangeRate)) - Number(exchangeRate) * (2/100)) ).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                {/* {(cryptoPrices[selectedCrypto as keyof typeof cryptoPrices] * exchangeRates[fiatCurrency as keyof typeof exchangeRates]).toLocaleString()}  */}
                {fiatCurrency}
              </span>
          </div>
          
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="input pl-12 pr-20"
                placeholder="0.00"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                {getCurrencySymbol()}
              </div>
            </div>
            
            <div className="relative ml-2">
              <button
                onClick={() => setFiatExpanded(!fiatExpanded)}
                className="h-full px-4 rounded-lg border border-slate-300 dark:border-dark-500 bg-white dark:bg-dark-600 text-slate-900 dark:text-white flex items-center"
              >
                <span>{fiatCurrency}</span>
                <ChevronDown size={16} className={`ml-2 transition-transform ${fiatExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {fiatExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 z-20"
                >
                  <div className="py-1">
                    {fiatCurrencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          handleCurrencyChange(currency.code);
                          setFiatExpanded(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                      >
                        <span className="w-12">{currency.symbol}</span>
                        <span>{currency.code}</span>
                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{currency.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              You Receive (Estimated)
            </label>
          </div>
          
          <div className="mt-1 p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                  <span className="text-lg">{cryptoOptions.find(c => c.symbol === selectedCrypto)?.icon}</span>
                </div>
                <div>
                  <p className="font-medium">
                  {((1 / Number(exchangeRate) * 0.98) * Number(fiatAmount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                    {/* {calculateCryptoAmount()}  */}
                    {selectedCrypto}
                    </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {cryptoOptions.find(c => c.symbol === selectedCrypto)?.name}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setCryptoExpanded(!cryptoExpanded)}
                  className="px-3 py-1 rounded-lg border border-slate-300 dark:border-dark-500 bg-white dark:bg-dark-600 text-slate-900 dark:text-white flex items-center"
                >
                  <span>{selectedCrypto}</span>
                  <ChevronDown size={16} className={`ml-2 transition-transform ${cryptoExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {cryptoExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 z-20"
                  >
                    <div className="py-1">
                      {cryptoOptions.map(crypto => (
                        <button
                          key={crypto.symbol}
                          onClick={() => {
                            setSelectedCrypto(crypto.symbol);
                            setCryptoExpanded(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                        >
                          <span className="w-8">{crypto.icon}</span>
                          <span>{crypto.symbol}</span>
                          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{crypto.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Payment Method
          </label>
          
          <div className="relative">
            <button
              onClick={() => setPaymentExpanded(!paymentExpanded)}
              className="w-full input flex items-center justify-between"
            >
              <div className="flex items-center">
                {getPaymentMethods().find(m => m.id === paymentMethod)?.icon}
                <span className="ml-2">{getPaymentMethods().find(m => m.id === paymentMethod)?.name}</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${paymentExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {paymentExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 mt-1 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 z-20"
              >
                <div className="py-1">
                  {getPaymentMethods().map(method => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setPaymentMethod(method.id);
                        setPaymentExpanded(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                    >
                      {method.icon}
                      <span className="ml-2">{method.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formatMobileNumber(mobileNumber)}
              onChange={(e) => handleMobileNumberChange(e.target.value)}
              className="input pl-12 ml-2"
              placeholder={fiatCurrency === 'KSH' ? '0712 345 678' : ( paymentMethod === 'mtn' ? '0770 123 456' : '0700 123 456')}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
              {fiatCurrency === 'KSH' ? '+254' : '+256'}
            </div>
          </div>
          {mobileNumber && !validateMobileNumber(mobileNumber) && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              Please enter a valid {fiatCurrency === 'KSH' ? 'Safaricom' : 'Ugandan'} mobile number
            </p>
          )}
        </div>
        
        <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
          <div className="flex justify-between mb-2">
            <span>Amount</span>
            <span>
              {((1 / Number(exchangeRate) * 0.98) * Number(fiatAmount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              {/* {fiatAmount}  */}
              {selectedCrypto}
              </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Network Fee</span>
            {/* <span>

              {(parseFloat(fiatAmount || '0') * 0.01).toFixed(2)}
               {selectedCrypto}
             </span> */}
            {gasResult.data?.formatted?.maxFeePerGas
              ? `${(((Number(gasResult.data.formatted.maxPriorityFeePerGas) + Number(gasResult.data.formatted.maxFeePerGas) * Number(ethPrice)) / 1e18) + 0.01).toFixed(3)} USD`
              : '...'}
          </div>
          <div className="flex justify-between mb-2">
            <span>Processing Fee (2%)</span>
            <span>
              {((1 / Number(exchangeRate) * 0.02) * Number(fiatAmount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {(
                ((1 / Number(exchangeRate) * 0.98) * Number(fiatAmount)) - 
                (
                  (((Number(gasResult.data?.formatted?.maxPriorityFeePerGas ?? 0) + Number(gasResult.data?.formatted?.maxFeePerGas ?? 0)) * Number(ethPrice)) / 1e18) + 0.01
                ) - 
                ((1 / Number(exchangeRate) * 0.02) * Number(fiatAmount))
              ).toFixed(2)}{" "}
              {selectedCrypto}
              {/* {(parseFloat(fiatAmount || '0') * 1.035).toFixed(2)} {fiatCurrency} */}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleBuy}
          className="btn btn-primary w-full flex items-center justify-center"
          disabled={!fiatAmount || parseFloat(fiatAmount) <= 0 || !validateMobileNumber(mobileNumber)}
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold mb-3">Mobile Money Guide</h3>
        <ul className="space-y-3">
          {fiatCurrency === 'KSH' ? (
            <>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <p className="font-medium">Enter M-PESA Number</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Use your registered Safaricom M-PESA number</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <p className="font-medium">Watch for STK Push</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">You'll receive an M-PESA prompt on your phone</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <p className="font-medium">Enter PIN</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enter your M-PESA PIN to complete the payment</p>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <p className="font-medium">Enter Mobile Money Number</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Use your registered {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'} number</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <p className="font-medium">Check Your Phone</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">You'll receive a USSD prompt to authorize payment</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <p className="font-medium">Confirm Payment</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enter your {paymentMethod === 'mtn' ? 'MTN MoMo' : 'Airtel Money'} PIN</p>
                </div>
              </li>
            </>
          )}
        </ul>
      </motion.div>
    </div>
  );
}