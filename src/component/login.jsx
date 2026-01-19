import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { generateMnemonic } from '../services/wallet';

const Login = () => {
  const { login } = useWallet();

  const [mnemonic, setMnemonic] = useState('');
  const [newMnemonic, setNewMnemonic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ===== Helpers =====
  const isValidMnemonic = (phrase) =>
    phrase && phrase.trim().split(/\s+/).length === 12;

  // ===== Import Wallet =====
  const handleImport = async (e) => {
    e.preventDefault();

    if (!isValidMnemonic(mnemonic)) {
      setError('Please enter a valid 12-word mnemonic phrase.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(mnemonic.trim());
    } catch (err) {
      setError('Invalid mnemonic phrase. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Create Wallet =====
  const handleCreate = () => {
    try {
      const phrase = generateMnemonic();
      if (!phrase) throw new Error('Mnemonic generation failed');
      setNewMnemonic(phrase);
    } catch {
      setError('Failed to generate mnemonic. Please try again.');
    }
  };

  const proceedWithNewMnemonic = async () => {
    if (!newMnemonic) return;

    try {
      setLoading(true);
      await login(newMnemonic);
    } catch {
      setError('Failed to login with generated wallet.');
    } finally {
      setLoading(false);
    }
  };

  // ===== New Wallet Screen =====
  if (newMnemonic) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Save Your Secret Phrase
        </h2>

        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md mb-6">
          <p className="font-bold">IMPORTANT!</p>
          <p>
            Write this 12-word phrase down. It's the only way to recover your wallet.
          </p>
        </div>

        <div className="bg-gray-800 text-red-700 p-4 rounded-lg text-center font-mono text-lg tracking-wider my-4 select-all">
          {newMnemonic}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={proceedWithNewMnemonic}
          className="w-full btn btn-primary mt-2"
        >
          {loading ? 'Loading...' : "I've Saved It, Continue"}
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    );
  }

  // ===== Main Login Screen =====
  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-6">
        Simple Crypto Wallet
      </h1>

      {/* Import Wallet */}
      <div className="bg-base-200 p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Import Existing Wallet
        </h2>

        <form onSubmit={handleImport}>
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            placeholder="Enter your 12-word mnemonic phrase..."
            className="w-full p-3 border border-gray-600 rounded-lg bg-base-100 focus:ring-2 focus:ring-blue-500 transition"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full btn btn-primary"
          >
            {loading ? 'Importing...' : 'Import Wallet'}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      {/* Create Wallet */}
      <div className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-2">
          Create a New Wallet
        </h2>
        <p className="text-gray-400 mb-4">
          No wallet yet? Create one now.
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={handleCreate}
          className="w-full btn btn-neutral"
        >
          Create New Wallet
        </button>
      </div>
    </div>
  );
};

export default Login;
