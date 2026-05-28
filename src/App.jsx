import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Importação de todas as Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agendamento from './pages/Agendamento'; 
import Cartao from './pages/Cartao';
import TDE from './pages/TDE'; 
import Ibge from './pages/Ibge';
import Rota from './pages/Rota';
import Afk from './pages/Afk'; 
import Workspace from './pages/Workspace'; // <-- ADICIONE ESTA LINHA

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Privadas (Protegidas pelo PrivateRoute) */}
          <Route element={<PrivateRoute />}>
             <Route path="/" element={<Dashboard />} />
             <Route path="/agendamento" element={<Agendamento />} />
             <Route path="/cartao" element={<Cartao />} />
             <Route path="/tde" element={<TDE />} />
             <Route path="/ibge" element={<Ibge />} />
             <Route path="/rota" element={<Rota />} />
             <Route path="/afk" element={<Afk />} />
             
             {/* NOVA ROTA: Meu Workspace */}
             <Route path="/workspace" element={<Workspace />} /> {/* <-- ADICIONE ESTA LINHA */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;