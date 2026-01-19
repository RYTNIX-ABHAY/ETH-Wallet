import React, { useState } from 'react';
import * as blockchain from '../services/blockchain';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function AssetCard({ coin, balance, onTransactionSuccess }) {
    if (!coin) return null;

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setMessage('');
        setError('');
        try {
            if (coin.symbol === 'ETH') {
                const txHash =await blockchain.sendEth(coin.privateKey, recipient, amount);
                
                setMessage(`Success! Tx: ${txHash.substring(0, 10)}...`);
                resetFormAndRefresh();
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
            setSending(false);
        }
    };
    const resetFormAndRefresh = () => {
        setRecipient('');
        setAmount('');
        setSending(false);
        if (onTransactionSuccess) onTransactionSuccess();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Address copied!');
    }

    return (
        <div className="card w-full bg-base-500 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{coin.name} ({coin.symbol})</h2>
                <p className="text-xl my-2">
                    {balance === null ? <span className="loading loading-dots loading-md"></span> : `${parseFloat(balance).toFixed(6)}`}
                    <span className="text-neutral-content ml-2">{coin.symbol}</span>
                </p>
                <div className="form-control mt-2">
                     <label className="label"><span className="label-text">Your Address</span></label>
                    <div className="join">
                        <input type="text" readOnly value={coin.address} className="input input-bordered w-full truncate join-item" />
                        <button onClick={() => copyToClipboard(coin.address)} className="btn join-item">Copy</button>
                    </div>
                </div>

                <div className="divider">Send</div>

                <form onSubmit={handleSend}>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Recipient Address</span></label>
                        <input type="text" placeholder="Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} required className="input input-bordered w-full" />
                    </div>
                     <div className="form-control mt-2">
                        <label className="label"><span className="label-text">Amount</span></label>
                        <input type="text" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} required className="input input-bordered w-full" />
                    </div>
                    <button type="submit" disabled={sending || !recipient || !amount} className="btn btn-primary w-full mt-4">
                        {sending && <span className="loading loading-spinner"></span>}
                        Send {coin.symbol}
                    </button>
                </form>
                 {message && <div role="alert" className="alert alert-success mt-4 p-3 text-sm">{message}</div>}
                 {error && <div role="alert" className="alert alert-error mt-4 p-3 text-sm">{error}</div>}
            </div>
        </div>
    );
}

export default AssetCard;