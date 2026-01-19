import {useWallet} from './context/WalletContext';
import Login from './component/login';
import WalletDashboard from './component/WalletDash';

function App() {
     const { wallet, loading } = useWallet();
     
     const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl font-semibold">Loading Wallet...</div>
    </div>
  );

  return (
   <div className="min-h-screen"> 
      <div className="container mx-auto p-4 md:p-8">
        {loading ? <LoadingSpinner /> : wallet ? <WalletDashboard /> : <Login />}
      </div>
    </div>
  )
}

export default App
