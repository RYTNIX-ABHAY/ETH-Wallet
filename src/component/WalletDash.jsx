import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';

import AssetCard from './AssetC';

import { getEthBalance } from '../services/blockchain';

function WalletDashboard() {
    const { wallet, logout } = useWallet();
    const [balances, setBalances] = useState({ eth: null});

    const fetchBalances = useCallback(async () => {
    
        if (!wallet || !wallet.ethereum) return;

        try {
            console.log("Refreshing balances...");
            const [eth] = await Promise.all([
                getEthBalance(wallet.ethereum.address)
            ]);
            setBalances({ eth });
        } catch (error) {
            console.error("Failed to fetch all balances:", error);
        }
    }, [wallet]);

    useEffect(() => {
        fetchBalances();
        const interval = setInterval(fetchBalances, 30000);
        return () => clearInterval(interval);
    }, [fetchBalances]);

    
    if (!wallet || !wallet.ethereum ) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600">Wallet Data Error</h2>
                <p className="my-4">There was a problem loading your wallet data. Please try logging out and importing your wallet again.</p>
                <button onClick={logout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                    Logout
                </button>
            </div>
        );
    }

    const coins = [
        { name: 'Ethereum', symbol: 'ETH', ...wallet.ethereum }
    ];

    return (
       <div className="min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center p-4 md:p-8">
    {/* This container limits width so data doesn't stretch too thin */}
    <div className="w-full max-w-6xl">
        
        <header className="text-center mb-12">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-2">
                Wallet<span className="text-indigo-500">Core</span>
            </h2>
            <p className="text-slate-400 font-medium mb-6">Secure Multi-Chain Management</p>
            
            <button 
                onClick={logout} 
                className="bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-slate-700 px-6 py-2 rounded-full transition-all text-sm font-bold"
            >
                Logout & Lock Session
            </button>
        </header>

        <div className="flex bg-[#10b981]  justify-items-center">
            {coins.map(coin => (
                <AssetCard
                    key={coin.symbol}
                    coin={coin}
                    balance={balances[coin.symbol.toLowerCase()]}
                    onTransactionSuccess={fetchBalances}
                />
            ))}
        </div>
        
    </div>
</div>
    );
};

export default WalletDashboard;