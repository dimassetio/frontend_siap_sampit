import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes"; // Pindahkan semua isi <Routes> ke sini
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
